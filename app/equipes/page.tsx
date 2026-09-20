import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CATEGORY_LABELS, plural, slotsForTeam, teamsByCategory } from "@/lib/planning";

export const metadata: Metadata = {
  title: "Équipes",
  description:
    "Toutes les équipes de Nantes Breil Basket, du micro-basket aux seniors, avec leurs créneaux d’entraînement.",
};

export default function EquipesPage() {
  const groups = teamsByCategory();

  return (
    <>
      <PageHero
        title="Nos équipes"
        intro="Choisissez une équipe pour voir tous ses entraînements."
      />
      <div className="container page-body page-body--spaced">
        {groups.map(({ category, teams }) => (
          <section key={category} className="day-section" aria-labelledby={`cat-${category}`}>
            <h2 id={`cat-${category}`} className="section-title">
              {CATEGORY_LABELS[category]}
            </h2>
            <div className="team-grid">
              {teams.map((team) => {
                const slots = slotsForTeam(team);
                return (
                  <Link
                    key={team}
                    href={{ pathname: "/planning", query: { equipe: team } }}
                    className="team-tile"
                  >
                    <span className="team-tile-name">{team}</span>
                    <span className="team-tile-count">
                      {plural(slots.length, "entraînement")} par semaine
                    </span>
                    <ul>
                      {slots.map((s) => (
                        <li key={s.id}>
                          <strong>{s.jour}</strong> {s.debut}–{s.fin}, {s.gymnase}
                        </li>
                      ))}
                    </ul>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
