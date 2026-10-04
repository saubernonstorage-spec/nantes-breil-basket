import type { Metadata } from "next";
import Link from "next/link";
import { BUREAU, COMITE, COMMISSIONS, HISTOIRE, PHOTOS, PROJET, STATS, VALEURS } from "@/data/nbb";
import { enLettres, majuscule } from "@/lib/utils";
import { EntetePage } from "@/components/Page";
import { Photo } from "@/components/Photo";

export const metadata: Metadata = {
  title: "Le club — histoire, valeurs, bureau et bénévoles",
  description:
    "Le Nantes Breil Basket, club de basket nantais depuis 1932 : histoire, valeurs, projet associatif, bureau, comité directeur et commissions de bénévoles.",
  alternates: { canonical: "/club" },
};

const ORDRE_BUREAU = ["Président", "Secrétaire", "Trésorier", "Vice-président", "Secrétaire adjoint", "Trésorier adjoint"];

export default function Club() {
  const bureau = [...BUREAU].sort((a, b) => {
    const ia = ORDRE_BUREAU.indexOf(a.role);
    const ib = ORDRE_BUREAU.indexOf(b.role);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
  const recrutent = COMMISSIONS.filter((c) => c.recrute);
  const autres = COMMISSIONS.filter((c) => !c.recrute);

  return (
    <>
      <EntetePage
        fil="Le club"
        largeurTitre={1000}
        titre={
          <>
            Un club de quartier, <span className="accent">une ambition de club formateur</span>
          </>
        }
        chapo={`Association loi 1901 installée quartier des Hauts-Pavés, le Nantes Breil Basket fait jouer ${STATS.adherents} adhérents dans ${STATS.equipes} équipes. Ici, on vient apprendre le basket — et on reste pour l'ambiance.`}
      />

      {/* Grande photo du club, sous l'en-tête (en-têtes de même hauteur sur toutes les pages). */}
      <div className="section club-photo-bloc">
        <div className="club-photo">
          <Photo src={PHOTOS.club.src} alt={PHOTOS.club.alt} sizes="(max-width: 1360px) 100vw, 1300px" prioritaire />
        </div>
      </div>

      {/* Histoire : titre à gauche (collant sur ordinateur), frise verticale à droite. */}
      <section aria-labelledby="histoire-titre" className="section histoire" style={{ paddingTop: 72, paddingBottom: 56 }}>
        <div className="histoire__tete">
          <div className="surtitre">Notre histoire</div>
          <h2 id="histoire-titre" className="titre-section">
            Presque un siècle de basket
          </h2>
        </div>
        <ol className="frise">
          {HISTOIRE.map((h) => (
            <li key={h.annee}>
              <div className="frise__annee">{h.annee}</div>
              <div>
                <h3>{h.titre}</h3>
                <p>{h.texte}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Valeurs numérotées, puis le projet associatif dans un bloc sombre. */}
      <section aria-labelledby="valeurs-titre" className="section" style={{ paddingTop: 40, paddingBottom: 56 }}>
        <div className="surtitre">Valeurs &amp; projet associatif</div>
        <h2 id="valeurs-titre" className="titre-section" style={{ marginBottom: 28 }}>
          Ce qui nous fait avancer
        </h2>
        <ol className="valeurs">
          {VALEURS.map((v, i) => (
            <li key={v.titre} className="valeur">
              <span aria-hidden="true" className="valeur__numero">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{v.titre}</h3>
              <p>{v.texte}</p>
            </li>
          ))}
        </ol>
        <div className="projet">
          {PROJET.map((p) => (
            <div key={p.titre} className="projet__bloc">
              <div className="surtitre">{p.titre}</div>
              <p>{p.texte}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="bureau" aria-labelledby="bureau-titre" className="section" style={{ paddingBottom: 40 }}>
        <div className="surtitre">Organigramme</div>
        <h2 id="bureau-titre" className="titre-section" style={{ marginBottom: 24 }}>
          Le bureau
        </h2>
        {/* Même grille que les entraîneurs de l'accueil : cartes de même largeur ; sur mobile, une rangée qui défile de côté. */}
        <div
          className="grille portraits-defilants"
          role="region"
          aria-label="Membres du bureau"
          tabIndex={0}
          style={{ "--min": "250px", gap: 16 } as React.CSSProperties}
        >
          {bureau.map((b) => (
            <article key={b.nom} className="portrait">
              <div className="portrait__rond">
                <Photo src={b.photo} alt={`Portrait de ${b.nom}, ${b.role}`} sizes="132px" vide={{ initiales: b.nom }} />
              </div>
              <div className="portrait__corps">
                <span className="etiquette">{b.role}</span>
                <h3 className="portrait__nom">{b.nom}</h3>
                <p className="portrait__detail">{b.detail}</p>
              </div>
            </article>
          ))}
        </div>
        <h3 className="titre-bloc" style={{ fontSize: 32, margin: "36px 0 14px" }}>
          Comité directeur &amp; bénévoles
        </h3>
        <ul className="comite">
          {COMITE.map((c) => (
            <li key={c.nom}>
              <strong>{c.nom}</strong>
              <span>{c.detail}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="commissions" aria-labelledby="comm-titre" className="bande-sombre" style={{ marginTop: 40 }}>
        <div className="section" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="tete-section" style={{ marginBottom: 28 }}>
            <div>
              <div className="surtitre">Les commissions</div>
              <h2 id="comm-titre" className="titre-section" style={{ fontSize: "clamp(40px, 5vw, 72px)", maxWidth: 780 }}>
                Parents, le club a besoin de <span className="accent">vous</span>
              </h2>
            </div>
            <p className="texte-clair" style={{ maxWidth: 420, margin: 0 }}>
              {majuscule(enLettres(recrutent.length, true))} commission{recrutent.length > 1 ? "s cherchent" : " cherche"}{" "}
              des bras en ce moment. Pas besoin d'expérience, ni de beaucoup de temps : dites-nous ce qui vous tente.
            </p>
          </div>
          <div className="grille" style={{ "--min": "280px", gap: 14 } as React.CSSProperties}>
            {recrutent.map((c) => (
              <div key={c.nom} className="commission-recrute">
                <span className="commission-recrute__badge">On recrute</span>
                <h3>{c.nom}</h3>
                <p>{c.role}</p>
                <span className="commission-recrute__temps">{c.temps}</span>
              </div>
            ))}
          </div>
          {/* Tout le bandeau est un lien vers le formulaire de contact (sujet bénévolat). */}
          <Link href="/contact?sujet=benevolat" className="bandeau-orange carte-lien">
            <p>Table de marque, arbitrage, bar : une formation courte est proposée.</p>
            <span className="btn btn--l btn--nuit">Je deviens bénévole</span>
          </Link>
          <h3 className="titre-bloc" style={{ fontSize: 32, margin: "56px 0 16px" }}>
            Les autres commissions
          </h3>
          <div className="grille grille--remplir" style={{ "--min": "260px", gap: 10 } as React.CSSProperties}>
            {autres.map((c) => (
              <div key={c.nom} className="commission">
                <h4>{c.nom}</h4>
                <p>{c.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
