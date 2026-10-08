/** Temps côté navigateur : heure de Nantes et horloge partagée des comptes à rebours (sans état serveur). */
import { useSyncExternalStore } from "react";

/** Instant (UTC) correspondant à une date et une heure à Nantes (heure d'été ou d'hiver comprise). */
export function instantParis(date: string, heure = "00:00"): number {
  const naif = Date.parse(`${date}T${heure}:00Z`);
  const parties = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
      .formatToParts(new Date(naif))
      .map((p) => [p.type, p.value]),
  );
  const vuAParis = Date.parse(`${parties.year}-${parties.month}-${parties.day}T${parties.hour}:${parties.minute}:00Z`);
  return naif - (vuAParis - naif);
}

/** Jours, heures, minutes et secondes restant avant un instant. */
export function decompte(cible: number, maintenant: number) {
  const reste = Math.max(0, Math.floor((cible - maintenant) / 1000));
  return {
    reste,
    unites: [
      { valeur: Math.floor(reste / 86400), label: "jours" },
      { valeur: Math.floor((reste % 86400) / 3600), label: "heures" },
      { valeur: Math.floor((reste % 3600) / 60), label: "min" },
      { valeur: reste % 60, label: "sec" },
    ],
  };
}

/* Horloge partagée, mise à jour chaque seconde tant qu'un compte à rebours est affiché. */
let heure = 0;
const abonnes = new Set<() => void>();
let minuterie = 0;
function abonner(prevenir: () => void) {
  abonnes.add(prevenir);
  if (abonnes.size === 1) {
    heure = Date.now();
    minuterie = window.setInterval(() => {
      heure = Date.now();
      abonnes.forEach((f) => f());
    }, 1000);
  }
  return () => {
    abonnes.delete(prevenir);
    if (!abonnes.size) window.clearInterval(minuterie);
  };
}
function heureActuelle(): number {
  if (!heure) heure = Date.now();
  return heure;
}

/** Heure actuelle (ms), rafraîchie chaque seconde ; null pendant le rendu serveur. */
export function useHorloge(): number | null {
  return useSyncExternalStore(abonner, heureActuelle, () => null);
}
