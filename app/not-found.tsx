import Link from "next/link";

export const metadata = { title: "Page introuvable" };

export default function PageIntrouvable() {
  return (
    <div className="page not-found">
      <div>
        <p className="not-found__code" aria-hidden="true">
          404
        </p>
        <h1 className="title-page" style={{ fontSize: "clamp(28px, 4vw, 44px)", marginTop: 12 }}>
          Air ball : page introuvable
        </h1>
        <p className="lead" style={{ marginLeft: "auto", marginRight: "auto" }}>
          Cette page n&apos;existe pas ou a changé d&apos;adresse. Reprenez le jeu depuis l&apos;accueil ou le planning.
        </p>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <Link href="/" className="btn btn--primary">
            Retour à l&apos;accueil
          </Link>
          <Link href="/planning" className="btn btn--ghost">
            Voir le planning
          </Link>
        </div>
      </div>
    </div>
  );
}
