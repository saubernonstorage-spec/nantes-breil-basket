"use server";

import { refresh } from "next/cache";
import { CLUB } from "@/data/nbb";
import { envoyerEmailA } from "@/lib/email";
import { messageConfirmationStage } from "@/lib/nbb";
import { accesConfigure, estConnecte, fermerSession, motDePasseValide, ouvrirSession } from "@/lib/session";
import { changerStatut, lire, noterConfirmation, STATUTS, supprimer, TABLES, type Table } from "@/lib/stockage";
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
    return { ok: false, message: "La messagerie du site n'est pas configurée (variables SMTP sur Netlify) : e-mail non envoyé." };
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
