import { EquipesExplorer } from "@/components/EquipesExplorer";
import { CLUB, NOTE_HPB, STATS } from "@/data/nbb";
import { equipesParCategorie, nbGroupes } from "@/lib/nbb";
import { metaPage } from "@/lib/seo";

export const metadata = metaPage({
  titre: "Nos équipes",
  description: `Toutes les équipes du Nantes Breil Basket, du micro-basket aux seniors et loisirs : encadrement, créneaux d'entraînement et gymnases, saison ${CLUB.saison}.`,
  chemin: "/equipes",
});

export default function PageEquipes() {
  const groupes = equipesParCategorie().map(({ cle, nom, ages, resume, equipes }) => ({ cle, nom, ages, resume, equipes }));

  return (
    <div className="page">
      <EquipesExplorer
        groupes={groupes}
        bandeau={
          <>
            <p className="kicker">Saison {CLUB.saison}</p>
            <h1 className="title-page">Nos équipes</h1>
            <p className="lead">
              {STATS.equipes} équipes engagées en championnat, {nbGroupes()} groupes à l&apos;entraînement (loisirs
              et groupement HPB compris). Chaque fiche indique l&apos;encadrement, les créneaux et le gymnase,
              d&apos;après le planning officiel du club.
            </p>
          </>
        }
      />

      <section className="section" style={{ paddingTop: "clamp(36px, 5vw, 64px)" }}>
        <div className="card card--dashed">
          <p className="text-soft text-md">{NOTE_HPB}</p>
        </div>
      </section>
    </div>
  );
}
