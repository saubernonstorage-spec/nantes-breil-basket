import Image from "next/image";
import { CLUB } from "@/data/nbb";
import { GererCookies } from "./CookieBanner";
import { SmartLink } from "./SmartLink";
import { Socials } from "./Socials";

const COLONNES = [
  {
    titre: "Le club",
    liens: [
      { href: "/club", label: "Histoire et valeurs" },
      { href: "/club#bureau", label: "Bureau et bénévoles" },
      { href: "/equipes", label: "Nos équipes" },
      { href: "/galerie", label: "Galerie photos" },
    ],
  },
  {
    titre: "Pratique",
    liens: [
      { href: "/planning", label: "Planning des entraînements" },
      { href: "/calendrier", label: "Calendrier et résultats" },
      { href: "/inscriptions", label: "Inscriptions et tarifs" },
      { href: "/stages", label: "Stages des vacances" },
      { href: CLUB.boutique, label: "Boutique du club" },
    ],
  },
  {
    titre: "Informations",
    liens: [
      { href: "/infos", label: "Salles et accès" },
      { href: "/partenaires", label: "Devenir partenaire" },
      { href: "/contact", label: "Nous contacter" },
      { href: "/mentions-legales", label: "Mentions légales & RGPD" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div>
          <span className="footer-logo">
            <Image src="/logo-nbb.png" alt="" width={701} height={570} />
          </span>
          <p className="footer-name">{CLUB.nom}</p>
          <p className="footer-address">
            Quartier {CLUB.quartier} · {CLUB.ville}
            <br />
            {CLUB.adresse}
          </p>
          <Socials compact />
        </div>
        {COLONNES.map((col) => (
          <nav key={col.titre} className="footer-col" aria-label={col.titre}>
            <p className="footer-col__title">{col.titre}</p>
            <ul>
              {col.liens.map((l) => (
                <li key={l.label}>
                  <SmartLink href={l.href}>{l.label}</SmartLink>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="site-footer__bottom">
        <div className="site-footer__bottom-inner">
          <p>
            © {new Date().getFullYear()} {CLUB.nom} — association loi 1901 · Photos des mineurs publiées avec
            autorisation de droit à l&apos;image.
          </p>
          <GererCookies />
        </div>
      </div>
    </footer>
  );
}
