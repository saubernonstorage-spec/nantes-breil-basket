import Link from "next/link";
import { Terrain } from "@/components/Terrain";

export default function PageIntrouvable() {
  return (
    <section className="entete-page introuvable">
      <Terrain motif="raquette" style={{ top: 0, left: "50%", width: "min(90%, 640px)", transform: "translateX(-50%)" }} />
      <div className="entete-page__inner" style={{ textAlign: "center" }}>
        <div className="introuvable__code">404</div>
        <h1 className="titre-page">
          Hors du <span className="accent">terrain</span>
        </h1>
        <p className="chapo" style={{ margin: "0 auto 28px" }}>
          Cette page n'existe pas ou a changé d'adresse. Reprenez le jeu depuis l'accueil ou le planning.
        </p>
        <div className="rangee rangee--10" style={{ justifyContent: "center" }}>
          <Link href="/" className="btn btn--l btn--orange">
            Retour à l'accueil
          </Link>
          <Link href="/planning" className="btn btn--l btn--clair">
            Planning des entraînements
          </Link>
        </div>
      </div>
    </section>
  );
}
