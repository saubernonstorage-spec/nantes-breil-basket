import Link from "next/link";
import { Terrain } from "@/components/Terrain";

/**
 * Lignes de terrain communes aux en-têtes de page sans photo : deux tiers du terrain, sous le menu, à droite,
 * en fondu sur la moitié gauche (styles : .terrain--entete).
 */
export function TerrainEntete() {
  return <Terrain motif="angleLarge" className="terrain--entete" />;
}

/** En-tête sombre des pages intérieures : fil d'Ariane, grand titre, chapeau ; décor par défaut : TerrainEntete. */
export function EntetePage({
  fil,
  titre,
  chapo,
  decor,
  children,
  style,
  largeurTitre,
  largeurChapo,
  variante,
}: {
  fil: string;
  titre: React.ReactNode;
  chapo?: React.ReactNode;
  decor?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  largeurTitre?: number;
  largeurChapo?: number;
  /** « filtres » : un bloc chevauche le bas de l'en-tête (Entraînements, Matchs). */
  variante?: "filtres";
}) {
  return (
    <section className={variante ? `entete-page entete-page--${variante}` : "entete-page"} style={style}>
      {decor ?? <TerrainEntete />}
      <div className="entete-page__inner">
        <FilAriane page={fil} />
        <h1 className="titre-page" style={largeurTitre ? { maxWidth: largeurTitre } : undefined}>
          {titre}
        </h1>
        {chapo ? (
          <p className="chapo" style={largeurChapo ? { maxWidth: largeurChapo } : undefined}>
            {chapo}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}

export function FilAriane({ page }: { page: string }) {
  return (
    <nav aria-label="Fil d'Ariane" className="fil">
      <Link href="/">Accueil</Link> / {page}
    </nav>
  );
}

/** Surtitre orange + titre de section (+ texte d'accompagnement à droite). */
export function TeteSection({
  surtitre,
  titre,
  id,
  texte,
  lien,
  grand,
  equilibre,
  className = "",
}: {
  surtitre: React.ReactNode;
  titre: React.ReactNode;
  id?: string;
  texte?: React.ReactNode;
  lien?: React.ReactNode;
  /** Titres de l'accueil, un peu plus grands. */
  grand?: boolean;
  /** Lignes du titre de longueur égale (certains titres de l'accueil). */
  equilibre?: boolean;
  className?: string;
}) {
  const bloc = (
    <div>
      <div className="surtitre">{surtitre}</div>
      <h2 id={id} className={`titre-section${grand ? " titre-section--grand" : ""}${equilibre ? " equilibre" : ""}`}>
        {titre}
      </h2>
    </div>
  );
  if (!texte && !lien) return <div className={`tete-section tete-section--seule ${className}`}>{bloc}</div>;
  return (
    <div className={`tete-section ${className}`}>
      {bloc}
      {texte ? <p className="tete-section__texte">{texte}</p> : null}
      {lien}
    </div>
  );
}
