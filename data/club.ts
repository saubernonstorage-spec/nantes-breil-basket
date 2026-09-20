/**
 * Informations générales du club.
 * Les champs vides ("") ne sont simplement pas affichés sur le site.
 */
export type Club = {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
  inscriptionUrl: string;
};

export const CLUB: Club = {
  name: "Nantes Breil Basket",
  shortName: "NBB",
  tagline: "Du micro-basket aux seniors, on joue ensemble.",
  description:
    "Nantes Breil Basket : club de basket de Nantes. Retrouvez le planning des entraînements, les équipes et les gymnases.",

  // ⬇️ À COMPLÉTER
  email: "",
  phone: "",
  address: "",
  facebook: "",
  instagram: "",
  /** Lien d'inscription (HelloAsso, formulaire de la FFBB, etc.) */
  inscriptionUrl: "",
};

export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/planning", label: "Planning" },
  { href: "/equipes", label: "Équipes" },
  { href: "/contact", label: "Contact" },
] as const;
