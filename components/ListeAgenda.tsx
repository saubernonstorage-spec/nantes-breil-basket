import Link from "next/link";
import type { DateAgenda } from "@/lib/types";
import { AfficheAgenda } from "@/components/AfficheAgenda";

/**
 * Liste des dates de l'agenda (accueil sur fond sombre, page Agenda sur fond clair).
 * `compacte` (accueil) : titre et texte seulement, centrés en hauteur sur la date (sans type ni lieu).
 * `affiches` (page Agenda) : l'affiche de chaque date (champ affiche), au format portrait, agrandissable.
 */
export function ListeAgenda({
  dates,
  clair = false,
  compacte = false,
  affiches = false,
}: {
  dates: DateAgenda[];
  clair?: boolean;
  compacte?: boolean;
  affiches?: boolean;
}) {
  const classes = ["agenda", clair ? "agenda--clair" : "", compacte ? "agenda--compacte" : "", affiches ? "agenda--affiches" : ""].filter(Boolean).join(" ");
  return (
    <ol className={classes}>
      {dates.map((a) => (
        <li key={`${a.date}-${a.titre}`} className="agenda__item">
          <div className="agenda__date">
            <div className="agenda__jour">{a.jour}</div>
            <div className="agenda__num">{a.num}</div>
            <div className="agenda__mois">{a.mois}</div>
          </div>
          <div className="agenda__corps">
            <div className="agenda__tete">
              <h3 className="agenda__titre">{a.lien ? <Link href={a.lien}>{a.titre}</Link> : a.titre}</h3>
              {compacte ? null : <span className="agenda__type">{a.type}</span>}
            </div>
            <p className="agenda__texte">{a.texte}</p>
            {a.lieu && !compacte ? <div className="agenda__lieu">{a.lieu}</div> : null}
          </div>
          {affiches ? <AfficheAgenda src={a.affiche} titre={a.titre} /> : null}
        </li>
      ))}
    </ol>
  );
}
