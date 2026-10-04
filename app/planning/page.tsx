import type { Metadata } from "next";
import { Suspense } from "react";
import { CLUB } from "@/data/nbb";
import { gymnasesUtilises, joursUtilises, planning, toutesLesEquipes } from "@/lib/nbb";
import { EntetePage } from "@/components/Page";
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
        titre={
          <>
            Planning des <span className="accent">entraînements</span>
          </>
        }
        // Chiffres calculés depuis le planning (SLOTS) : ils suivent les changements de créneaux.
        chapo={`Chaque créneau a son gymnase, ses équipes et ses coachs : ${donnees.creneaux.length} créneaux d'entraînement répartis sur ${donnees.gymnases.length} salles, du ${donnees.jours[0].toLowerCase()} au ${donnees.jours[donnees.jours.length - 1].toLowerCase()}. Filtrez par équipe, par salle ou par jour pour trouver le vôtre.`}
      />
      {/* Sans JavaScript (ou avant son chargement) : le planning complet. */}
      <Suspense fallback={<PlanningVue {...donnees} />}>
        <PlanningAvecAdresse {...donnees} />
      </Suspense>
    </>
  );
}
