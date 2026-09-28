"use client";

import { useActionState, useTransition } from "react";
import { connexion, deconnexion, modifierStatut, supprimerDemande } from "@/app/espace-dirigeants/actions";
import { Erreur } from "@/components/formulaires/Champs";

export function Connexion() {
  const [etat, action, enCours] = useActionState(connexion, { erreur: "" });
  return (
    <form action={action} className="connexion">
      <div className="champ">
        <label htmlFor="mdp">Mot de passe</label>
        <input id="mdp" name="motDePasse" type="password" required autoComplete="current-password" className="saisie" />
      </div>
      <Erreur message={etat.erreur} />
      <button type="submit" className="btn btn--m btn--nuit" disabled={enCours}>
        {enCours ? "Vérification…" : "Entrer"}
      </button>
      <p className="petit-texte" style={{ fontSize: 13 }}>
        Mot de passe du bureau, défini dans les réglages de l'hébergeur (variable ADMIN_PASSWORD).
      </p>
    </form>
  );
}

export function Deconnexion() {
  const [enCours, demarrer] = useTransition();
  return (
    <button type="button" className="btn btn--s btn--petit btn--contour" disabled={enCours} onClick={() => demarrer(() => deconnexion())}>
      Se déconnecter
    </button>
  );
}

export function Statut({ table, id, statut, statuts }: { table: string; id: string; statut: string; statuts: readonly string[] }) {
  const [enCours, demarrer] = useTransition();
  return (
    <select
      aria-label="Statut de la demande"
      className="statut"
      value={statut}
      disabled={enCours}
      onChange={(e) => {
        const valeur = e.target.value;
        demarrer(() => modifierStatut(table, id, valeur));
      }}
    >
      {statuts.map((s) => (
        <option key={s}>{s}</option>
      ))}
    </select>
  );
}

export function Supprimer({ table, id }: { table: string; id: string }) {
  const [enCours, demarrer] = useTransition();
  return (
    <button
      type="button"
      className="bouton-supprimer"
      disabled={enCours}
      onClick={() => {
        if (window.confirm("Supprimer définitivement cette demande ?")) demarrer(() => supprimerDemande(table, id));
      }}
    >
      {enCours ? "Suppression…" : "Supprimer"}
    </button>
  );
}
