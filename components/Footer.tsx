import Image from "next/image";
import Link from "next/link";
import { CLUB, PARTENAIRES } from "@/data/nbb";
import { BandeauCookies, BoutonCookies } from "@/components/Cookies";
import { Terrain } from "@/components/Terrain";
import { IconeFacebook, IconeInstagram, IconeWhatsapp, NouvelOnglet } from "@/components/icons";

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
      <Terrain motif="bout" className="pied__terrain" />
      <div className="pied__inner">
        <div className="pied__partenaires">
          <span className="pied__etiquette">Partenaires</span>
          {PARTENAIRES.map((p) => (
            <Link key={p.nom} href="/partenaires" className="pied__partenaire">
              {p.nom}
            </Link>
          ))}
          <Link href="/partenaires" className="btn btn--s btn--petit btn--orange pied__devenir">
            Devenir partenaire
          </Link>
        </div>

        <div className="pied__question">
          <div>
            <div className="surtitre">Une question ?</div>
            <p className="pied__slogan">On vous répond.</p>
          </div>
          <div className="rangee rangee--10">
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
              Association loi 1901
              {CLUB.adresse.split("\n").map((ligne) => (
                <span key={ligne}>
                  <br />
                  {ligne}
                </span>
              ))}
            </p>
            <a href={`mailto:${CLUB.email}`} className="pied__email">
              {CLUB.email}
            </a>
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
