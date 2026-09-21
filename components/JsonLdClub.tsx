import { CLUB, GYMNASES } from "@/data/nbb";
import { estACompleter, estEmail } from "@/lib/utils";

/**
 * Données structurées (schema.org) pour le référencement local :
 * Google comprend qu'il s'agit d'un club de basket à Nantes.
 * Les informations encore « [À COMPLÉTER] » sont simplement omises.
 */
export function JsonLdClub() {
  const principal = GYMNASES[0];
  const adresse =
    principal && !estACompleter(principal.adresse) ? principal.adresse.match(/^(.*),\s*(\d{5})\s+(.+)$/) : null;

  const donnees: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SportsClub",
    name: CLUB.nom,
    alternateName: CLUB.sigle,
    url: CLUB.siteUrl,
    logo: `${CLUB.siteUrl}/logo-nbb.png`,
    image: `${CLUB.siteUrl}/logo-nbb.png`,
    description: `Club de basket associatif du quartier ${CLUB.quartier} à ${CLUB.ville}. École de mini-basket labellisée 3 étoiles par la FFBB.`,
    sport: "Basketball",
    areaServed: { "@type": "City", name: CLUB.ville },
    sameAs: [CLUB.facebook, CLUB.instagram].filter((u) => u.startsWith("http")),
  };

  if (adresse) {
    donnees.address = {
      "@type": "PostalAddress",
      streetAddress: adresse[1],
      postalCode: adresse[2],
      addressLocality: adresse[3],
      addressCountry: "FR",
    };
  }
  if (principal?.lat && principal?.lon) {
    donnees.geo = { "@type": "GeoCoordinates", latitude: principal.lat, longitude: principal.lon };
  }
  if (!estACompleter(CLUB.email) && estEmail(CLUB.email)) donnees.email = CLUB.email.trim();
  if (!estACompleter(CLUB.telephone)) donnees.telephone = CLUB.telephone;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(donnees).replace(/</g, "\\u003c") }}
    />
  );
}
