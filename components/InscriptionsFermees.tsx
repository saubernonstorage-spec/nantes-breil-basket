"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { Fenetre } from "@/components/Fenetre";

/** Texte commun à la fenêtre et à la page Inscriptions quand les inscriptions sont fermées. */
export const TEXTE_INSCRIPTIONS_FERMEES =
  "Les inscriptions au club sont fermées pour le moment. Une question, une demande pour la saison prochaine ? Écrivez-nous : on vous répond.";

/**
 * Inscriptions fermées (INSCRIPTIONS_OUVERTES = false) : un clic sur un bouton d'inscription (lien vers
 * /inscriptions affiché en bouton, ou vers le formulaire /inscriptions#formulaire) ouvre cette fenêtre au
 * lieu de la page, avec un bouton vers la page Contact. Les simples liens d'information (menu, pied de
 * page, tarifs) ne sont pas interceptés.
 */
export function InscriptionsFermees() {
  const [ouverte, setOuverte] = useState(false);
  const idTitre = useId();

  useEffect(() => {
    function clic(e: MouseEvent) {
      const lien = (e.target as Element | null)?.closest?.("a[href]");
      if (!(lien instanceof HTMLAnchorElement)) return;
      const url = new URL(lien.href, location.href);
      if (url.origin !== location.origin || url.pathname !== "/inscriptions") return;
      if (url.hash !== "#formulaire" && !lien.classList.contains("btn")) return;
      e.preventDefault();
      setOuverte(true);
    }
    document.addEventListener("click", clic, true);
    return () => document.removeEventListener("click", clic, true);
  }, []);

  const fermer = () => setOuverte(false);

  return (
    <Fenetre ouverte={ouverte} onFermer={fermer} className="fenetre" labelledBy={idTitre}>
      <div className="fenetre__tete">
        <div>
          <div className="surtitre" style={{ marginBottom: 8 }}>
            Inscriptions
          </div>
          <h2 id={idTitre} className="fenetre__titre">
            Inscriptions fermées
          </h2>
        </div>
        <button type="button" className="bouton-rond bouton-rond--clair" aria-label="Fermer" onClick={fermer}>
          ×
        </button>
      </div>
      <div className="fenetre__corps">
        <p className="fenetre__texte">{TEXTE_INSCRIPTIONS_FERMEES}</p>
        <div className="rangee rangee--8 fenetre__boutons">
          <Link href="/contact" className="btn btn--l btn--orange" onClick={fermer}>
            Nous contacter
          </Link>
          <button type="button" className="btn btn--l btn--contour" onClick={fermer}>
            Fermer
          </button>
        </div>
      </div>
    </Fenetre>
  );
}
