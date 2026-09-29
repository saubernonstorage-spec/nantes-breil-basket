import type { Metadata } from "next";
import { Suspense } from "react";
import { CLUB } from "@/data/nbb";
import { gymnasesUtilises, joursUtilises, planning, toutesLesEquipes } from "@/lib/nbb";
import { EntetePage } from "@/components/Page";
import { Terrain } from "@/components/Terrain";
import { PlanningAvecAdresse, PlanningVue } from "@/components/PlanningExplorer";

export const metadata: Metadata = {
  title: `Planning des entraînements ${CLUB.saison}`,
  description:
    "Planning des entraînements du Nantes Breil Basket : tous les créneaux par équipe, par gymnase et par jour, à Nantes (Joël Paon, Breil, Floreska-Guépin, Dervallières…).",
  alternates: { canonical: "/planning" },
};

export default function Planning() {
  const donnees = {
    creneaux: planning(),
    equipes: toutesLesEquipes(),
    gymnases: gymnasesUtilises(),
    jours: joursUtilises(),
  };

  return (
    <>
      <EntetePage
        fil={`Planning · saison ${CLUB.saison}`}
        variante="filtres"
        largeurTitre={980}
        largeurChapo={600}
        decor={<Terrain motif="raquette" style={{ top: 0, right: "6%", width: "min(46%, 560px)" }} />}
        titre={
          <>
            Planning des <span className="accent">entraînements</span>
          </>
        }
        chapo="Chaque créneau, son gymnase, ses équipes et ses coachs. Filtrez par équipe, par salle ou par jour — les filtres se combinent."
      />
      {/* Sans JavaScript (ou avant son chargement) : le planning complet. */}
      <Suspense fallback={<PlanningVue {...donnees} />}>
        <PlanningAvecAdresse {...donnees} />
      </Suspense>
    </>
  );
}
