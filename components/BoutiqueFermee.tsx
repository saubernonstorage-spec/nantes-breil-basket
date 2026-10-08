"use client";

import { useEffect, useId, useState } from "react";
import { Fenetre } from "@/components/Fenetre";
import type { OuvertureBoutique } from "@/lib/types";
import { IconeFermer } from "@/components/icons";

/** Date du jour à Nantes, au format AAAA-MM-JJ (comparable aux dates de OUVERTURES_BOUTIQUE). */
function aujourdhui(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date());
}

/** « mardi 20 octobre 2026 » à partir de « 2026-10-20 ». */
function enLettres(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Boutique fermée : un clic sur n'importe quel lien vers la boutique (en-tête, menu, accueil, pied de page)
 * ouvre cette fenêtre au lieu de la boutique, avec la prochaine période d'ouverture. La date est testée au
 * moment du clic : les pages statiques n'ont pas besoin d'être régénérées à l'ouverture ou à la fermeture.
 */
export function BoutiqueFermee({ url, ouvertures }: { url: string; ouvertures: OuvertureBoutique[] }) {
  const [prochaine, setProchaine] = useState<OuvertureBoutique | null | undefined>(undefined);
  const idTitre = useId();

  useEffect(() => {
    if (!ouvertures.length) return;
    function clic(e: MouseEvent) {
      const lien = (e.target as Element | null)?.closest?.("a[href]");
      if (!(lien instanceof HTMLAnchorElement) || lien.href !== url) return;
      const jour = aujourdhui();
      if (ouvertures.some((o) => o.debut <= jour && jour <= o.fin)) return;
      e.preventDefault();
      const suivantes = ouvertures.filter((o) => o.debut > jour).sort((a, b) => a.debut.localeCompare(b.debut));
      setProchaine(suivantes[0] ?? null);
    }
    document.addEventListener("click", clic, true);
    return () => document.removeEventListener("click", clic, true);
  }, [url, ouvertures]);

  const fermer = () => setProchaine(undefined);

  return (
    <Fenetre ouverte={prochaine !== undefined} onFermer={fermer} className="fenetre fenetre--boutique" labelledBy={idTitre}>
      <div className="fenetre__tete">
        <div>
          <div className="surtitre" style={{ marginBottom: 8 }}>
            Boutique en ligne
          </div>
          <h2 id={idTitre} className="fenetre__titre">
            Boutique fermée
          </h2>
        </div>
        <button type="button" className="bouton-rond bouton-rond--clair" aria-label="Fermer" onClick={fermer}>
          <IconeFermer />
        </button>
      </div>
      <div className="fenetre__corps">
        {prochaine ? (
          <p className="fenetre__texte">
            Prochaine ouverture : <strong>du {enLettres(prochaine.debut)} au {enLettres(prochaine.fin)}</strong>. Vous
            pourrez alors commander les tenues du club en ligne.
          </p>
        ) : (
          <p className="fenetre__texte">La date de la prochaine ouverture n&apos;est pas encore connue.</p>
        )}
        <button type="button" className="btn btn--l btn--orange" onClick={fermer}>
          J&apos;ai compris
        </button>
      </div>
    </Fenetre>
  );
}
