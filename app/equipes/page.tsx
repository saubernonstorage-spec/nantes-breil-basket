import type { Metadata } from "next";
import Link from "next/link";
import { CLUB, STATS } from "@/data/nbb";
import { equipesParCategorie, toutesLesEquipes } from "@/lib/nbb";
import { EntetePage } from "@/components/Page";
import { BoutonClassement, ZoomPhoto } from "@/components/EquipeFenetres";
import { Sommaire } from "@/components/Navigation";

export const metadata: Metadata = {
  title: `Nos équipes ${CLUB.saison}`,
  description:
    "Les équipes du Nantes Breil Basket : micro-basket, U7, U9, U11, U13, U15, U18, seniors et loisirs. Entraîneurs, horaires, gymnases et cotisation de chaque équipe.",
  alternates: { canonical: "/equipes" },
};

export default function Equipes() {
  const groupes = equipesParCategorie();

  return (
    <>
      <EntetePage
        fil={`Équipes · saison ${CLUB.saison}`}
        titre={
          <>
            Nos <span className="accent">équipes</span>
          </>
        }
        chapo={`${STATS.equipes} équipes engagées en championnat et ${toutesLesEquipes().length} groupes à l'entraînement. Retrouvez ici la photo d'équipe, son encadrement, ses horaires d'entraînement et son classement.`}
      />

      <div className="section" style={{ paddingTop: 24, paddingBottom: 88 }}>
        <Sommaire label="Catégories d'équipes" sections={groupes.map((g) => ({ id: g.cle, titre: g.nom }))} />
        {groupes.map((g) => (
          <section key={g.cle} id={g.cle} aria-labelledby={`t-${g.cle}`} className="groupe-equipes">
            <div className="groupe-equipes__tete">
              <div>
                <div className="surtitre">
                  {g.ages} · {g.nb}
                </div>
                <h2 id={`t-${g.cle}`} className="titre-section" style={{ fontSize: "clamp(40px, 5vw, 68px)" }}>
                  {g.nom}
                </h2>
              </div>
              <p className="tete-section__texte" style={{ maxWidth: 460 }}>
                {g.resume}
              </p>
            </div>
            <div className="grille grille--remplir" style={{ "--min": "310px", gap: 16 } as React.CSSProperties}>
              {g.equipes.map((t) => (
                <article key={t.nom} id={t.ancre} className="equipe">
                  {/* Sans photo : une bande compacte plutôt qu'un grand motif de terrain. */}
                  <div className={t.photo ? "equipe__photo" : "equipe__photo equipe__photo--bande"}>
                    {t.photo ? <ZoomPhoto src={t.photo} nom={t.nom} libelle={t.libelle} /> : null}
                    <span className="equipe__nom">{t.nom}</span>
                    {t.ctc ? <span className="equipe__ctc">CTC · La Similienne</span> : null}
                  </div>
                  <div className="equipe__corps">
                    <div>
                      <h3 className="equipe__libelle">{t.libelle}</h3>
                      {t.coachs ? (
                        <div className="equipe__coach">
                          Encadrement : <strong>{t.coachs}</strong>
                        </div>
                      ) : null}
                    </div>
                    <ul className="equipe__creneaux">
                      {t.creneaux.map((c) => (
                        <li key={`${c.jour}-${c.horaire}`}>
                          <strong>{c.jour}</strong>
                          <span>
                            {c.horaire} ·{" "}
                            <Link href={c.lienGymnase} className="lien-orange">
                              {c.gymnase}
                            </Link>
                          </span>
                        </li>
                      ))}
                    </ul>
                    <BoutonClassement libelle={t.libelle} classement={t.classement} lienFFBB={CLUB.ffbb} />
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        <div className="rangee" style={{ marginTop: 56 }}>
          <div className="encart encart--bleu">
            <h2 className="titre-bloc" style={{ fontSize: 28, marginBottom: 8 }}>
              Groupes CTC
            </h2>
            <p>
              Les groupes U13, U15 et U18 « HPB » évoluent en CTC (Coopération Territoriale de Clubs) avec La Similienne,
              avec 3 entraînements par semaine et une perspective de championnat accès région. Les places y sont
              attribuées sur sélection de la Commission technique.
            </p>
          </div>
          <div className="encart encart--blanc">
            <h2 className="titre-bloc" style={{ fontSize: 28, marginBottom: 8 }}>
              Droit à l'image
            </h2>
            <p>
              Les photos d'équipe ne sont publiées qu'avec l'autorisation de droit à l'image de chaque joueur mineur. Une
              photo à retirer ? <Link href="/contact?sujet=image">Écrivez-nous</Link>, c'est fait sous 48 h.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
