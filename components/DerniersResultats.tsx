"use client";

import { useId, useState } from "react";
import Link from "next/link";
import type { IssueMatch, SemaineResultats } from "@/lib/nbb";
import { pluriel } from "@/lib/utils";

const ISSUES: Record<IssueMatch, string> = { victoire: "Victoire", defaite: "Défaite", nul: "Nul" };
/** Sur mobile, nombre de résultats visibles avant « Voir les … résultats » (pas de zone qui défile dans la page). */
const VISIBLES_MOBILE = 6;

/**
 * Accueil : tous les résultats FFBB du dernier week-end, du premier au dernier match (jour puis heure).
 * Sur ordinateur, tous les résultats sont affichés ; sur mobile, les premiers seulement, et un bouton
 * déplie la suite sur place.
 */
export function DerniersResultats({ semaine }: { semaine: SemaineResultats }) {
  const [ouvert, setOuvert] = useState(false);
  const idTitre = useId();
  const idListe = useId();
  const total = semaine.jours.reduce((t, j) => t + j.resultats.length, 0);
  const victoires = semaine.jours.reduce((t, j) => t + j.resultats.filter((r) => r.issue === "victoire").length, 0);
  // Rang du premier match de chaque jour dans le week-end (pour savoir ce qui est replié sur mobile).
  const debuts = semaine.jours.map((_, k) => semaine.jours.slice(0, k).reduce((t, j) => t + j.resultats.length, 0));

  return (
    <section aria-labelledby={idTitre} className={ouvert ? "derniers-resultats est-ouvert" : "derniers-resultats"}>
      <div className="derniers-resultats__tete">
        <div className="surtitre">Derniers résultats</div>
        <h2 id={idTitre} className="derniers-resultats__titre">
          Week-end {semaine.dates}
        </h2>
        <p className="derniers-resultats__bilan">
          {pluriel(total, "match", "matchs")} · {pluriel(victoires, "victoire", "victoires")}
        </p>
      </div>
      <div id={idListe} className="derniers-resultats__liste" role="region" aria-label={`Résultats du week-end ${semaine.dates}`}>
        {semaine.jours.map((j, k) => {
          const debut = debuts[k];
          return (
            <div key={j.cle} className={debut >= VISIBLES_MOBILE ? "derniers-resultats__jour derniers-resultats--suite" : "derniers-resultats__jour"}>
              <h3 className="derniers-resultats__date">
                {j.label}
                <span>{pluriel(j.resultats.length, "match", "matchs")}</span>
              </h3>
              <ul>
                {j.resultats.map((r, i) => (
                  <li key={r.cle} className={debut + i >= VISIBLES_MOBILE ? "derniers-resultats__ligne derniers-resultats--suite" : "derniers-resultats__ligne"}>
                    <span className="derniers-resultats__heure">{r.heure}</span>
                    <span className={r.domicile ? "tag-equipe" : "tag-equipe tag-equipe--orange"}>{r.equipe}</span>
                    <span className="derniers-resultats__adversaire">
                      <span>{r.domicile ? "vs" : "chez"}</span> {r.adversaire}
                      {r.forfait ? <span>{r.forfait === "nous" ? " · forfait du NBB" : " · forfait de l'adversaire"}</span> : null}
                    </span>
                    <span className={`score score--${r.issue}`}>
                      <span className="sr-only">{ISSUES[r.issue]}, </span>
                      {r.nous}–{r.eux}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      {total > VISIBLES_MOBILE ? (
        <button
          type="button"
          className="btn btn--m btn--petit btn--creme derniers-resultats__plus"
          aria-expanded={ouvert}
          aria-controls={idListe}
          onClick={() => setOuvert((o) => !o)}
        >
          {ouvert ? "Afficher moins de résultats" : `Voir les ${total} résultats`}
        </button>
      ) : null}
      <Link href="/matchs#resultats" className="derniers-resultats__lien">
        Autres week-ends et classements
      </Link>
    </section>
  );
}
