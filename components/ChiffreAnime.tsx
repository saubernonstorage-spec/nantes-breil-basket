"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Chiffre qui défile de 0 à sa valeur quand il apparaît à l'écran (une seule fois), d'après le composant
 * « Number Ticker » de 21st.dev, réécrit sans dépendance. Une valeur non numérique (« ★★★ ») est affichée telle
 * quelle ; sans JavaScript ou si le visiteur a demandé moins d'animations, la valeur finale s'affiche directement.
 */
export function ChiffreAnime({ valeur, duree = 1200 }: { valeur: string; duree?: number }) {
  const cible = /^\d+$/.test(valeur.trim()) ? Number(valeur) : null;
  const [affiche, setAffiche] = useState(valeur);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (cible === null || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setAffiche("0");
    let image = 0;
    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (!entree.isIntersecting) return;
        observateur.disconnect();
        const debut = performance.now();
        const pas = (t: number) => {
          const p = Math.min(1, (t - debut) / duree);
          // Décélération en fin de course (ease-out cubique) : le chiffre « se pose ».
          setAffiche(String(Math.round(cible * (1 - (1 - p) ** 3))));
          if (p < 1) image = requestAnimationFrame(pas);
        };
        image = requestAnimationFrame(pas);
      },
      { threshold: 0.6 },
    );
    observateur.observe(el);
    return () => {
      observateur.disconnect();
      cancelAnimationFrame(image);
    };
  }, [cible, duree]);

  return (
    <span ref={ref} className="chiffre-anime" style={{ minWidth: `${valeur.length}ch` }}>
      {affiche}
    </span>
  );
}
