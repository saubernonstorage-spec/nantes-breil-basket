/**
 * Petites fonctions pures (sans accès au contenu), utilisables côté serveur
 * comme dans les composants du navigateur.
 */

/** Texte encore à fournir par le club. */
export function aCompleter(texte: string | undefined | null): boolean {
  return !texte || texte.includes("[À COMPLÉTER") || texte.includes("[À CONFIRMER");
}

/** "Floreska-Guépin" → "floreska-guepin" ; "Micro 1" → "micro-1". */
export function slug(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function pluriel(n: number, singulier: string, pluriel = `${singulier}s`): string {
  return `${n} ${n > 1 ? pluriel : singulier}`;
}

const UNITES = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf", "vingt"];

/** 3 → "trois", 1 → "un" / "une" ; au-delà de vingt, le nombre en chiffres. */
export function enLettres(n: number, feminin = false): string {
  if (n === 1 && feminin) return "une";
  return UNITES[n] ?? String(n);
}

export function majuscule(texte: string): string {
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

/** "18:30" → "18h30" ; "09:00" → "09h00". */
export function heure(h: string): string {
  return h.replace(":", "h");
}

/** "18:00" → "18h", "18:30" → "18h30" (écriture courte). */
export function heureCourte(h: string): string {
  return h.replace(":00", "h").replace(":", "h");
}

function minutes(h: string): number {
  const [hh, mm] = h.split(":").map(Number);
  return hh * 60 + mm;
}

/** Durée d'un créneau : "1 h 30". */
export function duree(debut: string, fin: string): string {
  const x = minutes(fin) - minutes(debut);
  const h = Math.floor(x / 60);
  const m = x % 60;
  return `${h} h${m ? " " + String(m).padStart(2, "0") : ""}`;
}

export function euros(n: number): string {
  return Number.isInteger(n) ? `${n} €` : `${n.toFixed(2).replace(".", ",")} €`;
}

export function estEmail(texte: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texte);
}

export function estTelephone(texte: string): boolean {
  return texte.replace(/\D/g, "").length >= 10;
}

/** "06 34 37 09 72" → "tel:0634370972". */
export function lienTel(numero: string): string {
  return `tel:${numero.replace(/[^\d+]/g, "")}`;
}

/** Itinéraire Google Maps vers une adresse (s'ouvre dans l'application du téléphone). */
export function itineraire(adresse: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(adresse.replace(/\n/g, ", "))}`;
}

export function initiales(nom: string): string {
  return nom
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((m) => m[0]?.toUpperCase())
    .join("");
}

/* ───────── Stages : calcul du montant (formulaire et serveur) ───────── */

export type PrixStage = { jour: number; semaine: number };

/** "18 €" → 18. */
export function montant(texte: string): number {
  return parseInt(texte, 10) || 0;
}

/** Prix d'une semaine selon le nombre de jours choisis : jamais plus cher que la semaine complète. */
export function coutSemaine(nJours: number, joursDansLaSemaine: number, prix: PrixStage): number {
  if (nJours === 0) return 0;
  if (nJours >= joursDansLaSemaine) return prix.semaine;
  return Math.min(nJours * prix.jour, prix.semaine);
}

/** Réduction famille (en %) selon le nombre d'enfants inscrits. */
export function tauxReduction(reductions: { enfants: number; taux: number }[], enfants: number): number {
  return reductions.filter((r) => enfants >= r.enfants).reduce((m, r) => Math.max(m, r.taux), 0);
}

export function appliquerReduction(brut: number, taux: number): number {
  return Math.round(brut * (100 - taux)) / 100;
}

/* ───────── Inscriptions : catégorie selon l'année de naissance ───────── */

export function categorieParAnnee(
  table: { categorie: string; nesDe: number; nesA: number }[],
  annee: number,
): string {
  if (!annee) return "";
  const ligne = table.find((c) => annee >= c.nesDe && annee <= c.nesA);
  if (ligne) return ligne.categorie;
  const plusJeune = Math.max(...table.map((c) => c.nesA));
  return annee > plusJeune ? "Trop jeune pour cette saison" : "";
}

export type PrixCotisation = { prix: number; prixB: number };

/** Cotisation estimée d'après la catégorie, l'équipe souhaitée et l'option d'assurance B. */
export function estimerCotisation({
  categorie,
  tarifEquipe,
  mini,
  seniors,
  jeunes,
  assuranceB,
}: {
  categorie: string;
  tarifEquipe: PrixCotisation | null;
  mini: PrixCotisation;
  seniors: PrixCotisation;
  /** Fourchette des tarifs jeunes, quand l'équipe n'est pas encore choisie. */
  jeunes: { min: PrixCotisation; max: PrixCotisation };
  assuranceB: boolean;
}): string {
  let t: PrixCotisation | null = null;
  if (/^Micro|^U7$/.test(categorie)) t = mini;
  else if (tarifEquipe) t = tarifEquipe;
  else if (categorie === "Seniors") t = seniors;
  if (!t) {
    return assuranceB ? `${jeunes.min.prixB} à ${jeunes.max.prixB} €` : `${jeunes.min.prix} à ${jeunes.max.prix} €`;
  }
  return `${assuranceB ? t.prixB : t.prix} €`;
}

/** Équipes à proposer pour une catégorie d'âge et un sexe (« F », « M » ou vide). */
export function equipesProposees(equipes: string[], categorie: string, sexe: string): string[] {
  if (!categorie) return [];
  if (categorie === "Seniors") {
    const motif = sexe === "F" ? /^SF|^Loisirs/ : sexe === "M" ? /^SM|^Loisirs/ : /^S[FM]|^Loisirs/;
    return equipes.filter((e) => motif.test(e));
  }
  if (/^Micro|^U7$/.test(categorie)) return equipes.filter((e) => e === categorie);
  const suffixe = sexe === "F" ? "F" : sexe === "M" ? "(M|HPB)" : "";
  const motif = new RegExp(`^${categorie.replace(/[^A-Za-z0-9]/g, "")}${suffixe}`);
  return equipes.filter((e) => motif.test(e));
}
