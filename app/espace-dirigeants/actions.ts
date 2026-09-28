"use server";

import { refresh } from "next/cache";
import { accesConfigure, estConnecte, fermerSession, motDePasseValide, ouvrirSession } from "@/lib/session";
import { changerStatut, STATUTS, supprimer, TABLES, type Table } from "@/lib/stockage";

export type EtatConnexion = { erreur: string };

export async function connexion(_: EtatConnexion, donnees: FormData): Promise<EtatConnexion> {
  if (!accesConfigure()) return { erreur: "L'accès n'est pas configuré." };
  const saisi = String(donnees.get("motDePasse") ?? "");
  if (!motDePasseValide(saisi)) {
    // Ralentit les essais en série.
    await new Promise((r) => setTimeout(r, 1200));
    return { erreur: "Mot de passe incorrect." };
  }
  await ouvrirSession();
  refresh();
  return { erreur: "" };
}

export async function deconnexion() {
  await fermerSession();
  refresh();
}

function tableValide(t: string): t is Table {
  return (TABLES as string[]).includes(t);
}

const idValide = (id: string) => /^[A-Z]{3}-[A-Z0-9]+-[A-F0-9]+$/.test(id);

export async function modifierStatut(table: string, id: string, statut: string) {
  if (!(await estConnecte()) || !tableValide(table) || !idValide(id) || !(STATUTS as readonly string[]).includes(statut)) return;
  await changerStatut(table, id, statut);
  refresh();
}

export async function supprimerDemande(table: string, id: string) {
  if (!(await estConnecte()) || !tableValide(table) || !idValide(id)) return;
  await supprimer(table, id);
  refresh();
}
