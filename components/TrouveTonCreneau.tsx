"use client";

import Link from "next/link";
import { useState } from "react";
import { lienPlanning } from "@/lib/utils";

/** Carte « Trouve ton créneau » de l'accueil : choisit une équipe, ouvre le planning filtré. */
export function TrouveTonCreneau({ equipes }: { equipes: string[] }) {
  const [equipe, setEquipe] = useState("");

  return (
    <>
      <label htmlFor="home-team" className="label" style={{ fontWeight: 400, marginBottom: 8 }}>
        Ton équipe
      </label>
      <select
        id="home-team"
        className="select"
        value={equipe}
        onChange={(e) => setEquipe(e.target.value)}
        style={{ marginBottom: 12 }}
      >
        <option value="">Toutes les équipes</option>
        {equipes.map((e) => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </select>
      <Link href={lienPlanning({ equipe })} className="btn btn--primary btn--block quick-card__foot">
        Voir les entraînements
      </Link>
    </>
  );
}
