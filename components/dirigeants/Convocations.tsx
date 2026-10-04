"use client";

import { useActionState, useId } from "react";
import { enregistrerConvocations, type ResultatConvocations } from "@/app/espace-dirigeants/actions";
import type { MatchAConvoquer } from "@/lib/nbb";

type Weekend = { samedi: string; titre: string; matchs: MatchAConvoquer[] };

/** « Paul P., Hugo C. » → ["Paul P.", "Hugo C."] (deux cases au plus, la seconde garde le reste). */
function enDeux(valeur: string): [string, string] {
  const [un = "", ...reste] = valeur.split(/\s*,\s*/).filter(Boolean);
  return [un, reste.join(", ")];
}

/**
 * Onglet « Convocations » : un formulaire par week-end (en cours, puis suivant), une ligne par match à
 * domicile avec deux arbitres, deux places à la table de marque et l'OTM. Chaque case propose la liste
 * des adhérents (base importée), des noms déjà utilisés et des équipes du club ; on peut aussi taper.
 */
export function Convocations({ weekends, choix }: { weekends: Weekend[]; choix: string[] }) {
  const liste = `${useId()}-choix`;
  return (
    <div className="convocations">
      <p className="convocations__intro">
        Les matchs viennent de la FFBB. Pour chacun : deux arbitres, deux places à la table de marque et l'OTM. Chaque
        case propose les adhérents et les équipes du club (U15M1, U18F2…) : tapez les premières lettres ou ouvrez la
        liste. Une case laissée vide s'affiche « — » sur la page Matchs.
      </p>
      <datalist id={liste}>
        {[...new Set(choix)].map((n) => (
          <option key={n} value={n} />
        ))}
      </datalist>
      {weekends.map((w) => (
        <FormulaireWeekend key={w.samedi} weekend={w} liste={liste} />
      ))}
    </div>
  );
}

function Case({ nom, libelle, valeur, liste }: { nom: string; libelle: string; valeur: string; liste: string }) {
  return (
    <label>
      <span>{libelle}</span>
      <input className="saisie" name={nom} defaultValue={valeur} list={liste} maxLength={80} autoComplete="off" />
    </label>
  );
}

function FormulaireWeekend({ weekend, liste }: { weekend: Weekend; liste: string }) {
  const [etat, action, enCours] = useActionState<ResultatConvocations | null, FormData>(enregistrerConvocations, null);
  const jours = [...new Set(weekend.matchs.map((m) => m.jour))];
  return (
    <form action={action} className="convocations__weekend" aria-label={weekend.titre}>
      <h2 className="convocations__titre">{weekend.titre}</h2>
      {weekend.matchs.length === 0 ? (
        <p className="vide">Aucun match à domicile ce week-end.</p>
      ) : (
        jours.map((jour) => (
          <section key={jour} className="convocations__jour">
            <h3>{jour}</h3>
            {weekend.matchs
              .filter((m) => m.jour === jour)
              .map((m) => {
                const [arbitre1, arbitre2] = enDeux(m.arbitres);
                const [table1, table2] = enDeux(m.table);
                return (
                  <fieldset key={m.cle} className="convocation">
                    <input type="hidden" name="match" value={m.cle} />
                    <legend className="convocation__match">
                      <strong>{m.heure || "Horaire à confirmer"}</strong>
                      <span className="tag-equipe">{m.equipe}</span>
                      <span>contre {m.adversaire}</span>
                      <span className="convocation__salle">{m.salle}</span>
                    </legend>
                    <div className="convocation__champs">
                      {m.officiels ? (
                        <div className="convocation__officiels convocation__large">
                          Arbitres officiels (désignés par la FFBB)
                          <input type="hidden" name={`${m.cle}|arbitre1`} value={m.arbitres} />
                        </div>
                      ) : (
                        <>
                          <Case nom={`${m.cle}|arbitre1`} libelle="Arbitre 1" valeur={arbitre1} liste={liste} />
                          <Case nom={`${m.cle}|arbitre2`} libelle="Arbitre 2" valeur={arbitre2} liste={liste} />
                        </>
                      )}
                      <Case nom={`${m.cle}|table1`} libelle="Table 1" valeur={table1} liste={liste} />
                      <Case nom={`${m.cle}|table2`} libelle="Table 2" valeur={table2} liste={liste} />
                      <Case nom={`${m.cle}|otm`} libelle="OTM" valeur={m.otm} liste={liste} />
                    </div>
                  </fieldset>
                );
              })}
          </section>
        ))
      )}
      {weekend.matchs.length > 0 ? (
        <div className="convocations__bas">
          <button type="submit" className="btn btn--m btn--nuit" disabled={enCours}>
            {enCours ? "Enregistrement…" : "Enregistrer les convocations"}
          </button>
          {etat ? (
            <span role="status" className={etat.ok ? "envoi-stage envoi-stage--ok" : "envoi-stage envoi-stage--erreur"}>
              {etat.message}
            </span>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
