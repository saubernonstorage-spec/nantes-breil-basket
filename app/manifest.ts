import type { MetadataRoute } from "next";
import { CLUB } from "@/data/nbb";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: CLUB.nom,
    short_name: CLUB.sigle,
    description: "Club de basket à Nantes — Breil / Hauts-Pavés",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F3EE",
    theme_color: "#0A1733",
    lang: "fr",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
