"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { envoyerInscriptionStage } from "@/app/actions";
import { ETAT_INITIAL, LICENCES_STAGE } from "@/lib/formulaires";
import { AlerteFormulaire, Champ, ChampsAntiSpam, Confirmation, aria } from "./Champs";
import { useStageChoix } from "./StageChoix";

type Props = { semaines: string[]; delaiReponse: string; anneeMin: number; anneeMax: number };

/** Formulaire d'inscription aux stages des vacances. */
export function StageForm(props: Props) {
  const [envoi, setEnvoi] = useState(0);

  if (props.semaines.length === 0) {
    return (
      <div className="stack" style={{ gap: 12 }}>
        <h2 className="title-card title-card--lg">Inscription au stage</h2>
        <p className="text-soft">
          Aucune inscription n&apos;est ouverte pour le moment. Les dates sont publiées environ trois semaines avant
          chaque période de vacances.
        </p>
        <p>
          <Link href="/contact?sujet=stage" className="link-underline">
            Être prévenu ou poser une question →
          </Link>
        </p>
      </div>
    );
  }

  return <Formulaire key={envoi} {...props} onNouveau={() => setEnvoi((n) => n + 1)} />;
}

function Formulaire({ semaines, delaiReponse, anneeMin, anneeMax, onNouveau }: Props & { onNouveau: () => void }) {
  const [etat, action, enCours] = useActionState(envoyerInscriptionStage, ETAT_INITIAL);
  const { choix, setChoix } = useStageChoix();
  const v = etat.valeurs ?? {};
  const e = etat.erreurs ?? {};

  if (etat.statut === "succes") {
    return (
      <Confirmation titre="Demande enregistrée" bouton="Inscrire un autre enfant" onNouveau={onNouveau}>
        Merci ! Nous confirmons la place par e-mail sous {delaiReponse}, avec le lien de paiement et l&apos;autorisation
        parentale à retourner.
      </Confirmation>
    );
  }

  return (
    <form action={action} className="form">
      <div>
        <h2 className="title-card title-card--lg" style={{ marginBottom: 6 }}>
          Inscription au stage
        </h2>
        <p className="text-muted text-sm">
          Deux minutes, aucun compte à créer. Le paiement se fait après confirmation de la place.
        </p>
      </div>
      <AlerteFormulaire etat={etat} />

      <Champ id="s-periode" label="Période du stage *" erreur={e.periode}>
        <select
          id="s-periode"
          name="periode"
          className="select"
          required
          value={semaines.includes(choix) ? choix : semaines[0]}
          onChange={(ev) => setChoix(ev.target.value)}
          {...aria("s-periode", e.periode)}
        >
          {semaines.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Champ>

      <Champ id="s-enfant" label="Prénom et nom de l'enfant *" erreur={e.enfant}>
        <input
          id="s-enfant"
          name="enfant"
          type="text"
          className="input"
          required
          maxLength={120}
          defaultValue={v.enfant}
          {...aria("s-enfant", e.enfant)}
        />
      </Champ>

      <div className="grid-2-fields">
        <Champ id="s-annee" label="Année de naissance *" erreur={e.annee}>
          <input
            id="s-annee"
            name="annee"
            type="number"
            inputMode="numeric"
            className="input"
            required
            min={anneeMin}
            max={anneeMax}
            placeholder={String(anneeMax - 9)}
            defaultValue={v.annee}
            {...aria("s-annee", e.annee)}
          />
        </Champ>
        <Champ id="s-licence" label="Licencié au NBB ?">
          <select id="s-licence" name="licence" className="select" defaultValue={v.licence ?? "oui"}>
            {LICENCES_STAGE.map((l) => (
              <option key={l.valeur} value={l.valeur}>
                {l.label}
              </option>
            ))}
          </select>
        </Champ>
      </div>

      <Champ id="s-mail" label="E-mail du parent *" erreur={e.email}>
        <input
          id="s-mail"
          name="email"
          type="email"
          className="input"
          required
          autoComplete="email"
          maxLength={200}
          defaultValue={v.email}
          {...aria("s-mail", e.email)}
        />
      </Champ>

      <Champ id="s-tel" label="Téléphone *" erreur={e.tel}>
        <input
          id="s-tel"
          name="tel"
          type="tel"
          className="input"
          required
          autoComplete="tel"
          maxLength={30}
          defaultValue={v.tel}
          {...aria("s-tel", e.tel)}
        />
      </Champ>

      <Champ id="s-info" label="Allergie, traitement, information utile" erreur={e.info}>
        <textarea
          id="s-info"
          name="info"
          className="textarea"
          rows={3}
          maxLength={2000}
          style={{ minHeight: 90 }}
          defaultValue={v.info}
          {...aria("s-info", e.info)}
        />
      </Champ>

      <ChampsAntiSpam prefixe="s" />

      <div>
        <label htmlFor="s-rgpd" className="checkbox-row">
          <input
            id="s-rgpd"
            name="rgpd"
            type="checkbox"
            required
            defaultChecked={v.rgpd === "on"}
            {...aria("s-rgpd", e.rgpd)}
          />
          <span>
            J&apos;autorise mon enfant à participer au stage et j&apos;accepte que ces informations soient utilisées
            pour son organisation. <Link href="/mentions-legales#donnees">Politique de confidentialité</Link>
          </span>
        </label>
        {e.rgpd && (
          <p id="s-rgpd-erreur" className="field-error">
            {e.rgpd}
          </p>
        )}
      </div>

      <button type="submit" className="btn btn--primary" style={{ height: 54, fontSize: 18 }} disabled={enCours}>
        {enCours ? "Envoi en cours…" : "Envoyer la demande d'inscription"}
      </button>
      <p className="form-note">
        Protection anti-spam : champ piège invisible et contrôle du temps de saisie, sans cookie ni service tiers.
      </p>
    </form>
  );
}
