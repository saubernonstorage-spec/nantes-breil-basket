import type { Metadata } from "next";
import Link from "next/link";
import { FAQ } from "@/data/nbb";
import { fichesGymnases, gymnasesNantes } from "@/lib/nbb";
import { enLettres, majuscule } from "@/lib/utils";
import { EntetePage } from "@/components/Page";
import { Faq, InfosGymnases } from "@/components/InfosGymnases";

export const metadata: Metadata = {
  title: "Infos pratiques — gymnases, adresses et accès",
  description:
    "Les gymnases du Nantes Breil Basket à Nantes : Joël Paon (Hauts-Pavés), Breil, Floreska-Guépin, Dervallières, Coubertin, Lucien David, Victor Hugo, Similienne. Adresses, carte et accès.",
  alternates: { canonical: "/infos" },
};

export default function Infos() {
  const fiches = fichesGymnases();
  const n = gymnasesNantes().length;
  const partenaire = fiches.some((f) => f.partenaire);

  return (
    <>
      <EntetePage
        fil="Infos pratiques"
        largeurChapo={600}
        titre={
          <>
            Où l'on <span className="accent">joue</span>
          </>
        }
        chapo={`${majuscule(enLettres(n))} gymnases nantais${partenaire ? " et un gymnase partenaire" : ""}, une seule page pour savoir où aller. Le gymnase Joël Paon, quartier des Hauts-Pavés, est la maison du club.`}
      />

      <InfosGymnases fiches={fiches} />

      <section className="section" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div className="grille" style={{ "--min": "300px" } as React.CSSProperties}>
          <div className="encart encart--nuit-bleu">
            <h2 className="titre-bloc" style={{ fontSize: 28, marginBottom: 10 }}>
              Règles au gymnase
            </h2>
            <p>
              Chaussures de basket propres obligatoires, gourde personnelle et tenue adaptée (short - T-shirt). Parents :
              vérifiez la présence du coach avant de repartir.
            </p>
          </div>
          <div className="encart encart--blanc">
            <h2 className="titre-bloc" style={{ fontSize: 28, marginBottom: 10 }}>
              Objets trouvés
            </h2>
            <p>
              Les objets trouvés sont consignés à l'accueil des différents gymnases. Renseignez-vous auprès des gardiens ou
              au bar de Joël Paon.
            </p>
          </div>
        </div>
      </section>

      <section id="faq" aria-labelledby="faq-titre" className="section" style={{ paddingBottom: 88 }}>
        <div className="bloc-faq">
          <div className="bloc-faq__cote">
            <div className="surtitre">Questions fréquentes</div>
            <h2 id="faq-titre" className="titre-section" style={{ marginBottom: 16 }}>
              Vos questions, nos réponses
            </h2>
            <p className="petit-texte" style={{ fontSize: 16 }}>
              Pas trouvé ? <Link href="/contact">Écrivez-nous</Link>, un bénévole vous répond.
            </p>
          </div>
          <Faq questions={FAQ} />
        </div>
      </section>
    </>
  );
}
