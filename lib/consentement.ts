"use client";

import { useSyncExternalStore } from "react";

/**
 * Choix du visiteur sur les contenus intégrés (widget Score'n'co…).
 * Conservé 6 mois dans le navigateur, comme le recommande la CNIL.
 */
export type Choix = "accepte" | "refuse";

const CLE = "nbb-consentement";
const DUREE_MS = 182 * 24 * 60 * 60 * 1000;
const EVT_CHOIX = "nbb:consentement";
const EVT_GERER = "nbb:gerer-cookies";

/** Repli si le navigateur refuse le stockage (navigation privée stricte). */
let choixMemoire: Choix | null = null;

export function lireConsentement(): Choix | null {
  try {
    const brut = window.localStorage.getItem(CLE);
    if (!brut) return null;
    const { choix, date } = JSON.parse(brut) as { choix?: string; date?: number };
    if ((choix !== "accepte" && choix !== "refuse") || typeof date !== "number") return null;
    if (Date.now() - date > DUREE_MS) return null;
    return choix;
  } catch {
    return null;
  }
}

export function enregistrerConsentement(choix: Choix) {
  try {
    window.localStorage.setItem(CLE, JSON.stringify({ choix, date: Date.now() }));
  } catch {
    // Stockage indisponible : le choix vaut pour la visite en cours.
    choixMemoire = choix;
  }
  window.dispatchEvent(new Event(EVT_CHOIX));
}

function lireSnapshot(): Choix | null {
  return lireConsentement() ?? choixMemoire;
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
  return useSyncExternalStore<Choix | null | undefined>(abonner, lireSnapshot, () => undefined);
}

export function ouvrirGestionCookies() {
  window.dispatchEvent(new Event(EVT_GERER));
}

export function surGestionCookies(rappel: () => void) {
  window.addEventListener(EVT_GERER, rappel);
  return () => window.removeEventListener(EVT_GERER, rappel);
}
