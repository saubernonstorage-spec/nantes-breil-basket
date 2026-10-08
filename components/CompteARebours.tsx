"use client";

import Link from "next/link";
import { Photo } from "@/components/Photo";
import type { DateAgenda } from "@/lib/types";
import { decompte, instantParis, useHorloge } from "@/lib/temps";

const deux = (n: number) => String(n).padStart(2, "0");

/**
 * Compte à rebours jusqu'au prochain événement de l'agenda, avec son affiche (d'après la « Event Countdown
 * Card » de 21st.dev, réécrite aux couleurs du club). Le prochain événement est choisi dans le navigateur
 * d'après l'heure : la carte passe seule au suivant. Heure de début : champ heure de la date (sinon minuit).
 * Les chiffres changent chaque seconde, sans animation en boucle.
 */
export function CompteARebours({ dates }: { dates: DateAgenda[] }) {
  const maintenant = useHorloge();

  // Avant le chargement de la page dans le navigateur : rien (l'heure exacte n'est connue que là).
  if (maintenant === null) return null;
  const prochain = dates.map((d) => ({ d, t: instantParis(d.date, d.heure) })).find(({ t }) => t > maintenant);
  if (!prochain) return null;
  const { d, t } = prochain;

  const { reste, unites } = decompte(t, maintenant);
  const bientot = reste < 86400;

  return (
    <Link href={d.lien ?? "/agenda"} className="rebours carte-lien carte-lien--sombre" aria-label={`Prochain événement : ${d.titre}`}>
      <div className="rebours__affiche">
        <Photo src={d.affiche} alt="" sizes="(max-width: 699px) 100vw, 220px" />
        {bientot ? <span className="rebours__bientot">C'est bientôt !</span> : null}
      </div>
      <div className="rebours__corps">
        <div className="surtitre">Prochain événement</div>
        <h3 className="rebours__titre">{d.titre}</h3>
        <p className="rebours__quand">
          {d.jour} {d.num} {d.mois}
          {d.heure ? ` · ${d.heure.replace(":", " h ")}` : ""}
          {d.lieu ? ` · ${d.lieu}` : ""}
        </p>
        <div className="rebours__unites" role="timer" aria-live="off">
          {unites.map((u) => (
            <div key={u.label} className="rebours__unite">
              <strong>{u.label === "jours" ? u.valeur : deux(u.valeur)}</strong>
              <span>{u.label}</span>
            </div>
          ))}
        </div>
        <span className="rebours__lien">
          {d.lien ? "En savoir plus" : "Voir l'agenda"} <span className="fleche fleche--diag" aria-hidden="true">↗</span>
        </span>
      </div>
    </Link>
  );
}
