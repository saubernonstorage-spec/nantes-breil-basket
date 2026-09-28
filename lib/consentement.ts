"use client";

import { useSyncExternalStore } from "react";

/**
 * Choix du visiteur sur les contenus intégrés (carte Google Maps, widget de résultats).
 * Conservé 6 mois dans le navigateur, comme le recommande la CNIL.
 */
export type Choix = { embeds: boolean };

const CLE = "nbb-consent";
const DUREE_MS = 182 * 24 * 60 * 60 * 1000;
const EVT_CHOIX = "nbb-consent";
const EVT_OUVRIR = "nbb-open-cookies";

/** Repli si le navigateur refuse le stockage (navigation privée stricte). */
let choixMemoire: Choix | null = null;
/** Dernière valeur lue : useSyncExternalStore exige le même objet tant que rien ne change. */
let cache: { brut: string | null; choix: Choix | null } = { brut: null, choix: null };

function lire(): Choix | null {
  let brut: string | null = null;
  try {
    brut = window.localStorage.getItem(CLE);
  } catch {
    return choixMemoire;
  }
  if (brut === cache.brut) return cache.choix ?? choixMemoire;
  let choix: Choix | null = null;
  try {
    const v = brut ? (JSON.parse(brut) as { embeds?: unknown; date?: unknown }) : null;
    const date = typeof v?.date === "string" ? Date.parse(v.date) : NaN;
    if (v && typeof v.embeds === "boolean" && Date.now() - date < DUREE_MS) choix = { embeds: v.embeds };
  } catch {
    choix = null;
  }
  cache = { brut, choix };
  return choix ?? choixMemoire;
}

export function enregistrerConsentement(choix: Choix) {
  try {
    window.localStorage.setItem(CLE, JSON.stringify({ ...choix, date: new Date().toISOString() }));
  } catch {
    // Stockage indisponible : le choix vaut pour la visite en cours.
    choixMemoire = choix;
  }
  window.dispatchEvent(new Event(EVT_CHOIX));
}

function abonner(rappel: () => void) {
  window.addEventListener(EVT_CHOIX, rappel);
  window.addEventListener("storage", rappel);
  return () => {
    window.removeEventListener(EVT_CHOIX, rappel);
    window.removeEventListener("storage", rappel);
  };
}

/** `undefined` pendant le rendu serveur, `null` si aucun choix n'a encore été fait. */
export function useConsentement(): Choix | null | undefined {
  return useSyncExternalStore<Choix | null | undefined>(abonner, lire, () => undefined);
}

/** Rouvre le bandeau (« Gérer les cookies », bouton « Afficher la carte »…). */
export function ouvrirGestionCookies() {
  window.dispatchEvent(new Event(EVT_OUVRIR));
}

export function surOuvertureCookies(rappel: () => void) {
  window.addEventListener(EVT_OUVRIR, rappel);
  return () => window.removeEventListener(EVT_OUVRIR, rappel);
}
