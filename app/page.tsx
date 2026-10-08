import Link from "next/link";
import { CLUB, ENCADREMENT, PHOTOS, STATS } from "@/data/nbb";
import { agendaAVenir, chiffresAccueil, CRENEAUX, matchsALAffiche } from "@/lib/nbb";
import { aCompleter, enLettres } from "@/lib/utils";
import { JsonLdClub } from "@/components/JsonLdClub";
import { ListeAgenda } from "@/components/ListeAgenda";
import { ChiffreAnime } from "@/components/ChiffreAnime";
import { CompteARebours } from "@/components/CompteARebours";
import { MatchsALAffiche } from "@/components/MatchsALAffiche";
import { Photo } from "@/components/Photo";
import { TeteSection } from "@/components/Page";
import { Terrain } from "@/components/Terrain";
import { Etoiles, IconeFacebook, IconeInstagram, IconeWhatsapp, NouvelOnglet } from "@/components/icons";

// L'agenda n'affiche que les dates à venir : la page est régénérée toutes les heures.
export const revalidate = 3600;

/** Accès rapides : titres toujours sur deux lignes. */
const ACCES = [
  { href: "/planning", titre: ["Planning des", "entraînements"], texte: "Par équipe, gymnase ou jour" },
  { href: "/matchs", titre: ["Matchs &", "convocations"], texte: "Horaires, lieux, arbitrage, table" },
  { href: "/stages", titre: ["Stages", "vacances"], texte: "Inscription en ligne" },
  { href: "/infos", titre: ["Gymnases &", "accès"], texte: "Adresses, carte, bus" },
];

const ETAPES_ARBITRAGE = [
  "Découvrir les règles",
  "Arbitrer les matchs de jeunes du club",
  "Approfondir : 4 samedis de formation",
  "Devenir arbitre ou OTM officiel",
];

/** 46 → "plus de 45" ; 45 → "45". */
function environ(n: number): string {
  return n % 5 === 0 ? String(n) : `plus de ${n - (n % 5)}`;
}

function introEncadrement(): string {
  const salaries = ENCADREMENT.filter((c) => /salarié/i.test(c.role)).length;
  const apprentis = ENCADREMENT.filter((c) => /apprenti/i.test(c.role)).length;
  const dont = [
    salaries ? `${enLettres(salaries)} salarié${salaries > 1 ? "s" : ""}` : "",
    apprentis ? `${enLettres(apprentis, true)} apprentie${apprentis > 1 ? "s" : ""}` : "",
  ].filter(Boolean);
  return `Des entraîneurs formés${dont.length ? `, dont ${dont.join(" et ")}` : ""}, pour animer ${environ(CRENEAUX.length)} créneaux chaque semaine.`;
}

export default function Accueil() {
  const agenda = agendaAVenir(5);

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
            <Link href="/ecoles" className="badge-label">
              <span className="badge-label__etoiles">
                <Etoiles />
              </span>
              École Française de Mini-Basket
            </Link>
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
          </div>
        </div>
        <div className="hero__chiffres">
          <dl>
            {chiffresAccueil().map((c) => (
              <div key={c.label}>
                <dt>{c.label}</dt>
                <dd>
                  {/* Label en étoiles (« ★★★ ») : icônes ; chiffres : défilement. */}
                  {/^★+$/.test(c.valeur) ? <Etoiles n={c.valeur.length} taille={34} /> : <ChiffreAnime valeur={c.valeur} />}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Prochain match à domicile des équipes à l'affiche (EQUIPES_A_L_AFFICHE), avec compte à rebours. */}
      <MatchsALAffiche matchs={matchsALAffiche()} />

      <section aria-labelledby="acces-titre" className="section" style={{ paddingTop: 64, paddingBottom: 24 }}>
        <TeteSection
          grand
          equilibre
          surtitre="Accès rapides"
          titre="Ce que les familles cherchent"
          id="acces-titre"
        />
        <div className="grille acces-grille" style={{ "--min": "200px" } as React.CSSProperties}>
          {ACCES.map((a) => (
            <Link key={a.href} href={a.href} className="acces carte-lien">
              <span className="acces__titre">
                {a.titre[0]}
                <br />
                {a.titre[1]}
              </span>
              <span className="acces__texte">{a.texte}</span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="reseaux-titre" className="section" style={{ paddingBottom: 24 }}>
        {/* Deux cartes de même largeur (50/50), l'une sous l'autre sur mobile. */}
        <div className="rangee">
          <div className="reseaux">
            <div>
              <div className="surtitre">Réseaux sociaux</div>
              <h2 id="reseaux-titre" className="titre-section titre-section--carte">
                Le club en direct
              </h2>
            </div>
            <div className="reseaux__cote">
              <p>
                Suivez le NBB et rejoignez la communauté WhatsApp pour ne rater aucune information.
              </p>
              {/* Trois boutons de même largeur sur toute la carte ; l'un sous l'autre sur mobile. */}
              <div className="reseaux__boutons">
                <a href={CLUB.instagram} target="_blank" rel="noopener" className="btn btn--s btn--petit btn--orange">
                  <IconeInstagram />
                  Instagram
                  <NouvelOnglet />
                </a>
                <a href={CLUB.facebook} target="_blank" rel="noopener" className="btn btn--s btn--petit btn--orange">
                  <IconeFacebook />
                  Facebook
                  <NouvelOnglet />
                </a>
                <a href={CLUB.whatsapp} target="_blank" rel="noopener" className="btn btn--s btn--petit btn--contour">
                  <IconeWhatsapp />
                  WhatsApp
                  <NouvelOnglet />
                </a>
              </div>
            </div>
          </div>
          {/* Même structure que la carte réseaux : surtitre, titre, texte, bouton. */}
          <a href={CLUB.boutique} target="_blank" rel="noopener" className="boutique carte-lien">
            <div>
              <div className="surtitre">Boutique du club</div>
              <h2 className="titre-section titre-section--carte">Commandez en ligne</h2>
            </div>
            <div className="boutique__bas">
              <p>T-shirts, polos, sweats : portons haut les couleurs du club.</p>
              <span className="btn btn--s btn--petit btn--nuit">
                Voir la boutique <span className="fleche fleche--diag" aria-hidden="true">↗</span>
              </span>
            </div>
            <NouvelOnglet />
          </a>
        </div>
      </section>

      <div className="bande-sombre" style={{ marginTop: 40 }}>
        <div className="section" style={{ paddingTop: 80, paddingBottom: 80 }}>
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
          {/* Agenda à gauche (dates sous le titre), appel aux bénévoles et partenaires à droite. */}
          <div className="agenda-accueil">
            <section aria-labelledby="agenda-titre" className="agenda-accueil__agenda">
              <div>
                <div className="surtitre">Agenda</div>
                <h2 id="agenda-titre" className="titre-section titre-section--grand">
                  Les dates à retenir
                </h2>
              </div>
              <CompteARebours dates={agendaAVenir()} />
              <ListeAgenda dates={agenda} compacte />
              <Link href="/agenda" className="btn btn--petit btn--clair">
                Tout l'agenda
              </Link>
            </section>
            <section aria-labelledby="aide-titre" className="agenda-accueil__aide">
              <div className="surtitre">Le club, c'est vous</div>
              <h2 id="aide-titre" className="titre-section titre-section--grand" style={{ marginBottom: 18 }}>
                On a besoin de vous
              </h2>
              <div className="agenda-accueil__cartes">
                <Link href="/club#commissions" className="appel carte-lien">
                  <div className="surtitre surtitre--gris">Parents &amp; bénévoles</div>
                  <h3 className="appel__titre">Un peu de votre temps, et le club tourne.</h3>
                  <p>Pas besoin de connaissance particulière, on vous forme.</p>
                  <div className="appel__bas">
                    <span className="btn btn--m btn--petit btn--nuit">Proposer votre aide</span>
                  </div>
                </Link>
                <Link href="/partenaires" className="appel appel--bleu carte-lien carte-lien--sombre">
                  <Terrain
                    motif="angle"
                    style={{ right: 0, bottom: 0, width: "min(58%, 360px)", transform: "scaleY(-1)" }}
                  />
                  <div className="surtitre relatif">Entreprise &amp; parents</div>
                  <h3 className="appel__titre relatif">Soutenez le développement du club.</h3>
                  <p className="relatif">
                    Partenariat ou mécénat avec reçu fiscal : chaque soutien finance le matériel et l'encadrement.
                  </p>
                  <div className="appel__bas relatif">
                    <span className="btn btn--m btn--petit btn--orange">Devenir partenaire</span>
                  </div>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>

      <section aria-labelledby="vie-titre" className="section">
        <TeteSection grand equilibre surtitre="Nos écoles" titre="Apprendre, arbitrer, grandir" id="vie-titre" />
        <div className="rangee">
          <Link href="/ecoles" className="carte-ecole carte-lien carte-lien--sombre">
            <div className="couvrir">
              <Photo
                src={PHOTOS.accueilEcole.src}
                alt={PHOTOS.accueilEcole.alt}
                sizes="(max-width: 900px) 100vw, 60vw"
              />
            </div>
            <div aria-hidden="true" className="carte-ecole__voile" />
            <div className="carte-ecole__texte">
              <div className="pastille-orange">
                <Etoiles /> Labels FFBB
              </div>
              <h3 className="carte-ecole__titre">Trois étoiles au-dessus du panier</h3>
              <p>
                Micro-basket, U7, U9 et U11 : notre école de mini-basket est reconnue au plus haut niveau du label de
                la Fédération. Le club détient aussi le label FFBB Micro Basket.
              </p>
              <span className="btn btn--m btn--petit btn--creme">Découvrir l'école de basket</span>
            </div>
          </Link>
          <Link href="/ecoles#arbitrage" className="carte-arbitrage carte-lien carte-lien--sombre">
            <Terrain motif="angle" style={{ top: 0, right: 0, width: "min(78%, 420px)" }} />
            <div className="relatif">
              <div className="surtitre" style={{ marginBottom: 14 }}>
                École d'arbitrage
              </div>
              <h3 className="carte-arbitrage__titre">Siffler, c'est encore jouer.</h3>
            </div>
            <ol className="etapes-arbitrage">
              {ETAPES_ARBITRAGE.map((e, i) => (
                <li key={e}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {e}
                </li>
              ))}
            </ol>
            <span className="btn btn--m btn--petit btn--orange relatif carte-arbitrage__bouton">
              Le parcours d'arbitrage
            </span>
          </Link>
        </div>
      </section>

      <section aria-labelledby="coachs-titre" className="section">
        <TeteSection
          grand
          surtitre="Encadrement"
          titre="Celles et ceux qui entraînent"
          id="coachs-titre"
          texte={introEncadrement()}
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
