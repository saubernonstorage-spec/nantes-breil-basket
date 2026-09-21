"use client";

import { useEffect } from "react";

/**
 * Lien direct vers une ancre (ex. /inscriptions#faq) : pendant le chargement, la mise en page
 * bouge encore un peu (polices, animation d'entrée). Tant que le visiteur n'a pas défilé,
 * on garde l'ancre juste sous l'en-tête, puis on le laisse faire.
 */
export function AncreAuChargement() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id || !document.getElementById(id)) return;

    let actif = true;
    const recaler = () => {
      if (actif) document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
    };
    const arreter = () => {
      actif = false;
    };

    const evenements = ["wheel", "touchstart", "keydown", "mousedown"] as const;
    evenements.forEach((e) => window.addEventListener(e, arreter, { once: true, passive: true }));
    const observateur = new ResizeObserver(recaler);
    observateur.observe(document.body);
    document.fonts?.ready.then(recaler);
    const minuteries = [450, 1000, 2000].map((ms) => window.setTimeout(recaler, ms));
    const fin = window.setTimeout(() => {
      arreter();
      observateur.disconnect();
    }, 2500);

    return () => {
      arreter();
      observateur.disconnect();
      minuteries.forEach(clearTimeout);
      clearTimeout(fin);
      evenements.forEach((e) => window.removeEventListener(e, arreter));
    };
  }, []);

  return null;
}
