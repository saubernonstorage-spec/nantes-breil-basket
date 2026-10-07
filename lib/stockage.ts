import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { getStore, type Store } from "@netlify/blobs";

/**
 * Demandes reçues par le site (inscriptions, stages, messages), consultées dans l'Espace dirigeants.
 * Sur Netlify : Netlify Blobs, données hébergées dans l'Union européenne (Francfort).
 * Ailleurs (serveur Node.js, ex. Hostinger) et en local : fichiers JSON dans le dossier DOSSIER_DONNEES
 * (variable d'environnement ; par défaut .donnees/ à la racine du projet, ignoré par Git). Sur un serveur,
 * le placer hors du dossier de déploiement pour qu'il survive aux mises à jour du site.
 */

const DOSSIER = process.env.DOSSIER_DONNEES || path.join(process.cwd(), ".donnees");

export type Table = "inscriptions" | "stages" | "contacts";
export const TABLES: Table[] = ["inscriptions", "stages", "contacts"];

export const STATUTS = ["À traiter", "Confirmé", "Liste d'attente", "Payé", "Refusé"] as const;

export type Demande = {
  id: string;
  recuLe: string;
  statut: string;
  champs: Record<string, string>;
  /** Date d'envoi de l'e-mail de confirmation (inscriptions aux stages), s'il est parti. */
  confirmationEnvoyee?: string;
};

interface Magasin {
  lister(table: Table): Promise<Demande[]>;
  lire(table: Table, id: string): Promise<Demande | null>;
  ecrire(table: Table, demande: Demande): Promise<void>;
  supprimer(table: Table, id: string): Promise<void>;
}

/* ───────── Netlify Blobs ───────── */

function magasinNetlify(store: Store): Magasin {
  const lireCle = async (cle: string): Promise<Demande | null> => {
    try {
      return (await store.get(cle, { type: "json", consistency: "strong" })) as Demande | null;
    } catch (e) {
      // Lecture « forte » indisponible dans cet environnement : lecture normale.
      if (e instanceof Error && /consistency/i.test(e.message)) {
        return (await store.get(cle, { type: "json" })) as Demande | null;
      }
      throw e;
    }
  };
  return {
    async lister(table) {
      const { blobs } = await store.list({ prefix: `${table}/` });
      const demandes: Demande[] = [];
      for (let i = 0; i < blobs.length; i += 20) {
        const lot = await Promise.all(blobs.slice(i, i + 20).map((b) => lireCle(b.key)));
        demandes.push(...lot.filter((d): d is Demande => d !== null));
      }
      return demandes;
    },
    lire: (table, id) => lireCle(`${table}/${id}`),
    async ecrire(table, demande) {
      await store.setJSON(`${table}/${demande.id}`, demande);
    },
    async supprimer(table, id) {
      await store.delete(`${table}/${id}`);
    },
  };
}

/* ───────── Fichier local (développement) ───────── */

const FICHIER = path.join(DOSSIER, "demandes.json");

async function lireFichier(): Promise<Record<string, Demande[]>> {
  try {
    return JSON.parse(await fs.readFile(FICHIER, "utf8"));
  } catch {
    return {};
  }
}

async function ecrireFichier(donnees: Record<string, Demande[]>) {
  await fs.mkdir(path.dirname(FICHIER), { recursive: true });
  await fs.writeFile(FICHIER, JSON.stringify(donnees, null, 2), "utf8");
}

const magasinLocal: Magasin = {
  async lister(table) {
    return (await lireFichier())[table] ?? [];
  },
  async lire(table, id) {
    return ((await lireFichier())[table] ?? []).find((d) => d.id === id) ?? null;
  },
  async ecrire(table, demande) {
    const tout = await lireFichier();
    const liste = (tout[table] ?? []).filter((d) => d.id !== demande.id);
    tout[table] = [demande, ...liste];
    await ecrireFichier(tout);
  },
  async supprimer(table, id) {
    const tout = await lireFichier();
    tout[table] = (tout[table] ?? []).filter((d) => d.id !== id);
    await ecrireFichier(tout);
  },
};

function magasin(): Magasin {
  try {
    return magasinNetlify(getStore({ name: "nbb-demandes", region: "eu-central-1" }));
  } catch {
    // Hors de Netlify (développement, `npm start`) : fichier local.
    return magasinLocal;
  }
}

/* ───────── API ───────── */

const PREFIXES: Record<Table, string> = { inscriptions: "INS", stages: "STA", contacts: "MSG" };

/** Enregistre une demande et renvoie son numéro (ex. « INS-MG3K2A-7Q »), ou null en cas d'échec. */
export async function enregistrer(table: Table, champs: Record<string, string>): Promise<string | null> {
  const id = `${PREFIXES[table]}-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString("hex").toUpperCase()}`;
  try {
    await magasin().ecrire(table, { id, recuLe: new Date().toISOString(), statut: STATUTS[0], champs });
    return id;
  } catch (erreur) {
    console.error(`[stockage] Enregistrement impossible (${table}) :`, erreur);
    return null;
  }
}

export async function lister(table: Table): Promise<Demande[]> {
  const liste = await magasin().lister(table);
  return liste.sort((a, b) => b.recuLe.localeCompare(a.recuLe));
}

export async function lire(table: Table, id: string): Promise<Demande | null> {
  return magasin().lire(table, id);
}

/** Note l'envoi de l'e-mail de confirmation : la demande passe « Confirmé ». */
export async function noterConfirmation(table: Table, id: string): Promise<void> {
  const m = magasin();
  const demande = await m.lire(table, id);
  if (!demande) return;
  await m.ecrire(table, { ...demande, statut: "Confirmé", confirmationEnvoyee: new Date().toISOString() });
}

export async function changerStatut(table: Table, id: string, statut: string): Promise<void> {
  const m = magasin();
  const demande = await m.lire(table, id);
  if (demande) await m.ecrire(table, { ...demande, statut });
}

export async function supprimer(table: Table, id: string): Promise<void> {
  await magasin().supprimer(table, id);
}

/* ───────── Base des adhérents (export des licences, déposé dans l'Espace dirigeants) ───────── */

const FICHIER_ADHERENTS = path.join(DOSSIER, "adherents.json");

function magasinAdherents(): Store | null {
  try {
    return getStore({ name: "nbb-adherents", region: "eu-central-1" });
  } catch {
    return null; // hors de Netlify : fichier local
  }
}

/** La base des adhérents, ou null si aucun export n'a encore été déposé. */
export async function lireAdherents<T>(): Promise<T | null> {
  const store = magasinAdherents();
  if (store) return (await store.get("base", { type: "json" })) as T | null;
  try {
    return JSON.parse(await fs.readFile(FICHIER_ADHERENTS, "utf8")) as T;
  } catch {
    return null;
  }
}

/** Remplace la base (null : la supprime). */
export async function ecrireAdherents(base: unknown | null): Promise<void> {
  const store = magasinAdherents();
  if (store) {
    if (base === null) await store.delete("base");
    else await store.setJSON("base", base);
    return;
  }
  if (base === null) {
    await fs.rm(FICHIER_ADHERENTS, { force: true });
    return;
  }
  await fs.mkdir(path.dirname(FICHIER_ADHERENTS), { recursive: true });
  await fs.writeFile(FICHIER_ADHERENTS, JSON.stringify(base), "utf8");
}

const FICHIER_AFFECTATIONS = path.join(DOSSIER, "affectations.json");

/** Équipes d'entraînement et de match saisies par adhérent (gardées d'un dépôt d'export à l'autre). */
export async function lireAffectations<T>(): Promise<T | null> {
  const store = magasinAdherents();
  if (store) return (await store.get("affectations", { type: "json" })) as T | null;
  try {
    return JSON.parse(await fs.readFile(FICHIER_AFFECTATIONS, "utf8")) as T;
  } catch {
    return null;
  }
}

export async function ecrireAffectations(affectations: unknown): Promise<void> {
  const store = magasinAdherents();
  if (store) {
    await store.setJSON("affectations", affectations);
    return;
  }
  await fs.mkdir(path.dirname(FICHIER_AFFECTATIONS), { recursive: true });
  await fs.writeFile(FICHIER_AFFECTATIONS, JSON.stringify(affectations), "utf8");
}

/* ───────── Convocations des matchs (saisies dans l'Espace dirigeants) ───────── */

/** Arbitres, table et OTM d'un match à domicile ; clé : date (AAAA-MM-JJ) et équipe du site. */
export type ConvocationEnLigne = { date: string; equipe: string; arbitres: string; table: string; otm: string; modifieLe: string };

const FICHIER_CONVOCATIONS = path.join(DOSSIER, "convocations.json");
const cleConvocation = (date: string, equipe: string) => `convocations/${date}_${equipe}`;

function magasinConvocations(): Store | null {
  try {
    return getStore({ name: "nbb-convocations", region: "eu-central-1" });
  } catch {
    return null; // hors de Netlify : fichier local
  }
}

async function lireFichierConvocations(): Promise<ConvocationEnLigne[]> {
  try {
    return JSON.parse(await fs.readFile(FICHIER_CONVOCATIONS, "utf8"));
  } catch {
    return [];
  }
}

/**
 * Toutes les convocations saisies en ligne. En cas d'erreur de lecture (stockage indisponible, pendant
 * la construction du site…), une liste vide : la page Matchs garde alors celles de data/nbb.ts.
 */
export async function listerConvocations(): Promise<ConvocationEnLigne[]> {
  try {
    const store = magasinConvocations();
    if (!store) return await lireFichierConvocations();
    const { blobs } = await store.list({ prefix: "convocations/" });
    const lues = await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" }) as Promise<ConvocationEnLigne | null>));
    return lues.filter((c): c is ConvocationEnLigne => c !== null);
  } catch (erreur) {
    console.error("[stockage] Convocations illisibles :", erreur);
    return [];
  }
}

/** Enregistre (ou efface, si arbitres, table et OTM sont vides) la convocation d'un match. */
export async function enregistrerConvocation(c: Omit<ConvocationEnLigne, "modifieLe">): Promise<void> {
  const vide = !c.arbitres && !c.table && !c.otm;
  const store = magasinConvocations();
  if (store) {
    if (vide) await store.delete(cleConvocation(c.date, c.equipe));
    else await store.setJSON(cleConvocation(c.date, c.equipe), { ...c, modifieLe: new Date().toISOString() });
    return;
  }
  const liste = (await lireFichierConvocations()).filter((x) => !(x.date === c.date && x.equipe === c.equipe));
  if (!vide) liste.push({ ...c, modifieLe: new Date().toISOString() });
  await fs.mkdir(path.dirname(FICHIER_CONVOCATIONS), { recursive: true });
  await fs.writeFile(FICHIER_CONVOCATIONS, JSON.stringify(liste, null, 2), "utf8");
}
