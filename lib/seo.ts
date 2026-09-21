import type { Metadata } from "next";
import { CLUB } from "@/data/nbb";

/** Image d'aperçu affichée quand on partage un lien du site (WhatsApp, Facebook…). */
export const IMAGE_PARTAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Nantes Breil Basket — club de basket à Nantes, école de mini-basket 3 étoiles",
};

/** Métadonnées d'une page : titre, description, adresse canonique et aperçu de partage. */
export function metaPage({ titre, description, chemin }: { titre: string; description: string; chemin: string }): Metadata {
  return {
    title: titre,
    description,
    alternates: { canonical: chemin },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: CLUB.nom,
      title: `${titre} — ${CLUB.nom}`,
      description,
      url: chemin,
      images: [IMAGE_PARTAGE],
    },
  };
}
