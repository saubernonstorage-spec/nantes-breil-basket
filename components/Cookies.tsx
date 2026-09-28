"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  enregistrerConsentement,
  ouvrirGestionCookies,
  surOuvertureCookies,
  useConsentement,
} from "@/lib/consentement";

/** Bandeau de choix des cookies : affiché tant que le visiteur n'a pas choisi, ou rouvert à la demande. */
export function BandeauCookies() {
  const choix = useConsentement();
  const [rouvert, setRouvert] = useState(false);
  const [prefs, setPrefs] = useState(false);
  const [embeds, setEmbeds] = useState<boolean | null>(null);

  useEffect(
    () =>
      surOuvertureCookies(() => {
        setRouvert(true);
        setPrefs(true);
      }),
    [],
  );

  if (!rouvert && choix !== null) return null;

  const valeurEmbeds = embeds ?? choix?.embeds ?? false;
  const sauver = (accord: boolean) => {
    enregistrerConsentement({ embeds: accord });
    setRouvert(false);
    setPrefs(false);
    setEmbeds(null);
  };

  return (
    <div role="dialog" aria-live="polite" aria-label="Gestion des cookies" className="cookies">
      <div className="cookies__tete">
        <span className="cookies__logo">
          <Image src="/logo-nbb.png" alt="Logo du Nantes Breil Basket" width={40} height={32} />
        </span>
        <strong>Vos choix de cookies</strong>
      </div>
      <p className="cookies__texte">
        Le site n'utilise aucun cookie publicitaire ni outil de mesure d'audience. Avec votre accord, il affiche des
        contenus externes (carte des gymnases, résultats des matchs), qui peuvent déposer des cookies. Refuser ne
        limite pas l'accès aux informations.
      </p>
      {prefs ? (
        <div className="cookies__prefs">
          <label>
            <input type="checkbox" checked disabled />
            <span>
              <strong>Nécessaires</strong> — mémoriser vos choix. Toujours actifs.
            </span>
          </label>
          <label>
            <input type="checkbox" checked={valeurEmbeds} onChange={(e) => setEmbeds(e.target.checked)} />
            <span>
              <strong>Contenus intégrés</strong> — carte des gymnases (Google Maps), widget des résultats de matchs.
            </span>
          </label>
          <button type="button" className="cookies__enregistrer" onClick={() => sauver(valeurEmbeds)}>
            Enregistrer mes choix
          </button>
        </div>
      ) : null}
      <div className="cookies__boutons">
        <button type="button" className="cookies__btn" onClick={() => sauver(false)}>
          Tout refuser
        </button>
        <button type="button" className="cookies__btn cookies__btn--plein" onClick={() => sauver(true)}>
          Tout accepter
        </button>
      </div>
      <div className="cookies__bas">
        <button type="button" className="lien-bouton" aria-expanded={prefs} onClick={() => setPrefs((p) => !p)}>
          Personnaliser
        </button>
        <Link href="/mentions-legales#cookies">En savoir plus</Link>
      </div>
    </div>
  );
}

/** Bouton qui rouvre le bandeau (pied de page, mentions légales). */
export function BoutonCookies({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <button type="button" className={className} onClick={ouvrirGestionCookies}>
      {children}
    </button>
  );
}

/**
 * Contenu externe (iframe) affiché seulement après accord.
 * Tant que le visiteur n'a pas accepté, `bloque` est affiché avec un bouton qui vaut accord.
 */
export function ContenuConsenti({
  children,
  bloque,
}: {
  children: React.ReactNode;
  bloque: (accepter: () => void) => React.ReactNode;
}) {
  const choix = useConsentement();
  if (choix?.embeds) return <>{children}</>;
  return <>{bloque(() => enregistrerConsentement({ embeds: true }))}</>;
}
