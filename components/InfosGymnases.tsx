"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { FicheGymnase } from "@/lib/nbb";
import { enLettres, majuscule } from "@/lib/utils";
import { ContenuConsenti } from "@/components/Cookies";
import { Terrain } from "@/components/Terrain";
import { NouvelOnglet } from "@/components/icons";

function abonnerHash(rappel: () => void) {
  window.addEventListener("hashchange", rappel);
  return () => window.removeEventListener("hashchange", rappel);
}

/** Carte du gymnase choisi (après accord), fiche d'accès et liste des gymnases. */
export function InfosGymnases({ fiches }: { fiches: FicheGymnase[] }) {
  const hash = useSyncExternalStore(abonnerHash, () => decodeURIComponent(window.location.hash.slice(1)), () => "");
  const [choix, setChoix] = useState<string | null>(null);
  const carte = useRef<HTMLElement>(null);

  // Arrivée par un lien « /infos#gym-… » : on montre directement la carte de ce gymnase.
  useEffect(() => {
    if (fiches.some((f) => f.ancre === hash)) {
      const t = window.setTimeout(() => carte.current?.scrollIntoView({ block: "start" }), 60);
      return () => window.clearTimeout(t);
    }
  }, [hash, fiches]);

  const gym =
    fiches.find((f) => f.nom === choix) ?? fiches.find((f) => f.ancre === hash) ?? fiches[0];

  const choisir = (nom: string) => {
    setChoix(nom);
    carte.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const nantes = fiches.filter((f) => !f.partenaire);
  const partenaires = fiches.filter((f) => f.partenaire);

  return (
    <>
      <section ref={carte} aria-labelledby="carte-titre" className="section" style={{ paddingTop: 56, paddingBottom: 40 }}>
        <div className="rangee" style={{ gap: 16, alignItems: "stretch" }}>
          <div className="carte-gym">
            <h2 id="carte-titre" className="sr-only">
              Carte des gymnases
            </h2>
            <ContenuConsenti
              bloque={(accepter) => (
                <div className="carte-gym__bloque">
                  <Terrain
                    motif="angle"
                    style={{ right: 0, bottom: 0, width: "min(60%, 380px)", transform: "scaleY(-1)" }}
                  />
                  <div className="surtitre relatif" style={{ margin: 0 }}>
                    Carte interactive
                  </div>
                  <p className="relatif">
                    La carte est fournie par Google Maps, qui dépose des cookies. Acceptez les contenus intégrés pour
                    l'afficher, ou ouvrez directement l'itinéraire.
                  </p>
                  <div className="rangee rangee--10 relatif">
                    <button type="button" className="btn btn--orange" onClick={accepter}>
                      Afficher la carte
                    </button>
                    <a href={gym.itineraire} target="_blank" rel="noopener" className="btn btn--clair">
                      Itinéraire vers {gym.nom}
                      <NouvelOnglet />
                    </a>
                  </div>
                </div>
              )}
            >
              <iframe
                key={gym.nom}
                title={`Carte — gymnase ${gym.nom}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(gym.adresse.replace(/\n/g, ", "))}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="carte-gym__iframe"
              />
            </ContenuConsenti>
          </div>

          <div className="fiche-gym" aria-live="polite">
            <div className="surtitre" style={{ margin: 0 }}>
              Gymnase affiché
            </div>
            <h3 className="fiche-gym__nom">{gym.nom}</h3>
            <p className="fiche-gym__adresse">{gym.adresse}</p>
            {gym.transports.length > 0 ? (
              <div className="transports">
                <div className="transports__titre">Accès en transports</div>
                {gym.transports.map((t) => (
                  <div key={`${t.mode}-${t.arret}`} className="transports__ligne">
                    <div className="transports__pastilles">
                      {t.lignes.map((l) => (
                        <span key={l.num} role="img" aria-label={l.label} style={{ background: l.fond, color: l.texte }}>
                          {l.num}
                        </span>
                      ))}
                    </div>
                    <span>
                      <strong>{t.mode}</strong> · arrêt {t.arret}
                    </span>
                  </div>
                ))}
                {gym.parking === false ? (
                  <div className="transports__parking transports__parking--non">
                    <span aria-hidden="true">P</span>Pas de parking
                  </div>
                ) : null}
                {gym.parking === true ? (
                  <div className="transports__parking">
                    <span aria-hidden="true">P</span>Parking
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="petit-texte">Accès : {gym.acces}</p>
            )}
            <div className="fiche-gym__planning">
              <strong>{gym.nb}</strong> d'entraînement par semaine · <Link href={gym.lienPlanning}>voir le planning</Link>
            </div>
            <a href={gym.itineraire} target="_blank" rel="noopener" className="btn btn--m btn--nuit btn--large" style={{ marginTop: "auto" }}>
              Itinéraire
              <NouvelOnglet />
            </a>
          </div>
        </div>
      </section>

      <section aria-labelledby="gyms-titre" className="section" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div className="surtitre">Nos gymnases</div>
        <h2 id="gyms-titre" className="titre-section" style={{ marginBottom: 24 }}>
          {majuscule(enLettres(nantes.length, true))} salles à Nantes
        </h2>
        <div className="grille grille--remplir" style={{ "--min": "290px" } as React.CSSProperties}>
          {[...nantes, ...partenaires].map((g) => (
            <article key={g.nom} id={g.ancre} className={g.partenaire ? "gym gym--partenaire" : "gym"}>
              <div className="gym__tete">
                <h3>{g.nom}</h3>
                <span className="gym__nb">{g.nb}</span>
              </div>
              {g.partenaire ? <span className="gym__badge">Gymnase partenaire</span> : null}
              <p className="gym__adresse">{g.adresse}</p>
              <div className="gym__boutons">
                <button type="button" className="btn btn--xs btn--petit btn--contour" onClick={() => choisir(g.nom)}>
                  Sur la carte
                </button>
                <a href={g.itineraire} target="_blank" rel="noopener" className="btn btn--xs btn--petit btn--nuit">
                  Itinéraire
                  <NouvelOnglet />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

/** Questions fréquentes : une réponse ouverte à la fois. */
export function Faq({ questions }: { questions: { q: string; r: string }[] }) {
  const [ouverte, setOuverte] = useState(0);
  return (
    <div className="faq">
      {questions.map((q, i) => {
        const open = ouverte === i;
        return (
          <div key={q.q} className="faq__item">
            <h3>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`faq-${i}`}
                className="faq__question"
                onClick={() => setOuverte(open ? -1 : i)}
              >
                {q.q}
                {/* Un « + » dessiné en CSS : sa barre verticale pivote pour former le « − ». */}
                <span aria-hidden="true" className="faq__signe" />
              </button>
            </h3>
            {/* Toujours présent pour que la hauteur puisse s'animer ; fermé, il est inerte et masqué aux lecteurs d'écran. */}
            <div id={`faq-${i}`} className="faq__reponse" data-ouvert={open} inert={!open} aria-hidden={!open}>
              <div>
                <p>{q.r}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
