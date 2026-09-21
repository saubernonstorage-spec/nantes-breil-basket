/**
 * Petites fonctions sans données, utilisables partout (y compris côté navigateur).
 */

export const A_COMPLETER = "[À COMPLÉTER]";

/** Vrai si le texte est vide ou contient encore "[À COMPLÉTER]". */
export function estACompleter(texte: string | undefined | null): boolean {
  return !texte || texte.includes(A_COMPLETER);
}

/** Adresse web complète (https://…) : ouverte dans un nouvel onglet. */
export function estLienExterne(lien: string): boolean {
  return /^https?:\/\//i.test(lien.trim());
}

/** Vraie photo (chemin "/photos/…" ou adresse web) plutôt qu'un texte d'emplacement. */
export function estPhoto(valeur: string | undefined | null): valeur is string {
  if (!valeur) return false;
  const v = valeur.trim();
  return v.startsWith("/") || estLienExterne(v);
}

/** Adresse e-mail utilisable dans un lien mailto. */
export function estEmail(valeur: string): boolean {
  return /^[^\s@<>()[\]",;:]+@[^\s@<>()[\]",;:]+\.[a-z]{2,}$/i.test(valeur.trim());
}

/** Pluriel simple : "1 créneau", "3 créneaux". */
export function pluriel(n: number, singulier: string, plurielForme = `${singulier}s`): string {
  return `${n} ${n > 1 ? plurielForme : singulier}`;
}

/** 9 → "neuf" (jusqu'à vingt ; au-delà, le nombre en chiffres). */
export function enLettres(n: number): string {
  const mots = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf", "vingt"];
  return mots[n] ?? String(n);
}

/** "neuf" → "Neuf" */
export function majuscule(texte: string): string {
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

/** Lien vers la fiche d'un gymnase (page Infos pratiques). */
export function lienGymnase(nom: string): string {
  return `/infos?gym=${encodeURIComponent(nom)}#gymnases`;
}

/** Lien vers le planning filtré. */
export function lienPlanning(filtres: { equipe?: string; gym?: string; jour?: string }): string {
  const params = new URLSearchParams();
  if (filtres.equipe) params.set("equipe", filtres.equipe);
  if (filtres.gym) params.set("gym", filtres.gym);
  if (filtres.jour) params.set("jour", filtres.jour);
  const q = params.toString();
  return q ? `/planning?${q}` : "/planning";
}

/** Lien d'itinéraire (ouvre l'application de cartes du téléphone). */
export function lienItineraire(adresse: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(adresse)}`;
}

/** Carte OpenStreetMap intégrable, centrée sur un point. */
export function carteOsm(lat: number, lon: number) {
  const dLon = 0.018;
  const dLat = 0.009;
  const bbox = [lon - dLon, lat - dLat, lon + dLon, lat + dLat].map((n) => n.toFixed(5)).join("%2C");
  return {
    embed: `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`,
    lien: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=17/${lat}/${lon}`,
  };
}

/** "06 04 45 11 65" → "tel:+33604451165" */
export function lienTelephone(numero: string): string {
  const chiffres = numero.replace(/[^\d+]/g, "");
  if (chiffres.startsWith("0")) return `tel:+33${chiffres.slice(1)}`;
  return `tel:${chiffres}`;
}
