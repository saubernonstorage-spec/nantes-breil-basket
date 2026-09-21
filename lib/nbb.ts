/**
 * Données calculées à partir de `data/nbb.ts` : équipes, catégories,
 * gymnases, stages. Rien à modifier ici pour mettre à jour le contenu.
 * (Réservé au serveur : les composants navigateur reçoivent ces données en props.)
 */
import { CATEGORIES, CLUB, GYMNASES, PHOTOS_EQUIPES, SLOTS, STAGES } from "@/data/nbb";
import type { CleCategorie, Creneau, Jour, Stage } from "@/lib/types";
import { A_COMPLETER, lienGymnase } from "@/lib/utils";

export const JOURS: Jour[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const collator = new Intl.Collator("fr", { numeric: true, sensitivity: "base" });

/** "2026-2027" → "2026-27" */
export function saisonCourte(saison = CLUB.saison): string {
  const m = saison.match(/^(\d{4})-\d{2}(\d{2})$/);
  return m ? `${m[1]}-${m[2]}` : saison;
}

/** Première année de la saison : "2026-2027" → 2026. */
export function anneeSaison(): number {
  const n = parseInt(CLUB.saison, 10);
  return Number.isFinite(n) ? n : new Date().getFullYear();
}

/* ---------- Planning ---------- */

export function trierCreneaux(creneaux: Creneau[]): Creneau[] {
  return [...creneaux].sort(
    (a, b) =>
      JOURS.indexOf(a.jour) - JOURS.indexOf(b.jour) ||
      a.debut.localeCompare(b.debut) ||
      collator.compare(a.gymnase, b.gymnase),
  );
}

export function toutesLesEquipes(): string[] {
  return [...new Set(SLOTS.flatMap((s) => s.equipes))].sort(collator.compare);
}

export function gymnasesUtilises(): string[] {
  return [...new Set(SLOTS.map((s) => s.gymnase))].sort(collator.compare);
}

export function joursUtilises(): Jour[] {
  return JOURS.filter((j) => SLOTS.some((s) => s.jour === j));
}

export function creneauxDe(equipe: string): Creneau[] {
  return trierCreneaux(SLOTS.filter((s) => s.equipes.includes(equipe)));
}

export function creneauxDuGymnase(gymnase: string): Creneau[] {
  return trierCreneaux(SLOTS.filter((s) => s.gymnase === gymnase));
}

/* ---------- Équipes et catégories ---------- */

/** Range une équipe dans une catégorie d'après son nom. */
export function categorieDe(equipe: string): CleCategorie {
  if (/^Micro|^U7$|^U9|^U11/i.test(equipe)) return "mini";
  if (/^U13|^U15|^U18/i.test(equipe)) return "jeunes";
  if (/^SF|^SM/i.test(equipe)) return "seniors";
  return "loisirs";
}

export type FicheEquipe = {
  nom: string;
  coachs: string;
  photo: string;
  creneaux: { id: string; avant: string; gymnase: string; lienGymnase: string }[];
};

export function ficheEquipe(nom: string): FicheEquipe {
  const creneaux = creneauxDe(nom);
  return {
    nom,
    coachs: [...new Set(creneaux.flatMap((c) => c.coachs))].join(", ") || A_COMPLETER,
    photo: PHOTOS_EQUIPES[nom] ?? `PHOTO D'ÉQUIPE ${nom} — 1200×800 px`,
    creneaux: creneaux.map((c) => ({
      id: c.id,
      avant: `${c.jour} ${c.debut}–${c.fin} · `,
      gymnase: c.gymnase,
      lienGymnase: lienGymnase(c.gymnase),
    })),
  };
}

export function equipesParCategorie() {
  const equipes = toutesLesEquipes();
  return CATEGORIES.map((c) => ({
    ...c,
    equipes: equipes.filter((e) => categorieDe(e) === c.cle).map(ficheEquipe),
  }));
}

/** Nombre de groupes à l'entraînement (codes d'équipe présents au planning). */
export function nbGroupes(): number {
  return toutesLesEquipes().length;
}

/* ---------- Gymnases ---------- */

export type DetailGymnase = (typeof GYMNASES)[number] & { nbCreneaux: number; jours: string };

export function detailGymnases(): DetailGymnase[] {
  return GYMNASES.map((g) => {
    const creneaux = creneauxDuGymnase(g.nom);
    const jours = [...new Set(creneaux.map((c) => c.jour))];
    return { ...g, nbCreneaux: creneaux.length, jours: jours.join(", ") || A_COMPLETER };
  });
}

/* ---------- Stages ---------- */

export function stageOuvert(stage: Stage): boolean {
  return /ouvert/i.test(stage.statut) && !/non ouvert|ferm|complet|à venir/i.test(stage.statut);
}

export function libelleSemaine(stage: Stage, semaine: Stage["semaines"][number]): string {
  return `${stage.periode} — ${semaine.nom} (${semaine.dates})`;
}

/** Semaines proposées dans le formulaire d'inscription aux stages. */
export function semainesOuvertes(): string[] {
  return STAGES.filter(stageOuvert).flatMap((s) => s.semaines.map((w) => libelleSemaine(s, w)));
}
