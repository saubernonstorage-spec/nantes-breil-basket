"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { inscrireStage } from "@/app/actions";
import type { SemaineOuverte } from "@/lib/nbb";
import { RESULTAT_INITIAL, STATUTS_STAGE } from "@/lib/formulaires";
import type { ReductionStage, StatutStage } from "@/lib/types";
import {
  appliquerReduction,
  coutSemaine,
  estEmail,
  estTelephone,
  euros,
  tauxReduction,
  type PrixStage,
} from "@/lib/utils";
import { CaseACocher, ChampListe, ChampTexte, Confirmation, Erreur, Piege } from "@/components/formulaires/Champs";

type Props = {
  semaines: SemaineOuverte[];
  prix: Record<StatutStage, PrixStage>;
  reductions: ReductionStage[];
  annees: string[];
};

const VIDE = {
  jours: [] as string[],
  enfantPrenom: "",
  enfantNom: "",
  annee: "",
  statut: "licencies" as StatutStage,
  fratrie: "1",
  parentPrenom: "",
  parentNom: "",
  email: "",
  tel: "",
  participation: false,
  autorisation: false,
  image: false,
  hp: "",
};

type Formulaire = typeof VIDE;

export function StageForm({ semaines, prix, reductions, annees }: Props) {
  const [f, setF] = useState<Formulaire>(VIDE);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [resultat, envoyer, enCours] = useActionState(inscrireStage, RESULTAT_INITIAL);
  const [termine, setTermine] = useState(false);
  const t0 = useRef(0);

  useEffect(() => {
    t0.current = Date.now();
  }, []);

  const erreursServeur = resultat.statut === "erreur" ? (resultat.erreurs ?? {}) : {};
  const err = (k: string) => erreurs[k] ?? erreursServeur[k] ?? "";

  const maj = <K extends keyof Formulaire>(k: K, v: Formulaire[K]) => {
    setF((x) => ({ ...x, [k]: v }));
    setErreurs((e) => ({ ...e, [k === "jours" ? "semaines" : k]: "" }));
  };

  const p = prix[f.statut];
  const nChoisis = (w: SemaineOuverte) => w.jours.filter((j) => f.jours.includes(j.id)).length;
  const brut = semaines.reduce((s, w) => s + coutSemaine(nChoisis(w), w.jours.length, p), 0);
  const taux = tauxReduction(reductions, Number(f.fratrie) || 1);
  const total = f.jours.length ? euros(appliquerReduction(brut, taux)) : "—";

  const valider = () => {
    const e: Record<string, string> = {};
    if (!f.jours.length) e.semaines = "Choisissez une semaine ou au moins une journée.";
    if (!f.enfantPrenom.trim()) e.enfantPrenom = "Indiquez le prénom de l'enfant.";
    if (!f.enfantNom.trim()) e.enfantNom = "Indiquez le nom de l'enfant.";
    if (!f.annee) e.annee = "Choisissez l'année de naissance.";
    if (!f.parentPrenom.trim()) e.parentPrenom = "Indiquez le prénom du parent.";
    if (!f.parentNom.trim()) e.parentNom = "Indiquez le nom du parent.";
    if (!estEmail(f.email)) e.email = "Adresse e-mail invalide.";
    if (!estTelephone(f.tel)) e.tel = "Numéro à 10 chiffres.";
    if (!f.participation) e.participation = "L'autorisation parentale est nécessaire.";
    if (!f.autorisation) e.autorisation = "Votre accord est nécessaire pour traiter la demande.";
    if (f.annee) {
      for (const w of semaines) {
        if (w.nesDe && w.nesA && nChoisis(w) > 0 && (+f.annee < w.nesDe || +f.annee > w.nesA)) {
          e.semaines = `${w.nom} : réservée aux enfants né(e)s de ${w.nesDe} à ${w.nesA}.`;
        }
      }
    }
    return e;
  };

  const soumettre = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = valider();
    setErreurs(e);
    if (Object.keys(e).length) return;
    const d = new FormData();
    for (const [k, v] of Object.entries(f)) {
      if (k === "jours") f.jours.forEach((j) => d.append("jours", j));
      else if (typeof v === "boolean") {
        if (v) d.set(k, "on");
      } else d.set(k, String(v));
    }
    d.set("t", String(t0.current));
    setTermine(true);
    startTransition(() => envoyer(d));
  };

  if (termine && !enCours && resultat.statut === "succes") {
    return (
      <Confirmation titre="Demande enregistrée">
        <p className="confirmation__texte">
          {/^[A-Z]{3}-/.test(resultat.reference) ? (
            <>
              Référence <strong className="mono">{resultat.reference}</strong>.{" "}
            </>
          ) : null}
          Déposez maintenant le règlement{resultat.montant ? ` (${resultat.montant})` : ""} : la place est confirmée par
          SMS dès sa réception.
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
          Inscrire un autre enfant
        </button>
      </Confirmation>
    );
  }

  const ON = "choix--actif";

  return (
    <form noValidate onSubmit={soumettre} className="formulaire">
      <fieldset className="groupe-champs">
        <legend>Semaine ou journées de stage *</legend>
        <p className="champ__aide" style={{ margin: "0 0 10px" }}>
          Inscrivez votre enfant à la semaine ou seulement certains jours. Tous les jours d'une même semaine sont facturés
          au tarif semaine.
        </p>
        <div className="semaines-stage">
          {semaines.map((w) => {
            const ids = w.jours.map((j) => j.id);
            const n = nChoisis(w);
            const complete = n > 0 && n === ids.length;
            const eligibilite = w.nesDe
              ? `Né(e)s de ${w.nesDe} à ${w.nesA} · ${w.licenciesFFBB ? "Licenciés FFBB uniquement" : "Tout public"}`
              : "";
            // Prix de cette semaine complète : 5 jours ou, à Noël, 4 jours.
            const semaine = coutSemaine(ids.length, ids.length, p);
            const resume = complete
              ? `Semaine complète · ${semaine} €`
              : n
                ? `${n} jour${n > 1 ? "s" : ""} · ${coutSemaine(n, ids.length, p)} €`
                : `${semaine} € la semaine · ${p.jour} € le jour`;
            return (
              <div key={w.id} className={n ? "semaine-stage semaine-stage--choisie" : "semaine-stage"}>
                <div className="semaine-stage__tete">
                  <div>
                    <div className="semaine-stage__nom">
                      <strong>{w.periode}</strong> · {w.nom} — {w.dates}
                    </div>
                    {eligibilite ? <div className="semaine-stage__public">{eligibilite}</div> : null}
                    {w.cloture ? <div className="semaine-stage__cloture">Inscriptions jusqu'au {w.cloture}</div> : null}
                  </div>
                  <span className="semaine-stage__resume">{resume}</span>
                </div>
                <div role="group" aria-label={`${w.nom} : choix des jours`} className="rangee" style={{ gap: 6 }}>
                  <button
                    type="button"
                    aria-pressed={complete}
                    className={`choix choix--fort ${complete ? ON : ""}`}
                    onClick={() =>
                      maj("jours", complete ? f.jours.filter((id) => !ids.includes(id)) : [...f.jours.filter((id) => !ids.includes(id)), ...ids])
                    }
                  >
                    Toute la semaine
                  </button>
                  {w.jours.map((j) => {
                    const actif = f.jours.includes(j.id);
                    return (
                      <button
                        key={j.id}
                        type="button"
                        aria-pressed={actif}
                        aria-label={j.long}
                        className={`choix choix--jour ${actif ? ON : ""}`}
                        onClick={() => maj("jours", actif ? f.jours.filter((id) => id !== j.id) : [...f.jours, j.id])}
                      >
                        {j.court}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <Erreur message={err("semaines")} />
      </fieldset>

      <div className="champs" style={{ "--min": "280px" } as React.CSSProperties}>
        <ChampTexte label="Prénom de l'enfant *" value={f.enfantPrenom} onChange={(e) => maj("enfantPrenom", e.target.value)} autoComplete="off" erreur={err("enfantPrenom")} />
        <ChampTexte label="Nom de l'enfant *" value={f.enfantNom} onChange={(e) => maj("enfantNom", e.target.value)} autoComplete="off" erreur={err("enfantNom")} />
        <ChampListe label="Année de naissance *" value={f.annee} onChange={(e) => maj("annee", e.target.value)} erreur={err("annee")}>
          <option value="">Choisir…</option>
          {annees.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </ChampListe>
        <ChampListe label="Tarif applicable *" value={f.statut} onChange={(e) => maj("statut", e.target.value as StatutStage)}>
          {STATUTS_STAGE.map((s) => (
            <option key={s.valeur} value={s.valeur}>
              {s.label}
            </option>
          ))}
        </ChampListe>
        <ChampTexte label="Prénom du parent *" value={f.parentPrenom} onChange={(e) => maj("parentPrenom", e.target.value)} autoComplete="given-name" erreur={err("parentPrenom")} />
        <ChampTexte label="Nom du parent *" value={f.parentNom} onChange={(e) => maj("parentNom", e.target.value)} autoComplete="family-name" erreur={err("parentNom")} />
        <ChampTexte label="E-mail *" type="email" value={f.email} onChange={(e) => maj("email", e.target.value)} autoComplete="email" inputMode="email" erreur={err("email")} />
        <ChampTexte label="Portable (pour le SMS) *" type="tel" value={f.tel} onChange={(e) => maj("tel", e.target.value)} autoComplete="tel" inputMode="tel" erreur={err("tel")} />
      </div>

      <CaseACocher checked={f.participation} onChange={(e) => maj("participation", e.target.checked)} erreur={err("participation")}>
        J'autorise mon enfant à participer au stage du NBB et j'autorise la direction du stage à prendre toutes les mesures
        d'urgence en cas d'accident. *
      </CaseACocher>
      <CaseACocher checked={f.autorisation} onChange={(e) => maj("autorisation", e.target.checked)} erreur={err("autorisation")}>
        J'accepte que ces informations servent uniquement à l'organisation du stage.{" "}
        <Link href="/mentions-legales#confidentialite">Confidentialité</Link> *
      </CaseACocher>
      <CaseACocher checked={f.image} onChange={(e) => maj("image", e.target.checked)}>
        J'autorise la publication de photos de groupe prises pendant le stage (facultatif)
      </CaseACocher>
      <Piege valeur={f.hp} onChange={(v) => maj("hp", v)} />

      <ChampListe
        className="champ--ligne"
        label="Enfants de la famille inscrits à ce stage"
        value={f.fratrie}
        onChange={(e) => maj("fratrie", e.target.value)}
      >
        <option value="1">1 enfant</option>
        {reductions.map((r) => (
          <option key={r.enfants} value={String(r.enfants)}>
            {r.enfants} enfants · −{r.taux} %
          </option>
        ))}
      </ChampListe>

      <div className="total">
        <span className="total__label">Montant à régler</span>
        <span className="total__montants">
          {f.jours.length > 0 && taux > 0 ? (
            <>
              <span className="total__barre">{euros(brut)}</span>
              <span className="total__remise">−{taux} %</span>
            </>
          ) : null}
          {/* La clé change avec le montant : il « bat » brièvement à chaque mise à jour. */}
          <strong key={total} className={f.jours.length ? "total__valeur total__valeur--maj" : "total__valeur"}>
            {total}
          </strong>
        </span>
      </div>

      {resultat.statut === "erreur" && !enCours ? <p className="erreur-globale" role="alert">{resultat.message}</p> : null}

      <button type="submit" className="btn btn--xl btn--orange btn--large" disabled={enCours}>
        {enCours ? "Envoi en cours…" : "Envoyer la demande d'inscription"}
      </button>
    </form>
  );
}
