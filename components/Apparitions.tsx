"use client";

import { useEffect } from "react";

/**
 * Blocs qui apparaissent en douceur quand ils entrent à l'écran (une seule fois).
 * Uniquement le contenu « à découvrir » : pas les listes que l'on consulte vite
 * (planning, tableaux de matchs, FAQ, formulaires, mentions légales).
 */
const CIBLES = [
  ".acces",
  ".reseaux",
  ".carte-ecole",
  ".carte-arbitrage",
  ".banniere-photo",
  ".portrait",
  ".appel",
  ".carte-categorie",
  ".agenda__item",
  ".frise li",
  ".valeur",
  ".carte",
  ".encart",
  ".commission-recrute",
  ".commission",
  ".bandeau-orange",
  ".samedi",
  ".cotisation-mini",
  ".parcours__etape",
  ".seances",
  ".objectifs",
  ".equipe",
  ".carte-stage",
  ".tarifs-stage",
  ".journee-type",
  ".tarif",
  ".telechargements",
  ".album",
  ".partenaire",
  ".formule",
  ".offre",
  ".appel-orange",
].join(",");

/** Décalage entre les blocs d'une même rangée, plafonné pour ne jamais faire attendre. */
const DECALAGE_MS = 70;
const DECALAGE_MAX = 4;

/**
 * Sans JavaScript, ou si le visiteur a demandé moins d'animations, rien n'est masqué :
 * la classe « apparitions » n'est posée sur <html> qu'ici, et les blocs déjà visibles
 * au chargement s'affichent tout de suite, sans animation.
 * data-apparition : "attente" (masqué, hors écran) → "joue" (animation, voir globals.css).
 */
export function Apparitions() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    const main = document.getElementById("contenu");
    if (!main) return;

    const observateur = new IntersectionObserver(
      (entrees) => {
        let rang = 0;
        for (const e of entrees) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.style.setProperty("--apparition-delai", `${Math.min(rang++, DECALAGE_MAX) * DECALAGE_MS}ms`);
          el.dataset.apparition = "joue";
          observateur.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.12 },
    );

    const preparer = () => {
      const limite = window.innerHeight * 0.94;
      main.querySelectorAll<HTMLElement>(CIBLES).forEach((el) => {
        // Déjà en attente (effet relancé, par ex. en développement) : on l'observe de nouveau.
        if (el.dataset.apparition === "attente") {
          observateur.observe(el);
          return;
        }
        if (el.dataset.apparition !== undefined) return;
        // Déjà à l'écran (arrivée sur la page, lien vers une ancre) : affiché tel quel.
        if (el.getBoundingClientRect().top < limite) {
          el.dataset.apparition = "";
          return;
        }
        el.dataset.apparition = "attente";
        observateur.observe(el);
      });
    };

    document.documentElement.classList.add("apparitions");
    preparer();

    // Nouvelles pages (navigation sans rechargement) et contenus ajoutés après coup.
    let attente = 0;
    const mutations = new MutationObserver(() => {
      cancelAnimationFrame(attente);
      attente = requestAnimationFrame(preparer);
    });
    mutations.observe(main, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(attente);
      mutations.disconnect();
      observateur.disconnect();
    };
  }, []);

  return null;
}
