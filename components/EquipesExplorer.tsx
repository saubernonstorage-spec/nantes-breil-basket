"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import type { FicheEquipe } from "@/lib/nbb";
import { grille } from "@/lib/style";
import type { CleCategorie } from "@/lib/types";
import { Photo } from "./Photo";

type Groupe = {
  cle: CleCategorie;
  nom: string;
  ages: string;
  resume: string;
  equipes: FicheEquipe[];
};

/**
 * Page Équipes : boutons de catégorie (dans le bandeau) et fiches par catégorie.
 * Toutes les fiches restent dans la page (référencement, ancres) ; le filtre masque les autres.
 */
export function EquipesExplorer({ bandeau, groupes }: { bandeau: ReactNode; groupes: Groupe[] }) {
  const [categorie, setCategorie] = useState<CleCategorie | "">("");
  const boutons = [{ cle: "" as const, nom: "Toutes" }, ...groupes.map((g) => ({ cle: g.cle, nom: g.nom }))];

  return (
    <>
      <section className="page-hero">
        <div className="page-hero__inner">
          {bandeau}
          <div className="chips" role="group" aria-label="Filtrer par catégorie" style={{ marginTop: 26 }}>
            {boutons.map((b) => (
              <button
                key={b.cle || "toutes"}
                type="button"
                className="filter-btn"
                aria-pressed={categorie === b.cle}
                onClick={() => setCategorie(b.cle)}
              >
                {b.nom}
              </button>
            ))}
          </div>
        </div>
      </section>

      {groupes
        .filter((g) => g.equipes.length > 0)
        .map((g) => (
          <section
            key={g.cle}
            id={g.cle}
            className="section anchor-target"
            style={{ paddingTop: "clamp(36px, 5vw, 64px)" }}
            aria-labelledby={`cat-${g.cle}`}
            hidden={categorie !== "" && categorie !== g.cle}
          >
            <div className="section-head section-head--baseline section-head--inline" style={{ gap: 14, marginBottom: 8 }}>
              <h2 id={`cat-${g.cle}`} className="title-section">
                {g.nom}
              </h2>
              <p className="kicker" style={{ margin: 0, letterSpacing: "0.14em", fontSize: 14 }}>
                {g.ages}
              </p>
            </div>
            <p className="intro">{g.resume}</p>
            <div className="grid" style={grille(270)}>
              {g.equipes.map((e) => (
                <article key={e.nom} className="team-card">
                  <Photo
                    photo={e.photo}
                    alt={`Équipe ${e.nom} du Nantes Breil Basket`}
                    className="team-card__photo"
                    sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 25vw"
                  />
                  <div className="team-card__body">
                    <h3 className="team-card__name">{e.nom}</h3>
                    <p className="text-soft text-sm">
                      <strong style={{ color: "#fff" }}>Encadrement :</strong> {e.coachs}
                    </p>
                    <ul className="team-card__slots">
                      {e.creneaux.map((c) => (
                        <li key={c.id}>
                          {c.avant}
                          <Link href={c.lienGymnase} className="link-inline">
                            {c.gymnase}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
    </>
  );
}
