"use client";

import { useEffect } from "react";

/** Surfaces qui suivent la souris (voir « Effets liés au curseur » dans app/globals.css). */
const CIBLES = ".hero, a.cat-card, a.album, a.partner-tile";

/**
 * Transmet la position de la souris à quelques surfaces, sous forme de variables CSS
 * (--px et --py, en pixels depuis le coin haut-gauche de l'élément survolé).
 *
 * Rien n'est activé au doigt (écrans tactiles) ni si le visiteur a demandé moins
 * d'animations : sans ce script, le site s'affiche exactement pareil, en moins vivant.
 */
export function EffetsPointeur() {
  useEffect(() => {
    const souris = window.matchMedia("(pointer: fine)");
    const sobre = window.matchMedia("(prefers-reduced-motion: reduce)");
    const racine = document.documentElement;

    let cible: HTMLElement | null = null;
    let trame = 0;
    let x = 0;
    let y = 0;

    const placer = () => {
      trame = 0;
      if (!cible) return;
      const boite = cible.getBoundingClientRect();
      cible.style.setProperty("--px", `${Math.round(x - boite.left)}px`);
      cible.style.setProperty("--py", `${Math.round(y - boite.top)}px`);
    };

    const oublier = () => {
      cible?.style.removeProperty("--px");
      cible?.style.removeProperty("--py");
      cible = null;
    };

    const surDeplacement = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const survolee = e.target instanceof Element ? e.target.closest<HTMLElement>(CIBLES) : null;
      if (survolee !== cible) oublier();
      cible = survolee;
      if (!cible) return;
      x = e.clientX;
      y = e.clientY;
      // Une seule mise à jour par image affichée, même si la souris bouge beaucoup.
      if (!trame) trame = requestAnimationFrame(placer);
    };

    const regler = () => {
      const actif = souris.matches && !sobre.matches;
      racine.classList.toggle("curseur", actif);
      if (actif) {
        document.addEventListener("pointermove", surDeplacement, { passive: true });
      } else {
        document.removeEventListener("pointermove", surDeplacement);
        oublier();
      }
    };

    regler();
    souris.addEventListener("change", regler);
    sobre.addEventListener("change", regler);

    return () => {
      souris.removeEventListener("change", regler);
      sobre.removeEventListener("change", regler);
      document.removeEventListener("pointermove", surDeplacement);
      if (trame) cancelAnimationFrame(trame);
      oublier();
      racine.classList.remove("curseur");
    };
  }, []);

  return null;
}
