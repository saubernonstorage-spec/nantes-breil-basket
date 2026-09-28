import type { Metadata } from "next";
import { CLUB, PHOTOS, STAGES, STAGE_A_PREVOIR, STAGE_CONTACT, STAGE_JOURNEE, STAGE_REDUCTIONS, STAGE_TARIFS } from "@/data/nbb";
import { anneesStage, prixStage, semainesOuvertes } from "@/lib/nbb";
import { lienTel, majuscule } from "@/lib/utils";
import { FilAriane } from "@/components/Page";
import { Photo } from "@/components/Photo";
import { StageForm } from "@/components/formulaires/StageForm";

export const metadata: Metadata = {
  title: "Stages de basket vacances scolaires",
  description:
    "Stages de basket pendant les vacances scolaires à Nantes (gymnase Joël Paon) : dates, tarifs, journée type et inscription en ligne. Ouverts aux licenciés et non-licenciés.",
  alternates: { canonical: "/stages" },
};

/** "Stages d'automne" → "Automne". */
function titreCarte(periode: string): string {
  return majuscule(periode.replace(/^stages?\s+d(e\s+|')/i, ""));
}

export default function Stages() {
  const semaines = semainesOuvertes();

  return (
    <>
      <section className="entete-page stages-hero">
        <div className="couvrir">
          <Photo src={PHOTOS.stages.src} alt={PHOTOS.stages.alt} sizes="100vw" prioritaire />
        </div>
        <div aria-hidden="true" className="stages-hero__voile" />
        <div className="entete-page__inner stages-hero__contenu">
          <FilAriane page="Stages · vacances scolaires zone B" />
          <h1 className="titre-page" style={{ maxWidth: 900 }}>
            Les stages <span className="accent">des vacances</span>
          </h1>
          <p className="chapo" style={{ maxWidth: 560, marginBottom: 28, color: "rgba(245,243,238,.88)" }}>
            Une semaine de basket à chaque période de vacances, encadrée par les entraîneurs du NBB. Ouverts aux
            licenciés du club et aux enfants qui veulent découvrir le basket.
          </p>
          <div className="rangee rangee--10">
            <a href="#inscription-stage" className="btn btn--xl btn--orange">
              Inscrire mon enfant <span className="fleche fleche--bas" aria-hidden="true">↓</span>
            </a>
            <a href="#tarifs-stage" className="btn btn--xl btn--clair" style={{ borderColor: "rgba(245,243,238,.35)" }}>
              Tarifs &amp; journée type
            </a>
          </div>
        </div>
      </section>

      <section aria-labelledby="dates-titre" className="section" style={{ paddingTop: 64, paddingBottom: 32 }}>
        <div className="tete-section" style={{ marginBottom: 24 }}>
          <div>
            <div className="surtitre">Calendrier {CLUB.saison}</div>
            <h2 id="dates-titre" className="titre-section">
              Les dates de la saison
            </h2>
          </div>
          <p className="tete-section__texte" style={{ maxWidth: 440, fontSize: 14 }}>
            Places limitées, attribuées dans l'ordre de réception des règlements.
          </p>
        </div>
        <div className="grille" style={{ "--min": "260px" } as React.CSSProperties}>
          {STAGES.map((s) => (
            <article key={s.id} className="carte-stage">
              {s.ouvert ? (
                <span className="pastille pastille--orange">Inscriptions ouvertes</span>
              ) : (
                <span className="pastille pastille--grise">Programme à venir</span>
              )}
              <h3 className="carte-stage__titre">{titreCarte(s.periode)}</h3>
              <ul className="carte-stage__semaines">
                {(s.semaines.length ? s.semaines : [{ id: "vide", nom: "Dates", dates: "[À COMPLÉTER]" }]).map((w) => (
                  <li key={w.id}>
                    <div className="carte-stage__ligne">
                      <strong>{w.nom}</strong>
                      <span>{w.dates}</span>
                    </div>
                    {"nesDe" in w && w.nesDe ? (
                      <div className="carte-stage__ligne carte-stage__ligne--public">
                        <span>
                          Né(e)s de {w.nesDe} à {w.nesA}
                        </span>
                        <span className={w.licenciesFFBB ? "pastille pastille--bleue" : "pastille pastille--orange"}>
                          {w.licenciesFFBB ? "Licenciés FFBB uniquement" : "Tout public"}
                        </span>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="tarifs-stage" aria-labelledby="tarifs-titre" className="section" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <div className="rangee">
          <div className="tarifs-stage">
            <div className="surtitre">Tarifs</div>
            <h2 id="tarifs-titre" className="titre-bloc-grand" style={{ fontSize: "clamp(36px, 4vw, 52px)", marginBottom: 20 }}>
              Combien ça coûte
            </h2>
            <div className="defilement">
              <table className="tableau-tarifs">
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
                      <td className="accent">{t.licencies}</td>
                      <td>{t.carteBlanche}</td>
                      <td>{t.nonLicencies}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="tarifs-stage__etiquette">Plusieurs enfants inscrits</div>
            <div className="rangee rangee--10" style={{ marginTop: 10 }}>
              {STAGE_REDUCTIONS.map((r) => (
                <div key={r.enfants} className="reduction">
                  <strong>−{r.taux} %</strong>
                  <span>{r.texte}</span>
                </div>
              ))}
            </div>
            <p className="tarifs-stage__note">« Carte blanche » : dispositif de la Ville de Nantes, sur présentation du justificatif.</p>
          </div>
          <div className="journee-type">
            <div className="surtitre">Une journée type</div>
            <ol className="journee-type__liste">
              {STAGE_JOURNEE.map((j) => (
                <li key={j.heure}>
                  <strong>{j.heure}</strong>
                  <span>{j.texte}</span>
                </li>
              ))}
            </ol>
            <div className="surtitre">Dans le sac</div>
            <ul className="liste-coches">
              {STAGE_A_PREVOIR.map((a) => (
                <li key={a}>
                  <span aria-hidden="true">✓</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="inscription-stage" aria-labelledby="insc-titre" className="section" style={{ paddingTop: 48, paddingBottom: 88 }}>
        <div className="bloc-formulaire">
          <div className="bloc-formulaire__cote">
            <div className="surtitre" style={{ margin: 0 }}>
              Inscription en ligne
            </div>
            <h2 id="insc-titre" className="titre-section">
              Réserver une place
            </h2>
            <ol className="etapes-numeros">
              <li>
                <strong>1</strong>Vous remplissez le formulaire.
              </li>
              <li>
                <strong>2</strong>Vous déposez le règlement : à l'entraînement si l'enfant est licencié au NBB, ou dans la
                boîte aux lettres du club ({CLUB.boiteAuxLettres.replace(" — ", ", ")}).
              </li>
              <li>
                <strong>3</strong>L'inscription est effective à réception du règlement : un SMS vous confirme la place.
              </li>
            </ol>
            <p className="note-orange">
              <strong>Licenciés de la Similienne :</strong> si votre club organise un stage sur la même période,
              inscrivez-vous auprès de lui.
            </p>
            <p className="petit-texte">
              Une question ? {STAGE_CONTACT.nom} · <a href={lienTel(STAGE_CONTACT.telephone)}>{STAGE_CONTACT.telephone}</a>
            </p>
          </div>
          <div className="bloc-formulaire__carte">
            {semaines.length > 0 ? (
              <StageForm
                semaines={semaines}
                prix={{
                  licencies: prixStage("licencies"),
                  carteBlanche: prixStage("carteBlanche"),
                  nonLicencies: prixStage("nonLicencies"),
                }}
                reductions={STAGE_REDUCTIONS}
                annees={anneesStage()}
              />
            ) : (
              <p className="petit-texte" style={{ fontSize: 16 }}>
                Les inscriptions en ligne ouvriront avec le programme des prochains stages. En attendant, écrivez-nous
                depuis la page Contact.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
