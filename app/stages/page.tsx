import Link from "next/link";
import { Photo } from "@/components/Photo";
import { BoutonInscrireStage, StageChoixProvider } from "@/components/formulaires/StageChoix";
import { StageForm } from "@/components/formulaires/StageForm";
import { CLUB, PHOTOS, STAGE_A_PREVOIR, STAGE_INFOS, STAGE_JOURNEE, STAGE_TARIFS, STAGES } from "@/data/nbb";
import { anneeSaison, libelleSemaine, semainesOuvertes, stageOuvert } from "@/lib/nbb";
import { metaPage } from "@/lib/seo";
import { grille } from "@/lib/style";

export const metadata = metaPage({
  titre: "Stages des vacances",
  description:
    "Stages de basket pendant les vacances scolaires (zone B) au gymnase Joël Paon, à Nantes : dates, tarifs, journée type et inscription en ligne. Ouverts aux licenciés et aux non-licenciés.",
  chemin: "/stages",
});

export default function PageStages() {
  const semaines = semainesOuvertes();

  return (
    <StageChoixProvider initial={semaines[0] ?? ""}>
      <div className="page">
        <section className="stage-hero">
          <div className="stage-hero__inner">
            <div>
              <p className="label-tag" style={{ marginBottom: 14 }}>
                Vacances scolaires · zone B
              </p>
              <h1 className="title-page">
                Stages des
                <br />
                vacances
              </h1>
              <p className="lead" style={{ maxWidth: "40em" }}>
                Trois à cinq jours de basket à chaque période de vacances, au gymnase Joël Paon. Ouverts aux licenciés
                du club <strong style={{ color: "#fff" }}>et aux enfants non licenciés</strong> qui veulent essayer.
                Encadrement par les entraîneurs du NBB.
              </p>
              <div className="btn-row" style={{ marginTop: 28 }}>
                <a href="#inscription-stage" className="btn btn--primary">
                  S&apos;inscrire en ligne
                </a>
                <Link href="/contact?sujet=stage" className="btn btn--ghost">
                  Poser une question
                </Link>
              </div>
            </div>
            <Photo photo={PHOTOS.stages.photo} alt={PHOTOS.stages.alt} className="stage-photo" />
          </div>
        </section>

        <section className="section" aria-labelledby="dates">
          <div className="notice">
            <span className="notice__icon" aria-hidden="true">
              !
            </span>
            <div className="notice__body">
              <p className="display" style={{ fontSize: 20, marginBottom: 6 }}>
                Licenciés de la Similienne
              </p>
              <p className="accent-text pretty">
                Si un stage de la Similienne a lieu sur la même période, les licenciés de la Similienne
                s&apos;inscrivent auprès de leur club et non auprès du NBB. En cas de doute sur la période,{" "}
                <Link href="/contact?sujet=stage" className="link-white">
                  écrivez-nous
                </Link>
                .
              </p>
            </div>
          </div>

          <h2 id="dates" className="title-section title-section--sm" style={{ marginBottom: 6 }}>
            Les dates de la saison
          </h2>
          <p className="intro">
            Les dates définitives sont publiées environ trois semaines avant chaque période. Les places sont limitées
            et attribuées dans l&apos;ordre d&apos;arrivée des inscriptions.
          </p>
          <div className="stack" style={{ gap: 14 }}>
            {STAGES.map((s) => {
              const ouvert = stageOuvert(s);
              return (
                <article key={s.periode} className="stage-card bar-card">
                  <div className="row-between" style={{ alignItems: "baseline" }}>
                    <div>
                      <h3 className="title-card title-card--lg">{s.periode}</h3>
                      <p className="text-muted text-sm" style={{ marginTop: 8, maxWidth: "44em" }}>
                        {s.contenu}
                      </p>
                    </div>
                    <p className={ouvert ? "pill" : "pill pill--closed"}>{s.statut}</p>
                  </div>
                  <div className="stage-card__facts">
                    <span>
                      <strong>Pour qui :</strong> {s.public}
                    </span>
                    <span>
                      <strong>Lieu :</strong> {s.lieu}
                    </span>
                  </div>
                  <ul className="stack" style={{ gap: 10, marginTop: 18 }}>
                    {s.semaines.map((w) => (
                      <li key={w.nom + w.dates} className="week">
                        <div>
                          <p className="week__name">{w.nom}</p>
                          <p className="week__dates">{w.dates}</p>
                          <p className="week__places">{w.places}</p>
                        </div>
                        {ouvert ? (
                          <BoutonInscrireStage valeur={libelleSemaine(s, w)} />
                        ) : (
                          <p className="week__closed">Inscriptions non ouvertes</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section" aria-labelledby="tarifs-stages">
          <h2 id="tarifs-stages" className="title-section title-section--sm" style={{ marginBottom: 6 }}>
            Les tarifs
          </h2>
          <p className="intro" style={{ marginBottom: 22 }}>
            {STAGE_INFOS.tarifsNote}
          </p>
          <div className="table-wrap">
            <div className="table-scroll">
              <table className="tarifs">
                <thead>
                  <tr>
                    <th scope="col">Formule</th>
                    <th scope="col">Licenciés NBB</th>
                    <th scope="col">Carte blanche</th>
                    <th scope="col">Non-licenciés</th>
                  </tr>
                </thead>
                <tbody>
                  {STAGE_TARIFS.map((t) => (
                    <tr key={t.formule}>
                      <th scope="row">{t.formule}</th>
                      <td className="tarifs__main">{t.licencies}</td>
                      <td>{t.carteBlanche}</td>
                      <td>{t.nonLicencies}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="grid" style={grille(290, { align: "start" })}>
            <div className="card card--strong">
              <h2 className="title-card title-card--lg" style={{ marginBottom: 18 }}>
                Une journée type
              </h2>
              <ol className="rows">
                {STAGE_JOURNEE.map((j) => (
                  <li key={j.heure} className="day-row" style={{ borderTopColor: "var(--line)" }}>
                    <p className="day-row__time">{j.heure}</p>
                    <p className="text-soft text-md">{j.texte}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="card card--strong">
              <h2 className="title-card title-card--lg" style={{ marginBottom: 18 }}>
                À prévoir dans le sac
              </h2>
              <ul className="checklist">
                {STAGE_A_PREVOIR.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="inscription-stage" className="section anchor-target">
          <div className="grid" style={grille(300, { align: "start" })}>
            <div className="card card--raised" style={{ borderColor: "rgba(255,255,255,.14)" }}>
              <StageForm
                semaines={semaines}
                delaiReponse={CLUB.delaiReponse}
                anneeMin={anneeSaison() - 21}
                anneeMax={anneeSaison() - 2}
              />
            </div>

            <div className="stack">
              <div className="card card--strong">
                <h2 className="title-card title-card--lg" style={{ marginBottom: 14 }}>
                  Comment ça marche
                </h2>
                <ol className="numbered">
                  <li>Vous remplissez le formulaire ci-contre.</li>
                  <li>Le club confirme la place par e-mail (les places sont limitées).</li>
                  <li>Vous réglez le stage — moyens acceptés : {STAGE_INFOS.paiement}.</li>
                  <li>Rendez-vous au gymnase, autorisation parentale signée en main.</li>
                </ol>
              </div>
              <div className="card card--accent" style={{ borderRadius: 22 }}>
                <p className="accent-title">Non licencié, c&apos;est possible</p>
                <p className="accent-text">
                  Les stages sont ouverts aux enfants qui ne jouent pas encore au club : c&apos;est souvent le meilleur
                  moyen de tester le basket avant de s&apos;inscrire. Une attestation d&apos;assurance suffit.
                </p>
              </div>
              <div className="card card--soft" style={{ borderRadius: 22 }}>
                <p className="accent-title">Annulation</p>
                <p className="text-muted text-md">{STAGE_INFOS.annulation}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </StageChoixProvider>
  );
}
