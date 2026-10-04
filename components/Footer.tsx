import Image from "next/image";
import Link from "next/link";
import { CLUB, PARTENAIRES } from "@/data/nbb";
import { BandeauCookies, BoutonCookies } from "@/components/Cookies";
import { Photo } from "@/components/Photo";
import { IconeFacebook, IconeInstagram, IconeWhatsapp, NouvelOnglet } from "@/components/icons";
import { slug } from "@/lib/utils";

const COLONNES = [
  {
    titre: "Le club",
    liens: [
      { label: "Histoire & valeurs", href: "/club" },
      { label: "Bureau & commissions", href: "/club#bureau" },
      { label: "École de mini-basket", href: "/ecoles" },
      { label: "École d'arbitrage", href: "/ecoles#arbitrage" },
      { label: "Agenda", href: "/agenda" },
      { label: "Galerie", href: "/galerie" },
    ],
  },
  {
    titre: "Pratique",
    liens: [
      { label: "Planning des entraînements", href: "/planning" },
      { label: "Matchs & convocations", href: "/matchs" },
      { label: "Équipes", href: "/equipes" },
      { label: "Gymnases & accès", href: "/infos" },
      { label: "Stages vacances", href: "/stages" },
    ],
  },
  {
    titre: "Adhérer & soutenir",
    liens: [
      { label: "Inscriptions & tarifs", href: "/inscriptions" },
      { label: "Questions fréquentes", href: "/infos#faq" },
      { label: "Devenir bénévole", href: "/club#commissions" },
      { label: "Devenir partenaire", href: "/partenaires" },
      { label: "Boutique", href: CLUB.boutique, externe: true },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="pied">
      {/* Bande des partenaires, entre deux lignes ; le dessin de terrain commence en dessous. */}
      {PARTENAIRES.length ? (
        <div className="pied__inner pied__inner--partenaires">
          <ul className="pied__partenaires" aria-label="Partenaires du club">
            {PARTENAIRES.map((p) => {
              const contenu = (
                <>
                  {p.logo ? (
                    <span className={p.logoClair ? "pied__partenaire-logo" : "pied__partenaire-logo pied__partenaire-logo--fonce"}>
                      <Photo src={p.logo} alt="" sizes="120px" entiere />
                    </span>
                  ) : null}
                  {/* Avec un logo, seul le logo est visible (le nom reste lu par les lecteurs d'écran). */}
                  <span className={p.logo ? "sr-only" : undefined}>{p.nom}</span>
                </>
              );
              return (
                <li key={p.nom}>
                  {/* Mène à la carte de ce partenaire sur la page Partenaires (lien simple : la carte est bien ciblée et surlignée). */}
                  <a
                    href={`/partenaires#partenaire-${slug(p.nom)}`}
                    className={p.logo ? "pied__partenaire pied__partenaire--logo" : "pied__partenaire"}
                  >
                    {contenu}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div className="pied__corps">
        <div className="pied__inner">
          <div className="pied__question">
            <div>
              <div className="surtitre">Une question ?</div>
              <p className="pied__slogan">On vous répond.</p>
            </div>
            <div className="rangee rangee--10 pied__boutons">
              <Link href="/contact" className="btn btn--l btn--orange">
                Nous écrire
              </Link>
              <Link href="/infos#faq" className="btn btn--l btn--clair">
                Lire la FAQ
              </Link>
            </div>
          </div>

          <div className="pied__colonnes">
            <div className="pied__club">
              <div className="pied__marque">
                <span className="pied__logo">
                  <Image src="/logo-nbb.png" alt="Logo du Nantes Breil Basket" width={46} height={37} />
                </span>
                <span className="marque__nom pied__nom">
                  Nantes Breil
                  <br />
                  <span>Basket</span>
                </span>
              </div>
              <p className="pied__adresse">
                {CLUB.adresse.split("\n").map((ligne, n) => (
                  <span key={ligne}>
                    {n > 0 ? <br /> : null}
                    {ligne}
                  </span>
                ))}
              </p>
              <div className="rangee rangee--8">
                <a href={CLUB.facebook} target="_blank" rel="noopener" className="reseau reseau--petit">
                  <IconeFacebook />
                  Facebook
                  <NouvelOnglet />
                </a>
                <a href={CLUB.instagram} target="_blank" rel="noopener" className="reseau reseau--petit">
                  <IconeInstagram />
                  Instagram
                  <NouvelOnglet />
                </a>
                <a href={CLUB.whatsapp} target="_blank" rel="noopener" className="reseau reseau--petit">
                  <IconeWhatsapp />
                  WhatsApp
                  <NouvelOnglet />
                </a>
              </div>
            </div>
            {COLONNES.map((col) => (
              <nav key={col.titre} aria-label={col.titre} className="pied__col">
                <div className="pied__etiquette">{col.titre}</div>
                {col.liens.map((l) =>
                  "externe" in l ? (
                    <a key={l.label} href={l.href} target="_blank" rel="noopener">
                      {l.label}
                      <NouvelOnglet />
                    </a>
                  ) : (
                    <Link key={l.label} href={l.href}>
                      {l.label}
                    </Link>
                  ),
                )}
              </nav>
            ))}
          </div>

          <div aria-hidden="true" className="pied__geant">
            Nantes Breil
          </div>
        </div>
      </div>

      <div className="pied__bas">
        <div className="pied__bas-inner">
          <span>© {new Date().getFullYear()} Nantes Breil Basket — association loi 1901</span>
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/mentions-legales#confidentialite">Confidentialité</Link>
          <BoutonCookies className="lien-bouton">Gérer les cookies</BoutonCookies>
          <Link href="/espace-dirigeants" className="pied__dirigeants" prefetch={false}>
            Espace dirigeants
          </Link>
        </div>
      </div>
      <BandeauCookies />
    </footer>
  );
}
