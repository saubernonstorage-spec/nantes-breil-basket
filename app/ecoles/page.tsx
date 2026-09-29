import type { Metadata } from "next";
import Link from "next/link";
import { ARBITRAGE_SEANCES, CLUB, PHOTOS, TARIFS } from "@/data/nbb";
import { creneauxSamedi } from "@/lib/nbb";
import { FilAriane } from "@/components/Page";
import { Photo } from "@/components/Photo";
import { Terrain } from "@/components/Terrain";
import { NouvelOnglet } from "@/components/icons";

export const metadata: Metadata = {
  title: "École de mini-basket 3 étoiles et école d'arbitrage",
  description:
    "L'école de mini-basket du Nantes Breil Basket, labellisée 3 étoiles par la FFBB, et le label Micro Basket dès 3 ans. École d'arbitrage des U13 aux seniors.",
  alternates: { canonical: "/ecoles" },
};

const APPORTS = [
  { titre: "Apprendre en jouant", texte: "Jeux, parcours et ateliers : motricité, adresse et sens du collectif, sans s'en rendre compte." },
  { titre: "Un encadrement adapté", texte: "Des groupes à taille humaine et des coachs formés à l'accueil des plus jeunes." },
  { titre: "Progresser à son rythme", texte: "On découvre d'abord le ballon, puis les règles et les premières rencontres." },
  { titre: "Une première vie de groupe", texte: "Se faire des copains, respecter les autres, gagner et perdre ensemble." },
];

const PARCOURS = [
  { titre: "Découvrir", texte: "Un entraînement consacré à l'arbitrage avant chaque période de vacances pour tous les U15 et U18." },
  { titre: "Pratiquer", texte: "Arbitrer et tenir la table lors des matchs de jeunes du club, accompagné par un référent." },
  { titre: "Approfondir", texte: "4 samedis de formation dans l'année avec La Similienne, animés par des arbitres officiels." },
  { titre: "Devenir officiel", texte: "Pour les plus motivés : formation d'arbitre ou d'OTM auprès du comité départemental." },
];

const OBJECTIFS = [
  "Promouvoir l'arbitrage et faire découvrir cette facette du jeu",
  "Comprendre les aspects réglementaires du basket",
  "Améliorer le niveau d'arbitrage au club",
  "Amener les plus motivés à devenir officiels",
];

export default function Ecoles() {
  return (
    <>
      <section className="entete-page">
        <Terrain motif="angle" style={{ top: 0, left: 0, width: "min(44%, 520px)", transform: "scaleX(-1)" }} />
        <div className="entete-page__inner ecoles-hero">
          <div className="ecoles-hero__texte">
            <FilAriane page="Nos écoles" />
            <div className="badge-label" style={{ marginBottom: 20 }}>
              <span className="badge-label__etoiles">★★★</span>
              École Française de Mini-Basket · Label Micro Basket
            </div>
            <h1 className="titre-page">
              Trois étoiles <span className="accent">au-dessus du panier</span>
            </h1>
            <p className="chapo" style={{ maxWidth: 560, marginBottom: 28 }}>
              Le NBB est labellisé École Française de Mini-Basket au niveau maximal de trois étoiles. Ce label de la
              FFBB distingue les clubs qui offrent aux enfants un accueil éducatif et un encadrement de qualité. Le club
              détient aussi le label FFBB Micro Basket, pour l'accueil des tout-petits dès 3 ans.
            </p>
            <div className="rangee rangee--10">
              <Link href="/contact?sujet=essai" className="btn btn--xl btn--orange">
                Demander une séance d'essai
              </Link>
              <a href="#arbitrage" className="btn btn--xl btn--clair">
                École d'arbitrage <span className="fleche fleche--bas" aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
          <div className="ecoles-hero__photo">
            <Photo src={PHOTOS.ecoles.src} alt={PHOTOS.ecoles.alt} sizes="(max-width: 900px) 100vw, 560px" prioritaire />
          </div>
        </div>
      </section>

      <section aria-labelledby="apports-titre" className="section" style={{ paddingTop: 72, paddingBottom: 40 }}>
        <div className="surtitre">Ce que les enfants y trouvent</div>
        <h2 id="apports-titre" className="titre-section" style={{ marginBottom: 24 }}>
          Le plaisir du ballon d'abord
        </h2>
        <div className="grille">
          {APPORTS.map((a, i) => (
            <div key={a.titre} className="carte etape">
              <div className="etape__num">{String(i + 1).padStart(2, "0")}</div>
              <h3>{a.titre}</h3>
              <p>{a.texte}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="samedi-titre" className="section" style={{ paddingTop: 40, paddingBottom: 72 }}>
        <div className="rangee">
          <div className="samedi">
            <div className="surtitre">Le samedi matin · gymnase Joël Paon</div>
            <h2 id="samedi-titre" className="samedi__titre">
              Micro-basket &amp; U7
            </h2>
            <div className="samedi__liste">
              {creneauxSamedi().map((g) => (
                <div key={g.nom} className="samedi__groupe">
                  <div>
                    <strong>{g.nom}</strong>
                    <span>Coachs : {g.coachs}</span>
                  </div>
                  <span className="samedi__horaire">{g.horaire}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="cotisation-mini">
            <div className="surtitre" style={{ color: "inherit", margin: 0 }}>
              Cotisation mini-basket
            </div>
            <div>
              <div className="cotisation-mini__prix">{TARIFS[0].prix} €</div>
              <p>Pour la saison, licence et assurance de base comprises. Places limitées dans chaque groupe.</p>
            </div>
            <Link href="/inscriptions#formulaire" className="btn btn--m btn--nuit" style={{ alignSelf: "flex-start" }}>
              Inscrire mon enfant
            </Link>
          </div>
        </div>
      </section>

      <section id="arbitrage" aria-labelledby="arb-titre" className="bande-sombre arbitrage">
        <Terrain
          motif="cote"
          style={{ top: "50%", left: 0, height: "min(88%, 760px)", transform: "translateY(-50%) scaleX(-1)" }}
        />
        <div className="section relatif" style={{ paddingTop: 88, paddingBottom: 88 }}>
          <div className="surtitre">École d'arbitrage · de U13 à seniors</div>
          <h2 id="arb-titre" className="titre-page">
            Siffler, c'est <span className="accent">encore jouer.</span>
          </h2>
          <p className="chapo" style={{ maxWidth: 680, marginBottom: 40 }}>
            L'école d'arbitrage fait découvrir les règles à tous les licenciés, élève le niveau d'arbitrage des matchs
            du club et accompagne les plus motivés jusqu'au statut d'officiel.
          </p>
          <ol className="grille parcours" style={{ "--min": "230px", marginBottom: 40 } as React.CSSProperties}>
            {PARCOURS.map((p, i) => (
              <li key={p.titre} className={i === PARCOURS.length - 1 ? "parcours__etape parcours__etape--fin" : "parcours__etape"}>
                <div className="parcours__num">{String(i + 1).padStart(2, "0")}</div>
                <h3>{p.titre}</h3>
                <p>{p.texte}</p>
              </li>
            ))}
          </ol>
          <div className="rangee">
            <div className="seances">
              <h3 className="titre-bloc" style={{ marginBottom: 14 }}>
                Séances {CLUB.saison}
              </h3>
              <ul>
                {ARBITRAGE_SEANCES.map((s) => (
                  <li key={s.date}>
                    <strong>{s.date}</strong>
                    <span>
                      {s.heure} · {s.lieu}
                    </span>
                  </li>
                ))}
              </ul>
              <p>Ouvertes des U13 aux seniors. Le parcours complet est recommandé.</p>
            </div>
            <div className="objectifs">
              <h3 className="titre-bloc">Nos objectifs</h3>
              <ul>
                {OBJECTIFS.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
              <div className="rangee rangee--10" style={{ marginTop: "auto" }}>
                <Link href="/contact?sujet=arbitrage" className="btn btn--m btn--orange">
                  Participer
                </Link>
                <a href={CLUB.memoArbitrage} target="_blank" rel="noopener" className="btn btn--m btn--clair">
                  Mémo de l'arbitrage (PDF)
                  <NouvelOnglet />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
