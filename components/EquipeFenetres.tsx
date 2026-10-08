"use client";

import { useId, useState } from "react";
import { Fenetre } from "@/components/Fenetre";
import { LogoClub } from "@/components/LogoClub";
import { Photo } from "@/components/Photo";
import { IconeFermer, NouvelOnglet } from "@/components/icons";

type Classement = {
  championnat: string;
  maj: string;
  lignes: { rang: number; equipe: string; j: number; v: number; d: number; pts: number; nbb: boolean; logo: string }[];
  sansCompetition: boolean;
};

/** Photo d'équipe cliquable, agrandie dans une fenêtre. */
export function ZoomPhoto({ src, nom, libelle }: { src: string; nom: string; libelle: string }) {
  const [ouvert, setOuvert] = useState(false);
  return (
    <>
      <button type="button" className="equipe__zoom" aria-label={`Agrandir la photo de ${nom}`} onClick={() => setOuvert(true)}>
        <Photo src={src} alt={`Photo de l'équipe ${nom}`} sizes="(max-width: 700px) 100vw, 420px" />
      </button>
      <Fenetre ouverte={ouvert} onFermer={() => setOuvert(false)} className="fenetre-zoom" label={`Photo de l'équipe ${nom}`}>
        <div className="fenetre-zoom__cadre">
          <Photo src={src} alt={`Photo de l'équipe ${nom}`} sizes="(max-width: 1240px) 100vw, 1200px" entiere />
        </div>
        <div className="fenetre-zoom__bas">
          <span>{libelle}</span>
          <button type="button" className="bouton-rond bouton-rond--clair" aria-label="Fermer" onClick={() => setOuvert(false)}>
            <IconeFermer />
          </button>
        </div>
      </Fenetre>
    </>
  );
}

/** Bouton « Voir le classement » et sa fenêtre. */
export function BoutonClassement({
  libelle,
  classement,
  lienFFBB,
}: {
  libelle: string;
  classement: Classement;
  lienFFBB: string;
}) {
  const [ouvert, setOuvert] = useState(false);
  const idTitre = useId();
  const c = classement;
  const aVenir = !c.sansCompetition && c.lignes.length === 0;

  return (
    <>
      <button type="button" className="btn btn--s btn--petit btn--nuit btn--large equipe__classement" onClick={() => setOuvert(true)}>
        Voir le classement
      </button>
      <Fenetre ouverte={ouvert} onFermer={() => setOuvert(false)} className="fenetre" labelledBy={idTitre}>
        <div className="fenetre__tete">
          <div>
            <div className="surtitre" style={{ marginBottom: 8 }}>
              Classement
            </div>
            <h2 id={idTitre} className="fenetre__titre">
              {libelle}
            </h2>
            {c.championnat ? <div className="fenetre__sous-titre">{c.championnat}</div> : null}
          </div>
          <button type="button" className="bouton-rond bouton-rond--clair" aria-label="Fermer" onClick={() => setOuvert(false)}>
            <IconeFermer />
          </button>
        </div>
        <div className="fenetre__corps">
          {c.lignes.length > 0 ? (
            <>
              <table className="classement">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Équipe</th>
                    <th scope="col">J</th>
                    <th scope="col">V</th>
                    <th scope="col">D</th>
                    <th scope="col">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {c.lignes.map((l, i) => (
                    <tr key={`${l.rang}-${l.equipe}`} className={l.nbb ? "classement__nbb" : undefined} style={{ "--i": i } as React.CSSProperties}>
                      <td>{l.rang}</td>
                      <td>
                        <span className="avec-logo">
                          <LogoClub logo={l.logo} nom={l.equipe} taille={34} />
                          <span className="classement__nom">
                            {l.equipe}
                            {/* Bilan victoires / défaites : la barre se remplit à l'ouverture du classement. */}
                            {l.v + l.d > 0 ? (
                              <span className="bilan" aria-hidden="true">
                                <span className="bilan__v" style={{ flexGrow: l.v }} />
                                <span className="bilan__d" style={{ flexGrow: l.d }} />
                              </span>
                            ) : null}
                          </span>
                        </span>
                      </td>
                      <td>{l.j}</td>
                      <td>{l.v}</td>
                      <td>{l.d}</td>
                      <td>{l.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {c.maj ? <div className="fenetre__note">Mis à jour le {c.maj}</div> : null}
            </>
          ) : null}
          {c.sansCompetition ? (
            <p className="fenetre__texte">
              Cette équipe ne joue pas en championnat : pas de classement, place au jeu et aux progrès.
            </p>
          ) : null}
          {aVenir ? (
            <p className="fenetre__texte">
              Le classement de cette équipe n'est pas encore affiché ici. Retrouvez-le en direct sur le site de la
              Fédération.
            </p>
          ) : null}
          {!c.sansCompetition ? (
            <a href={lienFFBB} target="_blank" rel="noopener" className="btn btn--petit btn--nuit" style={{ alignSelf: "flex-start" }}>
              Résultats officiels FFBB
              <NouvelOnglet />
            </a>
          ) : null}
        </div>
      </Fenetre>
    </>
  );
}
