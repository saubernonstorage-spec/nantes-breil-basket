"use client";

import { useEffect, useRef } from "react";

type Props = {
  ouverte: boolean;
  onFermer: () => void;
  className?: string;
  label?: string;
  labelledBy?: string;
  /** Un clic en dehors du contenu (sur le fond) ferme la fenêtre. */
  fermerSurFond?: boolean;
  children: React.ReactNode;
};

/**
 * Fenêtre modale (élément <dialog> natif) : le navigateur garde le focus à l'intérieur,
 * Échap la ferme et le reste de la page devient inerte.
 */
export function Fenetre({ ouverte, onFermer, className, label, labelledBy, fermerSurFond = true, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (ouverte && !d.open) d.showModal();
    if (!ouverte && d.open) d.close();
  }, [ouverte]);

  return (
    <dialog
      ref={ref}
      className={className}
      aria-label={label}
      aria-labelledby={labelledBy}
      onClose={onFermer}
      onClick={(e) => {
        if (fermerSurFond && e.target === e.currentTarget) onFermer();
      }}
    >
      {ouverte ? children : null}
    </dialog>
  );
}
