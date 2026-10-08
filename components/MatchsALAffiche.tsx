"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Fenetre } from "@/components/Fenetre";
import { IconeFermer } from "@/components/icons";
import { LogoClub } from "@/components/LogoClub";
import { Photo } from "@/components/Photo";
import type { MatchAffiche } from "@/lib/nbb";
import type { DateAgenda } from "@/lib/types";
import { decompte, instantParis, useHorloge } from "@/lib/temps";

const deux = (n: number) => String(n).padStart(2, "0");

/**
 * Haut de l'accueil : le prochain match à domicile de chaque équipe à l'affiche (EQUIPES_A_L_AFFICHE), face à
 * face des logos et compte à rebours. Le match est choisi dans le navigateur d'après l'heure : la carte passe
 * seule au suivant. Sans heure connue, le décompte vise le début de la journée.
 */
export function MatchsALAffiche({ matchs, evenements = [] }: { matchs: MatchAffiche[]; evenements?: DateAgenda[] }) {
  const maintenant = useHorloge();
  const parEquipe = new Map<string, MatchAffiche[]>();
  for (const m of matchs) parEquipe.set(m.equipe, [...(parEquipe.get(m.equipe) ?? []), m]);
  // Avant le chargement de la page dans le navigateur : le premier match connu, sans décompte.
  const cartes = [...parEquipe.values()]
    .map((liste) => liste.find((m) => maintenant === null || instantParis(m.date, m.heure || "00:00") + 2 * 3600 * 1000 > maintenant))
    .filter((m): m is MatchAffiche => !!m);
  if (!cartes.length && !evenements.length) return null;

  return (
    <section aria-labelledby="affiche-titre" className="section a-l-affiche">
      <div className="surtitre">Matchs et événements</div>
      <h2 id="affiche-titre" className="titre-section">
        À l'affiche au NBB
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
        {/* Prochain événement de l'agenda : même construction qu'une carte de match. */}
        <EvenementAffiche dates={evenements} maintenant={maintenant} />
      </div>
      <div className="rangee rangee--10 a-l-affiche__liens">
        <Link href="/matchs" className="btn btn--petit btn--contour">
          Tous les matchs <span className="fleche fleche--diag" aria-hidden="true">↗</span>
        </Link>
        <Link href="/agenda" className="btn btn--petit btn--contour">
          Voir l'agenda <span className="fleche fleche--diag" aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}

/**
 * Prochain événement de l'agenda, construit comme une carte de match : pastille en haut, titre, date et lieu
 * avec l'affiche entière à droite, compte à rebours en bas. Un clic sur la carte agrandit l'affiche dans une
 * fenêtre (sans affiche : la carte mène à la page de l'événement ou à l'agenda).
 */
function EvenementAffiche({ dates, maintenant }: { dates: DateAgenda[]; maintenant: number | null }) {
  const [ouverte, setOuverte] = useState(false);
  if (maintenant === null) return null;
  const prochain = dates.map((d) => ({ d, t: instantParis(d.date, d.heure || "00:00") })).find(({ t }) => t > maintenant);
  if (!prochain) return null;
  const { d, t } = prochain;
  const { unites } = decompte(t, maintenant);
  const contenu = (
    <>
      <span className="match-affiche__tete">
        <span className="match-affiche__equipe">Événement</span>
        <span className="match-affiche__nom">{d.type}</span>
      </span>
      <span className="evenement-affiche__milieu">
        <span className="evenement-affiche__texte">
          <span className="evenement-affiche__titre">{d.titre}</span>
          <span className="evenement-affiche__quand">
            {d.jour} {d.num} {d.mois}
            {d.heure ? ` · ${d.heure.replace(":", " h ")}` : ""}
          </span>
          {d.lieu ? <span className="evenement-affiche__lieu">{d.lieu}</span> : null}
        </span>
        {d.affiche ? (
          <span className="evenement-affiche__affiche">
            <Photo src={d.affiche} alt="" sizes="140px" entiere />
          </span>
        ) : null}
      </span>
      <span className="rebours__unites match-affiche__rebours" role="timer" aria-live="off">
        {unites.map((u) => (
          <span key={u.label} className="rebours__unite">
            <strong>{u.label === "jours" ? u.valeur : deux(u.valeur)}</strong>
            <span>{u.label}</span>
          </span>
        ))}
      </span>
    </>
  );
  if (!d.affiche) {
    return (
      <Link href={d.lien ?? "/agenda"} className="match-affiche match-affiche--evenement carte-lien carte-lien--sombre">
        {contenu}
      </Link>
    );
  }
  return (
    <>
      <button
        type="button"
        className="match-affiche match-affiche--evenement carte-lien carte-lien--sombre"
        aria-label={`Prochain événement : ${d.titre}, ${d.jour} ${d.num} ${d.mois}. Agrandir l'affiche`}
        onClick={() => setOuverte(true)}
      >
        {contenu}
      </button>
      <Fenetre ouverte={ouverte} onFermer={() => setOuverte(false)} className="fenetre-zoom" label={`Affiche : ${d.titre}`}>
        <div className="fenetre-zoom__cadre fenetre-zoom__cadre--affiche">
          <Photo src={d.affiche} alt={`Affiche : ${d.titre}`} sizes="(max-width: 700px) 100vw, 640px" entiere />
        </div>
        <div className="fenetre-zoom__bas">
          <span>{d.titre}</span>
          <button type="button" className="bouton-rond bouton-rond--clair" aria-label="Fermer" onClick={() => setOuverte(false)}>
            <IconeFermer />
          </button>
        </div>
      </Fenetre>
    </>
  );
}
