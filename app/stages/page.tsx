import type { Metadata } from "next";
import { CLUB, PHOTOS, STAGE_A_PREVOIR, STAGE_CONTACT, STAGE_JOURNEE, STAGE_REDUCTIONS, STAGE_TARIFS } from "@/data/nbb";
import { anneesStage, prixStage, semainesOuvertes, stagesVue, type EtatStage } from "@/lib/nbb";
import { lienTel, majuscule } from "@/lib/utils";
import { FilAriane } from "@/components/Page";
import { Photo } from "@/components/Photo";
import { StageForm } from "@/components/formulaires/StageForm";
import { IconeCoche } from "@/components/icons";

export const metadata: Metadata = {
  title: "Stages de basket vacances scolaires",
  description:
    "Stages de basket pendant les vacances scolaires à Nantes : dates, tarifs, journée type et inscription en ligne. Ouverts aux licenciés et non-licenciés.",
  alternates: { canonical: "/stages" },
};

// L'ouverture et la fermeture des inscriptions (la veille du premier jour à midi) suivent l'heure :
// la page est régénérée toutes les 10 minutes. Le serveur refuse de toute façon une semaine fermée.
export const revalidate = 600;

/** "Stages d'automne" → "Automne". */
function titreCarte(periode: string): string {
  return majuscule(periode.replace(/^stages?\s+d(e\s+|')/i, ""));
}

const PASTILLES: Record<EtatStage, { texte: string; classe: string }> = {
  ouvertes: { texte: "Inscriptions ouvertes", classe: "pastille pastille--orange" },
  fermees: { texte: "Inscriptions fermées", classe: "pastille pastille--fermee" },
  "a-venir": { texte: "Inscriptions à venir", classe: "pastille pastille--grise" },
};

export default function Stages() {
  const stages = stagesVue();
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
          <p className="chapo" style={{ maxWidth: 560, color: "rgba(245,243,238,.88)" }}>
            Une semaine de basket à chaque période de vacances, encadrée par les entraîneurs du NBB. Ouverts aux
            licenciés du club et aux enfants qui veulent découvrir le basket.
          </p>
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
          {stages.map((s, i) => {
            const ouverte = s.etat === "ouvertes";
            const contenu = (
              <>
                <span className={PASTILLES[s.etat].classe}>{PASTILLES[s.etat].texte}</span>
                <h3 className="carte-stage__titre">{titreCarte(s.periode)}</h3>
                <ul className="carte-stage__semaines">
                  {s.semaines.map((w) => (
                    // Dans une période encore ouverte, une semaine déjà fermée est grisée.
                    <li key={w.id} className={s.etat === "ouvertes" && w.fermee ? "carte-stage__semaine--fermee" : undefined}>
                      <div className="carte-stage__ligne">
                        <strong>{w.nom}</strong>
                        <span>{w.dates}</span>
                      </div>
                      {s.etat === "ouvertes" && w.fermee ? (
                        <span className="pastille pastille--fermee">Inscriptions fermées</span>
                      ) : null}
                      {s.etat === "ouvertes" && !w.fermee && w.cloture ? (
                        <span className="carte-stage__cloture">Inscriptions jusqu'au {w.cloture}</span>
                      ) : null}
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
                {ouverte ? (
                  <span className="btn btn--m btn--petit btn--orange carte-stage__cta">
                    S'inscrire <span className="fleche fleche--bas" aria-hidden="true">↓</span>
                  </span>
                ) : null}
              </>
            );
            const style = { "--i": i } as React.CSSProperties;
            // Stage ouvert : toute la carte mène au formulaire d'inscription, plus bas sur la page.
            return ouverte ? (
              <a key={s.id} href="#inscription-stage" className="carte-stage carte-stage--ouverte carte-lien" style={style}>
                {contenu}
              </a>
            ) : (
              <article key={s.id} className={s.etat === "fermees" ? "carte-stage carte-stage--fermee" : "carte-stage"} style={style}>
                {contenu}
              </article>
            );
          })}
        </div>
      </section>

      <section id="tarifs-stage" aria-labelledby="tarifs-titre" className="section" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <div className="rangee">
          <div className="tarifs-stage">
            <div className="surtitre">Tarifs</div>
            <h2 id="tarifs-titre" className="titre-bloc-grand" style={{ fontSize: "clamp(36px, 4vw, 52px)", marginBottom: 20 }}>
              Combien ça coûte
            </h2>
            {/* Sur téléphone, chaque formule devient un bloc (trois prix côte à côte) : pas de défilement. */}
            <div>
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
                      {/* data-label : intitulé de colonne affiché au-dessus du prix sur téléphone. */}
                      <td className="accent" data-label="Licenciés NBB">
                        {t.licencies}
                      </td>
                      <td data-label="Carte blanche">{t.carteBlanche}</td>
                      <td data-label="Non-licenciés">{t.nonLicencies}</td>
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
                  <span aria-hidden="true"><IconeCoche /></span>
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
                <strong>3</strong>L'inscription est effective à réception du règlement : un e-mail vous confirme la place.
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
