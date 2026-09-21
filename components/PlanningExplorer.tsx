"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { grille } from "@/lib/style";
import type { Creneau, Jour } from "@/lib/types";
import { lienGymnase, pluriel } from "@/lib/utils";

type Filtres = { equipe: string; gym: string; jour: string };
type Donnees = { creneaux: Creneau[]; equipes: string[]; gymnases: string[]; jours: Jour[] };

const AUCUN_FILTRE: Filtres = { equipe: "", gym: "", jour: "" };

/** Affichage du planning pour des filtres donnés. */
export function PlanningVue({
  creneaux,
  equipes,
  gymnases,
  jours,
  filtres = AUCUN_FILTRE,
  onChange,
}: Donnees & { filtres?: Filtres; onChange?: (f: Filtres) => void }) {
  const maj = (f: Filtres) => onChange?.(f);
  const affiches = creneaux.filter(
    (s) =>
      (!filtres.equipe || s.equipes.includes(filtres.equipe)) &&
      (!filtres.gym || s.gymnase === filtres.gym) &&
      (!filtres.jour || s.jour === filtres.jour),
  );
  const parJour = jours
    .map((jour) => ({ jour, creneaux: affiches.filter((c) => c.jour === jour) }))
    .filter((j) => j.creneaux.length > 0);

  return (
    <>
      <section className="section section--tight" aria-label="Filtres du planning">
        <div className="filters">
          <div>
            <label htmlFor="f-equipe" className="label">
              Équipe
            </label>
            <select
              id="f-equipe"
              className="select"
              value={filtres.equipe}
              onChange={(e) => maj({ ...filtres, equipe: e.target.value })}
            >
              <option value="">Toutes les équipes</option>
              {equipes.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="f-gym" className="label">
              Gymnase
            </label>
            <select
              id="f-gym"
              className="select"
              value={filtres.gym}
              onChange={(e) => maj({ ...filtres, gym: e.target.value })}
            >
              <option value="">Tous les gymnases</option>
              {gymnases.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="f-jour" className="label">
              Jour
            </label>
            <select
              id="f-jour"
              className="select"
              value={filtres.jour}
              onChange={(e) => maj({ ...filtres, jour: e.target.value })}
            >
              <option value="">Tous les jours</option>
              {jours.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </div>
          <button type="button" className="filters__reset" onClick={() => maj(AUCUN_FILTRE)}>
            Réinitialiser
          </button>
        </div>
        <p className="count" aria-live="polite">
          {pluriel(affiches.length, "créneau affiché", "créneaux affichés")}
        </p>
      </section>

      {parJour.map((j) => (
        <section key={j.jour} className="section" style={{ paddingTop: 26 }} aria-labelledby={`jour-${j.jour}`}>
          <h2 id={`jour-${j.jour}`} className="day-title">
            {j.jour}
          </h2>
          <div className="grid" style={grille(255, { gap: "14px" })}>
            {j.creneaux.map((c) => (
              <article key={c.id} className="slot-card bar-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <p className="slot-card__time">
                    {c.debut} – {c.fin}
                  </p>
                  <p className="slot-card__duration">{c.duree}</p>
                </div>
                <p className="slot-card__gym">
                  Gymnase{" "}
                  <Link href={lienGymnase(c.gymnase)} className="link-inline">
                    {c.gymnase}
                  </Link>
                </p>
                <div className="slot-card__teams">
                  {c.equipes.map((eq) => (
                    <span key={eq} className="tag">
                      {eq}
                    </span>
                  ))}
                </div>
                <p className="slot-card__coachs">
                  <strong style={{ color: "#fff" }}>Encadrement :</strong> {c.coachs.join(", ")}
                </p>
              </article>
            ))}
          </div>
        </section>
      ))}

      {affiches.length === 0 && (
        <section className="section" style={{ paddingTop: 26 }}>
          <div className="empty-state">
            <p style={{ fontWeight: 700, color: "#fff", fontSize: 19 }}>Aucun créneau trouvé</p>
            <p style={{ marginTop: 8 }}>Modifiez ou réinitialisez les filtres.</p>
          </div>
        </section>
      )}
    </>
  );
}

/**
 * Planning filtrable. Les filtres sont gardés dans l'adresse de la page
 * (ex. /planning?equipe=U11F1) : on peut partager un lien déjà filtré.
 */
export function PlanningExplorer(donnees: Donnees) {
  const params = useSearchParams();
  const lire = (cle: string, valides: readonly string[]) => {
    const v = params.get(cle) ?? "";
    return valides.includes(v) ? v : "";
  };
  const filtres: Filtres = {
    equipe: lire("equipe", donnees.equipes),
    gym: lire("gym", donnees.gymnases),
    jour: lire("jour", donnees.jours),
  };

  const onChange = (f: Filtres) => {
    const q = new URLSearchParams();
    if (f.equipe) q.set("equipe", f.equipe);
    if (f.gym) q.set("gym", f.gym);
    if (f.jour) q.set("jour", f.jour);
    const s = q.toString();
    window.history.replaceState(null, "", s ? `?${s}` : window.location.pathname);
  };

  return <PlanningVue {...donnees} filtres={filtres} onChange={onChange} />;
}
