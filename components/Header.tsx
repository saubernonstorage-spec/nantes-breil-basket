"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IconMenu } from "./icons";

const NAV = [
  { href: "/club", label: "Le club" },
  { href: "/equipes", label: "Équipes" },
  { href: "/planning", label: "Planning" },
  { href: "/calendrier", label: "Calendrier" },
  { href: "/infos", label: "Infos" },
  { href: "/contact", label: "Contact" },
];

const NAV_MOBILE = [
  { href: "/", label: "Accueil" },
  ...NAV,
  { href: "/stages", label: "Stages vacances" },
  { href: "/galerie", label: "Galerie" },
  { href: "/partenaires", label: "Partenaires" },
];

export function Header() {
  const pathname = usePathname();
  const [ouvert, setOuvert] = useState(false);
  const [page, setPage] = useState(pathname);
  const bouton = useRef<HTMLButtonElement>(null);

  // Referme le menu mobile à chaque changement de page.
  if (page !== pathname) {
    setPage(pathname);
    setOuvert(false);
  }

  useEffect(() => {
    if (!ouvert) return;
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOuvert(false);
        bouton.current?.focus();
      }
    };
    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  }, [ouvert]);

  const courant = (href: string) =>
    (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)) ? "page" : undefined;
  const fermer = () => setOuvert(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand" aria-label="Nantes Breil Basket — accueil">
          <span className="brand__logo">
            <Image src="/logo-nbb.png" alt="" width={48} height={39} loading="eager" />
          </span>
          <span className="brand__name" aria-hidden="true">
            Nantes Breil
            <br />
            Basket
          </span>
        </Link>

        <nav className="nav-desktop" aria-label="Navigation principale">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} aria-current={courant(item.href)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <span className="header-actions">
          <Link href="/stages" className="header-stages" aria-current={courant("/stages")}>
            <span className="dot" aria-hidden="true" />
            <span className="only-desktop">Stages vacances</span>
            <span className="only-mobile">Stages</span>
          </Link>
          <Link href="/inscriptions" className="header-join">
            Rejoindre le club
          </Link>
          <button
            ref={bouton}
            type="button"
            className="menu-toggle only-mobile"
            aria-controls="nav-mobile"
            aria-expanded={ouvert}
            aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOuvert((o) => !o)}
          >
            <IconMenu open={ouvert} />
          </button>
        </span>
      </div>

      <nav id="nav-mobile" className="nav-mobile" aria-label="Navigation mobile" hidden={!ouvert}>
        <Link href="/inscriptions" className="nav-mobile__join" onClick={fermer}>
          Rejoindre le club
        </Link>
        {NAV_MOBILE.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="nav-mobile__link"
            aria-current={courant(item.href)}
            onClick={fermer}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
