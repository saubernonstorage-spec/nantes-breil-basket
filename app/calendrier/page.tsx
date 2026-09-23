import { EmbedConsenti } from "@/components/EmbedConsenti";
import { PageHero } from "@/components/PageHero";
import { SmartLink } from "@/components/SmartLink";
import { CLUB } from "@/data/nbb";
import { metaPage } from "@/lib/seo";
import { estLienExterne } from "@/lib/utils";

export const metadata = metaPage({
  titre: "Calendrier et résultats",
  description:
    "Calendrier des matchs, résultats et classements des équipes du Nantes Breil Basket, mis à jour automatiquement depuis la FFBB.",
  chemin: "/calendrier",
});

export default function PageCalendrier() {
  return (
    <div className="page">
      <PageHero
        kicker="Compétition"
        title={
          <>
            Calendrier
            <br />
            et résultats
          </>
        }
      >
        <p className="lead">
          Convocations, scores et classements viennent directement de la FFBB : aucune saisie manuelle, aucune
          erreur de recopie.
        </p>
      </PageHero>

      <section className="section" aria-labelledby="convocations">
        <div className="card card--raised" style={{ borderRadius: 26, padding: "clamp(24px, 4vw, 44px)" }}>
          <p className="kicker">Chaque semaine</p>
          <h2 id="convocations" className="title-section" style={{ fontSize: "clamp(28px, 4.4vw, 52px)", lineHeight: 1 }}>
            Horaires et convocations
          </h2>
          <p className="text-soft pretty" style={{ marginTop: 18, fontSize: 18, maxWidth: "46em" }}>
            Les horaires de rendez-vous, les convocations d&apos;arbitres et d&apos;officiels de table et les lieux de
            match seront publiés ici, mis à jour après chaque désignation.
          </p>
          <div className="reserved" style={{ marginTop: "clamp(24px, 3vw, 36px)" }}>
            <p>
              EMPLACEMENT RÉSERVÉ
              <br />
              tableau des convocations ou widget Score&apos;n&apos;co
              <br />
              [À COMPLÉTER]
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="stack">
          <div className="card card--strong">
            <h2 className="title-card title-card--lg" style={{ marginBottom: 10 }}>
              Résultats en direct
            </h2>
            <p className="text-muted text-md" style={{ marginBottom: 16 }}>
              Widget Score&apos;n&apos;co — tous les matchs et scores de la semaine, mis à jour automatiquement après
              chaque rencontre.
            </p>
            {estLienExterne(CLUB.scorenco) ? (
              <EmbedConsenti
                src={CLUB.scorenco}
                title="Matchs et résultats de la semaine du Nantes Breil Basket — Score'n'co"
                height={560}
                fournisseur="Score'n'co"
                bouton="Afficher les résultats"
              />
            ) : (
              <div className="reserved reserved--sm">
                <p>WIDGET SCORE&apos;N&apos;CO [À COMPLÉTER]</p>
              </div>
            )}
          </div>

          <div className="card card--strong">
            <h2 className="title-card title-card--lg" style={{ marginBottom: 10 }}>
              Classements
            </h2>
            <p className="text-muted text-md" style={{ marginBottom: 16 }}>
              Classement de chaque poule, par équipe. Les données officielles restent consultables sur le site de la
              FFBB.
            </p>
            <div className="reserved reserved--sm">
              <p>
                EMPLACEMENT WIDGET CLASSEMENTS
                <br />
                100% × 520 px
              </p>
            </div>
            <SmartLink href={CLUB.ffbb} className="link-underline">
              Voir sur le site de la FFBB <span className="fleche" aria-hidden="true">→</span>
            </SmartLink>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="card card--accent">
          <p className="accent-text">
            <strong style={{ color: "#fff" }}>Bon à savoir —</strong> les horaires peuvent changer jusqu&apos;au
            vendredi soir. En cas de doute, le groupe WhatsApp du club fait foi.{" "}
            <SmartLink href={CLUB.whatsapp}>Rejoindre le groupe</SmartLink>
          </p>
        </div>
      </section>
    </div>
  );
}
