"use client";

import { useMemo, useState } from "react";
import { DAYS, SLOTS } from "@/data/planning";
import { getDays, getGymnases, getTeams, plural, sortSlots } from "@/lib/planning";

const TEAMS = getTeams();
const GYMNASES = getGymnases();
const AVAILABLE_DAYS = getDays();

type Props = {
  initialTeam?: string;
  initialGymnase?: string;
  initialDay?: string;
};

type FieldProps = {
  id: string;
  label: string;
  allLabel: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
};

function Field({ id, label, allLabel, value, options, onChange }: FieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        className="select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export function PlanningExplorer({
  initialTeam = "",
  initialGymnase = "",
  initialDay = "",
}: Props) {
  const [team, setTeam] = useState(initialTeam);
  const [gymnase, setGymnase] = useState(initialGymnase);
  const [day, setDay] = useState(initialDay);

  const rows = useMemo(
    () =>
      sortSlots(
        SLOTS.filter(
          (s) =>
            (!team || s.equipes.includes(team)) &&
            (!gymnase || s.gymnase === gymnase) &&
            (!day || s.jour === day),
        ),
      ),
    [team, gymnase, day],
  );

  const reset = () => {
    setTeam("");
    setGymnase("");
    setDay("");
  };

  return (
    <>
      <section className="panel planning-filters" aria-label="Filtres du planning">
        <div className="filter-grid">
          <Field
            id="teamFilter"
            label="Équipe"
            allLabel="Toutes les équipes"
            value={team}
            options={TEAMS}
            onChange={setTeam}
          />
          <Field
            id="roomFilter"
            label="Gymnase"
            allLabel="Tous les gymnases"
            value={gymnase}
            options={GYMNASES}
            onChange={setGymnase}
          />
          <Field
            id="dayFilter"
            label="Jour"
            allLabel="Tous les jours"
            value={day}
            options={AVAILABLE_DAYS}
            onChange={setDay}
          />
          <button type="button" className="btn" onClick={reset}>
            Réinitialiser
          </button>
        </div>
        <p className="hint">
          Les filtres peuvent être combinés. Touchez le nom d’une équipe dans un
          créneau pour ne voir que ses entraînements.
        </p>
      </section>

      <div className="toolbar">
        <p className="count" aria-live="polite">
          {plural(rows.length, "créneau affiché", "créneaux affichés")}
        </p>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => window.print()}
        >
          Imprimer
        </button>
      </div>

      {rows.length === 0 && (
        <div className="empty">
          <strong>Aucun créneau trouvé</strong>
          <p>Modifiez ou réinitialisez les filtres.</p>
        </div>
      )}

      {DAYS.map((d) => {
        const list = rows.filter((s) => s.jour === d);
        if (list.length === 0) return null;
        return (
          <section key={d} className="day-section" aria-labelledby={`jour-${d}`}>
            <h2 id={`jour-${d}`} className="section-title">
              {d}
            </h2>
            <div className="slots">
              {list.map((s) => (
                <article key={s.id} className="slot">
                  <div className="slot-top">
                    <p className="slot-time">
                      {s.debut} – {s.fin}
                    </p>
                    <p className="slot-duration">{s.duree}</p>
                  </div>

                  <p className="slot-room">
                    Gymnase <strong>{s.gymnase}</strong>
                  </p>

                  <ul className="chips">
                    {s.equipes.map((t) => (
                      <li key={t}>
                        <button
                          type="button"
                          className="chip"
                          aria-pressed={team === t}
                          onClick={() => setTeam(team === t ? "" : t)}
                        >
                          {t}
                        </button>
                      </li>
                    ))}
                  </ul>

                  <p className="slot-coach">
                    <strong>{s.coachs.length > 1 ? "Coachs" : "Coach"} :</strong>{" "}
                    {s.coachs.length ? s.coachs.join(", ") : "Non renseigné"}
                  </p>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
