import type { MetadataRoute } from "next";
import { CLUB } from "@/data/nbb";

/** Permet d'ajouter le site à l'écran d'accueil du téléphone (parents, joueurs). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: CLUB.nom,
    short_name: CLUB.sigle,
    description: `Club de basket à ${CLUB.ville} — planning, équipes, stages et inscriptions.`,
    lang: "fr",
    start_url: "/",
    display: "standalone",
    background_color: "#071228",
    theme_color: "#071228",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
