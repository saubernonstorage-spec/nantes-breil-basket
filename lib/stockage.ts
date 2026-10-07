import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";

/**
 * Données saisies sur le site : demandes (inscriptions, stages, messages), base des adhérents, équipes
 * affectées et convocations, consultées dans l'Espace dirigeants. Fichiers JSON dans le dossier
 * DOSSIER_DONNEES (variable d'environnement ; par défaut .donnees/ à la racine du projet, ignoré par Git).
 * Sur le serveur (Hostinger), ce dossier est placé hors du dossier du site pour survivre aux déploiements.
 */

const DOSSIER = process.env.DOSSIER_DONNEES || path.join(process.cwd(), ".donnees");

/* ───────── Lecture et écriture des fichiers ───────── */

async function lireJson<T>(fichier: string, defaut: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(fichier, "utf8")) as T;
  } catch {
    return defaut;
  }
}

/** Écrit dans un fichier temporaire puis le renomme : un fichier n'est jamais à moitié écrit. */
async function ecrireJson(fichier: string, donnees: unknown): Promise<void> {
  await fs.mkdir(path.dirname(fichier), { recursive: true });
  const temporaire = `${fichier}.${randomBytes(4).toString("hex")}.tmp`;
  await fs.writeFile(temporaire, JSON.stringify(donnees, null, 2), "utf8");
  await fs.rename(temporaire, fichier);
}

/** Une modification à la fois par fichier : deux envois simultanés ne s'écrasent pas. */
const files = new Map<string, Promise<unknown>>();
function enFile<T>(fichier: string, action: () => Promise<T>): Promise<T> {
  const suite = (files.get(fichier) ?? Promise.resolve()).catch(() => {}).then(action);
  files.set(fichier, suite);
  return suite;
}

/* ───────── Demandes (formulaires) ───────── */

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

const FICHIER = path.join(DOSSIER, "demandes.json");

const lireDemandes = () => lireJson<Record<string, Demande[]>>(FICHIER, {});

/** Modifie la liste d'une table (lecture, modification, écriture, sans autre écriture entre les deux). */
function modifier(table: Table, changer: (liste: Demande[]) => Demande[]): Promise<void> {
  return enFile(FICHIER, async () => {
    const tout = await lireDemandes();
    tout[table] = changer(tout[table] ?? []);
    await ecrireJson(FICHIER, tout);
  });
}

const PREFIXES: Record<Table, string> = { inscriptions: "INS", stages: "STA", contacts: "MSG" };

/** Enregistre une demande et renvoie son numéro (ex. « INS-MG3K2A-7Q »), ou null en cas d'échec. */
export async function enregistrer(table: Table, champs: Record<string, string>): Promise<string | null> {
  const id = `${PREFIXES[table]}-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString("hex").toUpperCase()}`;
  try {
    await modifier(table, (liste) => [{ id, recuLe: new Date().toISOString(), statut: STATUTS[0], champs }, ...liste]);
    return id;
  } catch (erreur) {
    console.error(`[stockage] Enregistrement impossible (${table}) :`, erreur);
    return null;
  }
}

export async function lister(table: Table): Promise<Demande[]> {
  const liste = (await lireDemandes())[table] ?? [];
  return liste.sort((a, b) => b.recuLe.localeCompare(a.recuLe));
}

export async function lire(table: Table, id: string): Promise<Demande | null> {
  return ((await lireDemandes())[table] ?? []).find((d) => d.id === id) ?? null;
}

/** Note l'envoi de l'e-mail de confirmation : la demande passe « Confirmé ». */
export async function noterConfirmation(table: Table, id: string): Promise<void> {
  await modifier(table, (liste) =>
    liste.map((d) => (d.id === id ? { ...d, statut: "Confirmé", confirmationEnvoyee: new Date().toISOString() } : d)),
  );
}

export async function changerStatut(table: Table, id: string, statut: string): Promise<void> {
  await modifier(table, (liste) => liste.map((d) => (d.id === id ? { ...d, statut } : d)));
}

export async function supprimer(table: Table, id: string): Promise<void> {
  await modifier(table, (liste) => liste.filter((d) => d.id !== id));
}

/* ───────── Base des adhérents (export des licences, déposé dans l'Espace dirigeants) ───────── */

const FICHIER_ADHERENTS = path.join(DOSSIER, "adherents.json");

/** La base des adhérents, ou null si aucun export n'a encore été déposé. */
export function lireAdherents<T>(): Promise<T | null> {
  return lireJson<T | null>(FICHIER_ADHERENTS, null);
}

/** Remplace la base (null : la supprime). */
export function ecrireAdherents(base: unknown | null): Promise<void> {
  return enFile(FICHIER_ADHERENTS, () =>
    base === null ? fs.rm(FICHIER_ADHERENTS, { force: true }) : ecrireJson(FICHIER_ADHERENTS, base),
  );
}

const FICHIER_AFFECTATIONS = path.join(DOSSIER, "affectations.json");

/** Équipes d'entraînement et de match saisies par adhérent (gardées d'un dépôt d'export à l'autre). */
export function lireAffectations<T>(): Promise<T | null> {
  return lireJson<T | null>(FICHIER_AFFECTATIONS, null);
}

export function ecrireAffectations(affectations: unknown): Promise<void> {
  return enFile(FICHIER_AFFECTATIONS, () => ecrireJson(FICHIER_AFFECTATIONS, affectations));
}

/* ───────── Convocations des matchs (saisies dans l'Espace dirigeants) ───────── */

/** Arbitres, table et OTM d'un match à domicile ; clé : date (AAAA-MM-JJ) et équipe du site. */
export type ConvocationEnLigne = { date: string; equipe: string; arbitres: string; table: string; otm: string; modifieLe: string };

const FICHIER_CONVOCATIONS = path.join(DOSSIER, "convocations.json");

/** Toutes les convocations saisies en ligne (liste vide si le fichier n'existe pas encore). */
export function listerConvocations(): Promise<ConvocationEnLigne[]> {
  return lireJson<ConvocationEnLigne[]>(FICHIER_CONVOCATIONS, []);
}

/** Enregistre (ou efface, si arbitres, table et OTM sont vides) la convocation d'un match. */
export function enregistrerConvocation(c: Omit<ConvocationEnLigne, "modifieLe">): Promise<void> {
  return enFile(FICHIER_CONVOCATIONS, async () => {
    const liste = (await listerConvocations()).filter((x) => !(x.date === c.date && x.equipe === c.equipe));
    if (c.arbitres || c.table || c.otm) liste.push({ ...c, modifieLe: new Date().toISOString() });
    await ecrireJson(FICHIER_CONVOCATIONS, liste);
  });
}
