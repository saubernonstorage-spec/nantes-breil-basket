import Link from "next/link";
import { Suspense } from "react";
import { PageHero } from "@/components/PageHero";
import { PlanningExplorer, PlanningVue } from "@/components/PlanningExplorer";
import { CLUB, SLOTS } from "@/data/nbb";
import { gymnasesUtilises, joursUtilises, toutesLesEquipes, trierCreneaux } from "@/lib/nbb";
import { metaPage } from "@/lib/seo";

export const metadata = metaPage({
  titre: "Planning des entraînements",
  description: `Planning des entraînements ${CLUB.saison} du Nantes Breil Basket : tous les créneaux par équipe, par gymnase et par jour, à Nantes.`,
  chemin: "/planning",
});

export default function PagePlanning() {
  const donnees = {
    creneaux: trierCreneaux(SLOTS),
    equipes: toutesLesEquipes(),
    gymnases: gymnasesUtilises(),
    jours: joursUtilises(),
  };

  return (
    <div className="page">
      <PageHero kicker={`Saison ${CLUB.saison}`} title="Planning des entraînements">
        <p className="lead">Filtrez par équipe, par gymnase ou par jour. Les filtres se combinent.</p>
      </PageHero>

      {/* Sans JavaScript (et pour les moteurs de recherche), tout le planning est affiché. */}
      <Suspense fallback={<PlanningVue {...donnees} />}>
        <PlanningExplorer {...donnees} />
      </Suspense>

      <section className="section">
        <div className="card card--dashed row-between">
          <p className="text-soft" style={{ maxWidth: "46em" }}>
            Le planning est la <strong style={{ color: "#fff" }}>source unique</strong> du site : fiches équipes,
            liste des gymnases et chiffres de l&apos;accueil en sont tirés. Une erreur, un créneau qui a changé ?
            Dites-le-nous.
          </p>
          <Link href="/contact?sujet=creneau" className="btn btn--quiet btn--md">
            Signaler une erreur
          </Link>
        </div>
      </section>
    </div>
  );
}
