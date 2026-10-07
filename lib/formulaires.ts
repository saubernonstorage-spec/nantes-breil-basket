/** Éléments partagés entre les formulaires (navigateur) et leur traitement (serveur). */

export type Resultat =
  | { statut: "initial" }
  | { statut: "succes"; reference: string; montant?: string }
  | { statut: "erreur"; message: string; erreurs?: Record<string, string> };

export const RESULTAT_INITIAL: Resultat = { statut: "initial" };

export const SUJETS_CONTACT = [
  { valeur: "inscription", label: "Inscription / réinscription" },
  { valeur: "essai", label: "Séance d'essai" },
  { valeur: "arbitrage", label: "École d'arbitrage" },
  { valeur: "stage", label: "Stage vacances" },
  { valeur: "benevolat", label: "Bénévolat / commissions" },
  { valeur: "partenariat", label: "Partenariat / mécénat" },
  { valeur: "image", label: "Droit à l'image / retrait d'une photo" },
  { valeur: "erreur", label: "Signaler une erreur sur le site" },
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

/**
 * Après une validation ratée (navigateur ou serveur) : fait défiler jusqu'au premier champ en erreur, dans l'ordre
 * de la page, et y place le curseur. Attend que React ait affiché les messages (deux images). Défilement fluide
 * via scroll-behavior (CSS), coupé si le visiteur a demandé moins d'animations.
 */
export function allerPremiereErreur(zone: HTMLElement | null | undefined) {
  if (!zone) return;
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      const el = zone.querySelector<HTMLElement>('[aria-invalid="true"], .erreur:not(:empty), .erreur-globale:not(:empty)');
      if (!el) return;
      const bloc = el.closest<HTMLElement>(".champ, .case-bloc, fieldset") ?? el;
      bloc.scrollIntoView({ block: "center" });
      const champ = el.matches("input, select, textarea") ? el : bloc.querySelector<HTMLElement>("input, select, textarea, button");
      champ?.focus({ preventScroll: true });
    }),
  );
}
