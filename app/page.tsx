import Link from "next/link";
import { CLUB, ENCADREMENT, PHOTOS, STATS } from "@/data/nbb";
import { agendaAVenir, chiffresAccueil, matchsALAffiche, resultatsParWeekend } from "@/lib/nbb";
import { aCompleter } from "@/lib/utils";
import { JsonLdClub } from "@/components/JsonLdClub";
import { ChiffreAnime } from "@/components/ChiffreAnime";
import { DerniersResultats } from "@/components/DerniersResultats";
import { MatchsALAffiche } from "@/components/MatchsALAffiche";
import { Photo } from "@/components/Photo";
import { TeteSection } from "@/components/Page";
import { Sifflet } from "@/components/Illustrations";
import { Etoiles, IconeFacebook, IconeInstagram, IconeWhatsapp, NouvelOnglet } from "@/components/icons";

// L'agenda n'affiche que les dates à venir : la page est régénérée toutes les heures.
export const revalidate = 3600;

export default function Accueil() {
  // Week-end le plus récent des résultats FFBB (aucun en début de saison : la boîte n'est pas affichée).
  const dernierWeekend = resultatsParWeekend().semaines[0];

  return (
    <>
      <JsonLdClub />

      <section aria-labelledby="hero-titre" className="hero">
        <div className="hero__photo">
          <Photo src={PHOTOS.accueil.src} alt={PHOTOS.accueil.alt} sizes="100vw" prioritaire />
        </div>
        <div aria-hidden="true" className="hero__voile" />
        <div className="hero__contenu">
          <div className="hero__texte">
            <h1 id="hero-titre" className="hero__titre">
              Viens dribbler <span className="accent">dans ton quartier</span>
            </h1>
            <p className="hero__chapo">
              Du micro-basket dès 3 ans aux seniors, {STATS.adherents} adhérents font vivre le basket au cœur de
              Nantes dans le quartier des Hauts-Pavés.
            </p>
            <div className="rangee rangee--10">
              <Link href="/inscriptions" className="btn btn--xl btn--orange btn--ombre">
                Rejoindre le club
              </Link>
              <Link href="/stages" className="btn btn--xl btn--verre">
                Inscription aux stages
              </Link>
            </div>
            {/* Réseaux du club : trois icônes discrètes sous les boutons (plus de carte dédiée sur l'accueil). */}
            <div className="hero__reseaux" aria-label="Réseaux du club" role="group">
              <a href={CLUB.instagram} target="_blank" rel="noopener" aria-label="Instagram du club (nouvel onglet)" className="hero__reseau">
                <IconeInstagram />
              </a>
              <a href={CLUB.facebook} target="_blank" rel="noopener" aria-label="Facebook du club (nouvel onglet)" className="hero__reseau">
                <IconeFacebook />
              </a>
              <a href={CLUB.whatsapp} target="_blank" rel="noopener" aria-label="Groupe WhatsApp du club (nouvel onglet)" className="hero__reseau">
                <IconeWhatsapp />
              </a>
            </div>
          </div>
        </div>
        <div className="hero__chiffres">
          <dl>
            {chiffresAccueil().map((c) => (
              <div key={c.label}>
                <dt>{c.label}</dt>
                <dd>
                  {/* Label en étoiles (« ★★★ ») : icônes ; chiffres : défilement. */}
                  {/^★+$/.test(c.valeur) ? <Etoiles n={c.valeur.length} taille={26} /> : <ChiffreAnime valeur={c.valeur} />}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Prochain match à domicile des équipes à l'affiche (EQUIPES_A_L_AFFICHE) et prochain événement de l'agenda, avec comptes à rebours. */}
      <MatchsALAffiche matchs={matchsALAffiche()} evenements={agendaAVenir()} />

      {/* Photo sur toute la largeur, puis appel aux bénévoles et partenaires à gauche et résultats du dernier week-end à droite. */}
      <div className="bande-sombre" style={{ marginTop: 40 }}>
        <div className="section" style={{ paddingTop: 72, paddingBottom: 72 }}>
          <div className="banniere-photo">
            <Photo
              src={PHOTOS.accueilVieClub.src}
              alt={PHOTOS.accueilVieClub.alt}
              sizes="(max-width: 1360px) 100vw, 1300px"
            />
            <div aria-hidden="true" className="banniere-photo__voile" />
            <div className="banniere-photo__texte">
              {/* Toujours sur deux lignes : une ligne par partie de la phrase. */}
              <span className="ligne">On vient pour le basket,</span>{" "}
              <span className="ligne accent">on reste pour l'ambiance.</span>
            </div>
          </div>
          {/* Sous la photo : « Le club, c'est vous » puis « Nos écoles » à gauche (60 %), derniers résultats à droite (40 %). */}
          <div className={dernierWeekend ? "tableau-de-bord" : "tableau-de-bord tableau-de-bord--seul"}>
            <div className="tableau-de-bord__gauche">
              <section aria-labelledby="aide-titre">
                <div className="surtitre">Le club, c'est vous</div>
                <h2 id="aide-titre" className="tableau-de-bord__titre">
                  On a besoin de vous
                </h2>
                <div className="duo-boites">
                  <article className="boite-appel boite-appel--orange">
                    <div className="surtitre">Parents &amp; bénévoles</div>
                    <h3 className="boite-appel__titre">Un peu de votre temps, et le club tourne.</h3>
                    <p>Pas besoin de connaissance particulière, on vous forme.</p>
                    <Link href="/club#commissions" className="btn btn--l btn--nuit">
                      Proposer votre aide
                    </Link>
                  </article>
                  <article className="boite-appel">
                    <div className="surtitre">Entreprises &amp; parents</div>
                    <h3 className="boite-appel__titre">Soutenez le développement du club.</h3>
                    <p>
                      Partenariat ou mécénat avec reçu fiscal : chaque soutien finance le matériel et l'encadrement.
                    </p>
                    <Link href="/partenaires" className="btn btn--l btn--orange">
                      Devenir partenaire
                    </Link>
                  </article>
                </div>
              </section>

              <section aria-labelledby="vie-titre">
                <div className="surtitre">Nos écoles</div>
                <h2 id="vie-titre" className="tableau-de-bord__titre">
                  Apprendre, arbitrer, grandir
                </h2>
                <div className="duo-boites">
                  {/* Cartes entièrement cliquables. */}
                  <Link href="/ecoles" className="ecole-carte carte-lien">
                    <div className="ecole-carte__visuel">
                      <Photo
                        src={PHOTOS.accueilEcole.src}
                        alt={PHOTOS.accueilEcole.alt}
                        sizes="(max-width: 699px) 100vw, 400px"
                      />
                    </div>
                    <div className="ecole-carte__corps">
                      <div className="surtitre">École de basket</div>
                      <h3 className="ecole-carte__titre">Trois étoiles au-dessus du panier</h3>
                      <p>
                        Micro-basket, U7, U9 et U11 : notre école de mini-basket est reconnue au plus haut niveau du
                        label de la Fédération. Le club détient aussi le label FFBB Micro Basket.
                      </p>
                      <span className="btn btn--l btn--creme">Découvrir l'école de basket</span>
                    </div>
                  </Link>
                  <Link href="/ecoles#arbitrage" className="ecole-carte carte-lien">
                    <div className="ecole-carte__visuel ecole-carte__visuel--dessin">
                      <Sifflet className="ecole-carte__dessin" />
                    </div>
                    <div className="ecole-carte__corps">
                      <div className="surtitre">École d'arbitrage</div>
                      <h3 className="ecole-carte__titre">Siffler, c'est encore jouer.</h3>
                      <p>
                        Un parcours progressif pour découvrir les règles, arbitrer les rencontres de jeunes, se
                        perfectionner en formation et accéder au statut d’arbitre ou d’OTM officiel.
                      </p>
                      <span className="btn btn--l btn--orange">Le parcours d'arbitrage</span>
                    </div>
                  </Link>
                </div>
              </section>
            </div>
            {/* Résultats FFBB du dernier week-end (data/resultats-ffbb.json, mis à jour chaque nuit). */}
            {dernierWeekend ? <DerniersResultats semaine={dernierWeekend} /> : null}
          </div>
        </div>
      </div>

      <section aria-labelledby="coachs-titre" className="section">
        <TeteSection
          grand
          surtitre="Encadrement"
          titre="Celles et ceux qui entraînent"
          id="coachs-titre"
        />
        {/* Sur mobile, les cartes forment une rangée qui défile de côté (focalisable au clavier). */}
        <div
          className="grille portraits-defilants"
          role="region"
          aria-label="Entraîneurs du club"
          tabIndex={0}
          style={{ "--min": "250px", gap: 16 } as React.CSSProperties}
        >
          {ENCADREMENT.map((c) => {
            const nom = c.nom ? `${c.prenom} ${c.nom}` : c.prenom;
            // Diplômes et arrivée encore « [À COMPLÉTER] » : non affichés.
            const diplomes = c.diplomes.filter((d) => !aCompleter(d.nom));
            return (
              <article key={c.prenom} className="portrait">
                <div className="portrait__rond">
                  <Photo src={c.photo} alt={`Portrait de ${c.prenom}, ${c.role}`} sizes="132px" vide={{ initiales: nom }} />
                </div>
                <div className="portrait__corps">
                  <span className="etiquette">{c.role}</span>
                  <h3 className="portrait__nom">{nom}</h3>
                  {diplomes.length ? (
                    <div className="portrait__diplomes">
                      {diplomes.map((d) =>
                        d.url ? (
                          <a key={d.nom} href={d.url} target="_blank" rel="noopener">
                            {d.nom}
                            <NouvelOnglet />
                          </a>
                        ) : (
                          <span key={d.nom}>{d.nom}</span>
                        ),
                      )}
                    </div>
                  ) : null}
                  {aCompleter(c.arrivee) ? null : <div className="portrait__detail">{c.arrivee}</div>}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
