"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/* Icônes de la barre d'accès rapide (décoratives : le libellé suffit). */
const ICONES: Record<string, React.ReactNode> = {
  planning: (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4.5" width="18" height="16" rx="3" />
      <path d="M3 9.5h18M8 3v3M16 3v3M7.5 13.5h3M13.5 13.5h3M7.5 17h3" />
    </svg>
  ),
  matchs: (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3v18M5.6 5.6c3 2.8 3 10 0 12.8M18.4 5.6c-3 2.8-3 10 0 12.8" />
    </svg>
  ),
  agenda: (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z" />
    </svg>
  ),
  contact: (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  ),
};

const ACCES = [
  { href: "/planning", label: "Entraînements", icone: "planning" },
  { href: "/matchs", label: "Matchs", icone: "matchs" },
  { href: "/agenda", label: "Agenda", icone: "agenda" },
  { href: "/contact", label: "Contact", icone: "contact" },
];

/**
 * Barre d'accès rapide en bas de l'écran, sur téléphone seulement : les quatre pages les plus consultées par
 * les familles. La page en cours est mise en évidence. Absente de l'Espace dirigeants et à l'impression.
 */
export function BarreAcces() {
  const chemin = usePathname();
  if (chemin.startsWith("/espace-dirigeants")) return null;
  return (
    <nav aria-label="Accès rapide" className="barre-acces" data-noprint="" style={{ viewTransitionName: "barre-acces" }}>
      {ACCES.map((a) => {
        const actif = chemin === a.href || chemin.startsWith(`${a.href}/`);
        return (
          <Link key={a.href} href={a.href} className="barre-acces__lien" aria-current={actif ? "page" : undefined}>
            {ICONES[a.icone]}
            <span>{a.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/** Bouton « Haut de page », visible après un défilement d'environ un écran et demi. */
export function BoutonHaut() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const verifier = () => setVisible(window.scrollY > window.innerHeight * 1.5);
    window.addEventListener("scroll", verifier, { passive: true });
    return () => window.removeEventListener("scroll", verifier);
  }, []);
  return (
    <button
      type="button"
      className={visible ? "bouton-haut bouton-haut--visible" : "bouton-haut"}
      aria-label="Revenir en haut de la page"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      data-noprint=""
      onClick={() => {
        window.scrollTo({ top: 0 });
        document.getElementById("contenu")?.focus({ preventScroll: true });
      }}
    >
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}

/**
 * Sommaire collant sous l'en-tête (pages longues) : une pastille par section ; celle qui est à l'écran est
 * mise en évidence. Défile horizontalement sur téléphone.
 */
export function Sommaire({ sections, label }: { sections: { id: string; titre: string }[]; label: string }) {
  const [actif, setActif] = useState(sections[0]?.id ?? "");
  const cle = sections.map((s) => s.id).join("|");
  useEffect(() => {
    const ids = cle.split("|").filter(Boolean);
    const observateur = new IntersectionObserver(
      (entrees) => {
        const vue = entrees.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (vue) setActif(vue.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observateur.observe(el);
    });
    return () => observateur.disconnect();
  }, [cle]);
  if (sections.length < 2) return null;
  return (
    <nav aria-label={label} className="sommaire" data-noprint="">
      <ul>
        {sections.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`} aria-current={actif === s.id ? "location" : undefined}>
              {s.titre}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
