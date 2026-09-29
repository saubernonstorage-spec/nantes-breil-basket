"use server";

import { CATEGORIES_AGE, STAGE_REDUCTIONS } from "@/data/nbb";
import { envoyerEmail, type Destinataire } from "@/lib/email";
import { DELAI_MINIMUM_MS, reponseRobotValide, STATUTS_STAGE, SUJETS_CONTACT, type Resultat } from "@/lib/formulaires";
import { donneesCotisation, estMineur, prixStage, semainesOuvertes, toutesLesEquipes } from "@/lib/nbb";
import { enregistrer, type Table } from "@/lib/stockage";
import type { StatutStage } from "@/lib/types";
import {
  appliquerReduction,
  categorieParAnnee,
  coutSemaine,
  estEmail,
  estimerCotisation,
  estTelephone,
  euros,
  tauxReduction,
} from "@/lib/utils";

/* ───────── Outils communs ───────── */

/** Protection anti-spam : champ piège rempli, ou formulaire envoyé trop vite après son affichage. */
function estSpam(donnees: FormData): boolean {
  if (String(donnees.get("hp") ?? "").trim() !== "") return true;
  const debut = Number(donnees.get("t"));
  return !Number.isFinite(debut) || debut <= 0 || Date.now() - debut < DELAI_MINIMUM_MS;
}

function champ(donnees: FormData, nom: string, max = 200): string {
  return String(donnees.get(nom) ?? "")
    .trim()
    .slice(0, max);
}

function coche(donnees: FormData, nom: string): boolean {
  return donnees.get(nom) === "on";
}

const ERREUR_CHAMPS: Resultat = { statut: "erreur", message: "Certains champs sont à compléter." };

/**
 * Enregistre la demande (Espace dirigeants) et prévient le club par e-mail.
 * Réussite si au moins l'un des deux a fonctionné.
 */
async function transmettre({
  table,
  champs,
  destinataire,
  sujet,
  repondreA,
}: {
  table: Table;
  champs: Record<string, string>;
  destinataire: Destinataire;
  sujet: string;
  repondreA: string;
}): Promise<string | null> {
  const reference = await enregistrer(table, champs);
  const texte = [
    reference ? `Demande n° ${reference} — à retrouver dans l'Espace dirigeants du site.` : "Nouvelle demande reçue sur le site.",
    "",
    ...Object.entries(champs).map(([k, v]) => `${k} : ${v}`),
    "",
    "— Pour répondre, utilisez simplement « Répondre » : la réponse part vers l'expéditeur.",
  ].join("\n");
  const envoye = await envoyerEmail({
    destinataire,
    sujet: `[Site NBB] ${sujet}${reference ? ` (${reference})` : ""}`,
    texte,
    repondreA,
  });
  if (reference) return reference;
  return envoye ? "ENVOYÉ" : null;
}

const ECHEC: Resultat = {
  statut: "erreur",
  message:
    "L'envoi n'a pas abouti. Réessayez dans quelques minutes, ou écrivez-nous directement par e-mail ou via le groupe WhatsApp du club.",
};

/* ───────── Contact ───────── */

export async function envoyerContact(_: Resultat, donnees: FormData): Promise<Resultat> {
  // Un robot reçoit la même réponse qu'un humain : il n'apprend rien.
  if (estSpam(donnees)) return { statut: "succes", reference: "EN-ATTENTE" };

  const v = {
    nom: champ(donnees, "nom", 120),
    email: champ(donnees, "email"),
    sujet: champ(donnees, "sujet", 40),
    message: champ(donnees, "message", 5000),
    robot: champ(donnees, "robot", 20),
  };
  const erreurs: Record<string, string> = {};
  if (!v.nom) erreurs.nom = "Indiquez votre nom.";
  if (!estEmail(v.email)) erreurs.email = "Adresse e-mail invalide.";
  if (v.message.length < 10) erreurs.message = "Votre message est un peu court.";
  if (!reponseRobotValide(v.robot)) erreurs.robot = "Indice : moins de 6.";
  if (!coche(donnees, "rgpd")) erreurs.rgpd = "Cette case est nécessaire pour vous répondre.";
  if (Object.keys(erreurs).length) return { ...ERREUR_CHAMPS, erreurs } as Resultat;

  const sujet = SUJETS_CONTACT.find((s) => s.valeur === v.sujet)?.label ?? "Autre";
  const reference = await transmettre({
    table: "contacts",
    destinataire: "general",
    sujet: `${sujet} — ${v.nom}`,
    repondreA: v.email,
    champs: { Nom: v.nom, "E-mail": v.email, Sujet: sujet, Message: v.message },
  });
  return reference ? { statut: "succes", reference } : ECHEC;
}

/* ───────── Stages ───────── */

export async function inscrireStage(_: Resultat, donnees: FormData): Promise<Resultat> {
  if (estSpam(donnees)) return { statut: "succes", reference: "EN-ATTENTE" };

  const semaines = semainesOuvertes();
  const idsValides = new Set(semaines.flatMap((w) => w.jours.map((j) => j.id)));
  const demandes = [...new Set(donnees.getAll("jours").map(String))];
  const jours = demandes.filter((id) => idsValides.has(id));
  const statut = (STATUTS_STAGE.find((s) => s.valeur === champ(donnees, "statut"))?.valeur ?? "licencies") as StatutStage;
  const v = {
    enfantPrenom: champ(donnees, "enfantPrenom", 80),
    enfantNom: champ(donnees, "enfantNom", 80),
    annee: Number(champ(donnees, "annee", 4)),
    parentPrenom: champ(donnees, "parentPrenom", 80),
    parentNom: champ(donnees, "parentNom", 80),
    email: champ(donnees, "email"),
    tel: champ(donnees, "tel", 30),
    fratrie: Math.min(Math.max(Number(champ(donnees, "fratrie", 2)) || 1, 1), 10),
  };

  const erreurs: Record<string, string> = {};
  if (!jours.length) erreurs.semaines = "Choisissez une semaine ou au moins une journée.";
  // Page ouverte avant la fermeture d'une semaine (la veille de son dernier jour à midi).
  if (demandes.length > jours.length) {
    erreurs.semaines = "Les inscriptions sont fermées pour une semaine choisie. Rechargez la page pour voir les semaines ouvertes.";
  }
  if (!v.enfantPrenom) erreurs.enfantPrenom = "Indiquez le prénom de l'enfant.";
  if (!v.enfantNom) erreurs.enfantNom = "Indiquez le nom de l'enfant.";
  if (!v.annee || v.annee < 1990 || v.annee > 2100) erreurs.annee = "Choisissez l'année de naissance.";
  if (!v.parentPrenom) erreurs.parentPrenom = "Indiquez le prénom du parent.";
  if (!v.parentNom) erreurs.parentNom = "Indiquez le nom du parent.";
  if (!estEmail(v.email)) erreurs.email = "Adresse e-mail invalide.";
  if (!estTelephone(v.tel)) erreurs.tel = "Numéro à 10 chiffres.";
  if (!coche(donnees, "participation")) erreurs.participation = "L'autorisation parentale est nécessaire.";
  if (!coche(donnees, "autorisation")) erreurs.autorisation = "Votre accord est nécessaire pour traiter la demande.";
  for (const w of semaines) {
    const choisie = w.jours.some((j) => jours.includes(j.id));
    if (choisie && v.annee && w.nesDe && w.nesA && (v.annee < w.nesDe || v.annee > w.nesA)) {
      erreurs.semaines = `${w.nom} : réservée aux enfants né(e)s de ${w.nesDe} à ${w.nesA}.`;
    }
  }
  if (Object.keys(erreurs).length) return { ...ERREUR_CHAMPS, erreurs } as Resultat;

  const prix = prixStage(statut);
  let brut = 0;
  const recap: string[] = [];
  for (const w of semaines) {
    const pris = w.jours.filter((j) => jours.includes(j.id));
    if (!pris.length) continue;
    brut += coutSemaine(pris.length, w.jours.length, prix);
    recap.push(
      pris.length === w.jours.length
        ? `${w.periode} · ${w.nom} (semaine complète)`
        : `${w.periode} · ${w.nom} : ${pris.map((j) => j.court).join(", ")}`,
    );
  }
  const taux = tauxReduction(STAGE_REDUCTIONS, v.fratrie);
  const total = euros(appliquerReduction(brut, taux));
  const enfant = `${v.enfantPrenom} ${v.enfantNom}`;

  const reference = await transmettre({
    table: "stages",
    destinataire: "stages",
    sujet: `Inscription stage — ${enfant}`,
    repondreA: v.email,
    champs: {
      Enfant: enfant,
      "Année de naissance": String(v.annee),
      "Semaines / jours": recap.join(" ; "),
      Tarif: STATUTS_STAGE.find((s) => s.valeur === statut)?.label ?? statut,
      "Enfants de la famille inscrits": String(v.fratrie),
      Montant: taux ? `${total} (réduction famille de ${taux} % sur ${euros(brut)})` : total,
      Parent: `${v.parentPrenom} ${v.parentNom}`,
      "E-mail": v.email,
      Téléphone: v.tel,
      "Autorisation parentale et mesures d'urgence": "Oui",
      "Photos de groupe": coche(donnees, "image") ? "Autorisées" : "Non",
    },
  });
  return reference ? { statut: "succes", reference, montant: total } : ECHEC;
}

/* ───────── Préinscription au club ───────── */

export async function preinscrire(_: Resultat, donnees: FormData): Promise<Resultat> {
  if (estSpam(donnees)) return { statut: "succes", reference: "EN-ATTENTE" };

  const equipes = toutesLesEquipes();
  const v = {
    type: champ(donnees, "type") === "reinscription" ? "Réinscription" : "Nouvelle inscription",
    prenom: champ(donnees, "prenom", 80),
    nom: champ(donnees, "nom", 80),
    naissance: champ(donnees, "naissance", 10),
    sexe: champ(donnees, "sexe", 1),
    equipe: champ(donnees, "equipe", 20),
    respNom: champ(donnees, "respNom", 120),
    respLien: champ(donnees, "respLien", 30),
    email: champ(donnees, "email"),
    tel: champ(donnees, "tel", 30),
    cp: champ(donnees, "cp", 10),
    ville: champ(donnees, "ville", 80),
    image: champ(donnees, "image", 3),
    sante: champ(donnees, "sante", 20),
    benevolat: donnees.getAll("benevolat").map(String).slice(0, 20),
  };
  const annee = /^\d{4}-\d{2}-\d{2}$/.test(v.naissance) ? Number(v.naissance.slice(0, 4)) : 0;
  const mineur = estMineur(annee);

  const erreurs: Record<string, string> = {};
  if (!v.prenom) erreurs.prenom = "Indiquez le prénom.";
  if (!v.nom) erreurs.nom = "Indiquez le nom.";
  if (!annee || annee < 1930 || annee > new Date().getFullYear() - 2) erreurs.naissance = "Indiquez une date de naissance valide.";
  if (v.sexe !== "F" && v.sexe !== "M") erreurs.sexe = "Choisissez une option.";
  if (v.equipe && !equipes.includes(v.equipe)) erreurs.equipe = "Choisissez une équipe de la liste.";
  if (mineur && !v.respNom) erreurs.respNom = "Obligatoire pour un mineur.";
  if (!estEmail(v.email)) erreurs.email = "Adresse e-mail invalide.";
  if (!estTelephone(v.tel)) erreurs.tel = "Numéro à 10 chiffres.";
  if (v.image !== "oui" && v.image !== "non") erreurs.image = "Choisissez oui ou non.";
  if (v.sante !== "questionnaire" && v.sante !== "certificat") erreurs.sante = "Choisissez une option.";
  if (!coche(donnees, "charte") || !coche(donnees, "rgpd")) erreurs.accords = "Les deux cases marquées * sont nécessaires.";
  if (Object.keys(erreurs).length) return { ...ERREUR_CHAMPS, erreurs } as Resultat;

  const categorie = categorieParAnnee(CATEGORIES_AGE, annee);
  const c = donneesCotisation();
  const assuranceB = coche(donnees, "assuranceB");
  const cotisation = estimerCotisation({
    categorie,
    tarifEquipe: v.equipe ? c.tarifsEquipes[v.equipe] ?? null : null,
    mini: c.mini,
    seniors: c.seniors,
    jeunes: c.jeunes,
    assuranceB,
  });

  const reference = await transmettre({
    table: "inscriptions",
    destinataire: "inscriptions",
    sujet: `${v.type} — ${v.prenom} ${v.nom}`,
    repondreA: v.email,
    champs: {
      Demande: v.type,
      "Joueur / joueuse": `${v.prenom} ${v.nom}`,
      Naissance: `${v.naissance.split("-").reverse().join("/")} · ${categorie}`,
      Sexe: v.sexe === "F" ? "Féminin" : "Masculin",
      "Équipe souhaitée": v.equipe || "À définir avec le club",
      ...(mineur ? { "Responsable légal·e": `${v.respNom} (${v.respLien || "Parent"})` } : {}),
      "E-mail": v.email,
      Téléphone: v.tel,
      Adresse: [v.cp, v.ville].filter(Boolean).join(" ") || "—",
      "Droit à l'image": v.image === "oui" ? "Autorisé" : "Refusé",
      Santé: v.sante === "questionnaire" ? "Questionnaire de santé (réponses « non »)" : "Certificat médical à fournir",
      "Assurance formule B": assuranceB ? "Oui" : "Non",
      "Cotisation estimée": cotisation,
      Bénévolat: v.benevolat.length ? v.benevolat.join(", ") : "—",
    },
  });
  return reference ? { statut: "succes", reference } : ECHEC;
}
