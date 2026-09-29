"use client";

import { useSearchParams } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import type { IssueMatch, MatchDomicileVue, MomentWeekend, SemaineResultats, WeekEndVue } from "@/lib/nbb";
import { aCompleter, pluriel } from "@/lib/utils";
import { IconeCartes, IconeTableau, NouvelOnglet } from "@/components/icons";

type Props = { weekends: WeekEndVue[]; indexDefaut: number; equipes: string[]; whatsapp: string };
type Affichage = "tableau" | "cartes";

const MOMENTS: Record<MomentWeekend, string> = { passe: "Terminée", semaine: "Prochains matchs", "a-venir": "À venir" };

/** Même seuil que le CSS (.matchs[data-vue="auto"]) : en dessous, les cartes sont affichées par défaut. */
const PETIT_ECRAN = "(max-width: 699px)";

function abonnerEcran(rappel: () => void) {
  const m = window.matchMedia(PETIT_ECRAN);
  m.addEventListener("change", rappel);
  return () => m.removeEventListener("change", rappel);
}

/** Petit écran chez le visiteur (false pendant le rendu serveur). */
function usePetitEcran(): boolean {
  return useSyncExternalStore(abonnerEcran, () => window.matchMedia(PETIT_ECRAN).matches, () => false);
}

function grouper<T>(liste: T[], cle: (m: T) => string) {
  const groupes: { cle: string; premier: T; matchs: T[] }[] = [];
  for (const m of liste) {
    const k = cle(m);
    let g = groupes.find((x) => x.cle === k);
    if (!g) {
      g = { cle: k, premier: m, matchs: [] };
      groupes.push(g);
    }
    g.matchs.push(m);
  }
  return groupes;
}

function parJour<T extends { jourCle: string; jourLabel: string }>(liste: T[]) {
  return grouper(liste, (m) => m.jourCle).map((g) => ({ cle: g.cle, label: g.premier.jourLabel, matchs: g.matchs }));
}

/** Matchs à domicile par salle, dans l'ordre reçu du serveur (celui d'ADRESSES_SALLES). */
function parSalle(liste: MatchDomicileVue[]) {
  return grouper(liste, (m) => m.salle).map((g) => ({ salle: g.cle, adresse: g.premier.adresse, matchs: g.matchs }));
}

export function MatchsVue({ weekends, indexDefaut, equipes, whatsapp, equipeInitiale = "" }: Props & { equipeInitiale?: string }) {
  const [sel, choisirSemaine] = useState(indexDefaut);
  const [equipe, choisirEquipe] = useState(equipeInitiale);
  // Tant que le visiteur n'a pas choisi, le CSS décide : cartes sur petit écran, tableau au-delà.
  const [affichage, choisirAffichage] = useState<Affichage | null>(null);
  const petitEcran = usePetitEcran();
  const vue: Affichage = affichage ?? (petitEcran ? "cartes" : "tableau");
  // Chaque choix rejoue un fondu très court sur les matchs : on voit qu'ils ont été mis à jour.
  const [version, setVersion] = useState(0);
  const setSel = (i: number) => {
    choisirSemaine(i);
    setVersion((v) => v + 1);
  };
  const setEquipe = (e: string) => {
    choisirEquipe(e);
    setVersion((v) => v + 1);
  };
  const setVue = (a: Affichage) => {
    choisirAffichage(a);
    setVersion((v) => v + 1);
  };
  const rafraichi = version ? "rafraichi" : undefined;

  const w = weekends[sel];
  const filtre = <M extends { equipe: string }>(m: M) => !equipe || m.equipe === equipe;
  const dom = w.domicile.filter(filtre);
  const ext = w.exterieur.filter(filtre);
  const pour = equipe ? " pour cette équipe " : " ";
  const glisser = (
    <p className="matchs__glisser" aria-hidden="true">
      Faites glisser le tableau vers la droite pour tout lire <span className="fleche">→</span>
    </p>
  );

  return (
    <div className="matchs" data-vue={affichage ?? "auto"}>
      {/* Même barre de filtres que la page Entraînements, posée à cheval sur l'en-tête. */}
      <div className="filtres-planning">
        <form role="search" aria-label="Filtrer les matchs" onSubmit={(e) => e.preventDefault()} className="filtres filtres--matchs">
          <label className="filtres__champ">
            Week-end
            <select className="saisie" value={sel} onChange={(e) => setSel(Number(e.target.value))}>
              {weekends.map((x, i) => (
                <option key={x.semaine + x.dates} value={i}>
                  {x.dates} · {MOMENTS[x.moment]}
                </option>
              ))}
            </select>
          </label>
          <label className="filtres__champ">
            Équipe
            <select className="saisie" value={equipe} onChange={(e) => setEquipe(e.target.value)}>
              <option value="">Toutes les équipes</option>
              {equipes.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </label>
          <div className="filtres__champ">
            <span id="affichage-libelle">Affichage</span>
            <div role="group" aria-labelledby="affichage-libelle" className="choix-vue">
              <button type="button" aria-pressed={vue === "tableau"} className="choix-vue__bouton" onClick={() => setVue("tableau")}>
                <IconeTableau />
                Tableau
              </button>
              <button type="button" aria-pressed={vue === "cartes"} className="choix-vue__bouton" onClick={() => setVue("cartes")}>
                <IconeCartes />
                Cartes
              </button>
            </div>
          </div>
        </form>
      </div>

      <section aria-labelledby="dom-titre" className="section" style={{ paddingTop: 40, paddingBottom: 24 }}>
        <div className="tete-section" style={{ marginBottom: 10 }}>
          <div>
            <div className="surtitre">À domicile · {pluriel(dom.length, "match", "matchs")}</div>
            <h2 id="dom-titre" className="titre-section">
              Chez nous
            </h2>
          </div>
          <p className="tete-section__texte" style={{ maxWidth: 460, fontSize: 14 }}>
            Pas disponible pour arbitrer ? Trouvez un remplaçant et prévenez le plus rapidement possible votre coach.
          </p>
        </div>
        <div key={version} className={rafraichi}>
          {dom.length > 0 ? (
            <>
              {glisser}
              {parSalle(dom).map((s) => (
                <div key={s.salle} className="salle-matchs">
                  <div className="salle-matchs__tete">
                    <h3 className="salle-matchs__nom">{s.salle}</h3>
                    {s.adresse ? <span className="salle-matchs__adresse">{s.adresse}</span> : null}
                    <span className="salle-matchs__nb">{pluriel(s.matchs.length, "match", "matchs")}</span>
                  </div>
                  {/* Focalisable : au clavier aussi, on peut faire défiler le tableau quand il dépasse de l'écran. */}
                  <div className="tableau-matchs" role="region" aria-label={`Matchs à domicile, salle ${s.salle}`} tabIndex={0}>
                    <table style={{ minWidth: 950 }}>
                      <caption className="sr-only">
                        Matchs à domicile, salle {s.salle} — {w.titre}
                      </caption>
                      <thead>
                        <tr>
                          <th scope="col" className="fixe-1" style={{ width: 104 }}>
                            Heure
                          </th>
                          <th scope="col" className="fixe-2" style={{ width: 124 }}>
                            Équipe
                          </th>
                          <th scope="col">Adversaire</th>
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
                        {parJour(s.matchs).map((j) => (
                          <GroupeJour key={j.cle} label={j.label} n={j.matchs.length} colonnes={6}>
                            {j.matchs.map((m) => (
                              <tr key={m.cle}>
                                <td className="fixe-1 tableau-matchs__heure"><Heure h={m.heure} /></td>
                                <td className="fixe-2">
                                  <span className="tag-equipe">{m.equipe}</span>
                                </td>
                                <td className="tableau-matchs__adversaire">
                                  <span>vs</span> {m.adversaire}
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
                  <div className="cartes-matchs">
                    {parJour(s.matchs).map((j) => (
                      <JourCartes key={j.cle} label={j.label} n={j.matchs.length} niveau={4}>
                        {j.matchs.map((m) => (
                          <li key={m.cle} className="carte-match">
                            <div className="carte-match__tete">
                              <span className="carte-match__heure"><Heure h={m.heure} /></span>
                              <span className="tag-equipe">{m.equipe}</span>
                            </div>
                            <p className="carte-match__adversaire">
                              <span>vs</span> {m.adversaire}
                            </p>
                            <dl className="carte-match__roles">
                              <div>
                                <dt>Arbitres</dt>
                                <dd>{m.arbitres}</dd>
                              </div>
                              <div>
                                <dt>Table</dt>
                                <dd>{m.table}</dd>
                              </div>
                              <div>
                                <dt>OTM</dt>
                                <dd>{m.otm}</dd>
                              </div>
                            </dl>
                          </li>
                        ))}
                      </JourCartes>
                    ))}
                  </div>
                </div>
              ))}
            </>
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
            <>
              {glisser}
              <div className="tableau-matchs tableau-matchs--ext" role="region" aria-label="Matchs à l'extérieur" tabIndex={0}>
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
                    {parJour(ext).map((j) => (
                      <GroupeJour key={j.cle} label={j.label} n={j.matchs.length} colonnes={5}>
                        {j.matchs.map((m) => (
                          <tr key={m.cle}>
                            <td className="fixe-1 tableau-matchs__heure"><Heure h={m.heure} /></td>
                            <td className="fixe-2">
                              <span className="tag-equipe tag-equipe--orange">{m.equipe}</span>
                            </td>
                            <td className="tableau-matchs__adversaire">
                              <span>chez</span> {m.adversaire}
                            </td>
                            <td className="tableau-matchs__lieu">{m.lieu}</td>
                            <td className="tableau-matchs__itineraire">
                              <LienItineraire href={m.itineraire} />
                            </td>
                          </tr>
                        ))}
                      </GroupeJour>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="cartes-matchs cartes-matchs--ext">
                {parJour(ext).map((j) => (
                  <JourCartes key={j.cle} label={j.label} n={j.matchs.length} niveau={3}>
                    {j.matchs.map((m) => (
                      <li key={m.cle} className="carte-match">
                        <div className="carte-match__tete">
                          <span className="carte-match__heure"><Heure h={m.heure} /></span>
                          <span className="tag-equipe tag-equipe--orange">{m.equipe}</span>
                        </div>
                        <p className="carte-match__adversaire">
                          <span>chez</span> {m.adversaire}
                        </p>
                        <p className="carte-match__lieu">{m.lieu}</p>
                        <LienItineraire href={m.itineraire} />
                      </li>
                    ))}
                  </JourCartes>
                ))}
              </div>
            </>
          ) : (
            <p className="vide-ligne" style={{ marginTop: 0 }}>
              {w.vide ? "Le programme de ce week-end n'est pas encore publié." : `Pas de match à l'extérieur${pour}ce week-end.`}
            </p>
          )}
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
    </div>
  );
}

/** Horaire du match ; encore à compléter dans les données : « À confirmer ». */
function Heure({ h }: { h: string }) {
  return aCompleter(h) ? <span className="heure-a-confirmer">À confirmer</span> : <>{h}</>;
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

/** Version cartes : un titre par jour, puis une carte par match. */
function JourCartes({ label, n, niveau, children }: { label: string; n: number; niveau: 3 | 4; children: React.ReactNode }) {
  const Titre = niveau === 3 ? "h3" : "h4";
  return (
    <div className="cartes-matchs__jour">
      <Titre className="cartes-matchs__titre">
        <span className="tableau-matchs__jour-nom">{label}</span>
        <span className="tableau-matchs__jour-nb">{pluriel(n, "match", "matchs")}</span>
      </Titre>
      <ul className="cartes-matchs__liste">{children}</ul>
    </div>
  );
}

function LienItineraire({ href }: { href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener" className="lien-itineraire">
      Itinéraire <span className="fleche fleche--diag" aria-hidden="true">↗</span>
      <NouvelOnglet />
    </a>
  );
}

/** Même vue, avec l'équipe éventuellement choisie dans l'adresse (/matchs?equipe=U11F1). */
export function MatchsAvecAdresse(props: Props) {
  const equipe = useSearchParams().get("equipe") ?? "";
  return <MatchsVue {...props} equipeInitiale={props.equipes.includes(equipe) ? equipe : ""} />;
}


const ISSUES: Record<IssueMatch, string> = { victoire: "Victoire", defaite: "Défaite", nul: "Nul" };

/** Résultats FFBB (récupérés chaque nuit) : un week-end à la fois, dans un tableau groupé par jour. */
export function ResultatsFFBB({ semaines, maj, ffbb }: { semaines: SemaineResultats[]; maj: string; ffbb: string }) {
  const [sel, choisir] = useState(0);
  const lienFFBB = (
    <a href={ffbb} target="_blank" rel="noopener" className="btn btn--petit btn--clair">
      Site de la FFBB
      <NouvelOnglet />
    </a>
  );
  if (!semaines.length) {
    return (
      <div className="resultats-vide">
        <p>Aucun résultat pour l'instant : ils s'afficheront ici après les premiers matchs de la saison.</p>
        {lienFFBB}
      </div>
    );
  }
  const s = semaines[Math.min(sel, semaines.length - 1)];
  const n = s.jours.reduce((t, j) => t + j.resultats.length, 0);
  return (
    <div className="resultats">
      <div className="resultats__barre">
        <label className="resultats__choix">
          Week-end
          <select className="saisie" value={sel} onChange={(e) => choisir(Number(e.target.value))}>
            {semaines.map((x, i) => (
              <option key={x.cle} value={i}>
                {x.dates}
                {i === 0 ? " · derniers résultats" : ""}
              </option>
            ))}
          </select>
        </label>
        {lienFFBB}
      </div>
      <div key={s.cle} className="tableau-matchs tableau-resultats rafraichi" role="region" aria-label={`Résultats du week-end ${s.dates}`} tabIndex={0}>
        <table>
          <caption className="sr-only">
            Résultats du week-end {s.dates} : {pluriel(n, "match", "matchs")}
          </caption>
          <thead>
            <tr>
              <th scope="col" className="tableau-resultats__equipe">
                Équipe
              </th>
              <th scope="col">Adversaire</th>
              <th scope="col" className="tableau-resultats__score">
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            {s.jours.map((j) => (
              <GroupeJour key={j.cle} label={j.label} n={j.resultats.length} colonnes={3}>
                {j.resultats.map((r) => (
                  <tr key={r.cle}>
                    <td className="tableau-resultats__equipe">
                      <span className={r.domicile ? "tag-equipe" : "tag-equipe tag-equipe--orange"}>{r.equipe}</span>
                    </td>
                    <td className="tableau-matchs__adversaire">
                      <span>{r.domicile ? "vs" : "chez"}</span> {r.adversaire}
                      {r.forfait ? (
                        <span className="tableau-resultats__forfait">
                          {r.forfait === "nous" ? " · forfait du NBB" : " · forfait de l'adversaire"}
                        </span>
                      ) : null}
                    </td>
                    <td className="tableau-resultats__score">
                      <strong>
                        {r.nous} – {r.eux}
                      </strong>
                      <span className={`issue issue--${r.issue}`}>{ISSUES[r.issue]}</span>
                    </td>
                  </tr>
                ))}
              </GroupeJour>
            ))}
          </tbody>
        </table>
      </div>
      <p className="resultats__maj">
        Score du NBB en premier · résultats officiels de la FFBB, mis à jour chaque nuit (dernier changement le {maj}).
      </p>
    </div>
  );
}
