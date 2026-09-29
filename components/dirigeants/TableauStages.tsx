import type { Demande } from "@/lib/stockage";
import { lienTel } from "@/lib/utils";
import { ConfirmerStage, Supprimer, type EtatMessagerie } from "@/components/dirigeants/Dirigeants";

/**
 * Espace dirigeants, onglet Stages : une ligne par inscription (plus récente en premier).
 * Deux statuts seulement, non modifiables à la main : « À traiter » à l'arrivée, « Confirmé » une fois
 * l'e-mail de confirmation envoyé.
 * L'autorisation parentale n'a pas de colonne : elle est obligatoire pour envoyer le formulaire.
 */

function dateCourte(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Paris" });
}

/** « 72 € (réduction famille de 15 % sur 85 €) » → montant et précision. */
function montant(texte: string): { valeur: string; note: string } {
  const m = texte.match(/^(.*?)\s*\((.*)\)$/);
  return m ? { valeur: m[1], note: m[2] } : { valeur: texte, note: "" };
}

export function TableauStages({ demandes, messagerie }: { demandes: Demande[]; messagerie: EtatMessagerie }) {
  return (
    <div className="tableau-admin" role="region" aria-label="Inscriptions aux stages" tabIndex={0}>
      <table>
        <caption className="sr-only">Inscriptions aux stages, de la plus récente à la plus ancienne</caption>
        <thead>
          <tr>
            <th scope="col">Reçue le</th>
            <th scope="col">Enfant</th>
            <th scope="col">Semaines / jours</th>
            <th scope="col">Tarif</th>
            <th scope="col">Montant</th>
            <th scope="col">Parent</th>
            <th scope="col">Statut</th>
            <th scope="col">Confirmation</th>
            <th scope="col">
              <span className="sr-only">Supprimer</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {demandes.map((d) => {
            const c = d.champs;
            const m = montant(c["Montant"] ?? "");
            const fratrie = Number(c["Enfants de la famille inscrits"]) || 1;
            const semaines = (c["Semaines / jours"] ?? "").split(" ; ").filter(Boolean);
            const envoyeeLe = d.confirmationEnvoyee ? dateCourte(d.confirmationEnvoyee) : "";
            const confirme = !!envoyeeLe || d.statut === "Confirmé";
            return (
              <tr key={d.id}>
                <td>
                  <span className="tableau-admin__date">{dateCourte(d.recuLe)}</span>
                  <span className="mono tableau-admin__petit">{d.id}</span>
                </td>
                <th scope="row" className="tableau-admin__enfant">
                  <span className="tableau-admin__nom">{c["Enfant"] || "—"}</span>
                  {c["Année de naissance"] ? <span className="tableau-admin__petit">Né(e) en {c["Année de naissance"]}</span> : null}
                  {c["Photos de groupe"] ? (
                    <span className="tableau-admin__petit">
                      Photos : {c["Photos de groupe"] === "Non" ? "refusées" : c["Photos de groupe"].toLowerCase()}
                    </span>
                  ) : null}
                </th>
                <td>
                  {semaines.length ? (
                    <ul className="tableau-admin__liste">
                      {semaines.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  {c["Tarif"] || "—"}
                  {fratrie > 1 ? <span className="tableau-admin__petit">{fratrie} enfants inscrits</span> : null}
                </td>
                <td>
                  <strong className="tableau-admin__montant">{m.valeur || "—"}</strong>
                  {m.note ? <span className="tableau-admin__petit">{m.note}</span> : null}
                </td>
                <td className="tableau-admin__parent">
                  {c["Parent"] || "—"}
                  {c["E-mail"] ? (
                    <a href={`mailto:${c["E-mail"]}`} className="tableau-admin__petit">
                      {c["E-mail"]}
                    </a>
                  ) : null}
                  {c["Téléphone"] ? (
                    <a href={lienTel(c["Téléphone"])} className="tableau-admin__petit">
                      {c["Téléphone"]}
                    </a>
                  ) : null}
                </td>
                <td>
                  <span className={confirme ? "etat-stage etat-stage--confirme" : "etat-stage"}>{confirme ? "Confirmé" : "À traiter"}</span>
                </td>
                <td>
                  <div className="tableau-admin__actions">
                    <ConfirmerStage
                      id={d.id}
                      destinataire={c["E-mail"] ?? ""}
                      envoyeeLe={envoyeeLe}
                      messagerie={messagerie}
                    />
                    {envoyeeLe ? <span className="tableau-admin__petit">Envoyée le {envoyeeLe}</span> : null}
                  </div>
                </td>
                <td>
                  <Supprimer table="stages" id={d.id} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
