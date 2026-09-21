import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Photo } from "@/components/Photo";
import { BUREAU, COMMISSIONS, ENCADREMENT, HISTOIRE, PHOTOS, PROJET, STATS, VALEURS } from "@/data/nbb";
import { metaPage } from "@/lib/seo";
import { grille } from "@/lib/style";
import { enLettres, estACompleter, majuscule } from "@/lib/utils";

export const metadata = metaPage({
  titre: "Le club",
  description:
    "Histoire, valeurs et projet associatif du Nantes Breil Basket, club de basket du quartier Breil / Hauts-Pavés à Nantes : entraîneurs, bureau et commissions de bénévoles.",
  chemin: "/club",
});

export default function PageClub() {
  const bureauIncomplet = BUREAU.some((b) => estACompleter(b.nom));

  return (
    <div className="page">
      <PageHero
        kicker="Le club"
        title={
          <>
            Un club de quartier,
            <br />
            une ambition de club formateur
          </>
        }
      >
        <p className="lead">
          Association loi 1901 installée entre le Breil et les Hauts-Pavés, le Nantes Breil Basket fait jouer{" "}
          {STATS.adherents} adhérents dans {STATS.equipes} équipes. Ici, on vient apprendre le basket — et on reste
          pour l&apos;ambiance.
        </p>
      </PageHero>

      <section className="section section--club" aria-labelledby="histoire">
        <h2 id="histoire" className="title-section" style={{ marginBottom: 24 }}>
          Notre histoire
        </h2>
        <ol className="rows">
          {HISTOIRE.map((h, i) => (
            <li key={i} className="timeline-row">
              <p className="timeline-row__year">{h.annee}</p>
              <p className="text-soft pretty">{h.texte}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section section--club" aria-labelledby="valeurs">
        <h2 id="valeurs" className="title-section" style={{ marginBottom: 24 }}>
          Nos valeurs
        </h2>
        <div className="grid" style={grille(250)}>
          {VALEURS.map((v) => (
            <div key={v.titre} className="card">
              <h3 className="title-card" style={{ marginBottom: 10, lineHeight: 1.15 }}>
                {v.titre}
              </h3>
              <p className="text-muted text-md">{v.texte}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="projet" className="section section--club anchor-target" aria-labelledby="projet-titre">
        <div className="grid" style={grille(280, { gap: "clamp(24px, 4vw, 44px)", align: "center" })}>
          <div>
            <h2 id="projet-titre" className="title-section" style={{ marginBottom: 16 }}>
              Le projet associatif
            </h2>
            <p className="text-soft pretty">{PROJET.texte}</p>
            <div className="stack" style={{ marginTop: 22, gap: 10 }}>
              <div className="label-box label-box--accent">
                <span className="label-box__icon" aria-hidden="true">
                  ★★★
                </span>
                <p>
                  <strong>École de Mini-Basket 3 étoiles</strong> — label FFBB pour la qualité de l&apos;accueil des
                  plus jeunes.
                </p>
              </div>
              <div className="label-box">
                <span className="label-box__icon" aria-hidden="true">
                  ◆
                </span>
                <p>
                  <strong>Label Citoyen</strong> — {PROJET.labelCitoyen}
                </p>
              </div>
            </div>
          </div>
          <Photo photo={PHOTOS.club.photo} alt={PHOTOS.club.alt} className="club-photo" />
        </div>
      </section>

      <section className="section section--club" aria-labelledby="encadrement">
        <h2 id="encadrement" className="title-section" style={{ marginBottom: 10 }}>
          L&apos;équipe d&apos;encadrement
        </h2>
        <p className="intro">Les entraîneurs et entraîneuses qui animent les créneaux de la semaine.</p>
        <div className="grid" style={grille(280)}>
          {ENCADREMENT.map((c) => (
            <div key={c.prenom} className="card person">
              <Photo photo={c.photo} alt={`Portrait de ${c.prenom}`} className="portrait" sizes="88px" />
              <span>
                <span className="person__name">{c.prenom}</span>
                <span className="person__meta">
                  <span className="badge">{c.role}</span>
                  <span>Au club depuis {c.depuis}</span>
                </span>
                <span className="person__text">{c.presentation}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section id="bureau" className="section section--club anchor-target" aria-labelledby="bureau-titre">
        <h2 id="bureau-titre" className="title-section" style={{ marginBottom: 10 }}>
          Le bureau
        </h2>
        <p className="intro">
          {bureauIncomplet
            ? "Les fonctions sont prêtes : ajoutez les prénoms et noms des élus dans le fichier de contenu."
            : "Les élus bénévoles qui pilotent l'association."}
        </p>
        <div className="grid" style={grille(380)}>
          {BUREAU.map((b) => (
            <div key={b.role} className="card person">
              <Photo
                photo={b.photo}
                alt={estACompleter(b.nom) ? "" : `Portrait de ${b.nom}`}
                className="portrait"
                sizes="88px"
              />
              <span>
                <span className="person__name">{b.nom}</span>
                <span className="person__meta">
                  <span className="badge">{b.role}</span>
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--club" aria-labelledby="commissions">
        <h2 id="commissions" className="title-section" style={{ marginBottom: 10 }}>
          Les commissions
        </h2>
        <p className="intro">
          {COMMISSIONS.length > 1 ? `${majuscule(enLettres(COMMISSIONS.length))} commissions` : "Une commission"} de
          bénévoles se partagent le travail. Chacune cherche des bras : dites-nous celle qui vous tente.
        </p>
        <div className="grid" style={grille(300, { gap: "14px" })}>
          {COMMISSIONS.map((c) => (
            <div key={c.nom} className="card stack" style={{ borderRadius: 18, padding: 22, gap: 10, alignContent: "start" }}>
              <h3 className="title-card">{c.nom}</h3>
              <p className="text-soft text-sm pretty">{c.role}</p>
              {c.referent && (
                <p className="text-muted text-sm">
                  Référent : <strong style={{ color: "#fff" }}>{c.referent}</strong>
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="section section--club">
        <div className="cta-band">
          <div>
            <h2 className="title-section" style={{ fontSize: "clamp(24px, 3.6vw, 40px)" }}>
              Donner un coup de main ?
            </h2>
            <p className="text-soft" style={{ marginTop: 14, maxWidth: "34em" }}>
              Table de marque, arbitrage, transports, bar, photos, communication : deux heures de temps en temps, et
              le club tourne. Aucune compétence requise, on vous forme.
            </p>
          </div>
          <div className="cta-band__actions">
            <Link href="/contact?sujet=benevolat" className="btn btn--primary">
              Devenir bénévole
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

