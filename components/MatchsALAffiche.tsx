"use client";

import Image from "next/image";
import Link from "next/link";
import { LogoClub } from "@/components/LogoClub";
import type { MatchAffiche } from "@/lib/nbb";
import { decompte, instantParis, useHorloge } from "@/lib/temps";

const deux = (n: number) => String(n).padStart(2, "0");

/**
 * Haut de l'accueil : le prochain match à domicile de chaque équipe à l'affiche (EQUIPES_A_L_AFFICHE), face à
 * face des logos et compte à rebours. Le match est choisi dans le navigateur d'après l'heure : la carte passe
 * seule au suivant. Sans heure connue, le décompte vise le début de la journée.
 */
export function MatchsALAffiche({ matchs }: { matchs: MatchAffiche[] }) {
  const maintenant = useHorloge();
  const parEquipe = new Map<string, MatchAffiche[]>();
  for (const m of matchs) parEquipe.set(m.equipe, [...(parEquipe.get(m.equipe) ?? []), m]);
  // Avant le chargement de la page dans le navigateur : le premier match connu, sans décompte.
  const cartes = [...parEquipe.values()]
    .map((liste) => liste.find((m) => maintenant === null || instantParis(m.date, m.heure || "00:00") + 2 * 3600 * 1000 > maintenant))
    .filter((m): m is MatchAffiche => !!m);
  if (!cartes.length) return null;

  return (
    <section aria-labelledby="affiche-titre" className="section a-l-affiche">
      <div className="surtitre">À domicile</div>
      <h2 id="affiche-titre" className="titre-section">
        Les prochains matchs à l'affiche
      </h2>
      <div className="a-l-affiche__grille">
        {cartes.map((m) => {
          const cible = instantParis(m.date, m.heure || "00:00");
          const { reste, unites } = maintenant === null ? { reste: 1, unites: [] } : decompte(cible, maintenant);
          return (
            <article key={m.equipe} className="match-affiche">
              <div className="match-affiche__tete">
                <span className="match-affiche__equipe">{m.equipe}</span>
                <span className="match-affiche__nom">{m.nom}</span>
              </div>
              <div className="match-affiche__face">
                <div className="match-affiche__club">
                  <span className="match-affiche__logo">
                    <Image src="/logo-nbb.png" alt="" width={64} height={52} />
                  </span>
                  <strong>Nantes Breil</strong>
                </div>
                <span className="match-affiche__vs" aria-hidden="true">
                  VS
                </span>
                <div className="match-affiche__club">
                  <span className="match-affiche__logo">
                    <LogoClub logo={m.logo} nom={m.adversaire} taille={64} />
                  </span>
                  <strong>{m.adversaire}</strong>
                </div>
              </div>
              <p className="match-affiche__quand">
                {m.jourLabel}
                {m.heure ? ` · ${m.heure.replace(":", " h ")}` : " · horaire à confirmer"}
                {m.salle ? (
                  <>
                    {" · "}
                    {m.lienSalle ? <Link href={m.lienSalle}>{m.salle}</Link> : m.salle}
                  </>
                ) : null}
              </p>
              {reste > 0 && unites.length ? (
                <div className="rebours__unites match-affiche__rebours" role="timer" aria-live="off">
                  {unites.map((u) => (
                    <div key={u.label} className="rebours__unite">
                      <strong>{u.label === "jours" ? u.valeur : deux(u.valeur)}</strong>
                      <span>{u.label}</span>
                    </div>
                  ))}
                </div>
              ) : reste === 0 ? (
                <p className="match-affiche__direct">C'est maintenant : venez encourager l'équipe !</p>
              ) : null}
            </article>
          );
        })}
      </div>
      <Link href="/matchs" className="btn btn--petit btn--contour a-l-affiche__lien">
        Tous les matchs <span className="fleche fleche--diag" aria-hidden="true">↗</span>
      </Link>
    </section>
  );
}
