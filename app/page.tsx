import Image from "next/image";
import Link from "next/link";
import { CLUB } from "@/data/club";
import {
  getGymnases,
  getStats,
  plural,
  slotsForGymnase,
  teamsByCategory,
  CATEGORY_LABELS,
} from "@/lib/planning";

export default function HomePage() {
  const stats = getStats();
  const groups = teamsByCategory();
  const gymnases = getGymnases().map((name) => {
    const slots = slotsForGymnase(name);
    const days = [...new Set(slots.map((s) => s.jour))];
    return { name, count: slots.length, days };
  });

  return (
    <>
      <section className="home-hero">
        <div className="container home-hero-grid">
          <div className="home-hero-copy">
            <h1>{CLUB.name}</h1>
            <p className="home-hero-tagline">{CLUB.tagline}</p>
            <p className="home-hero-stats">
              {plural(stats.equipes, "équipe")}, {plural(stats.gymnases, "gymnase")}{" "}
              et {plural(stats.creneaux, "créneau", "créneaux")} d’entraînement
              chaque semaine.
            </p>
            <div className="actions">
              <Link href="/planning" className="btn btn-accent">
                Voir le planning
              </Link>
              {CLUB.inscriptionUrl ? (
                <a
                  href={CLUB.inscriptionUrl}
                  className="btn btn-ghost"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  S’inscrire
                </a>
              ) : (
                <Link href="/contact" className="btn btn-ghost">
                  Nous contacter
                </Link>
              )}
            </div>
          </div>

          <div className="home-hero-logo" aria-hidden="true">
            <div className="logo-tile">
              <Image src="/logo.png" alt="" width={701} height={570} priority />
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <section className="panel finder" aria-labelledby="finder-title">
          <div>
            <h2 id="finder-title" className="finder-title">
              Trouvez votre créneau
            </h2>
            <p className="finder-text">
              Sélectionnez une équipe pour afficher ses entraînements.
            </p>
          </div>
          {/* Formulaire GET classique : fonctionne sans JavaScript */}
          <form action="/planning" method="get" className="finder-form">
            <div className="field">
              <label htmlFor="finder-team">Équipe</label>
              <select id="finder-team" name="equipe" className="select" defaultValue="">
                <option value="">Toutes les équipes</option>
                {groups.map(({ category, teams }) => (
                  <optgroup key={category} label={CATEGORY_LABELS[category]}>
                    {teams.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <button type="submit" className="btn">
              Voir les entraînements
            </button>
          </form>
        </section>

        <section className="home-section" aria-labelledby="gymnases-title">
          <h2 id="gymnases-title" className="section-title">
            Nos gymnases
          </h2>
          <ul className="gym-list">
            {gymnases.map((g) => (
              <li key={g.name}>
                <Link
                  href={{ pathname: "/planning", query: { gymnase: g.name } }}
                  className="gym"
                >
                  <span className="gym-name">{g.name}</span>
                  <span className="gym-meta">
                    {plural(g.count, "créneau", "créneaux")}
                  </span>
                  <span className="gym-days">{g.days.join(", ")}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="join" aria-labelledby="join-title">
          <div>
            <h2 id="join-title">Envie de rejoindre le club ?</h2>
            <p>
              Contactez-nous pour connaître les modalités d’inscription et les
              places disponibles dans chaque équipe.
            </p>
          </div>
          <Link href="/contact" className="btn btn-accent">
            Nous contacter
          </Link>
        </section>
      </div>
    </>
  );
}
