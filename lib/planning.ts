import { DAYS, SLOTS, type Slot } from "@/data/planning";

const collator = new Intl.Collator("fr", { numeric: true, sensitivity: "base" });

/** Tri : jour de la semaine, puis heure de début, puis gymnase. */
export function sortSlots(slots: Slot[]): Slot[] {
  return [...slots].sort(
    (a, b) =>
      DAYS.indexOf(a.jour) - DAYS.indexOf(b.jour) ||
      a.debut.localeCompare(b.debut) ||
      collator.compare(a.gymnase, b.gymnase),
  );
}

export function getTeams(): string[] {
  return [...new Set(SLOTS.flatMap((s) => s.equipes))].sort(collator.compare);
}

export function getGymnases(): string[] {
  return [...new Set(SLOTS.map((s) => s.gymnase))].sort(collator.compare);
}

export function getDays() {
  return DAYS.filter((d) => SLOTS.some((s) => s.jour === d));
}

export function slotsForTeam(team: string): Slot[] {
  return sortSlots(SLOTS.filter((s) => s.equipes.includes(team)));
}

export function slotsForGymnase(gymnase: string): Slot[] {
  return sortSlots(SLOTS.filter((s) => s.gymnase === gymnase));
}

/* ---------- Catégories d'équipes ---------- */

export const CATEGORY_ORDER = [
  "Micro-basket",
  "U7",
  "U9",
  "U11",
  "U13",
  "U15",
  "U18",
  "Seniors",
  "Loisirs",
  "Autres",
] as const;

export type Category = (typeof CATEGORY_ORDER)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  "Micro-basket": "Micro-basket",
  U7: "Moins de 7 ans (U7)",
  U9: "Moins de 9 ans (U9)",
  U11: "Moins de 11 ans (U11)",
  U13: "Moins de 13 ans (U13)",
  U15: "Moins de 15 ans (U15)",
  U18: "Moins de 18 ans (U18)",
  Seniors: "Seniors",
  Loisirs: "Loisirs",
  Autres: "Autres",
};

export function teamCategory(team: string): Category {
  const u = team.match(/^U(\d+)/);
  if (u) {
    const c = `U${u[1]}` as Category;
    if ((CATEGORY_ORDER as readonly string[]).includes(c)) return c;
  }
  if (/^S[MF]\d*/.test(team)) return "Seniors";
  if (/^Loisirs/i.test(team)) return "Loisirs";
  if (/^Micro/i.test(team)) return "Micro-basket";
  return "Autres";
}

export function teamsByCategory(): { category: Category; teams: string[] }[] {
  const teams = getTeams();
  return CATEGORY_ORDER.map((category) => ({
    category,
    teams: teams.filter((t) => teamCategory(t) === category),
  })).filter((g) => g.teams.length > 0);
}

/* ---------- Statistiques pour la page d'accueil ---------- */

export function getStats() {
  return {
    creneaux: SLOTS.length,
    equipes: getTeams().length,
    gymnases: getGymnases().length,
  };
}

/** "1 équipe", "2 équipes"… */
export function plural(n: number, singulier: string, pluriel = `${singulier}s`) {
  return `${n} ${n > 1 ? pluriel : singulier}`;
}
