import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLdClub } from "@/components/JsonLdClub";
import { Photo } from "@/components/Photo";
import { SmartLink } from "@/components/SmartLink";
import { TrouveTonCreneau } from "@/components/TrouveTonCreneau";
import { ACTUS, AGENDA, ARBITRAGE, CLUB, GYMNASES, PARTENAIRES, PHOTOS, STATS } from "@/data/nbb";
import { equipesParCategorie, gymnasesUtilises, nbGroupes, saisonCourte, toutesLesEquipes } from "@/lib/nbb";
import { grille, vars } from "@/lib/style";
import { estLienExterne, estPhoto, lienGymnase, lienTelephone, pluriel } from "@/lib/utils";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Accueil() {
  const nbGymnases = gymnasesUtilises().length;
  const stats = [
    { valeur: STATS.adherents, label: `adhérents en ${saisonCourte()}` },
    { valeur: STATS.equipes, label: "équipes engagées" },
    { valeur: String(nbGymnases), label: "gymnases à Nantes" },
  ];
  const photoHero = estPhoto(PHOTOS.accueil.photo) ? PHOTOS.accueil.photo.trim() : null;

  return (
    <div className="page">
      <JsonLdClub />

      {/* ---------- Bandeau d'accroche ---------- */}
      <section className="hero">
        {photoHero ? (
          <Image
            src={photoHero}
            alt={PHOTOS.accueil.alt}
            fill
            preload
            sizes="100vw"
            className="hero__img"
            unoptimized={estLienExterne(photoHero)}
          />
        ) : (
          <div className="hero__stripes" aria-hidden="true" />
        )}
        <div className="hero__shade" aria-hidden="true" />
        {!photoHero && (
          <p className="hero__label" aria-hidden="true">
            {PHOTOS.accueil.photo}
          </p>
        )}

        <div className="hero__content">
          <p className="label-tag">
            <span aria-hidden="true">★★★</span>
            <span>
              École de mini-basket — label FFBB<span className="visually-hidden"> 3 étoiles</span>
            </span>
          </p>
          <h1 className="hero__title">
            Viens dribbler
            <br />
            dans ton quartier
          </h1>
          <p className="hero__lead">
            Du micro-basket dès 3 ans aux seniors, en passant par les loisirs :{" "}
            <strong>
              {STATS.adherents} adhérents, {STATS.equipes} équipes et {nbGymnases} gymnases
            </strong>{" "}
            à Nantes. Il y a forcément un créneau pour toi.
          </p>
          <div className="btn-row">
            <Link href="/inscriptions" className="btn btn--primary btn--lg">
              Rejoindre le club
            </Link>
            <Link href="/stages" className="btn btn--outline btn--lg">
              <span className="dot" aria-hidden="true" />
              Stages vacances
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Chiffres clés ---------- */}
      <section className="stats" aria-label="Le club en chiffres">
        <ul className="stats__list">
          {stats.map((s) => (
            <li key={s.label}>
              <span className="stats__value">{s.valeur}</span>
              <span className="stats__label">{s.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Accès rapides ---------- */}
      <section className="section section--home" aria-label="Accès rapides">
        <div className="grid" style={grille(260)}>
          <div className="quick-card quick-card--featured">
            <p className="kicker kicker--card">Le plus demandé</p>
            <h2 className="quick-card__title">Trouve ton créneau</h2>
            <TrouveTonCreneau equipes={toutesLesEquipes()} />
          </div>

          <div className="quick-card">
            <p className="kicker kicker--card">Où l&apos;on joue</p>
            <h2 className="quick-card__title" style={{ marginBottom: 14 }}>
              Nos gymnases
            </h2>
            <ul className="chips">
              {GYMNASES.map((g) => (
                <li key={g.nom} style={{ display: "flex" }}>
                  <Link href={lienGymnase(g.nom)} className="chip">
                    {g.nom}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="quick-card__foot" style={{ paddingTop: 16 }}>
              <Link href="/infos" className="link-underline">
                Adresses et accès <span className="fleche" aria-hidden="true">→</span>
              </Link>
            </p>
          </div>

          <div className="quick-card" style={{ gap: 14 }}>
            <div>
              <p className="kicker kicker--card">Aux couleurs du club</p>
              <h2 className="quick-card__title" style={{ marginBottom: 10 }}>
                La boutique
              </h2>
              <p className="text-muted text-sm">
                Maillots, sweats et accessoires NBB, à commander en ligne sur la boutique officielle du club.
              </p>
            </div>
            <SmartLink href={CLUB.boutique} className="btn btn--primary btn--block quick-card__foot">
              Aller à la boutique <span className="fleche fleche--diag" aria-hidden="true">↗</span>
            </SmartLink>
          </div>
        </div>
      </section>

      {/* ---------- Actualités et agenda ---------- */}
      <section className="section section--home">
        <div className="grid" style={grille(300, { gap: "clamp(24px, 4vw, 44px)", align: "start" })}>
          <div>
            <h2 className="title-section">Dernières actus</h2>
            <ul className="rows" style={{ marginTop: 18 }}>
              {ACTUS.slice(0, 3).map((n) => (
                <li key={n.titre}>
                  <SmartLink href={n.lien} className="list-item">
                    <Photo photo={n.photo} alt="" label="PHOTO" className="list-item__thumb" sizes="84px" />
                    <span>
                      <span className="list-item__tag">{n.tag}</span>
                      <span className="list-item__title">{n.titre}</span>
                    </span>
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="section-head section-head--baseline">
              <h2 className="title-section">Agenda</h2>
              <Link href="/calendrier" className="link-underline text-sm">
                Calendrier complet <span className="fleche" aria-hidden="true">→</span>
              </Link>
            </div>
            <ul className="rows" style={{ marginTop: 18 }}>
              {AGENDA.slice(0, 4).map((a) => (
                <li key={a.titre} className="list-item">
                  <span className="date-badge">{a.date}</span>
                  <span>
                    <span className="list-item__title" style={{ marginTop: 0 }}>
                      {a.titre}
                    </span>
                    <span className="list-item__meta">{a.lieu}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- École de basket ---------- */}
      <section className="ecole">
        <div className="ecole__inner">
          <div className="ecole__grid">
            <div>
              <p className="kicker kicker--bold">Notre école de basket</p>
              <h2 className="ecole__title">
                Trois étoiles
                <br />
                au-dessus du panier
              </h2>
              <p className="ecole__text">
                Le NBB est labellisé <strong>École de Mini-Basket 3 étoiles</strong> par la FFBB. Du micro-basket
                (3-5 ans) aux U11, vos enfants progressent le samedi matin au gymnase Joël Paon, encadrés par des
                éducateurs identifiés sur le planning.
              </p>
              <div className="btn-row">
                <Link href="/inscriptions" className="btn btn--dark">
                  Inscrire mon enfant
                </Link>
                <Link href="/club#projet" className="btn btn--dark-outline">
                  Découvrir le label
                </Link>
              </div>
            </div>

            <div className="ecole__visual">
              <Photo photo={PHOTOS.ecole.photo} alt={PHOTOS.ecole.alt} className="ecole__photo" />
              <p className="ecole__stamp">
                <span aria-hidden="true">★★★</span>
                <span className="ecole__stamp-text">
                  Label FFBB<span className="visually-hidden"> 3 étoiles</span>
                </span>
              </p>
            </div>
          </div>

          <ul className="ecole__features">
            <li className="feature">
              <span className="feature__icon" aria-hidden="true">
                ★★★
              </span>
              <span>
                <span className="feature__title">Label 3 étoiles</span>
                <span className="feature__text">École de mini-basket reconnue par la FFBB</span>
              </span>
            </li>
            <li className="feature">
              <span className="feature__icon feature__icon--num" aria-hidden="true">
                3
              </span>
              <span>
                <span className="feature__title">Dès 3 ans</span>
                <span className="feature__text">Âge d&apos;entrée au micro-basket</span>
              </span>
            </li>
            <li className="feature">
              <span className="feature__icon feature__icon--txt" aria-hidden="true">
                Sam
              </span>
              <span>
                <span className="feature__title">Samedi matin</span>
                <span className="feature__text">Au gymnase Joël Paon</span>
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* ---------- École d'arbitrage ---------- */}
      <section className="section section--home" aria-labelledby="arbitrage">
        <p className="kicker kicker--bold">Arbitrage</p>
        <h2 id="arbitrage" className="title-section title-section--lg">
          L&apos;école d&apos;arbitrage
        </h2>
        <p className="text-soft pretty" style={{ margin: "14px 0 26px", maxWidth: "46em", fontSize: 18 }}>
          {ARBITRAGE.intro}
        </p>
        <div className="grid" style={grille(300, { align: "start" })}>
          <div className="card">
            <h3 className="title-card card__title">Nos objectifs</h3>
            <ul className="arrowlist">
              {ARBITRAGE.objectifs.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h3 className="title-card card__title">Formation interne</h3>
            <div className="stack" style={vars({ "--gap": "12px" })}>
              {ARBITRAGE.formation.map((p) => (
                <p key={p} className="text-soft text-md pretty">
                  {p}
                </p>
              ))}
            </div>
          </div>
          <div className="card card--accent">
            <h3 className="title-card" style={{ marginBottom: 6 }}>
              {ARBITRAGE.seancesTitre}
            </h3>
            <p className="text-muted text-sm" style={{ marginBottom: 14 }}>
              {ARBITRAGE.seancesIntro}
            </p>
            <ul className="seances stack" style={vars({ "--gap": "8px" })}>
              {ARBITRAGE.seances.map((s) => (
                <li key={s.date}>
                  <strong>{s.date}</strong>
                  <span className="text-muted">{s.lieu}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="card row-between" style={{ marginTop: 16, gap: 18 }}>
          <p className="text-soft text-md pretty" style={{ maxWidth: "44em" }}>
            Envie de devenir arbitre officiel, OTM, ou simplement d&apos;en savoir plus sur les formations du club et du
            comité&nbsp;? Contactez <strong style={{ color: "#fff" }}>{ARBITRAGE.contact.nom}</strong> —{" "}
            <a href={`mailto:${ARBITRAGE.contact.email}`}>{ARBITRAGE.contact.email}</a> ·{" "}
            <a href={lienTelephone(ARBITRAGE.contact.telephone)}>{ARBITRAGE.contact.telephone}</a>
          </p>
          <SmartLink href={ARBITRAGE.memo} className="btn btn--primary btn--md" style={{ whiteSpace: "nowrap" }}>
            Mémo de l&apos;arbitrage (PDF)
          </SmartLink>
        </div>
      </section>

      {/* ---------- Équipes ---------- */}
      <section className="section section--home">
        <div className="section-head">
          <div>
            <h2 className="title-section title-section--lg">Nos équipes</h2>
            <p className="text-muted text-md" style={{ marginTop: 8 }}>
              {STATS.equipes} équipes engagées en championnat · {nbGroupes()} groupes à l&apos;entraînement
            </p>
          </div>
          <Link href="/equipes" className="link-underline">
            Toutes les fiches équipes <span className="fleche" aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="grid" style={grille(230)}>
          {equipesParCategorie().map((c) => (
            <Link key={c.cle} href={`/equipes#${c.cle}`} className="cat-card">
              <Photo photo={c.photo} alt="" className="cat-card__photo" sizes="(max-width: 600px) 100vw, 25vw" />
              <span className="cat-card__body">
                <span className="cat-card__name">{c.nom}</span>
                <span className="cat-card__meta">
                  {c.ages} · {pluriel(c.equipes.length, "groupe")}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Partenaires ---------- */}
      <section className="section section--home" aria-labelledby="partenaires">
        <h2 id="partenaires" className="kicker kicker--muted" style={{ marginBottom: 20 }}>
          Ils soutiennent le club
        </h2>
        <ul className="grid" style={grille(170, { gap: "14px" })}>
          {PARTENAIRES.map((p) => (
            <li key={p.nom}>
              <Link href="/partenaires" className="partner-tile">
                {estPhoto(p.logo) ? (
                  <Image
                    src={p.logo.trim()}
                    alt={p.nom}
                    width={160}
                    height={70}
                    style={{ objectFit: "contain", width: "100%", height: 70 }}
                    unoptimized={estLienExterne(p.logo)}
                  />
                ) : (
                  p.nom
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
