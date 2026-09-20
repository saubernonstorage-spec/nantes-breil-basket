import Link from "next/link";
import { CLUB, NAV_LINKS } from "@/data/club";

export function Footer() {
  const year = new Date().getFullYear();
  const hasContact =
    CLUB.email || CLUB.phone || CLUB.address || CLUB.facebook || CLUB.instagram;

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="footer-title">{CLUB.name}</p>
          <p className="footer-text">{CLUB.tagline}</p>
        </div>

        <nav aria-label="Pied de page">
          <p className="footer-heading">Le site</p>
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {hasContact && (
          <div>
            <p className="footer-heading">Contact</p>
            <ul>
              {CLUB.email && (
                <li>
                  <a href={`mailto:${CLUB.email}`}>{CLUB.email}</a>
                </li>
              )}
              {CLUB.phone && (
                <li>
                  <a href={`tel:${CLUB.phone.replace(/\s/g, "")}`}>
                    {CLUB.phone}
                  </a>
                </li>
              )}
              {CLUB.facebook && (
                <li>
                  <a href={CLUB.facebook} target="_blank" rel="noopener noreferrer">
                    Facebook
                  </a>
                </li>
              )}
              {CLUB.instagram && (
                <li>
                  <a href={CLUB.instagram} target="_blank" rel="noopener noreferrer">
                    Instagram
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      <p className="container footer-legal">
        © {year} {CLUB.name}
      </p>
    </footer>
  );
}
