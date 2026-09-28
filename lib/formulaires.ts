/** Éléments partagés entre les formulaires (navigateur) et leur traitement (serveur). */

export type Resultat =
  | { statut: "initial" }
  | { statut: "succes"; reference: string; montant?: string }
  | { statut: "erreur"; message: string; erreurs?: Record<string, string> };

export const RESULTAT_INITIAL: Resultat = { statut: "initial" };

export const SUJETS_CONTACT = [
  { valeur: "inscription", label: "Inscription / réinscription" },
  { valeur: "essai", label: "Séance d'essai" },
  { valeur: "creneau", label: "Créneau d'entraînement" },
  { valeur: "match", label: "Match, convocation, déplacement" },
  { valeur: "arbitrage", label: "École d'arbitrage" },
  { valeur: "stage", label: "Stage vacances" },
  { valeur: "benevolat", label: "Bénévolat / commissions" },
  { valeur: "partenariat", label: "Partenariat / mécénat" },
  { valeur: "image", label: "Droit à l'image / retrait d'une photo" },
  { valeur: "autre", label: "Autre" },
] as const;

export const STATUTS_STAGE = [
  { valeur: "licencies", label: "Licencié·e au NBB" },
  { valeur: "carteBlanche", label: "Carte blanche (Ville de Nantes)" },
  { valeur: "nonLicencies", label: "Non licencié·e / autre club" },
] as const;

/** Délai minimal (ms) entre l'affichage du formulaire et l'envoi : en dessous, c'est un robot. */
export const DELAI_MINIMUM_MS = 3000;

/** Réponse à la question anti-robot du formulaire de contact. */
export function reponseRobotValide(texte: string): boolean {
  return /^\s*(5|cinq)\s*$/i.test(texte);
}
