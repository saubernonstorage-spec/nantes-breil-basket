import type { Metadata } from "next";
import { Suspense } from "react";
import { CLUB } from "@/data/nbb";
import { equipesDesMatchs, indexWeekendCourant, weekendsVue } from "@/lib/nbb";
import { EntetePage } from "@/components/Page";
import { Terrain } from "@/components/Terrain";
import { MatchsAvecAdresse, MatchsVue, Resultats } from "@/components/MatchsExplorer";

export const metadata: Metadata = {
  title: "Matchs, convocations et résultats",
  description:
    "Matchs du week-end du Nantes Breil Basket : horaires, lieux, convocations d'arbitrage et de table de marque, résultats et classements FFBB.",
  alternates: { canonical: "/matchs" },
};

// Le week-end affiché par défaut change avec la date : la page est régénérée toutes les heures.
export const revalidate = 3600;

export default function Matchs() {
  const weekends = weekendsVue();
  const donnees = {
    weekends,
    indexDefaut: indexWeekendCourant(),
    equipes: equipesDesMatchs(),
    whatsapp: CLUB.whatsapp,
  };

  return (
    <>
      <EntetePage
        fil={`Matchs & résultats · ${weekends[donnees.indexDefaut].semaine}`}
        decor={
          <Terrain
            motif="bout"
            style={{ left: "50%", bottom: 0, width: "min(100%, 900px)", transform: "translateX(-50%) scaleY(-1)" }}
          />
        }
        titre={
          <>
            Matchs &amp; <span className="accent">convocations</span>
          </>
        }
        chapo="Horaires, lieux, arbitres, table de marque et OTM. Choisissez un week-end et votre équipe pour ne voir que vos matchs."
      >
        <div className="rangee rangee--10" style={{ marginTop: 28 }}>
          <a href="#resultats" className="btn btn--l btn--petit btn--orange">
            Résultats <span className="fleche fleche--bas" aria-hidden="true">↓</span>
          </a>
        </div>
      </EntetePage>

      <Suspense fallback={<MatchsVue {...donnees} />}>
        <MatchsAvecAdresse {...donnees} />
      </Suspense>

      <section id="resultats" aria-labelledby="res-titre" className="bande-sombre">
        <div className="section" style={{ paddingTop: 72, paddingBottom: 72 }}>
          <div className="surtitre">Résultats &amp; classements</div>
          <h2 id="res-titre" className="titre-section" style={{ marginBottom: 14 }}>
            Scores officiels FFBB
          </h2>
          <p className="texte-clair" style={{ maxWidth: 640, marginBottom: 26 }}>
            Les scores et classements viennent directement de la Fédération : aucune saisie manuelle, aucune erreur de
            recopie.
          </p>
          <Resultats widget={CLUB.widgetResultats} ffbb={CLUB.ffbb} />
        </div>
      </section>
    </>
  );
}
