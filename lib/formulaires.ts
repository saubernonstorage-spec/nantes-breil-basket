/** Éléments partagés entre les formulaires (navigateur) et leur traitement (serveur). */

export type EtatFormulaire = {
  statut: "initial" | "succes" | "erreur";
  message?: string;
  erreurs?: Partial<Record<string, string>>;
  /** Valeurs saisies, renvoyées en cas d'erreur pour ne rien faire perdre au visiteur. */
  valeurs?: Partial<Record<string, string>>;
};

export const ETAT_INITIAL: EtatFormulaire = { statut: "initial" };

export const SUJETS_CONTACT = [
  { valeur: "inscription", label: "Inscription / essai" },
  { valeur: "creneau", label: "Créneau d'entraînement" },
  { valeur: "match", label: "Match, convocation, déplacement" },
  { valeur: "stage", label: "Stage des vacances" },
  { valeur: "benevolat", label: "Bénévolat" },
  { valeur: "partenariat", label: "Partenariat" },
  { valeur: "image", label: "Droit à l'image / retrait d'une photo" },
  { valeur: "autre", label: "Autre" },
] as const;

export const LICENCES_STAGE = [
  { valeur: "oui", label: "Oui" },
  { valeur: "non", label: "Non, découverte" },
  { valeur: "autre", label: "Licencié dans un autre club" },
] as const;

/** Délai minimal (ms) entre l'affichage du formulaire et l'envoi : en dessous, c'est un robot. */
export const DELAI_MINIMUM_MS = 3000;
