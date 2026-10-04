"use client";

import { startTransition, useActionState, useMemo, useState } from "react";
import { affecterAdherent, importerAdherents, supprimerAdherents, type ResultatAdherents } from "@/app/espace-dirigeants/actions";
import type { Affectation, Affectations, BaseAdherents } from "@/lib/adherents";

function sansAccents(texte: string): string {
  return texte.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

type Champ = keyof Affectation;

/**
 * Liste des équipes du club : enregistrée dès qu'on change de valeur. La valeur est gardée par le tableau
 * (elle survit aux filtres) et revient en arrière si l'enregistrement échoue.
 */
function ChoixEquipe({
  nom,
  champ,
  valeur,
  equipes,
  label,
  onChoix,
}: {
  nom: string;
  champ: Champ;
  valeur: string;
  equipes: string[];
  label: string;
  onChoix: (equipe: string) => void;
}) {
  const [etat, setEtat] = useState<"" | "envoi" | "ok" | "erreur">("");
  return (
    <select
      className={`saisie saisie--equipe${etat ? ` saisie--${etat}` : ""}`}
      aria-label={`${label} de ${nom}`}
      value={valeur}
      onChange={async (e) => {
        const equipe = e.target.value;
        onChoix(equipe);
        setEtat("envoi");
        const r = await affecterAdherent(nom, champ, equipe);
        if (r.ok) setEtat("ok");
        else {
          onChoix(valeur);
          setEtat("erreur");
          window.alert(r.message);
        }
      }}
    >
      <option value="">—</option>
      {equipes.map((eq) => (
        <option key={eq} value={eq}>
          {eq}
        </option>
      ))}
    </select>
  );
}

/**
 * Onglet « Adhérents » : dépôt de l'export des licences (glisser-déposer ou choix du fichier), puis la
 * base (nom, qualification, catégorie, e-mail) avec recherche et filtre par catégorie, et la saisie des
 * équipes d'entraînement et de match de chaque adhérent.
 */
export function Adherents({ base, affectations, equipes }: { base: BaseAdherents | null; affectations: Affectations; equipes: string[] }) {
  const [etat, importer, enCours] = useActionState<ResultatAdherents | null, FormData>(importerAdherents, null);
  const [survol, setSurvol] = useState(false);
  const [recherche, setRecherche] = useState("");
  const [categorie, setCategorie] = useState("");
  const [saisies, setSaisies] = useState(affectations);
  const choisir = (nom: string, champ: Champ) => (equipe: string) =>
    setSaisies((s) => ({ ...s, [nom]: { ...(s[nom] ?? { entrainement: "", match: "" }), [champ]: equipe } }));

  function envoyer(fichier: File | undefined) {
    if (!fichier) return;
    const donnees = new FormData();
    donnees.set("fichier", fichier);
    startTransition(() => importer(donnees));
  }

  const adherents = useMemo(() => base?.adherents ?? [], [base]);
  const qualifies = adherents.filter((a) => a.qualification).length;
  const categories = useMemo(() => {
    const n = new Map<string, number>();
    for (const a of adherents) n.set(a.categorie || "—", (n.get(a.categorie || "—") ?? 0) + 1);
    return [...n].sort(([a], [b]) => a.localeCompare(b, "fr", { numeric: true }));
  }, [adherents]);
  const liste = useMemo(() => {
    const mots = sansAccents(recherche).split(/\s+/).filter(Boolean);
    return adherents.filter((a) => {
      if (categorie && (a.categorie || "—") !== categorie) return false;
      const texte = sansAccents(`${a.nom} ${a.email}`);
      return mots.every((m) => texte.includes(m));
    });
  }, [adherents, recherche, categorie]);

  return (
    <div className="adherents">
      <label
        className={survol ? "depot depot--survol" : "depot"}
        onDragOver={(e) => {
          e.preventDefault();
          setSurvol(true);
        }}
        onDragLeave={() => setSurvol(false)}
        onDrop={(e) => {
          e.preventDefault();
          setSurvol(false);
          envoyer(e.dataTransfer.files[0]);
        }}
      >
        <input
          type="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="sr-only"
          disabled={enCours}
          onChange={(e) => {
            envoyer(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        <strong>{enCours ? "Import en cours…" : "Déposez ici l'export des licences (.xlsx)"}</strong>
        <span>
          ou cliquez pour choisir le fichier « exporterLicenceDonnees.xlsx » (FBI → export des licences). Il remplace
          toute la base ; seuls le nom, la date de qualification, la catégorie et l'e-mail sont conservés. Les
          équipes saisies ci-dessous sont gardées.
        </span>
      </label>
      {etat ? (
        <p role="status" className={etat.ok ? "envoi-stage envoi-stage--ok" : "envoi-stage envoi-stage--erreur"}>
          {etat.message}
        </p>
      ) : null}

      {!base ? (
        <div className="vide">Aucune base pour l'instant : déposez l'export des licences ci-dessus.</div>
      ) : (
        <>
          <div className="adherents__tete">
            <p>
              {/* Adhérents qualifiés seulement (date de qualification renseignée dans l'export). */}
              <strong>
                {qualifies} adhérent{qualifies > 1 ? "s" : ""}
              </strong> · import du{" "}
              {new Date(base.importeLe).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Paris" })} ·{" "}
              {base.fichier}
            </p>
            <button
              type="button"
              className="bouton-supprimer"
              onClick={() => {
                if (window.confirm("Supprimer toute la base des adhérents ? Il faudra redéposer l'export pour la retrouver.")) {
                  startTransition(() => supprimerAdherents());
                }
              }}
            >
              Supprimer la base
            </button>
          </div>

          <div className="adherents__filtres">
            <label className="champ">
              <span>Rechercher</span>
              <input
                type="search"
                className="saisie"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Nom, prénom ou e-mail"
              />
            </label>
            <label className="champ">
              <span>Catégorie</span>
              <select className="saisie" value={categorie} onChange={(e) => setCategorie(e.target.value)}>
                <option value="">Toutes ({adherents.length})</option>
                {categories.map(([c, n]) => (
                  <option key={c} value={c}>
                    {c} ({n})
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="adherents__compte" aria-live="polite">
            {liste.length} ligne{liste.length > 1 ? "s" : ""} affichée{liste.length > 1 ? "s" : ""}
          </p>

          <div className="tableau-admin" role="region" aria-label="Adhérents" tabIndex={0}>
            <table>
              <thead>
                <tr>
                  <th scope="col">Nom</th>
                  <th scope="col">Qualification</th>
                  <th scope="col">Catégorie</th>
                  <th scope="col">Entraînement</th>
                  <th scope="col">Match</th>
                  <th scope="col">E-mail</th>
                </tr>
              </thead>
              <tbody>
                {liste.map((a, i) => (
                  <tr key={`${a.nom}-${a.email}-${i}`}>
                    <td>
                      <strong>{a.nom}</strong>
                    </td>
                    <td>{a.qualification || "—"}</td>
                    <td>{a.categorie || "—"}</td>
                    <td>
                      <ChoixEquipe
                        nom={a.nom}
                        champ="entrainement"
                        label="Équipe d'entraînement"
                        valeur={saisies[a.nom]?.entrainement ?? ""}
                        equipes={equipes}
                        onChoix={choisir(a.nom, "entrainement")}
                      />
                    </td>
                    <td>
                      <ChoixEquipe
                        nom={a.nom}
                        champ="match"
                        label="Équipe de match"
                        valeur={saisies[a.nom]?.match ?? ""}
                        equipes={equipes}
                        onChoix={choisir(a.nom, "match")}
                      />
                    </td>
                    <td>{a.email ? <a href={`mailto:${a.email}`}>{a.email}</a> : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
