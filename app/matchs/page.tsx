import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CLUB } from "@/data/nbb";
import { matchsAffiches, resultatsParWeekend } from "@/lib/nbb";
import { listerConvocations } from "@/lib/stockage";
import { EntetePage } from "@/components/Page";
import { MatchsAvecAdresse, MatchsVue, ResultatsFFBB } from "@/components/MatchsExplorer";

export const metadata: Metadata = {
  title: "Matchs, convocations et résultats",
  description:
    "Matchs du week-end du Nantes Breil Basket : horaires, lieux, convocations d'arbitrage et de table de marque, résultats et classements FFBB.",
  alternates: { canonical: "/matchs" },
};

// Le week-end affiché par défaut change avec la date : la page est régénérée toutes les heures.
export const revalidate = 3600;

export default async function Matchs() {
  // Le week-end passé, celui de la semaine et les 3 suivants (SEMAINES_A_VENIR, lib/nbb.ts). Les convocations saisies
  // dans l'Espace dirigeants s'ajoutent à celles de data/nbb.ts (la page est régénérée à chaque enregistrement).
  const { weekends, indexDefaut, equipes } = matchsAffiches(await listerConvocations());
  const donnees = { weekends, indexDefaut, equipes, whatsapp: CLUB.whatsapp };
  // Résultats FFBB récupérés chaque nuit (scripts/donnees_ffbb.py).
  const resultats = resultatsParWeekend();

  return (
    <>
      <EntetePage
        variante="filtres"
        fil={`Matchs & résultats · ${weekends[indexDefaut].semaine}`}
        titre={
          <>
            Matchs &amp; <span className="accent">convocations</span>
          </>
        }
        chapo="Horaires, lieux, arbitres, table de marque et OTM : tout est là pour chaque match, avec en moyenne une quinzaine de rencontres organisées chaque week-end sur deux gymnases. Choisissez un week-end et votre équipe pour ne voir que vos matchs."
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
