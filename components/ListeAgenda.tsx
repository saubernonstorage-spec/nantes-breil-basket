import Link from "next/link";
import type { DateAgenda } from "@/lib/types";

/** Liste des dates de l'agenda (accueil sur fond sombre, page Agenda sur fond clair). */
export function ListeAgenda({ dates, clair = false }: { dates: DateAgenda[]; clair?: boolean }) {
  return (
    <ol className={clair ? "agenda agenda--clair" : "agenda"}>
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
              <span className="agenda__type">{a.type}</span>
            </div>
            <p className="agenda__texte">{a.texte}</p>
            {a.lieu ? <div className="agenda__lieu">{a.lieu}</div> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
