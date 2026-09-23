import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Photo } from "@/components/Photo";
import { SmartLink } from "@/components/SmartLink";
import { NOTE_PARTENARIAT, OFFRE_PARTENARIAT, PARTENAIRES, STATS } from "@/data/nbb";
import { gymnasesUtilises } from "@/lib/nbb";
import { metaPage } from "@/lib/seo";
import { grille } from "@/lib/style";
import { enLettres, estACompleter, estLienExterne, estPhoto } from "@/lib/utils";

export const metadata = metaPage({
  titre: "Partenaires",
  description:
    "Les partenaires et sponsors du Nantes Breil Basket, et l'offre de partenariat pour associer votre entreprise à un club formateur nantais.",
  chemin: "/partenaires",
});

export default function PagePartenaires() {
  const offresIncompletes = OFFRE_PARTENARIAT.some((o) => estACompleter(o.montant));

  return (
    <div className="page">
      <PageHero
        kicker="Partenaires"
        title={
          <>
            Ils font vivre
            <br />
            le club
          </>
        }
      >
        <p className="lead">
          Grâce à eux, {STATS.adherents} adhérents jouent, se déplacent et s&apos;équipent. Merci à nos partenaires
          locaux.
        </p>
      </PageHero>

      <section className="section" aria-label="Nos partenaires">
        <ul className="grid" style={grille(250)}>
          {PARTENAIRES.map((p) => (
            <li key={p.nom} className="card stack" style={{ padding: 22, gap: 14, alignContent: "start" }}>
              <Photo
                photo={p.logo}
                alt={`Logo ${p.nom}`}
                className={estPhoto(p.logo) ? "logo-slot logo-slot--image" : "logo-slot"}
                sizes="260px"
              />
              <div>
                <h2 style={{ fontSize: 19, fontWeight: 700 }}>{p.nom}</h2>
                <p className="text-muted text-sm" style={{ marginTop: 4 }}>
                  {p.activite}
                </p>
                {estLienExterne(p.site) && (
                  <p style={{ marginTop: 10 }}>
                    <SmartLink href={p.site} className="link-underline text-sm">
                      Voir le site <span className="fleche fleche--diag" aria-hidden="true">↗</span>
                    </SmartLink>
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="section" aria-labelledby="devenir">
        <h2 id="devenir" className="title-section title-section--sm" style={{ marginBottom: 6 }}>
          Devenir partenaire
        </h2>
        <p className="intro">
          Trois formules, une seule idée : associer votre nom à un club formateur du centre-ville nantais, visible
          chaque week-end dans {enLettres(gymnasesUtilises().length)} gymnases.
          {offresIncompletes && " Montants et contreparties à valider par le bureau."}
        </p>
        <div className="grid" style={grille(260)}>
          {OFFRE_PARTENARIAT.map((o) => (
            <div key={o.nom} className="offer">
              <h3 className="title-card title-card--md">{o.nom}</h3>
              <p className="offer__price">{o.montant}</p>
              <ul className="checklist checklist--sm">
                {o.inclus.map((i, n) => (
                  <li key={n}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="card card--soft row-between" style={{ marginTop: 20 }}>
          <p className="text-soft" style={{ maxWidth: "44em" }}>
            {NOTE_PARTENARIAT}
          </p>
          <Link href="/contact?sujet=partenariat" className="btn btn--primary btn--md">
            Demander le dossier
          </Link>
        </div>
      </section>
    </div>
  );
}
