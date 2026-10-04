import Image from "next/image";

/** Mots trop courants pour des initiales (« Basket Club Rezé 2 » → « R »). */
const MOTS_COMMUNS = /^(basket|club|ball|bc|de|du|des|la|le|les|et|\d+)$/i;

function initialesClub(nom: string): string {
  const mots = nom.split(/[\s\-.'/()]+/).filter((m) => m && !MOTS_COMMUNS.test(m));
  return mots
    .slice(0, 2)
    .map((m) => m[0].toUpperCase())
    .join("");
}

/**
 * Logo d'un club (public/logos/, récupéré chaque nuit à la FFBB), ou ses initiales s'il est inconnu.
 * Décoratif : le nom du club est toujours écrit à côté.
 */
export function LogoClub({ logo, nom, taille = 40 }: { logo: string; nom: string; taille?: number }) {
  return (
    <span className="logo-club" style={{ width: taille, height: taille }} aria-hidden="true">
      {logo ? (
        // Déjà réduits en WebP 160 px par le script : pas besoin de l'optimiseur d'images.
        <Image src={logo} alt="" width={taille} height={taille} unoptimized />
      ) : (
        <span className="logo-club__initiales" style={{ fontSize: Math.round(taille * 0.4) }}>
          {initialesClub(nom)}
        </span>
      )}
    </span>
  );
}
