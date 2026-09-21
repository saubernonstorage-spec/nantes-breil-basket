"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { EtatFormulaire } from "@/lib/formulaires";

/**
 * Champs cachés anti-spam : un champ piège que seuls les robots remplissent,
 * et l'heure d'affichage du formulaire (un humain met plus de 3 secondes à le remplir).
 */
export function ChampsAntiSpam({ prefixe }: { prefixe: string }) {
  const horodatage = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (horodatage.current && !horodatage.current.value) horodatage.current.value = String(Date.now());
  }, []);

  return (
    <>
      <div className="hp" aria-hidden="true">
        <label htmlFor={`${prefixe}-site`}>Ne remplissez pas ce champ</label>
        <input id={`${prefixe}-site`} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <input ref={horodatage} type="hidden" name="t" defaultValue="" />
    </>
  );
}

/** Libellé + champ + message d'erreur éventuel. */
export function Champ({
  id,
  label,
  erreur,
  children,
}: {
  id: string;
  label: string;
  erreur?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
      {erreur && (
        <p id={`${id}-erreur`} className="field-error">
          {erreur}
        </p>
      )}
    </div>
  );
}

/** Attributs d'accessibilité d'un champ en erreur. */
export function aria(id: string, erreur?: string) {
  return erreur ? { "aria-invalid": true as const, "aria-describedby": `${id}-erreur` } : {};
}

/** Encadré d'erreur générale (en haut du formulaire). */
export function AlerteFormulaire({ etat }: { etat: EtatFormulaire }) {
  if (etat.statut !== "erreur" || !etat.message) return null;
  return (
    <div role="alert" className="form-alert">
      {etat.message}
    </div>
  );
}

/** Message de confirmation, qui reçoit le focus pour être lu par les lecteurs d'écran. */
export function Confirmation({
  titre,
  children,
  bouton,
  onNouveau,
}: {
  titre: string;
  children: ReactNode;
  bouton: string;
  onNouveau: () => void;
}) {
  const boite = useRef<HTMLDivElement>(null);
  useEffect(() => {
    boite.current?.focus();
  }, []);

  return (
    <div ref={boite} role="status" tabIndex={-1} className="status-box">
      <p className="title-card" style={{ fontSize: 22, marginBottom: 8 }}>
        {titre}
      </p>
      <p style={{ color: "var(--cream)" }}>{children}</p>
      <button type="button" className="btn btn--quiet btn--sm" style={{ marginTop: 16 }} onClick={onNouveau}>
        {bouton}
      </button>
    </div>
  );
}
