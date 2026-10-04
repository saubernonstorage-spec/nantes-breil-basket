"use client";

import { useState } from "react";
import { Fenetre } from "@/components/Fenetre";
import { Photo } from "@/components/Photo";

/**
 * Affiche (flyer) d'une date de l'agenda, au format portrait : cliquable, elle s'agrandit en entier dans une
 * fenêtre pour être lue. Sans affiche : un fond terrain aux couleurs du club, non cliquable.
 */
export function AfficheAgenda({ src, titre }: { src?: string; titre: string }) {
  const [ouvert, setOuvert] = useState(false);
  if (!src) {
    return (
      <div className="agenda__affiche">
        <Photo alt="" sizes="160px" />
      </div>
    );
  }
  return (
    <>
      <button type="button" className="agenda__affiche agenda__affiche--zoom" aria-label={`Agrandir l'affiche : ${titre}`} onClick={() => setOuvert(true)}>
        <Photo src={src} alt={`Affiche : ${titre}`} sizes="(max-width: 699px) 50vw, 160px" />
      </button>
      <Fenetre ouverte={ouvert} onFermer={() => setOuvert(false)} className="fenetre-zoom" label={`Affiche : ${titre}`}>
        <div className="fenetre-zoom__cadre fenetre-zoom__cadre--affiche">
          <Photo src={src} alt={`Affiche : ${titre}`} sizes="(max-width: 700px) 100vw, 640px" entiere />
        </div>
        <div className="fenetre-zoom__bas">
          <span>{titre}</span>
          <button type="button" className="bouton-rond bouton-rond--clair" aria-label="Fermer" onClick={() => setOuvert(false)}>
            ×
          </button>
        </div>
      </Fenetre>
    </>
  );
}
