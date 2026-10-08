"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import type { Jour } from "@/lib/types";
import type { CreneauPlanning } from "@/lib/nbb";
import { memoriserEquipe, useMonEquipe } from "@/lib/preferences";
import { Sommaire } from "@/components/Navigation";

type Filtres = { equipe: string; gymnase: string; jour: string };
type Donnees = { creneaux: CreneauPlanning[]; equipes: string[]; gymnases: string[]; jours: Jour[] };

const AUCUN: Filtres = { equipe: "", gymnase: "", jour: "" };
const JOURS_SEMAINE: Jour[] = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

const sansAbonnement = () => () => {};

/** Jour de la semaine chez le visiteur (null pendant le rendu serveur). */
function useJourCourant(): Jour | null {
  return useSyncExternalStore(
    sansAbonnement,
    () => JOURS_SEMAINE[new Date().getDay()],
    () => null,
  );
}

/** Planning affiché pour des filtres donnés (sans filtre : tout le planning, y compris sans JavaScript). */
export function PlanningVue({
  creneaux,
  equipes,
  gymnases,
  jours,
  filtres = AUCUN,
  onChange,
  memorisee = false,
}: Donnees & { filtres?: Filtres; onChange?: (f: Filtres) => void; memorisee?: boolean }) {
  const aujourdhui = useJourCourant();
  // Chaque changement de filtre rejoue un fondu très court sur la liste : on voit qu'elle a été mise à jour.
  const [version, setVersion] = useState(0);
  const changer = (f: Filtres) => {
    setVersion((v) => v + 1);
    onChange?.(f);
  };
  const maj = (f: Partial<Filtres>) => changer({ ...filtres, ...f });
  const affiches = creneaux.filter(
    (s) =>
      (!filtres.equipe || s.equipes.includes(filtres.equipe)) &&
      (!filtres.gymnase || s.gymnase === filtres.gymnase) &&
      (!filtres.jour || s.jour === filtres.jour),
  );
  const parJour = jours
    .map((jour) => ({ jour, liste: affiches.filter((c) => c.jour === jour) }))
    .filter((j) => j.liste.length > 0);
  const n = affiches.length;

  return (
    <>
      <div className="filtres-planning" data-noprint="">
        <form role="search" aria-label="Filtrer le planning" onSubmit={(e) => e.preventDefault()} className="filtres">
          <label className="filtres__champ">
            Équipe
            <select className="saisie" value={filtres.equipe} onChange={(e) => maj({ equipe: e.target.value })}>
              <option value="">Toutes les équipes</option>
              {equipes.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </label>
          <label className="filtres__champ">
            Gymnase
            <select className="saisie" value={filtres.gymnase} onChange={(e) => maj({ gymnase: e.target.value })}>
              <option value="">Tous les gymnases</option>
              {gymnases.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>
          <label className="filtres__champ">
            Jour
            <select className="saisie" value={filtres.jour} onChange={(e) => maj({ jour: e.target.value })}>
              <option value="">Tous les jours</option>
              {jours.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </label>
          <div className="filtres__boutons">
            <button type="button" className="btn btn--contour" onClick={() => changer(AUCUN)}>
              Réinitialiser
            </button>
          </div>
        </form>
      </div>

      <section aria-live="polite" className="section" style={{ paddingTop: 28, paddingBottom: 80 }}>
        <div className="planning__resume">
          <p className="planning__compte">
            {n} créneau{n > 1 ? "x" : ""} affiché{n > 1 ? "s" : ""}
            {filtres.equipe ? ` pour ${filtres.equipe}` : ""}
          </p>
          {memorisee ? <p className="planning__memoire">Équipe mémorisée sur cet appareil</p> : null}
        </div>
        <Sommaire label="Jours de la semaine" sections={parJour.map(({ jour }) => ({ id: `jour-${jour.toLowerCase()}`, titre: jour }))} />
        <div key={version} className={version ? "rafraichi" : undefined}>
        {parJour.map(({ jour, liste }) => (
          <div key={jour} id={`jour-${jour.toLowerCase()}`} className="planning__jour">
            <h2 className="planning__titre-jour">
              {jour}
              {jour === aujourdhui ? <span className="planning__aujourdhui">Aujourd'hui</span> : null}
              <span className="planning__trait" />
              <span className="planning__nb">
                {liste.length} créneau{liste.length > 1 ? "x" : ""}
              </span>
            </h2>
            <div className="grille grille--remplir" style={{ "--min": "290px" } as React.CSSProperties}>
              {liste.map((c) => (
                <article key={c.cle} className="creneau">
                  <div className="creneau__tete">
                    <div className="creneau__horaire">{c.horaire}</div>
                    <span className="creneau__duree">{c.duree}</span>
                  </div>
                  <Link href={c.lienGymnase} className="creneau__gymnase">
                    Gymnase <strong>{c.gymnase}</strong>
                  </Link>
                  <div className="creneau__equipes">
                    {c.etiquettes.map((e) => (
                      <span key={e}>{e}</span>
                    ))}
                  </div>
                  {c.coachs ? (
                    <div className="creneau__coach">
                      Coach : <strong>{c.coachs}</strong>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        ))}
        </div>
        {n === 0 ? (
          <div className="vide">
            <strong>Aucun créneau trouvé</strong>
            Modifiez ou réinitialisez les filtres.
          </div>
        ) : null}
        <div className="encart-bleu-large" data-noprint="">
          <p>
            Vérifiez toujours la présence du coach avant de laisser votre enfant au gymnase. Un changement de dernière
            minute ? Il est annoncé sur le groupe WhatsApp du club.
          </p>
        </div>
      </section>
    </>
  );
}

/**
 * Planning dont les filtres sont gardés dans l'adresse (/planning?equipe=U11F1) : liens partageables. Sans
 * équipe dans l'adresse, l'équipe mémorisée sur l'appareil (« mon équipe », lib/preferences.ts) est reprise.
 */
export function PlanningAvecAdresse(props: Donnees) {
  const params = useSearchParams();
  const chemin = usePathname();
  const monEquipe = useMonEquipe();
  const equipeAdresse = props.equipes.includes(params.get("equipe") ?? "") ? (params.get("equipe") as string) : "";
  const equipeMemorisee = props.equipes.includes(monEquipe) ? monEquipe : "";
  const lire = (cle: string, valides: string[]) => {
    const v = params.get(cle) ?? "";
    return valides.includes(v) ? v : "";
  };
  const filtres: Filtres = {
    equipe: equipeAdresse || equipeMemorisee,
    gymnase: lire("gymnase", props.gymnases),
    jour: lire("jour", props.jours),
  };
  const changer = (f: Filtres) => {
    // Choisir une équipe la mémorise ; « Toutes les équipes » (ou Réinitialiser) l'oublie.
    if (f.equipe !== filtres.equipe) memoriserEquipe(f.equipe);
    const q = new URLSearchParams();
    if (f.equipe) q.set("equipe", f.equipe);
    if (f.gymnase) q.set("gymnase", f.gymnase);
    if (f.jour) q.set("jour", f.jour);
    const texte = q.toString();
    window.history.replaceState(null, "", texte ? `${chemin}?${texte}` : chemin);
  };
  return <PlanningVue {...props} filtres={filtres} onChange={changer} memorisee={!!filtres.equipe && filtres.equipe === equipeMemorisee} />;
}
