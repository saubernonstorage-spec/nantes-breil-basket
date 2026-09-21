"use client";

import { enregistrerConsentement, useConsentement } from "@/lib/consentement";

type Props = {
  src: string;
  title: string;
  height: number;
  fournisseur: string;
  bouton: string;
};

/**
 * Contenu intégré (iframe d'un service tiers) chargé seulement après accord
 * du visiteur, conformément au bandeau cookies.
 */
export function EmbedConsenti({ src, title, height, fournisseur, bouton }: Props) {
  const choix = useConsentement();

  if (choix === "accepte") {
    return (
      <div className="embed">
        <iframe src={src} title={title} loading="lazy" style={{ height }} />
      </div>
    );
  }

  return (
    <div className="embed-consent">
      <p className="text-soft text-md">
        Ce contenu est fourni par <strong>{fournisseur}</strong>, qui peut déposer des cookies. Il ne
        s&apos;affiche qu&apos;avec votre accord.
      </p>
      <button type="button" className="btn btn--primary btn--sm" onClick={() => enregistrerConsentement("accepte")}>
        {bouton}
      </button>
    </div>
  );
}
