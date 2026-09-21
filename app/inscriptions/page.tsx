import Link from "next/link";
import { Faq } from "@/components/Faq";
import { PageHero } from "@/components/PageHero";
import { SmartLink } from "@/components/SmartLink";
import { AIDES, CLUB, DOCUMENTS, ETAPES_INSCRIPTION, FAQ, TARIFS } from "@/data/nbb";
import { metaPage } from "@/lib/seo";
import { grille } from "@/lib/style";
import { enLettres, estACompleter, estLienExterne, majuscule } from "@/lib/utils";

export const metadata = metaPage({
  titre: "Inscriptions",
  description: `S'inscrire au Nantes Breil Basket pour la saison ${CLUB.saison} : séances d'essai, tarifs par catégorie, documents à fournir, aides financières et questions fréquentes.`,
  chemin: "/inscriptions",
});

export default function PageInscriptions() {
  const lienEnLigne = estLienExterne(CLUB.inscription) ? CLUB.inscription : "/contact?sujet=inscription";
  const tarifsIncomplets = TARIFS.some((t) => estACompleter(t.prix));
  const nb = enLettres(FAQ.length);

  return (
    <div className="page">
      <PageHero kicker={`Saison ${CLUB.saison}`} title="Inscriptions">
        <p className="lead">
          Deux séances d&apos;essai, un formulaire, quelques documents : on vous explique tout, étape par étape.
        </p>
        <div className="btn-row">
          <SmartLink href={lienEnLigne} className="btn btn--primary">
            S&apos;inscrire en ligne
          </SmartLink>
          <Link href="/planning" className="btn btn--ghost">
            Voir les créneaux
          </Link>
        </div>
        {!estLienExterne(CLUB.inscription) && (
          <p className="text-faint" style={{ marginTop: 14, fontSize: 14 }}>
            Lien du formulaire officiel à renseigner : [À COMPLÉTER]
          </p>
        )}
      </PageHero>

      <section className="section" aria-labelledby="etapes">
        <h2 id="etapes" className="title-section title-section--sm" style={{ marginBottom: 20 }}>
          Comment ça se passe
        </h2>
        <ol className="grid" style={grille(230)}>
          {ETAPES_INSCRIPTION.map((texte, i) => (
            <li key={i} className="card" style={{ padding: 22 }}>
              <p className="step-card__num" aria-hidden="true">
                {i + 1}
              </p>
              <p className="text-soft text-md">
                <span className="visually-hidden">Étape {i + 1} : </span>
                {texte}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section">
        <div className="grid" style={grille(300, { align: "start" })}>
          <div className="card card--strong" id="tarifs">
            <h2 className="title-card title-card--lg" style={{ marginBottom: 6 }}>
              Tarifs par catégorie
            </h2>
            <p className="text-muted text-sm" style={{ marginBottom: 18 }}>
              {tarifsIncomplets
                ? "Montants votés par le bureau — à compléter avant publication."
                : `Montants votés par le bureau pour la saison ${CLUB.saison}.`}
            </p>
            <ul className="rows">
              {TARIFS.map((t) => (
                <li key={t.categorie} className="price-row" style={{ borderTopColor: "var(--line)" }}>
                  <span>
                    <span className="price-row__name">{t.categorie}</span>
                    <span className="price-row__age">{t.age}</span>
                  </span>
                  <span className="price-row__price">{t.prix}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="stack">
            <div className="card card--strong">
              <h2 className="title-card title-card--lg" style={{ marginBottom: 16 }}>
                Documents à fournir
              </h2>
              <ul className="checklist">
                {DOCUMENTS.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
            <div className="card card--strong">
              <h2 className="title-card title-card--lg" style={{ marginBottom: 16 }}>
                Aides possibles
              </h2>
              <div className="stack" style={{ gap: 12 }}>
                {AIDES.map((a) => (
                  <p key={a.titre} className="text-soft text-md">
                    <strong style={{ color: "#fff" }}>{a.titre}</strong> — {a.texte}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="section anchor-target" aria-labelledby="faq-titre">
        <h2 id="faq-titre" className="title-section title-section--sm" style={{ marginBottom: 6 }}>
          Questions fréquentes
        </h2>
        <p className="intro" style={{ marginBottom: 22 }}>
          {majuscule(nb)} réponses qui évitent {nb} messages aux dirigeants.
        </p>
        <Faq items={FAQ} groupe="faq-inscriptions" />
      </section>
    </div>
  );
}
