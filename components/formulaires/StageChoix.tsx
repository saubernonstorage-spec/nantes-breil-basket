"use client";

import { createContext, use, useState, type ReactNode } from "react";

type Contexte = { choix: string; setChoix: (valeur: string) => void };

const StageChoixContexte = createContext<Contexte | null>(null);

/** Mémorise la semaine de stage choisie, partagée entre les boutons et le formulaire. */
export function StageChoixProvider({ initial, children }: { initial: string; children: ReactNode }) {
  const [choix, setChoix] = useState(initial);
  return <StageChoixContexte value={{ choix, setChoix }}>{children}</StageChoixContexte>;
}

export function useStageChoix(): Contexte {
  const ctx = use(StageChoixContexte);
  if (!ctx) throw new Error("useStageChoix doit être utilisé dans <StageChoixProvider>.");
  return ctx;
}

/** Bouton « Inscrire mon enfant » d'une semaine : présélectionne la semaine et descend au formulaire. */
export function BoutonInscrireStage({ valeur }: { valeur: string }) {
  const { setChoix } = useStageChoix();
  return (
    <a
      href="#inscription-stage"
      className="btn btn--primary btn--sm"
      style={{ whiteSpace: "nowrap" }}
      onClick={() => {
        setChoix(valeur);
        requestAnimationFrame(() => document.getElementById("s-periode")?.focus({ preventScroll: true }));
      }}
    >
      Inscrire mon enfant
    </a>
  );
}
