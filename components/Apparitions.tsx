"use client";

import { useEffect } from "react";

/**
 * Blocs qui apparaissent en douceur à chaque fois qu'ils entrent à l'écran, en descendant
 * comme en remontant (ils arrivent du côté par lequel ils entrent).
 * Uniquement le contenu « à découvrir » : pas les listes que l'on consulte vite
 * (planning, tableaux de matchs, FAQ, formulaires, mentions légales).
 */
const CIBLES = [
  ".carte-ecole",
  ".carte-arbitrage",
  ".banniere-photo",
  ".portrait",
  ".appel",
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
/** Part du bloc visible à partir de laquelle il apparaît. */
const SEUIL = 0.15;

/**
 * Sans JavaScript, ou si le visiteur a demandé moins d'animations, rien n'est masqué :
 * la classe « apparitions » n'est posée sur <html> qu'ici, et les blocs déjà à l'écran
 * au chargement s'affichent tout de suite, sans animation.
 *
 * data-apparition : "" (affiché) · "attente" (masqué, entièrement hors de l'écran) · "joue" (animation).
 * data-apparition-sens : "bas" (le bloc entrera par le bas, en montant) ou "haut" (par le haut, en descendant).
 * Un bloc qui sort complètement de l'écran repasse en attente : il réapparaîtra à sa prochaine entrée.
 */
export function Apparitions() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    const main = document.getElementById("contenu");
    if (!main) return;

    const mettreEnAttente = (el: HTMLElement, auDessus: boolean) => {
      el.dataset.apparition = "attente";
      el.dataset.apparitionSens = auDessus ? "haut" : "bas";
    };

    const observateur = new IntersectionObserver(
      (entrees) => {
        let rang = 0;
        for (const e of entrees) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting && e.intersectionRatio >= SEUIL) {
            if (el.dataset.apparition !== "attente") continue;
            el.style.setProperty("--apparition-delai", `${Math.min(rang++, DECALAGE_MAX) * DECALAGE_MS}ms`);
            el.dataset.apparition = "joue";
          } else if (!e.isIntersecting && el.dataset.apparition !== "attente") {
            // Sorti de l'écran : invisible pour le visiteur, on le réarme pour sa prochaine entrée.
            mettreEnAttente(el, e.boundingClientRect.top < 0);
          }
        }
      },
      { threshold: [0, SEUIL] },
    );

    const preparer = () => {
      const hauteur = window.innerHeight;
      main.querySelectorAll<HTMLElement>(CIBLES).forEach((el) => {
        if (el.dataset.apparition === undefined) {
          const r = el.getBoundingClientRect();
          // À l'écran à l'arrivée : affiché tel quel. Au-dessus ou en dessous : il apparaîtra en entrant.
          if (r.bottom <= 0) mettreEnAttente(el, true);
          else if (r.top >= hauteur) mettreEnAttente(el, false);
          else el.dataset.apparition = "";
        }
        // Observer un bloc déjà suivi est sans effet (utile si l'effet est relancé en développement).
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
