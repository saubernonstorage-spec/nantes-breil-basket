import { CLUB } from "@/data/nbb";

/** Données structurées schema.org (SportsClub) pour les moteurs de recherche. */
export function JsonLdClub() {
  const [, rue, cpVille] = CLUB.adresse.split("\n");
  const [codePostal, ...ville] = (cpVille ?? "").split(" ");
  const donnees = {
    "@context": "https://schema.org",
    "@type": "SportsClub",
    name: CLUB.nom,
    sport: "Basketball",
    url: CLUB.siteUrl,
    logo: `${CLUB.siteUrl}/logo-nbb.png`,
    foundingDate: CLUB.fondation,
    address: {
      "@type": "PostalAddress",
      streetAddress: rue,
      postalCode: codePostal,
      addressLocality: ville.join(" "),
      addressCountry: "FR",
    },
    sameAs: [CLUB.facebook, CLUB.instagram, CLUB.linkedin],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(donnees).replace(/</g, "\\u003c") }}
    />
  );
}
