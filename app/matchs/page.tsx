import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CLUB } from "@/data/nbb";
import { matchsAffiches, resultatsParWeekend } from "@/lib/nbb";
import { EntetePage } from "@/components/Page";
import { Terrain } from "@/components/Terrain";
import { MatchsAvecAdresse, MatchsVue, ResultatsFFBB } from "@/components/MatchsExplorer";

export const metadata: Metadata = {
  title: "Matchs, convocations et résultats",
  description:
    "Matchs du week-end du Nantes Breil Basket : horaires, lieux, convocations d'arbitrage et de table de marque, résultats et classements FFBB.",
  alternates: { canonical: "/matchs" },
};

// Le week-end affiché par défaut change avec la date : la page est régénérée toutes les heures.
export const revalidate = 3600;

export default function Matchs() {
  // Trois week-ends seulement : le dernier passé, celui de la semaine et le suivant.
  const { weekends, indexDefaut, equipes } = matchsAffiches();
  const donnees = { weekends, indexDefaut, equipes, whatsapp: CLUB.whatsapp };
  // Résultats FFBB récupérés chaque nuit (scripts/donnees_ffbb.py).
  const resultats = resultatsParWeekend();

  return (
    <>
      <EntetePage
        variante="filtres"
        fil={`Matchs & résultats · ${weekends[indexDefaut].semaine}`}
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
      />

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
            Les scores viennent directement de la Fédération, chaque nuit : aucune saisie manuelle, aucune erreur de
            recopie. Le classement de chaque équipe est sur la page <Link href="/equipes">Équipes</Link>.
          </p>
          <ResultatsFFBB semaines={resultats.semaines} maj={resultats.maj} ffbb={CLUB.ffbb} />
        </div>
      </section>
    </>
  );
}
