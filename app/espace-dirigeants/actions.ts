"use server";

import { refresh, revalidatePath } from "next/cache";
import { CLUB, CONVOCATIONS } from "@/data/nbb";
import { lireExport, TAILLE_MAX, type Affectations } from "@/lib/adherents";
import { envoyerEmailA } from "@/lib/email";
import { matchsAConvoquer, messageConfirmationStage, toutesLesEquipes } from "@/lib/nbb";
import { accesConfigure, estConnecte, fermerSession, motDePasseValide, ouvrirSession } from "@/lib/session";
import {
  changerStatut,
  ecrireAdherents,
  ecrireAffectations,
  lireAffectations,
  enregistrerConvocation,
  lire,
  listerConvocations,
  noterConfirmation,
  STATUTS,
  supprimer,
  TABLES,
  type Table,
} from "@/lib/stockage";
import { estEmail } from "@/lib/utils";

export type EtatConnexion = { erreur: string };

export async function connexion(_: EtatConnexion, donnees: FormData): Promise<EtatConnexion> {
  if (!accesConfigure()) return { erreur: "L'accès n'est pas configuré." };
  const saisi = String(donnees.get("motDePasse") ?? "");
  if (!motDePasseValide(saisi)) {
    // Ralentit les essais en série.
    await new Promise((r) => setTimeout(r, 1200));
    return { erreur: "Mot de passe incorrect." };
  }
  await ouvrirSession();
  refresh();
  return { erreur: "" };
}

export async function deconnexion() {
  await fermerSession();
  refresh();
}

function tableValide(t: string): t is Table {
  return (TABLES as string[]).includes(t);
}

const idValide = (id: string) => /^[A-Z]{3}-[A-Z0-9]+-[A-F0-9]+$/.test(id);

export async function modifierStatut(table: string, id: string, statut: string) {
  // Stages : statut automatique (« À traiter », puis « Confirmé » à l'envoi de l'e-mail), jamais modifié à la main.
  if (table === "stages") return;
  if (!(await estConnecte()) || !tableValide(table) || !idValide(id) || !(STATUTS as readonly string[]).includes(statut)) return;
  await changerStatut(table, id, statut);
  refresh();
}

export async function supprimerDemande(table: string, id: string) {
  if (!(await estConnecte()) || !tableValide(table) || !idValide(id)) return;
  await supprimer(table, id);
  refresh();
}

export type ResultatAdherents = { ok: boolean; message: string };

/** Dépose l'export des licences (.xlsx) : il remplace toute la base des adhérents. */
export async function importerAdherents(_: ResultatAdherents | null, donnees: FormData): Promise<ResultatAdherents> {
  if (!(await estConnecte())) return { ok: false, message: "Session expirée : reconnectez-vous." };
  const fichier = donnees.get("fichier");
  if (!(fichier instanceof File) || !fichier.size) return { ok: false, message: "Aucun fichier reçu." };
  if (!/\.xlsx$/i.test(fichier.name)) return { ok: false, message: "Déposez un fichier Excel (.xlsx) : l'export des licences de la FFBB." };
  if (fichier.size > TAILLE_MAX) return { ok: false, message: "Fichier trop volumineux (5 Mo au plus)." };
  try {
    const base = await lireExport(await fichier.arrayBuffer(), fichier.name);
    await ecrireAdherents(base);
    refresh();
    return { ok: true, message: `${base.adherents.length} adhérents importés depuis « ${fichier.name} ».` };
  } catch (erreur) {
    const message = erreur instanceof Error && /export|feuille|adhérent/.test(erreur.message) ? erreur.message : "Le fichier n'a pas pu être lu.";
    console.error("[adherents] Import impossible :", erreur);
    return { ok: false, message };
  }
}

/** Supprime toute la base des adhérents (fin de saison, demande d'effacement…). */
export async function supprimerAdherents() {
  if (!(await estConnecte())) return;
  await ecrireAdherents(null);
  refresh();
}

/** Enregistre l'équipe d'entraînement ou de match d'un adhérent (liste vide : retire l'équipe). */
export async function affecterAdherent(nom: string, champ: "entrainement" | "match", equipe: string): Promise<ResultatAdherents> {
  if (!(await estConnecte())) return { ok: false, message: "Session expirée : reconnectez-vous." };
  if (champ !== "entrainement" && champ !== "match") return { ok: false, message: "Champ inconnu." };
  if (equipe && !toutesLesEquipes().includes(equipe)) return { ok: false, message: "Équipe inconnue." };
  const cle = String(nom).trim().slice(0, 150);
  if (!cle) return { ok: false, message: "Adhérent inconnu." };
  try {
    const affectations = (await lireAffectations<Affectations>()) ?? {};
    const a = { ...(affectations[cle] ?? { entrainement: "", match: "" }), [champ]: equipe };
    if (a.entrainement || a.match) affectations[cle] = a;
    else delete affectations[cle];
    await ecrireAffectations(affectations);
    return { ok: true, message: "Enregistré." };
  } catch (erreur) {
    console.error("[adherents] Affectation impossible :", erreur);
    return { ok: false, message: "Enregistrement impossible, réessayez." };
  }
}

export type ResultatConvocations = { ok: boolean; message: string };

/** Champ de convocation : une ligne, 150 caractères au plus. */
function champConvocation(donnees: FormData, nom: string): string {
  return String(donnees.get(nom) ?? "")
    .replace(/[\r\n]+/g, " ")
    .trim()
    .slice(0, 150);
}

/**
 * Enregistre les convocations d'un week-end (arbitres, table, OTM). Seuls les matchs à domicile connus
 * du site sont acceptés ; un match dont les trois champs sont vides revient à « aucune convocation ».
 * La page Matchs est régénérée aussitôt.
 */
export async function enregistrerConvocations(_: ResultatConvocations | null, donnees: FormData): Promise<ResultatConvocations> {
  if (!(await estConnecte())) return { ok: false, message: "Session expirée : reconnectez-vous." };
  const { weekends } = matchsAConvoquer(await listerConvocations());
  const envoyes = donnees.getAll("match").map(String);
  const matchs = weekends.flatMap((w) => w.matchs).filter((m) => envoyes.includes(m.cle));
  if (!matchs.length) return { ok: false, message: "Aucun match à enregistrer." };
  try {
    for (const m of matchs) {
      // Deux arbitres et deux personnes (ou équipes) à la table : enregistrés « A, B ».
      const deux = (champ: string) =>
        [1, 2].map((n) => champConvocation(donnees, `${m.cle}|${champ}${n}`)).filter(Boolean).join(", ");
      const saisie = { arbitres: deux("arbitre"), table: deux("table"), otm: champConvocation(donnees, `${m.cle}|otm`) };
      // Rien de changé : pas d'écriture.
      if (saisie.arbitres === m.arbitres && saisie.table === m.table && saisie.otm === m.otm) continue;
      const vide = !saisie.arbitres && !saisie.table && !saisie.otm;
      // Tout effacé alors que data/nbb.ts en prévoit une : « — » enregistré, sinon celle du fichier reviendrait.
      const dansFichier = CONVOCATIONS.some((c) => c.date === m.date && c.equipe === m.equipe);
      await enregistrerConvocation({
        date: m.date,
        equipe: m.equipe,
        ...(vide && dansFichier ? { arbitres: "—", table: "—", otm: "—" } : saisie),
      });
    }
  } catch (erreur) {
    console.error("[convocations] Enregistrement impossible :", erreur);
    return { ok: false, message: "L'enregistrement a échoué. Réessayez dans un instant." };
  }
  revalidatePath("/matchs");
  refresh();
  const heure = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });
  return { ok: true, message: `Enregistré à ${heure} : la page Matchs est à jour.` };
}

export type ResultatConfirmation = { ok: boolean; message: string };

/**
 * Envoie au parent l'e-mail de confirmation d'une inscription au stage. Le message est construit ici à
 * partir de l'inscription enregistrée : le navigateur ne peut ni le modifier ni changer le destinataire. Copie cachée au club, puis la demande passe « Confirmé ».
 */
export async function envoyerConfirmationStage(id: string): Promise<ResultatConfirmation> {
  if (!(await estConnecte())) return { ok: false, message: "Session expirée : reconnectez-vous." };
  const demande = idValide(id) ? await lire("stages", id) : null;
  if (!demande) return { ok: false, message: "Inscription introuvable : elle a peut-être été supprimée." };
  const email = demande.champs["E-mail"] ?? "";
  if (!estEmail(email)) return { ok: false, message: "L'adresse e-mail du parent n'est pas valide : e-mail non envoyé." };

  const { sujet, texte } = messageConfirmationStage(demande.champs);
  const envoi = await envoyerEmailA({ a: email, sujet, texte, repondreA: CLUB.email, copieClub: "stages" });
  if (envoi === "non-configure") {
    return { ok: false, message: "La messagerie du site n'est pas configurée (variables SMTP chez l'hébergeur) : e-mail non envoyé." };
  }
  if (envoi === "echec") return { ok: false, message: "L'e-mail n'a pas pu partir. Réessayez plus tard ; rien n'a été modifié." };

  await noterConfirmation("stages", id);
  refresh();
  return {
    ok: true,
    message:
      envoi === "simule"
        ? "Envoi simulé (en local) : message affiché dans le terminal."
        : "E-mail envoyé.",
  };
}
