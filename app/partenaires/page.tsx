import type { Metadata } from "next";
import Link from "next/link";
import { CLUB, GYMNASES, OFFRE_PARTENARIAT, PARTENAIRES, STATS } from "@/data/nbb";
import { EntetePage } from "@/components/Page";
import { Photo } from "@/components/Photo";
import { Terrain } from "@/components/Terrain";
import { NouvelOnglet } from "@/components/icons";

export const metadata: Metadata = {
  title: "Partenaires et mécénat",
  description: `Devenez partenaire du Nantes Breil Basket, club de basket nantais de ${STATS.adherents} adhérents : visibilité au gymnase, sur les maillots et en ligne, ou mécénat avec reçu fiscal.`,
  alternates: { canonical: "/partenaires" },
};

export default function Partenaires() {
  const chiffres = [
    { label: "Adhérents", valeur: STATS.adherents },
    { label: "Équipes", valeur: STATS.equipes },
    { label: "Gymnases", valeur: String(GYMNASES.length) },
    { label: "Depuis", valeur: CLUB.fondation, accent: true },
  ];
  const plaquette = /^https?:\/\//.test(CLUB.plaquettePartenaires) ? CLUB.plaquettePartenaires : "";

  return (
    <>
      <EntetePage
        fil="Partenaires"
        largeurTitre={1000}
        largeurChapo={620}
        decor={<Terrain motif="angle" style={{ right: 0, bottom: 0, width: "min(50%, 600px)", transform: "scaleY(-1)" }} />}
        titre={
          <>
            Jouez collectif <span className="accent">avec le NBB</span>
          </>
        }
      >
        <p className="chapo" style={{ maxWidth: 620, marginBottom: 30 }}>
          Entreprise, commerçant ou particulier : votre soutien finance l'école de basket, le matériel, les stages et la
          formation des coachs et arbitres.
        </p>
        <dl className="chiffres-partenaires">
          {chiffres.map((c) => (
            <div key={c.label}>
              <dt>{c.label}</dt>
              <dd className={c.accent ? "accent" : undefined}>{c.valeur}</dd>
            </div>
          ))}
        </dl>
      </EntetePage>

      <section aria-labelledby="actuels-titre" className="section" style={{ paddingTop: 64, paddingBottom: 40 }}>
        <div className="surtitre">Ils nous soutiennent</div>
        <h2 id="actuels-titre" className="titre-section" style={{ marginBottom: 24 }}>
          Merci à nos partenaires
        </h2>
        <div className="grille grille--remplir" style={{ "--min": "250px" } as React.CSSProperties}>
          {PARTENAIRES.map((p) => {
            const contenu = (
              <>
                <div className={p.logoClair ? "partenaire__logo partenaire__logo--sombre" : "partenaire__logo"}>
                  <Photo src={p.logo} alt={`Logo de ${p.nom}`} sizes="300px" entiere vide={{ texte: p.nom }} />
                </div>
                <div>
                  <h3 className="partenaire__nom">{p.nom}</h3>
                  <p className="partenaire__activite">
                    {p.activite} · {p.ville}
                  </p>
                </div>
              </>
            );
            return p.site ? (
              <a key={p.nom} href={p.site} target="_blank" rel="noopener" className="partenaire carte-lien">
                {contenu}
                <NouvelOnglet />
              </a>
            ) : (
              <article key={p.nom} className="partenaire">
                {contenu}
              </article>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="formules-titre" className="section" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div className="surtitre">Deux façons de s'engager</div>
        <h2 id="formules-titre" className="titre-section" style={{ marginBottom: 24 }}>
          Partenariat ou mécénat
        </h2>
        <div className="rangee">
          <div className="formule formule--bleue">
            <div className="surtitre">Entreprises</div>
            <h3 className="formule__titre">Partenariat</h3>
            <p>Un contrat avec le club, en échange d'un soutien financier ou matériel.</p>
            <ul>
              <li>Visibilité au gymnase et sur les maillots</li>
              <li>Présence sur le site et les réseaux du club</li>
              <li>Invitations aux temps forts de la saison</li>
            </ul>
          </div>
          <div className="formule">
            <div className="surtitre">Entreprises et particuliers</div>
            <h3 className="formule__titre">Mécénat</h3>
            <p>Un don sans contrepartie commerciale, pour soutenir directement le projet du club.</p>
            <ul>
              <li>Réduction d'impôt possible (association loi 1901) [À CONFIRMER : éligibilité]</li>
              <li>Reçu fiscal délivré par le club</li>
              <li>Don fléché : école de basket, matériel, stages…</li>
            </ul>
          </div>
        </div>
        <div className="grille" style={{ "--min": "280px", marginTop: 14 } as React.CSSProperties}>
          {OFFRE_PARTENARIAT.map((o) => (
            <div key={o.nom} className="offre">
              {o.vedette ? <span className="pastille pastille--orange">La plus choisie</span> : null}
              <h3 className="titre-bloc">{o.nom}</h3>
              <div className="offre__montant">{o.montant}</div>
              <ul className="liste-coches liste-coches--traits">
                {o.inclus.map((i) => (
                  <li key={i}>
                    <span aria-hidden="true">✓</span>
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40, paddingBottom: 88 }}>
        <div className="appel-orange">
          <div style={{ maxWidth: 700 }}>
            <h2 className="appel-orange__titre">Parlons de votre projet</h2>
            <p>
              La commission Partenaires vous présente la plaquette et construit avec vous la formule adaptée.{" "}
              {plaquette ? (
                <a href={plaquette} target="_blank" rel="noopener">
                  Télécharger la plaquette (PDF)
                  <NouvelOnglet />
                </a>
              ) : (
                "[À COMPLÉTER : lien vers la plaquette PDF.]"
              )}
            </p>
          </div>
          <Link href="/contact?sujet=partenariat" className="btn btn--xl btn--nuit">
            Contacter la commission
          </Link>
        </div>
      </section>
    </>
  );
}
