import type { MetadataRoute } from "next";
import { CLUB } from "@/data/nbb";

const PAGES: { chemin: string; priorite: number; frequence: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { chemin: "", priorite: 1, frequence: "weekly" },
  { chemin: "/planning", priorite: 0.9, frequence: "monthly" },
  { chemin: "/inscriptions", priorite: 0.9, frequence: "monthly" },
  { chemin: "/stages", priorite: 0.9, frequence: "weekly" },
  { chemin: "/equipes", priorite: 0.8, frequence: "monthly" },
  { chemin: "/calendrier", priorite: 0.8, frequence: "weekly" },
  { chemin: "/club", priorite: 0.7, frequence: "monthly" },
  { chemin: "/infos", priorite: 0.7, frequence: "monthly" },
  { chemin: "/contact", priorite: 0.6, frequence: "yearly" },
  { chemin: "/partenaires", priorite: 0.5, frequence: "monthly" },
  { chemin: "/galerie", priorite: 0.5, frequence: "monthly" },
  { chemin: "/mentions-legales", priorite: 0.2, frequence: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = CLUB.siteUrl.replace(/\/$/, "");
  return PAGES.map((p) => ({
    url: `${base}${p.chemin}`,
    changeFrequency: p.frequence,
    priority: p.priorite,
  }));
}
