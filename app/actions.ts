"use server";

import { envoyerEmail } from "@/lib/email";
import {
  DELAI_MINIMUM_MS,
  LICENCES_STAGE,
  SUJETS_CONTACT,
  type EtatFormulaire,
} from "@/lib/formulaires";
import { anneeSaison, semainesOuvertes } from "@/lib/nbb";
import { estEmail } from "@/lib/utils";

/** Protection anti-spam : champ piège invisible rempli, ou formulaire envoyé trop vite. */
function estSpam(donnees: FormData): boolean {
  if (String(donnees.get("website") ?? "").trim() !== "") return true;
  const debut = Number(donnees.get("t"));
  return Number.isFinite(debut) && debut > 0 && Date.now() - debut < DELAI_MINIMUM_MS;
}

function champ(donnees: FormData, nom: string, max: number): string {
  return String(donnees.get(nom) ?? "")
    .trim()
    .slice(0, max);
}

export async function envoyerContact(_precedent: EtatFormulaire, donnees: FormData): Promise<EtatFormulaire> {
  // Un robot reçoit la même réponse qu'un humain : il n'apprend rien.
  if (estSpam(donnees)) return { statut: "succes" };

  const valeurs = {
    nom: champ(donnees, "nom", 120),
    email: champ(donnees, "email", 200),
    sujet: champ(donnees, "sujet", 40),
    message: String(donnees.get("message") ?? "").trim(),
    rgpd: donnees.get("rgpd") === "on" ? "on" : "",
  };

  const erreurs: Record<string, string> = {};
  if (!valeurs.nom) erreurs.nom = "Indiquez votre nom et prénom.";
  if (!estEmail(valeurs.email)) erreurs.email = "Indiquez une adresse e-mail valide (ex. prenom@exemple.fr).";
  if (!valeurs.message) erreurs.message = "Écrivez votre message.";
  else if (valeurs.message.length > 5000) erreurs.message = "Votre message est trop long (5 000 caractères maximum).";
  if (valeurs.rgpd !== "on") erreurs.rgpd = "Cochez cette case pour que nous puissions vous répondre.";

  if (Object.keys(erreurs).length > 0) {
    return { statut: "erreur", message: "Vérifiez les champs signalés.", erreurs, valeurs };
  }

  const sujet = SUJETS_CONTACT.find((s) => s.valeur === valeurs.sujet)?.label ?? "Autre";
  const resultat = await envoyerEmail({
    sujet: `[Site NBB] ${sujet} — ${valeurs.nom}`,
    texte: [
      "Nouveau message envoyé depuis le formulaire de contact du site.",
      "",
      `Nom : ${valeurs.nom}`,
      `E-mail : ${valeurs.email}`,
      `Sujet : ${sujet}`,
      "",
      "Message :",
      valeurs.message,
      "",
      "— Pour répondre, utilisez simplement « Répondre » : la réponse part vers l'expéditeur.",
    ].join("\n"),
    repondreA: valeurs.email,
  });

  if (!resultat.ok) return { statut: "erreur", message: resultat.message, valeurs };
  return { statut: "succes" };
}

export async function envoyerInscriptionStage(
  _precedent: EtatFormulaire,
  donnees: FormData,
): Promise<EtatFormulaire> {
  if (estSpam(donnees)) return { statut: "succes" };

  const valeurs = {
    periode: champ(donnees, "periode", 200),
    enfant: champ(donnees, "enfant", 120),
    annee: champ(donnees, "annee", 4),
    licence: champ(donnees, "licence", 20),
    email: champ(donnees, "email", 200),
    tel: champ(donnees, "tel", 30),
    info: String(donnees.get("info") ?? "").trim(),
    rgpd: donnees.get("rgpd") === "on" ? "on" : "",
  };

  const erreurs: Record<string, string> = {};
  if (!semainesOuvertes().includes(valeurs.periode)) erreurs.periode = "Choisissez une période de stage ouverte.";
  if (!valeurs.enfant) erreurs.enfant = "Indiquez le prénom et le nom de l'enfant.";
  const annee = Number(valeurs.annee);
  const base = anneeSaison();
  if (!Number.isInteger(annee) || annee < base - 21 || annee > base - 2) {
    erreurs.annee = "Indiquez une année de naissance valide.";
  }
  if (!estEmail(valeurs.email)) erreurs.email = "Indiquez une adresse e-mail valide (ex. prenom@exemple.fr).";
  if (valeurs.tel.replace(/\D/g, "").length < 10) erreurs.tel = "Indiquez un numéro de téléphone joignable.";
  if (valeurs.info.length > 2000) erreurs.info = "2 000 caractères maximum.";
  if (valeurs.rgpd !== "on") erreurs.rgpd = "Cette autorisation est nécessaire pour l'inscription.";

  if (Object.keys(erreurs).length > 0) {
    return { statut: "erreur", message: "Vérifiez les champs signalés.", erreurs, valeurs };
  }

  const licence = LICENCES_STAGE.find((l) => l.valeur === valeurs.licence)?.label ?? "Non précisé";
  const resultat = await envoyerEmail({
    destinataire: "stages",
    sujet: `[Site NBB] Inscription stage — ${valeurs.periode} — ${valeurs.enfant}`,
    texte: [
      "Nouvelle demande d'inscription à un stage des vacances.",
      "",
      `Période : ${valeurs.periode}`,
      `Enfant : ${valeurs.enfant}`,
      `Année de naissance : ${valeurs.annee}`,
      `Licencié au NBB : ${licence}`,
      `E-mail du parent : ${valeurs.email}`,
      `Téléphone : ${valeurs.tel}`,
      "",
      "Allergie, traitement, information utile :",
      valeurs.info || "(rien de signalé)",
      "",
      "— Confirmez la place en répondant à ce message (lien de paiement et autorisation parentale).",
    ].join("\n"),
    repondreA: valeurs.email,
  });

  if (!resultat.ok) return { statut: "erreur", message: resultat.message, valeurs };
  return { statut: "succes" };
}
