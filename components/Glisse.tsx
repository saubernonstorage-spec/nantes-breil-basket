"use client";

import { AnimatePresence, motion, MotionConfig } from "framer-motion";

/**
 * Listes filtrées (Entraînements, Matchs) : quand un filtre change, les cartes restantes glissent vers leur
 * nouvelle place, celles qui sortent s'effacent, celles qui arrivent apparaissent (framer-motion, animation de
 * mise en page). Court (250 ms), jamais en boucle ; coupé si le visiteur a demandé moins d'animations.
 */
const ENTREE = { opacity: 0, scale: 0.96 };
const PRESENT = { opacity: 1, scale: 1 };
const TRANSITION = { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const };

/** À placer autour de la zone filtrée : réglages communs et respect de « moins d'animations ». */
export function ZoneAnimee({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user" transition={TRANSITION}>{children}</MotionConfig>;
}

/** Liste dont les éléments entrent et sortent en douceur (les éléments sont des CarteAnimee). */
export function ListeAnimee({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      {children}
    </AnimatePresence>
  );
}

/** Carte qui glisse à sa nouvelle place quand la liste change. */
export function CarteAnimee({
  as = "article",
  className,
  children,
}: {
  as?: "article" | "li" | "div";
  className?: string;
  children: React.ReactNode;
}) {
  const Balise = as === "li" ? motion.li : as === "div" ? motion.div : motion.article;
  return (
    <Balise layout="position" initial={ENTREE} animate={PRESENT} exit={ENTREE} className={className}>
      {children}
    </Balise>
  );
}
