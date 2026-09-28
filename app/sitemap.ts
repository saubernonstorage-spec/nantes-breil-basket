import type { MetadataRoute } from "next";
import { CLUB } from "@/data/nbb";

const PAGES: { chemin: string; priorite: number; frequence: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { chemin: "", priorite: 1, frequence: "weekly" },
  { chemin: "/inscriptions", priorite: 0.9, frequence: "monthly" },
  { chemin: "/planning", priorite: 0.9, frequence: "monthly" },
  { chemin: "/matchs", priorite: 0.9, frequence: "weekly" },
  { chemin: "/equipes", priorite: 0.8, frequence: "monthly" },
  { chemin: "/stages", priorite: 0.8, frequence: "monthly" },
  { chemin: "/ecoles", priorite: 0.8, frequence: "yearly" },
  { chemin: "/club", priorite: 0.7, frequence: "yearly" },
  { chemin: "/agenda", priorite: 0.7, frequence: "weekly" },
  { chemin: "/infos", priorite: 0.7, frequence: "yearly" },
  { chemin: "/contact", priorite: 0.6, frequence: "yearly" },
  { chemin: "/partenaires", priorite: 0.5, frequence: "yearly" },
  { chemin: "/galerie", priorite: 0.5, frequence: "monthly" },
  { chemin: "/mentions-legales", priorite: 0.2, frequence: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((p) => ({
    url: `${CLUB.siteUrl}${p.chemin}`,
    changeFrequency: p.frequence,
    priority: p.priorite,
  }));
}
