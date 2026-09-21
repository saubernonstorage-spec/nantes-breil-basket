import { Suspense } from "react";
import { Faq } from "@/components/Faq";
import { GymnasesVue, InfosGymnases } from "@/components/InfosGymnases";
import { PageHero } from "@/components/PageHero";
import { FAQ, INFOS_PRATIQUES } from "@/data/nbb";
import { detailGymnases, gymnasesUtilises } from "@/lib/nbb";
import { metaPage } from "@/lib/seo";
import { grille } from "@/lib/style";
import { enLettres, majuscule } from "@/lib/utils";

export const metadata = metaPage({
  titre: "Infos pratiques",
  description:
    "Adresses et accès des gymnases du Nantes Breil Basket à Nantes (Joël Paon, Breil, Dervallières…), carte, règles des salles et questions fréquentes.",
  chemin: "/infos",
});

export default function PageInfos() {
  const gymnases = detailGymnases();
  const nbFaq = enLettres(FAQ.length);

  return (
    <div className="page">
      <PageHero
        kicker="Infos pratiques"
        title={
          <>
            Gymnases, accès
            <br />
            et FAQ
          </>
        }
      >
        <p className="lead">
          {majuscule(enLettres(gymnasesUtilises().length))} gymnases nantais, un seul endroit pour savoir où aller. Le
          gymnase Joël Paon est la maison du club.
        </p>
      </PageHero>

      <Suspense fallback={<GymnasesVue gymnases={gymnases} />}>
        <InfosGymnases gymnases={gymnases} />
      </Suspense>

      <section className="section">
        <div className="grid" style={grille(260)}>
          <div className="card card--soft">
            <h2 className="accent-title">Règles dans les gymnases</h2>
            <p className="text-muted text-md">{INFOS_PRATIQUES.regles}</p>
          </div>
          <div className="card card--soft">
            <h2 className="accent-title">Objets trouvés</h2>
            <p className="text-muted text-md">{INFOS_PRATIQUES.objetsTrouves}</p>
          </div>
        </div>
      </section>

      <section id="faq" className="section anchor-target" aria-labelledby="faq-titre">
        <h2 id="faq-titre" className="title-section title-section--sm" style={{ marginBottom: 6 }}>
          Questions fréquentes
        </h2>
        <p className="intro" style={{ marginBottom: 22 }}>
          {majuscule(nbFaq)} réponses qui évitent {nbFaq} messages aux dirigeants.
        </p>
        <Faq items={FAQ} groupe="faq-infos" />
      </section>
    </div>
  );
}
