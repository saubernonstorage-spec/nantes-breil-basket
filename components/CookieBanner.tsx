"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  enregistrerConsentement,
  ouvrirGestionCookies,
  surGestionCookies,
  useConsentement,
  type Choix,
} from "@/lib/consentement";

/** Bandeau de consentement : s'affiche tant qu'aucun choix n'a été fait. */
export function CookieBanner() {
  const choix = useConsentement();
  const [rouvert, setRouvert] = useState(false);
  const premierBouton = useRef<HTMLButtonElement>(null);

  useEffect(
    () =>
      surGestionCookies(() => {
        setRouvert(true);
        requestAnimationFrame(() => premierBouton.current?.focus());
      }),
    [],
  );

  if (!rouvert && choix !== null) return null;

  const choisir = (c: Choix) => {
    enregistrerConsentement(c);
    setRouvert(false);
  };

  return (
    <div className="cookie-bar" role="dialog" aria-modal="false" aria-labelledby="cookie-texte">
      <p className="cookie-bar__text" id="cookie-texte">
        Aucun cookie publicitaire ici. Avec votre accord, nous affichons les contenus intégrés (résultats
        sportifs Score&apos;n&apos;co), qui peuvent déposer leurs propres cookies. Refuser ne limite en rien
        l&apos;accès au site. <Link href="/mentions-legales#cookies">En savoir plus</Link>
      </p>
      <span className="cookie-bar__actions">
        <button ref={premierBouton} type="button" className="cookie-btn" onClick={() => choisir("refuse")}>
          Refuser
        </button>
        <button type="button" className="cookie-btn cookie-btn--accept" onClick={() => choisir("accepte")}>
          Tout accepter
        </button>
      </span>
    </div>
  );
}

/** Bouton « Gérer les cookies » du pied de page. */
export function GererCookies() {
  return (
    <button type="button" className="link-button" onClick={ouvrirGestionCookies}>
      Gérer les cookies
    </button>
  );
}
