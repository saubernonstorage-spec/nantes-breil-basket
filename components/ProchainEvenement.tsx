"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Fenetre } from "@/components/Fenetre";
import { Photo } from "@/components/Photo";
import type { DateAgenda } from "@/lib/types";
import { IconeFermer } from "@/components/icons";

/** Clé de session : la fenêtre ne s'ouvre qu'une fois par visite (par onglet). */
const CLE = "nbb-prochain-evenement";

/** Date du jour à Nantes, au format AAAA-MM-JJ. */
function aujourdhui(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date());
}

/**
 * À l'arrivée sur le site, une fenêtre présente le prochain événement de l'agenda : son affiche en entier
 * (champ affiche, format portrait A4, la même que sur la page Agenda), puis la date, le titre, le texte et le lieu. Une fois par visite ; jamais dans l'Espace dirigeants.
 */
export function ProchainEvenement({ dates }: { dates: DateAgenda[] }) {
  const chemin = usePathname();
  const [evenement, setEvenement] = useState<DateAgenda | null>(null);
  const idTitre = useId();

  useEffect(() => {
    if (chemin.startsWith("/espace-dirigeants")) return;
    try {
      if (sessionStorage.getItem(CLE)) return;
    } catch {
      // stockage indisponible (navigation privée stricte) : la fenêtre s'ouvre quand même
    }
    const jour = aujourdhui();
    const prochain = dates.find((d) => d.date >= jour);
    if (!prochain) return;
    // Petit délai : la page s'affiche d'abord, la fenêtre arrive ensuite.
    const minuterie = window.setTimeout(() => {
      setEvenement(prochain);
      try {
        sessionStorage.setItem(CLE, "1");
      } catch {}
    }, 900);
    return () => window.clearTimeout(minuterie);
    // Seulement au premier chargement : pas à chaque changement de page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fermer = () => setEvenement(null);
  const e = evenement;

  return (
    <Fenetre ouverte={!!e} onFermer={fermer} className="fenetre fenetre--affiche" labelledBy={idTitre}>
      {e ? (
        <article className="affiche">
          <div className="affiche__photo">
            <Photo src={e.affiche} alt={`Affiche : ${e.titre}`} sizes="400px" />
            <span className="affiche__type">{e.type}</span>
            <button type="button" className="bouton-rond bouton-rond--clair affiche__fermer" aria-label="Fermer" onClick={fermer}>
              <IconeFermer />
            </button>
          </div>
          <div className="affiche__corps">
            <div className="affiche__date">
              <span>{e.jour}</span>
              <strong>{e.num}</strong>
              <span>{e.mois}</span>
            </div>
            <div className="affiche__texte">
              <div className="surtitre">Prochain événement</div>
              <h2 id={idTitre} className="affiche__titre">
                {e.titre}
              </h2>
              {e.texte ? <p>{e.texte}</p> : null}
              {e.lieu ? <p className="affiche__lieu">{e.lieu}</p> : null}
            </div>
          </div>
          <div className="affiche__boutons">
            <Link href={e.lien ?? "/agenda"} className="btn btn--l btn--orange" onClick={fermer}>
              {e.lien ? "En savoir plus" : "Voir l'agenda"}
            </Link>
            <button type="button" className="btn btn--l btn--clair" onClick={fermer}>
              Plus tard
            </button>
          </div>
        </article>
      ) : null}
    </Fenetre>
  );
}
