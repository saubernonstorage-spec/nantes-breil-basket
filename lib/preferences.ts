/**
 * Préférences du visiteur gardées sur son appareil (localStorage), sans compte ni cookie : « mon équipe »,
 * reprise par les pages Entraînements et Matchs. Utilisable côté navigateur (fonctions sans état serveur).
 */
import { useSyncExternalStore } from "react";

const CLE_EQUIPE = "nbb-mon-equipe";
const EVENEMENT = "nbb-preferences";

function lire(): string {
  try {
    return localStorage.getItem(CLE_EQUIPE) ?? "";
  } catch {
    return ""; // stockage indisponible (navigation privée stricte) : pas de mémoire
  }
}

function abonner(prevenir: () => void) {
  window.addEventListener("storage", prevenir);
  window.addEventListener(EVENEMENT, prevenir);
  return () => {
    window.removeEventListener("storage", prevenir);
    window.removeEventListener(EVENEMENT, prevenir);
  };
}

/** Équipe mémorisée sur l'appareil ("" : aucune ; toujours "" pendant le rendu serveur). */
export function useMonEquipe(): string {
  return useSyncExternalStore(abonner, lire, () => "");
}

/** Mémorise l'équipe choisie dans un filtre ("" : l'oublie). */
export function memoriserEquipe(equipe: string) {
  try {
    if (equipe) localStorage.setItem(CLE_EQUIPE, equipe);
    else localStorage.removeItem(CLE_EQUIPE);
  } catch {
    // stockage indisponible : le filtre fonctionne quand même, sans mémoire
  }
  window.dispatchEvent(new Event(EVENEMENT));
}
