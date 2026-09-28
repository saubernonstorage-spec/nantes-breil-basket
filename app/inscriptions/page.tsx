import type { Metadata } from "next";
import Link from "next/link";
import { AIDES, CATEGORIES_AGE, CLUB, COMMISSIONS, DOCUMENTS, PIECES, TARIFS, TARIF_NOTE } from "@/data/nbb";
import { anneeSaison, donneesCotisation, toutesLesEquipes } from "@/lib/nbb";
import { EntetePage } from "@/components/Page";
import { Terrain } from "@/components/Terrain";
import { InscriptionForm } from "@/components/formulaires/InscriptionForm";
import { NouvelOnglet } from "@/components/icons";

const prixMin = Math.min(...TARIFS.map((t) => t.prix));
const prixMax = Math.max(...TARIFS.map((t) => t.prix));

export const metadata: Metadata = {
  title: `Inscriptions ${CLUB.saison} et tarifs`,
  description: `S'inscrire au Nantes Breil Basket : tarifs ${CLUB.saison} de ${prixMin} € à ${prixMax} €, documents à fournir, étapes et inscription en ligne. Club de basket à Nantes.`,
  alternates: { canonical: "/inscriptions" },
};

export default function Inscriptions() {
  const charte = PIECES.find((p) => /charte/i.test(p.nom))?.url ?? PIECES[0]?.url ?? "#";

  return (
    <>
      <EntetePage
        fil={`Inscriptions · saison ${CLUB.saison}`}
        style={{ paddingBottom: 72 }}
        largeurTitre={900}
        largeurChapo={600}
        decor={<Terrain motif="cote" style={{ top: "50%", right: 0, height: "112%", transform: "translateY(-50%)" }} />}
        titre={
          <>
            Rejoindre <span className="accent">le NBB</span>
          </>
        }
        chapo="Deux séances d'essai, un formulaire en ligne, quelques documents : on vous guide étape par étape. Les places étant limitées dans chaque équipe, les réinscriptions sont prioritaires."
      >
        <div className="rangee rangee--10" style={{ marginTop: 28 }}>
          <a href="#formulaire" className="btn btn--xl btn--orange">
            S'inscrire en ligne <span className="fleche fleche--bas" aria-hidden="true">↓</span>
          </a>
          <a href="#tarifs" className="btn btn--xl btn--clair">
            Voir les tarifs
          </a>
          <Link href="/infos#faq" className="btn btn--xl btn--clair">
            FAQ
          </Link>
        </div>
      </EntetePage>

      <section aria-labelledby="etapes-titre" className="section" style={{ paddingTop: 64, paddingBottom: 32 }}>
        <div className="surtitre">Comment ça se passe</div>
        <h2 id="etapes-titre" className="titre-section" style={{ marginBottom: 24 }}>
          Cinq étapes, zéro prise de tête
        </h2>
        <ol className="grille etapes-inscription" style={{ "--min": "210px" } as React.CSSProperties}>
          <li className="carte etape etape--petite">
            <div className="etape__num">01</div>
            <h3>Essayer</h3>
            <p>
              Deux séances d'essai dans la catégorie. Planifiez-les à <a href={`mailto:${CLUB.email}`}>{CLUB.email}</a>.
            </p>
          </li>
          <li className="carte etape etape--petite">
            <div className="etape__num">02</div>
            <h3>Préinscription en ligne</h3>
            <p>Le formulaire ci-dessous, en 3 minutes. Vous recevez un numéro de dossier.</p>
          </li>
          <li className="carte etape etape--petite">
            <div className="etape__num">03</div>
            <h3>Dossier &amp; règlement</h3>
            <p>Documents et cotisation. Chèques encaissés à partir du 1er septembre ou selon votre échéancier.</p>
          </li>
          <li className="carte etape etape--petite">
            <div className="etape__num">04</div>
            <h3>Licence FFBB</h3>
            <p>Un lien personnalisé vous arrive de {CLUB.emailLicenceFFBB} : ajoutez-le à vos contacts.</p>
          </li>
          <li className="carte etape etape--petite etape--sombre">
            <div className="etape__num">05</div>
            <h3>Premier entraînement</h3>
            <p>
              Chaussures de salle, gourde, et c'est parti. <Link href="/planning">Voir le planning</Link>.
            </p>
          </li>
        </ol>
      </section>

      <section id="tarifs" aria-labelledby="tarifs-titre" className="section" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <div className="tete-section" style={{ marginBottom: 24 }}>
          <div>
            <div className="surtitre">Tarifs {CLUB.saison}</div>
            <h2 id="tarifs-titre" className="titre-section">
              Une cotisation selon les entraînements
            </h2>
          </div>
          <p className="tete-section__texte" style={{ maxWidth: 420, fontSize: 14 }}>
            {TARIF_NOTE}
          </p>
        </div>
        <div className="grille" style={{ "--min": "200px" } as React.CSSProperties}>
          {TARIFS.map((t) => (
            <div key={t.cle} className="tarif">
              <div>
                <h3>{t.categorie}</h3>
                <div className="tarif__detail">{t.detail}</div>
              </div>
              <div>
                <div className="tarif__prix">{t.prix} €</div>
                <div className="tarif__b">{t.prixB} € avec assurance B</div>
              </div>
            </div>
          ))}
        </div>
        <p className="petit-texte" style={{ marginTop: 14 }}>
          {AIDES} Tarif par équipe : voir <Link href="/equipes">chaque fiche équipe</Link>.
        </p>
      </section>

      <section aria-labelledby="docs-titre" className="section" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <div className="rangee">
          <div className="carte documents">
            <div className="surtitre">Documents à fournir</div>
            <h2 id="docs-titre" className="titre-moyen">
              Le dossier complet
            </h2>
            <ul className="liste-validee">
              {DOCUMENTS.map((d) => (
                <li key={d}>
                  <span aria-hidden="true">✓</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="telechargements">
            <div className="surtitre">Téléchargements</div>
            <h2 className="titre-moyen">Les PDF officiels</h2>
            <ul>
              {PIECES.map((p) => (
                <li key={p.nom}>
                  <a href={p.url} target="_blank" rel="noopener">
                    {p.nom}
                    <span aria-hidden="true">
                      PDF <span className="fleche fleche--bas">↓</span>
                    </span>
                    <NouvelOnglet />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="formulaire" aria-labelledby="form-titre" className="section" style={{ paddingTop: 48, paddingBottom: 88 }}>
        <div className="bloc-formulaire">
          <div className="bloc-formulaire__cote">
            <div className="surtitre" style={{ margin: 0 }}>
              Inscription en ligne
            </div>
            <h2 id="form-titre" className="titre-section">
              Votre préinscription
            </h2>
            <p className="petit-texte" style={{ fontSize: 16, lineHeight: 1.6 }}>
              Trois minutes, aucun compte à créer. La demande arrive directement dans l'espace de la commission
              Inscriptions, qui vous confirme la place selon les effectifs de l'équipe.
            </p>
            <p className="note-bleue" style={{ marginTop: 0, fontSize: 14 }}>
              Vos données servent uniquement à gérer l'adhésion et ne sont jamais transmises à des tiers, hors FFBB pour
              la licence. <Link href="/mentions-legales#confidentialite">En savoir plus</Link>.
            </p>
          </div>
          <div className="bloc-formulaire__carte">
            <InscriptionForm
              equipes={toutesLesEquipes()}
              categoriesAge={CATEGORIES_AGE}
              cotisation={donneesCotisation()}
              commissions={COMMISSIONS.slice(0, 8).map((c) => c.nom)}
              anneeMineur={anneeSaison() - 17}
              charte={charte}
              saison={CLUB.saison}
              delaiReponse={CLUB.delaiReponseInscription}
              emailLicence={CLUB.emailLicenceFFBB}
            />
          </div>
        </div>
      </section>
    </>
  );
}
