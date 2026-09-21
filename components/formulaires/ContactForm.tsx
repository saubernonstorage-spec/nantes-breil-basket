"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";
import { envoyerContact } from "@/app/actions";
import { ETAT_INITIAL, SUJETS_CONTACT } from "@/lib/formulaires";
import { AlerteFormulaire, Champ, ChampsAntiSpam, Confirmation, aria } from "./Champs";

type Props = { sujetInitial?: string; delaiReponse: string };

/** Formulaire de contact. Le bouton « Écrire un autre message » repart d'un formulaire vierge. */
export function ContactForm(props: Props) {
  const [envoi, setEnvoi] = useState(0);
  return <Formulaire key={envoi} {...props} onNouveau={() => setEnvoi((n) => n + 1)} />;
}

/** Variante qui présélectionne le sujet d'après l'adresse (ex. /contact?sujet=benevolat). */
export function ContactFormDepuisUrl({ delaiReponse }: { delaiReponse: string }) {
  const sujet = useSearchParams().get("sujet") ?? undefined;
  return <ContactForm key={sujet} sujetInitial={sujet} delaiReponse={delaiReponse} />;
}

function Formulaire({ sujetInitial, delaiReponse, onNouveau }: Props & { onNouveau: () => void }) {
  const [etat, action, enCours] = useActionState(envoyerContact, ETAT_INITIAL);
  const v = etat.valeurs ?? {};
  const e = etat.erreurs ?? {};
  const sujetParDefaut = SUJETS_CONTACT.some((s) => s.valeur === sujetInitial) ? sujetInitial : "inscription";

  if (etat.statut === "succes") {
    return (
      <Confirmation titre="Message envoyé" bouton="Écrire un autre message" onNouveau={onNouveau}>
        Merci ! Un dirigeant vous répond sous {delaiReponse}. Pensez à vérifier vos indésirables.
      </Confirmation>
    );
  }

  return (
    <form action={action} className="form">
      <h2 className="title-card title-card--lg">Formulaire de contact</h2>
      <AlerteFormulaire etat={etat} />

      <Champ id="c-nom" label="Nom et prénom *" erreur={e.nom}>
        <input
          id="c-nom"
          name="nom"
          type="text"
          className="input"
          required
          autoComplete="name"
          maxLength={120}
          defaultValue={v.nom}
          {...aria("c-nom", e.nom)}
        />
      </Champ>

      <Champ id="c-mail" label="E-mail *" erreur={e.email}>
        <input
          id="c-mail"
          name="email"
          type="email"
          className="input"
          required
          autoComplete="email"
          maxLength={200}
          defaultValue={v.email}
          {...aria("c-mail", e.email)}
        />
      </Champ>

      <Champ id="c-sujet" label="Sujet">
        <select id="c-sujet" name="sujet" className="select" defaultValue={v.sujet ?? sujetParDefaut}>
          {SUJETS_CONTACT.map((s) => (
            <option key={s.valeur} value={s.valeur}>
              {s.label}
            </option>
          ))}
        </select>
      </Champ>

      <Champ id="c-msg" label="Message *" erreur={e.message}>
        <textarea
          id="c-msg"
          name="message"
          className="textarea"
          required
          rows={5}
          maxLength={5000}
          defaultValue={v.message}
          {...aria("c-msg", e.message)}
        />
      </Champ>

      <ChampsAntiSpam prefixe="c" />

      <div>
        <label htmlFor="c-rgpd" className="checkbox-row">
          <input
            id="c-rgpd"
            name="rgpd"
            type="checkbox"
            required
            defaultChecked={v.rgpd === "on"}
            {...aria("c-rgpd", e.rgpd)}
          />
          <span>
            J&apos;accepte que mes coordonnées soient utilisées uniquement pour répondre à ce message.{" "}
            <Link href="/mentions-legales#donnees">Politique de confidentialité</Link>
          </span>
        </label>
        {e.rgpd && (
          <p id="c-rgpd-erreur" className="field-error">
            {e.rgpd}
          </p>
        )}
      </div>

      <button type="submit" className="btn btn--primary" style={{ height: 54, fontSize: 18 }} disabled={enCours}>
        {enCours ? "Envoi en cours…" : "Envoyer le message"}
      </button>
      <p className="form-note">
        Protection anti-spam : champ piège invisible et contrôle du temps de saisie, sans cookie ni service tiers.
      </p>
    </form>
  );
}
