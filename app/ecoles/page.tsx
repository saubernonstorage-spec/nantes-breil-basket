import type { Metadata } from "next";
import Link from "next/link";
import { ARBITRAGE_SEANCES, CLUB, PHOTOS, TARIFS } from "@/data/nbb";
import { creneauxSamedi } from "@/lib/nbb";
import { FilAriane } from "@/components/Page";
import { Photo } from "@/components/Photo";
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
  { titre: "Approfondir", texte: "4 samedis de formation complémentaires avec La Similienne, animés par des arbitres officiels." },
  { titre: "Devenir officiel", texte: "Pour les plus motivés : formation d'arbitre ou d'OTM auprès du comité départemental." },
];

const OBJECTIFS = [
  "Promouvoir l'arbitrage et faire découvrir cette facette du jeu",
  "Comprendre les aspects réglementaires du basket",
  "Améliorer le niveau d'arbitrage au club",
  "Accompagner les plus motivés pour devenir officiels",
];

export default function Ecoles() {
  return (
    <>
      <section className="entete-page entete-page--ecoles">
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
            <p className="chapo" style={{ maxWidth: 560 }}>
              Le NBB est labellisé École Française de Mini-Basket trois étoiles, le niveau maximal, ainsi que Micro Basket
              par la FFBB, ce qui atteste d'un accueil éducatif et d'un encadrement de qualité pour les enfants, dès 3 ans.
            </p>
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
        {/* Même présentation que les valeurs de la page Club : colonnes numérotées sous un trait. */}
        <ol className="valeurs">
          {APPORTS.map((a, i) => (
            <li key={a.titre} className="valeur">
              <span aria-hidden="true" className="valeur__numero">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{a.titre}</h3>
              <p>{a.texte}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="samedi-titre" className="section" style={{ paddingTop: 40, paddingBottom: 72 }}>
        <div className="rangee">
          <div className="samedi">
            <div>
              <div className="surtitre">Le samedi matin</div>
              <h2 id="samedi-titre" className="samedi__titre">
                Micro-basket &amp; U7
              </h2>
            </div>
            <div>
              <p className="samedi__lieu">Gymnase Joël Paon</p>
              {/* Un créneau par ligne : groupe (et années de naissance) à gauche, horaire à droite. */}
              <ol className="samedi__liste">
                {creneauxSamedi().map((g) => (
                  <li key={g.nom} className="samedi__groupe">
                    <div>
                      <strong>{g.nom}</strong>
                      {g.naissance ? <span className="samedi__naissance">Né(e)s en {g.naissance}</span> : null}
                    </div>
                    <span className="samedi__horaire">{g.horaire}</span>
                  </li>
                ))}
              </ol>
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
            <div className="rangee rangee--8">
              <Link href="/inscriptions#formulaire" className="btn btn--m btn--nuit">
                Inscrire mon enfant
              </Link>
              <Link href="/contact?sujet=essai" className="btn btn--m btn--contour">
                Demander une séance d'essai
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="arbitrage" aria-labelledby="arb-titre" className="bande-sombre arbitrage">
        <div className="section relatif" style={{ paddingTop: 88, paddingBottom: 88 }}>
          <div className="surtitre">École d'arbitrage</div>
          <h2 id="arb-titre" className="titre-page">
            Siffler, c'est <span className="accent">encore jouer.</span>
          </h2>
          <p className="chapo" style={{ maxWidth: 680, marginBottom: 40 }}>
            L'école d'arbitrage initie tous les licenciés aux règles, fait progresser l'arbitrage des matchs du club et
            accompagne les plus motivés jusqu'au statut d'officiel.
          </p>
          {/* Même présentation que les valeurs de la page Club, version fond sombre. */}
          <ol className="valeurs valeurs--sombre" style={{ marginBottom: 48 }}>
            {PARCOURS.map((p, i) => (
              <li key={p.titre} className="valeur">
                <span aria-hidden="true" className="valeur__numero">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{p.titre}</h3>
                <p>{p.texte}</p>
              </li>
            ))}
          </ol>
          {/* Mêmes cartes que la section du samedi : séances en lignes (carte bleue), objectifs sur la carte orange. */}
          <div className="rangee">
            <div className="samedi samedi--bleu">
              <div>
                <div className="surtitre">Ouvertes des U13 aux seniors</div>
                <h3 className="samedi__titre">Séances {CLUB.saison}</h3>
              </div>
              <div>
                <p className="samedi__lieu">Le parcours complet est recommandé</p>
                <ol className="samedi__liste">
                  {ARBITRAGE_SEANCES.map((s) => (
                    <li key={s.date} className="samedi__groupe">
                      <div>
                        <strong>{s.date}</strong>
                        <span className="samedi__naissance">{s.lieu}</span>
                      </div>
                      <span className="samedi__horaire">{s.heure}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <div className="cotisation-mini">
              <div>
                <div className="surtitre" style={{ color: "inherit", marginBottom: 14 }}>
                  Nos objectifs
                </div>
                {/* Liste : le verbe en grand, la suite de l'objectif dessous. */}
                <ul className="objectifs-liste">
                  {OBJECTIFS.map((o) => {
                    const [verbe, ...suite] = o.split(" ");
                    return (
                      <li key={o}>
                        <strong>{verbe}</strong> {suite.join(" ")}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="rangee rangee--8">
                <Link href="/contact?sujet=arbitrage" className="btn btn--m btn--nuit">
                  Participer
                </Link>
                <a href={CLUB.memoArbitrage} target="_blank" rel="noopener" className="btn btn--m btn--contour">
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
