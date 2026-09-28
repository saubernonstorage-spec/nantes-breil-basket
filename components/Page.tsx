import Link from "next/link";

/** En-tête sombre des pages intérieures : fil d'Ariane, grand titre, chapeau. */
export function EntetePage({
  fil,
  titre,
  chapo,
  decor,
  children,
  style,
  largeurTitre,
  largeurChapo,
}: {
  fil: string;
  titre: React.ReactNode;
  chapo?: React.ReactNode;
  decor?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  largeurTitre?: number;
  largeurChapo?: number;
}) {
  return (
    <section className="entete-page" style={style}>
      {decor}
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
