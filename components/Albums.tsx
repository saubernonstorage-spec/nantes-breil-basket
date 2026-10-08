"use client";

import { useState } from "react";
import type { Album } from "@/lib/types";
import { pluriel } from "@/lib/utils";
import { Fenetre } from "@/components/Fenetre";
import { Photo } from "@/components/Photo";
import { IconeFermer } from "@/components/icons";

/**
 * Albums de la galerie en mosaïque (le premier en grand, formats variés) ; chaque album s'ouvre dans une
 * fenêtre où les photos gardent leur format (colonnes).
 */
export function Albums({ albums }: { albums: Album[] }) {
  const [ouvert, setOuvert] = useState<string | null>(null);
  const album = albums.find((a) => a.id === ouvert);

  return (
    <>
      <div className="mosaique">
        {albums.map((a) => (
          <article key={a.id} className={a.photos.length ? "album album--ouvrable" : "album"}>
            <div className="album__couverture">
              <Photo src={a.couverture} alt={`Couverture de l'album ${a.titre}`} sizes="(max-width: 700px) 100vw, 680px" />
            </div>
            <div className="album__bas">
              <div>
                <h2 className="album__titre">{a.titre}</h2>
                <span className="album__meta">{a.photos.length ? pluriel(a.photos.length, "photo") : "Photos à venir"}</span>
              </div>
              {a.photos.length ? (
                <button type="button" className="btn btn--xs btn--petit btn--nuit" onClick={() => setOuvert(a.id)}>
                  Voir l'album
                </button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
      <Fenetre ouverte={!!album} onFermer={() => setOuvert(null)} className="fenetre-album" label={album?.titre} fermerSurFond={false}>
        {album ? (
          <div className="fenetre-album__contenu">
            <div className="fenetre-album__tete">
              <h2>{album.titre}</h2>
              <button type="button" className="bouton-rond bouton-rond--clair bouton-rond--grand" aria-label="Fermer l'album" onClick={() => setOuvert(null)}>
                <IconeFermer />
              </button>
            </div>
            <div className="fenetre-album__colonnes">
              {album.photos.map((p) => (
                <a key={p.src} href={p.src} target="_blank" rel="noopener" className="fenetre-album__photo">
                  <Photo src={p.src} alt={p.alt} sizes="(max-width: 600px) 100vw, 400px" />
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </Fenetre>
    </>
  );
}
