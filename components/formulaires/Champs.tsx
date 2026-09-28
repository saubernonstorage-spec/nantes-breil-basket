"use client";

import { useId } from "react";

/** Message d'erreur relié à son champ (lu par les lecteurs d'écran dès qu'il apparaît). */
export function Erreur({ id, message }: { id?: string; message?: string }) {
  return (
    <span id={id} className="erreur" role="alert">
      {message ?? ""}
    </span>
  );
}

type Base = {
  label: React.ReactNode;
  erreur?: string;
  aide?: React.ReactNode;
  className?: string;
};

export function ChampTexte({
  label,
  erreur,
  aide,
  className,
  ...input
}: Base & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className={`champ ${className ?? ""}`}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        className="saisie"
        aria-invalid={erreur ? true : undefined}
        aria-describedby={`${id}-e${aide ? ` ${id}-a` : ""}`}
        {...input}
      />
      {aide ? (
        <span id={`${id}-a`} className="champ__aide">
          {aide}
        </span>
      ) : null}
      <Erreur id={`${id}-e`} message={erreur} />
    </div>
  );
}

export function ChampZone({
  label,
  erreur,
  className,
  ...zone
}: Base & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <div className={`champ ${className ?? ""}`}>
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        className="saisie saisie--zone"
        aria-invalid={erreur ? true : undefined}
        aria-describedby={`${id}-e`}
        {...zone}
      />
      <Erreur id={`${id}-e`} message={erreur} />
    </div>
  );
}

export function ChampListe({
  label,
  erreur,
  aide,
  className,
  children,
  ...select
}: Base & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <div className={`champ ${className ?? ""}`}>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        className="saisie"
        aria-invalid={erreur ? true : undefined}
        aria-describedby={`${id}-e${aide ? ` ${id}-a` : ""}`}
        {...select}
      >
        {children}
      </select>
      {aide ? (
        <span id={`${id}-a`} className="champ__aide">
          {aide}
        </span>
      ) : null}
      {erreur !== undefined ? <Erreur id={`${id}-e`} message={erreur} /> : null}
    </div>
  );
}

export function CaseACocher({
  children,
  erreur,
  encadree,
  ...input
}: { children: React.ReactNode; erreur?: string; encadree?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className="case-bloc">
      <label className={encadree ? "case case--encadree" : "case"}>
        <input type="checkbox" aria-invalid={erreur ? true : undefined} aria-describedby={`${id}-e`} {...input} />
        <span>{children}</span>
      </label>
      {erreur !== undefined ? <Erreur id={`${id}-e`} message={erreur} /> : null}
    </div>
  );
}

/** Champ invisible : seuls les robots le remplissent. */
export function Piege({ valeur, onChange, label = "Ne pas remplir" }: { valeur: string; onChange: (v: string) => void; label?: string }) {
  return (
    <div aria-hidden="true" className="piege">
      <label>
        {label}
        <input tabIndex={-1} autoComplete="off" value={valeur} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}

/** Confirmation après envoi. */
export function Confirmation({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <div role="status" className="confirmation">
      <span aria-hidden="true" className="confirmation__coche">
        ✓
      </span>
      <h3 className="confirmation__titre">{titre}</h3>
      {children}
    </div>
  );
}
