"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { MatchDomicileVue, MatchExterieurVue, WeekEndVue } from "@/lib/nbb";
import { pluriel } from "@/lib/utils";
import { ContenuConsenti } from "@/components/Cookies";
import { NouvelOnglet } from "@/components/icons";

type Props = { weekends: WeekEndVue[]; indexDefaut: number; equipes: string[]; whatsapp: string };

function parJour<T extends { jourCle: string; jourLabel: string }>(liste: T[]) {
  const groupes: { cle: string; label: string; matchs: T[] }[] = [];
  for (const m of liste) {
    let g = groupes.find((x) => x.cle === m.jourCle);
    if (!g) {
      g = { cle: m.jourCle, label: m.jourLabel, matchs: [] };
      groupes.push(g);
    }
    g.matchs.push(m);
  }
  return groupes;
}

export function MatchsVue({ weekends, indexDefaut, equipes, whatsapp, equipeInitiale = "" }: Props & { equipeInitiale?: string }) {
  const [sel, choisirSemaine] = useState(indexDefaut);
  const [equipe, choisirEquipe] = useState(equipeInitiale);
  // Chaque choix rejoue un fondu très court sur les tableaux : on voit qu'ils ont été mis à jour.
  const [version, setVersion] = useState(0);
  const setSel = (i: number) => {
    choisirSemaine(i);
    setVersion((v) => v + 1);
  };
  const setEquipe = (e: string) => {
    choisirEquipe(e);
    setVersion((v) => v + 1);
  };
  const rafraichi = version ? "rafraichi" : undefined;
  const rail = useRef<HTMLDivElement>(null);
  const premier = useRef(true);

  // Le week-end choisi reste visible dans la barre de défilement.
  useEffect(() => {
    const r = rail.current;
    const el = r?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (r && el) r.scrollTo({ left: Math.max(0, el.offsetLeft - 8), behavior: premier.current ? "auto" : "smooth" });
    premier.current = false;
  }, [sel]);

  const w = weekends[sel];
  const filtre = <M extends { equipe: string }>(m: M) => !equipe || m.equipe === equipe;
  const dom = w.domicile.filter(filtre);
  const ext = w.exterieur.filter(filtre);
  const pour = equipe ? " pour cette équipe " : " ";
  const precOk = sel > 0;
  const suivOk = sel < weekends.length - 1;

  return (
    <>
      <section aria-label="Choisir le week-end et l'équipe" className="section" style={{ paddingTop: 40, paddingBottom: 0 }}>
        <div className="choix-weekend">
          <div className="choix-weekend__rail-bloc">
            <button
              type="button"
              className="choix-weekend__fleche"
              aria-label="Week-end précédent"
              disabled={!precOk}
              onClick={() => precOk && setSel(sel - 1)}
            >
              ‹
            </button>
            <div ref={rail} role="group" aria-label="Choisir le week-end" className="choix-weekend__rail">
              {weekends.map((x, i) => (
                <button
                  key={x.semaine + x.dates}
                  type="button"
                  aria-pressed={i === sel}
                  className="choix-weekend__semaine"
                  onClick={() => setSel(i)}
                >
                  <span className="choix-weekend__num">{x.num}</span>
                  <span className="choix-weekend__dates">{x.dates}</span>
                  {x.vide ? <span className="choix-weekend__avenir">À venir</span> : null}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="choix-weekend__fleche"
              aria-label="Week-end suivant"
              disabled={!suivOk}
              onClick={() => suivOk && setSel(sel + 1)}
            >
              ›
            </button>
          </div>
          <label className="choix-weekend__equipe">
            Mon équipe
            <select value={equipe} onChange={(e) => setEquipe(e.target.value)}>
              <option value="">Toutes</option>
              {equipes.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section aria-labelledby="dom-titre" className="section" style={{ paddingTop: 48, paddingBottom: 24 }}>
        <div className="tete-section" style={{ marginBottom: 10 }}>
          <div>
            <div className="surtitre">À domicile · {pluriel(dom.length, "match", "matchs")}</div>
            <h2 id="dom-titre" className="titre-section">
              Chez nous
            </h2>
          </div>
          <p className="tete-section__texte" style={{ maxWidth: 460, fontSize: 14 }}>
            « 2 × U11F2 » : deux joueurs ou joueuses de cette équipe tiennent la table de marque. Pas disponible ?
            Trouvez un remplaçant et prévenez votre coach.
          </p>
        </div>
        <div key={version} className={rafraichi}>
        {dom.length > 0 ? (
          <div className="tableau-matchs" style={{ marginTop: 26 }}>
            <table style={{ minWidth: 1160 }}>
              <caption className="sr-only">Matchs à domicile — {w.titre}</caption>
              <thead>
                <tr>
                  <th scope="col" className="fixe-1" style={{ width: 104 }}>
                    Heure
                  </th>
                  <th scope="col" className="fixe-2" style={{ width: 124 }}>
                    Équipe
                  </th>
                  <th scope="col">Adversaire</th>
                  <th scope="col" style={{ width: 210 }}>
                    Gymnase
                  </th>
                  <th scope="col" style={{ width: 190 }}>
                    Arbitres
                  </th>
                  <th scope="col" style={{ width: 150 }}>
                    Table
                  </th>
                  <th scope="col" style={{ width: 140 }}>
                    OTM
                  </th>
                </tr>
              </thead>
              <tbody>
                {parJour<MatchDomicileVue>(dom).map((j) => (
                  <GroupeJour key={j.cle} label={j.label} n={j.matchs.length} colonnes={7}>
                    {j.matchs.map((m) => (
                      <tr key={m.cle}>
                        <td className="fixe-1 tableau-matchs__heure">{m.heure}</td>
                        <td className="fixe-2">
                          <span className="tag-equipe">{m.equipe}</span>
                        </td>
                        <td className="tableau-matchs__adversaire">
                          <span>vs</span> {m.adversaire}
                        </td>
                        <td>
                          <strong className="tableau-matchs__salle">{m.salle}</strong>
                          <span className="tableau-matchs__adresse">{m.adresse}</span>
                        </td>
                        <td className="tableau-matchs__fort">{m.arbitres}</td>
                        <td className="tableau-matchs__fort">{m.table}</td>
                        <td className="tableau-matchs__fort">{m.otm}</td>
                      </tr>
                    ))}
                  </GroupeJour>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="vide-ligne">
            {w.vide ? "Le programme de ce week-end n'est pas encore publié." : `Pas de match à domicile${pour}ce week-end.`}
          </p>
        )}
        </div>
      </section>

      <section aria-labelledby="ext-titre" className="section" style={{ paddingTop: 40 }}>
        <div className="surtitre">À l'extérieur · {pluriel(ext.length, "match", "matchs")}</div>
        <h2 id="ext-titre" className="titre-section" style={{ marginBottom: 22 }}>
          On se déplace
        </h2>
        <div key={version} className={rafraichi}>
        {ext.length > 0 ? (
          <div className="tableau-matchs tableau-matchs--ext">
            <table style={{ minWidth: 820 }}>
              <caption className="sr-only">Matchs à l'extérieur — {w.titre}</caption>
              <thead>
                <tr>
                  <th scope="col" className="fixe-1" style={{ width: 104 }}>
                    Heure
                  </th>
                  <th scope="col" className="fixe-2" style={{ width: 124 }}>
                    Équipe
                  </th>
                  <th scope="col">Adversaire</th>
                  <th scope="col">Lieu du match</th>
                  <th scope="col" style={{ width: 160 }}>
                    <span className="sr-only">Itinéraire</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {parJour<MatchExterieurVue>(ext).map((j) => (
                  <GroupeJour key={j.cle} label={j.label} n={j.matchs.length} colonnes={5}>
                    {j.matchs.map((m) => (
                      <tr key={m.cle}>
                        <td className="fixe-1 tableau-matchs__heure">{m.heure}</td>
                        <td className="fixe-2">
                          <span className="tag-equipe tag-equipe--orange">{m.equipe}</span>
                        </td>
                        <td className="tableau-matchs__adversaire">
                          <span>chez</span> {m.adversaire}
                        </td>
                        <td className="tableau-matchs__lieu">{m.lieu}</td>
                        <td className="tableau-matchs__itineraire">
                          <a href={m.itineraire} target="_blank" rel="noopener">
                            Itinéraire <span className="fleche fleche--diag" aria-hidden="true">↗</span>
                            <NouvelOnglet />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </GroupeJour>
                ))}
              </tbody>
            </table>
          </div>
        ) : !w.vide ? (
          <p className="vide-ligne" style={{ marginTop: 0 }}>
            Pas de match à l'extérieur{pour}ce week-end.
          </p>
        ) : null}
        </div>
        <div className="note-bleue">
          Covoiturage : les déplacements sont organisés par les parents de l'équipe, à tour de rôle, rendez-vous sur{" "}
          <a href={whatsapp} target="_blank" rel="noopener">
            le groupe WhatsApp
            <NouvelOnglet />
          </a>
          .
        </div>
      </section>
    </>
  );
}

function GroupeJour({ label, n, colonnes, children }: { label: string; n: number; colonnes: number; children: React.ReactNode }) {
  return (
    <>
      <tr>
        <th scope="colgroup" colSpan={colonnes} className="tableau-matchs__jour">
          <div>
            <span className="tableau-matchs__jour-nom">{label}</span>
            <span className="tableau-matchs__jour-nb">{pluriel(n, "match", "matchs")}</span>
          </div>
        </th>
      </tr>
      {children}
    </>
  );
}

/** Même vue, avec l'équipe éventuellement choisie dans l'adresse (/matchs?equipe=U11F1). */
export function MatchsAvecAdresse(props: Props) {
  const equipe = useSearchParams().get("equipe") ?? "";
  return <MatchsVue {...props} equipeInitiale={props.equipes.includes(equipe) ? equipe : ""} />;
}

/** Widget des résultats, chargé seulement après accord du visiteur. */
export function Resultats({ widget, ffbb }: { widget: string; ffbb: string }) {
  const lienFFBB = (
    <a href={ffbb} target="_blank" rel="noopener" className="btn btn--clair">
      Site de la FFBB
      <NouvelOnglet />
    </a>
  );
  if (!widget) {
    return (
      <div className="resultats-bloc">
        <p>Retrouvez les scores et les classements de toutes les équipes du club sur le site de la Fédération.</p>
        <div className="rangee rangee--10">{lienFFBB}</div>
      </div>
    );
  }
  return (
    <ContenuConsenti
      bloque={(accepter) => (
        <div className="resultats-bloc">
          <p>
            Le widget de résultats est un contenu externe : il s'affiche après votre accord. Vous pouvez aussi consulter
            directement le site de la FFBB.
          </p>
          <div className="rangee rangee--10">
            <button type="button" className="btn btn--orange" onClick={accepter}>
              Afficher les résultats
            </button>
            {lienFFBB}
          </div>
        </div>
      )}
    >
      <div className="resultats-widget">
        <iframe src={widget} title="Résultats des matchs du Nantes Breil Basket" loading="lazy" />
      </div>
    </ContenuConsenti>
  );
}
