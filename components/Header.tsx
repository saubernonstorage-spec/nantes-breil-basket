"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Fenetre } from "@/components/Fenetre";
import { IconeFacebook, IconeInstagram, IconeWhatsapp, NouvelOnglet } from "@/components/icons";

const NAV = [
  { href: "/club", label: "Le club" },
  { href: "/ecoles", label: "Écoles" },
  { href: "/equipes", label: "Équipes" },
  { href: "/planning", label: "Entraînements" },
  { href: "/matchs", label: "Matchs", long: "Matchs & résultats" },
  { href: "/stages", label: "Stages" },
  { href: "/agenda", label: "Agenda" },
  { href: "/infos", label: "Infos pratiques" },
];

const NAV_COMPLET = [
  { href: "/", label: "Accueil" },
  ...NAV.map((n) => ({ href: n.href, label: n.long ?? n.label })),
  { href: "/inscriptions", label: "Inscriptions" },
  { href: "/galerie", label: "Galerie" },
  { href: "/partenaires", label: "Partenaires" },
  { href: "/contact", label: "Contact" },
];

export type LiensClub = { boutique: string; facebook: string; instagram: string; whatsapp: string };

export function Header({ liens }: { liens: LiensClub }) {
  const chemin = usePathname();
  const [ouvert, setOuvert] = useState(false);
  const fermer = () => setOuvert(false);

  return (
    <header className="entete-site">
      <a className="evitement" href="#contenu">
        Aller au contenu
      </a>
      <div className="entete-site__barre">
        <Link href="/" className="marque verre" aria-label="Nantes Breil Basket — retour à l'accueil">
          <span className="marque__rond">
            <Image src="/logo-nbb.png" alt="" width={38} height={31} loading="eager" />
          </span>
          <span className="marque__nom" aria-hidden="true">
            Nantes Breil
            <br />
            <span>Basket</span>
          </span>
        </Link>

        <nav aria-label="Navigation principale" className="nav-principale verre">
          {NAV.map((n) => {
            const actif = chemin === n.href || chemin.startsWith(`${n.href}/`);
            return (
              <Link key={n.href} href={n.href} aria-current={actif ? "page" : undefined} className="nav-principale__lien">
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="entete-site__actions">
          <a href={liens.boutique} target="_blank" rel="noopener" className="entete-site__boutique verre">
            Boutique
            <NouvelOnglet />
          </a>
          <Link href="/inscriptions" className="entete-site__rejoindre">
            <span className="entete-site__rejoindre-long">Rejoindre le club</span>
            <span className="entete-site__rejoindre-court">Rejoindre</span>
          </Link>
          <button
            type="button"
            className="burger verre"
            aria-expanded={ouvert}
            aria-controls="menu-mobile"
            aria-label="Ouvrir le menu"
            onClick={() => setOuvert(true)}
          >
            <span aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <Fenetre ouverte={ouvert} onFermer={fermer} className="menu-mobile" label="Menu" fermerSurFond={false}>
        <div id="menu-mobile" className="menu-mobile__contenu">
          <div className="menu-mobile__haut">
            <span className="menu-mobile__titre">Menu</span>
            {/* Premier élément focalisable : il reçoit le focus à l'ouverture. */}
            <button type="button" className="menu-mobile__fermer" aria-label="Fermer le menu" onClick={fermer}>
              ✕
            </button>
          </div>
          <nav aria-label="Navigation mobile" className="menu-mobile__nav">
            {NAV_COMPLET.map((n, i) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={fermer}
                aria-current={chemin === n.href ? "page" : undefined}
                style={{ "--i": i } as React.CSSProperties}
              >
                <span>{n.label}</span>
                <span className="menu-mobile__num">{String(i + 1).padStart(2, "0")}</span>
              </Link>
            ))}
          </nav>
          <div className="rangee rangee--10">
            <Link href="/inscriptions" onClick={fermer} className="btn btn--l btn--orange">
              Rejoindre le club
            </Link>
            <a href={liens.boutique} target="_blank" rel="noopener" className="btn btn--l btn--clair">
              Boutique
              <NouvelOnglet />
            </a>
          </div>
          <div className="rangee rangee--8">
            <a href={liens.facebook} target="_blank" rel="noopener" className="reseau">
              <IconeFacebook />
              Facebook
            </a>
            <a href={liens.instagram} target="_blank" rel="noopener" className="reseau">
              <IconeInstagram />
              Instagram
            </a>
            <a href={liens.whatsapp} target="_blank" rel="noopener" className="reseau">
              <IconeWhatsapp />
              Groupe WhatsApp
            </a>
          </div>
        </div>
      </Fenetre>
    </header>
  );
}
