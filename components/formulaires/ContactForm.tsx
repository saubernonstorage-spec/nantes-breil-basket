"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { envoyerContact } from "@/app/actions";
import { RESULTAT_INITIAL, reponseRobotValide, SUJETS_CONTACT } from "@/lib/formulaires";
import { aCompleter, estEmail } from "@/lib/utils";
import { CaseACocher, ChampListe, ChampTexte, ChampZone, Confirmation, Piege } from "@/components/formulaires/Champs";

const VIDE = { nom: "", email: "", sujet: "inscription", message: "", robot: "", rgpd: false, hp: "" };
type Formulaire = typeof VIDE;

export function ContactForm({ delaiReponse, sujet = "", commission = "" }: { delaiReponse: string; sujet?: string; commission?: string }) {
  const initial = (): Formulaire => ({
    ...VIDE,
    sujet: SUJETS_CONTACT.some((s) => s.valeur === sujet) ? sujet : VIDE.sujet,
    message: commission ? `Bonjour, la commission « ${commission} » m'intéresse. ` : "",
  });
  const [f, setF] = useState<Formulaire>(initial);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [resultat, envoyer, enCours] = useActionState(envoyerContact, RESULTAT_INITIAL);
  const [termine, setTermine] = useState(false);
  const t0 = useRef(0);

  useEffect(() => {
    t0.current = Date.now();
  }, []);

  const erreursServeur = resultat.statut === "erreur" && !enCours ? (resultat.erreurs ?? {}) : {};
  const err = (k: string) => erreurs[k] ?? erreursServeur[k] ?? "";
  const maj = <K extends keyof Formulaire>(k: K, v: Formulaire[K]) => {
    setF((x) => ({ ...x, [k]: v }));
    setErreurs((e) => ({ ...e, [k]: "" }));
  };

  const soumettre = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!f.nom.trim()) e.nom = "Indiquez votre nom.";
    if (!estEmail(f.email)) e.email = "Adresse e-mail invalide.";
    if (f.message.trim().length < 10) e.message = "Votre message est un peu court.";
    if (!reponseRobotValide(f.robot)) e.robot = "Indice : moins de 6.";
    if (!f.rgpd) e.rgpd = "Cette case est nécessaire pour vous répondre.";
    setErreurs(e);
    if (Object.keys(e).length) return;
    const d = new FormData();
    for (const [k, v] of Object.entries(f)) {
      if (typeof v === "boolean") {
        if (v) d.set(k, "on");
      } else d.set(k, v);
    }
    d.set("t", String(t0.current));
    setTermine(true);
    startTransition(() => envoyer(d));
  };

  if (termine && !enCours && resultat.statut === "succes") {
    return (
      <Confirmation titre="Message envoyé">
        <p className="confirmation__texte">
          Merci ! Un bénévole vous répond dès que possible{aCompleter(delaiReponse) ? "" : `, sous ${delaiReponse}`}.
          Pensez à vérifier vos courriers indésirables.
        </p>
        <button
          type="button"
          className="btn btn--m btn--contour"
          style={{ alignSelf: "flex-start" }}
          onClick={() => {
            setF(VIDE);
            setErreurs({});
            setTermine(false);
            t0.current = Date.now();
          }}
        >
          Écrire un autre message
        </button>
      </Confirmation>
    );
  }

  return (
    <>
      <h2 className="titre-formulaire">Formulaire de contact</h2>
      <form noValidate onSubmit={soumettre} className="formulaire" style={{ gap: 16 }}>
        <div className="champs" style={{ "--min": "220px" } as React.CSSProperties}>
          <ChampTexte label="Prénom et nom *" value={f.nom} onChange={(e) => maj("nom", e.target.value)} autoComplete="name" erreur={err("nom")} />
          <ChampTexte label="E-mail *" type="email" value={f.email} onChange={(e) => maj("email", e.target.value)} autoComplete="email" inputMode="email" erreur={err("email")} />
        </div>
        <ChampListe label="Sujet" value={f.sujet} onChange={(e) => maj("sujet", e.target.value)}>
          {SUJETS_CONTACT.map((s) => (
            <option key={s.valeur} value={s.valeur}>
              {s.label}
            </option>
          ))}
        </ChampListe>
        <ChampZone label="Message *" rows={6} value={f.message} onChange={(e) => maj("message", e.target.value)} erreur={err("message")} />
        <ChampTexte
          className="champ--court"
          label="Question anti-robot : combien de joueurs par équipe sont sur le terrain ? *"
          value={f.robot}
          onChange={(e) => maj("robot", e.target.value)}
          inputMode="numeric"
          erreur={err("robot")}
        />
        <Piege label="Site web" valeur={f.hp} onChange={(v) => maj("hp", v)} />
        <CaseACocher checked={f.rgpd} onChange={(e) => maj("rgpd", e.target.checked)} erreur={err("rgpd")}>
          J'accepte que mes coordonnées servent uniquement à répondre à ce message.{" "}
          <Link href="/mentions-legales#confidentialite">Confidentialité</Link> *
        </CaseACocher>
        {resultat.statut === "erreur" && !enCours ? (
          <p className="erreur-globale" role="alert">
            {resultat.message}
          </p>
        ) : null}
        <button type="submit" className="btn btn--xl btn--orange" style={{ alignSelf: "flex-start", padding: "0 28px" }} disabled={enCours}>
          {enCours ? "Envoi en cours…" : "Envoyer le message"}
        </button>
      </form>
    </>
  );
}

/** Sujet (et commission) présélectionnés depuis l'adresse : /contact?sujet=benevolat&commission=Parents. */
export function ContactAvecAdresse({ delaiReponse }: { delaiReponse: string }) {
  const p = useSearchParams();
  return <ContactForm delaiReponse={delaiReponse} sujet={p.get("sujet") ?? ""} commission={(p.get("commission") ?? "").slice(0, 60)} />;
}
