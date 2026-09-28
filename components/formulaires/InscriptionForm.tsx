"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { preinscrire } from "@/app/actions";
import { RESULTAT_INITIAL } from "@/lib/formulaires";
import {
  categorieParAnnee,
  equipesProposees,
  estEmail,
  estimerCotisation,
  estTelephone,
  type PrixCotisation,
} from "@/lib/utils";
import { CaseACocher, ChampListe, ChampTexte, Confirmation, Erreur, Piege } from "@/components/formulaires/Champs";

type Props = {
  equipes: string[];
  categoriesAge: { categorie: string; nesDe: number; nesA: number }[];
  cotisation: {
    tarifsEquipes: Record<string, PrixCotisation>;
    mini: PrixCotisation;
    seniors: PrixCotisation;
    jeunes: { min: PrixCotisation; max: PrixCotisation };
  };
  commissions: string[];
  /** Né(e) cette année-là ou après : mineur pendant la saison. */
  anneeMineur: number;
  charte: string;
  saison: string;
  delaiReponse: string;
  emailLicence: string;
};

const VIDE = {
  type: "nouvelle",
  prenom: "",
  nom: "",
  naissance: "",
  sexe: "",
  equipe: "",
  respNom: "",
  respLien: "Parent",
  email: "",
  tel: "",
  cp: "",
  ville: "",
  image: "",
  sante: "",
  assuranceB: false,
  charte: false,
  rgpd: false,
  benevolat: [] as string[],
  hp: "",
};

type Formulaire = typeof VIDE;

const ETAPES = ["Le joueur", "Contact", "Autorisations", "Vérification"];

function Choix({
  legende,
  nom,
  options,
  valeur,
  onChange,
  erreur,
  aide,
  bloc,
}: {
  legende: string;
  nom: string;
  options: [string, string][];
  valeur: string;
  onChange: (v: string) => void;
  erreur?: string;
  aide?: string;
  bloc?: boolean;
}) {
  return (
    <fieldset className="groupe-champs">
      <legend>{legende}</legend>
      {aide ? <p className="champ__aide" style={{ margin: "0 0 4px" }}>{aide}</p> : null}
      <div className={bloc ? "options options--bloc" : "options"}>
        {options.map(([v, label]) => (
          <label key={v} className="option">
            <input type="radio" name={nom} checked={valeur === v} onChange={() => onChange(v)} />
            {label}
          </label>
        ))}
      </div>
      {erreur !== undefined ? <Erreur message={erreur} /> : null}
    </fieldset>
  );
}

export function InscriptionForm(props: Props) {
  const { equipes, categoriesAge, cotisation, commissions, anneeMineur } = props;
  const [f, setF] = useState<Formulaire>(VIDE);
  const [etape, setEtape] = useState(1);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [resultat, envoyer, enCours] = useActionState(preinscrire, RESULTAT_INITIAL);
  const [termine, setTermine] = useState(false);
  const t0 = useRef(0);
  const haut = useRef<HTMLDivElement>(null);

  useEffect(() => {
    t0.current = Date.now();
  }, []);

  const erreursServeur = resultat.statut === "erreur" && !enCours ? (resultat.erreurs ?? {}) : {};
  const err = (k: string) => erreurs[k] ?? erreursServeur[k] ?? "";

  const maj = <K extends keyof Formulaire>(k: K, v: Formulaire[K]) => {
    setF((x) => ({ ...x, [k]: v }));
    setErreurs((e) => ({ ...e, [k]: "", ...(k === "charte" || k === "rgpd" ? { accords: "" } : {}) }));
  };

  const annee = /^\d{4}/.test(f.naissance) ? Number(f.naissance.slice(0, 4)) : 0;
  const mineur = annee >= anneeMineur;
  const categorie = categorieParAnnee(categoriesAge, annee);
  const proposees = equipesProposees(equipes, categorie, f.sexe);
  const estimation = estimerCotisation({
    categorie,
    tarifEquipe: f.equipe ? cotisation.tarifsEquipes[f.equipe] ?? null : null,
    mini: cotisation.mini,
    seniors: cotisation.seniors,
    jeunes: cotisation.jeunes,
    assuranceB: f.assuranceB,
  });

  const valider = (n: number) => {
    const e: Record<string, string> = {};
    if (n === 1) {
      if (!f.prenom.trim()) e.prenom = "Indiquez le prénom.";
      if (!f.nom.trim()) e.nom = "Indiquez le nom.";
      if (!annee || annee < 1930 || annee > new Date().getFullYear() - 2) e.naissance = "Indiquez une date de naissance valide.";
      if (!f.sexe) e.sexe = "Choisissez une option.";
    }
    if (n === 2) {
      if (mineur && !f.respNom.trim()) e.respNom = "Obligatoire pour un mineur.";
      if (!estEmail(f.email)) e.email = "Adresse e-mail invalide.";
      if (!estTelephone(f.tel)) e.tel = "Numéro à 10 chiffres.";
    }
    if (n === 3) {
      if (!f.image) e.image = "Choisissez oui ou non.";
      if (!f.sante) e.sante = "Choisissez une option.";
      if (!f.charte || !f.rgpd) e.accords = "Les deux cases marquées * sont nécessaires.";
    }
    return e;
  };

  const remonter = () => haut.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const soumettre = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = valider(etape);
    setErreurs(e);
    if (Object.keys(e).length) return;
    if (etape < 4) {
      setEtape(etape + 1);
      remonter();
      return;
    }
    const d = new FormData();
    for (const [k, v] of Object.entries(f)) {
      if (k === "benevolat") f.benevolat.forEach((b) => d.append("benevolat", b));
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
          Merci !{" "}
          {/^[A-Z]{3}-/.test(resultat.reference) ? (
            <>
              Votre dossier <strong className="mono">{resultat.reference}</strong> est entre les mains de la commission
              Inscriptions.
            </>
          ) : (
            <>Votre dossier est entre les mains de la commission Inscriptions.</>
          )}{" "}
          Nous vous confirmons la place par e-mail sous {props.delaiReponse}, avec les modalités de règlement.
        </p>
        <ol className="confirmation__etapes">
          <li>Préparez les documents à fournir (liste ci-dessus).</li>
          <li>Réglez la cotisation après confirmation de la place.</li>
          <li>Surveillez vos e-mails : le lien de licence vient de {props.emailLicence}.</li>
        </ol>
        <div className="rangee rangee--10">
          <button
            type="button"
            className="btn btn--m btn--contour"
            onClick={() => {
              setF(VIDE);
              setEtape(1);
              setErreurs({});
              setTermine(false);
              t0.current = Date.now();
            }}
          >
            Inscrire une autre personne
          </button>
          <Link href="/planning" className="btn btn--m btn--nuit">
            Voir le planning
          </Link>
        </div>
      </Confirmation>
    );
  }

  const erreurGlobale =
    Object.values(erreurs).some(Boolean) ? "Certains champs sont à compléter." : resultat.statut === "erreur" && !enCours ? resultat.message : "";

  return (
    <div ref={haut} className="assistant">
      <div className="assistant__etat">
        <strong>
          Étape {etape} sur 4 — {ETAPES[etape - 1]}
        </strong>
        <span>{etape * 25}%</span>
      </div>
      <div aria-hidden="true" className="assistant__barre">
        <div style={{ width: `${etape * 25}%` }} />
      </div>

      <form noValidate onSubmit={soumettre} aria-describedby="form-erreur" className="formulaire">
        {etape === 1 ? (
          <>
            <Choix
              legende="Type de demande *"
              nom="type"
              valeur={f.type}
              onChange={(v) => maj("type", v)}
              options={[
                ["nouvelle", "Nouvelle inscription"],
                ["reinscription", "Réinscription"],
              ]}
            />
            <div className="champs" style={{ "--min": "220px" } as React.CSSProperties}>
              <ChampTexte label="Prénom du joueur / de la joueuse *" value={f.prenom} onChange={(e) => maj("prenom", e.target.value)} autoComplete="off" erreur={err("prenom")} />
              <ChampTexte label="Nom *" value={f.nom} onChange={(e) => maj("nom", e.target.value)} autoComplete="off" erreur={err("nom")} />
              <ChampTexte label="Date de naissance *" type="date" value={f.naissance} onChange={(e) => maj("naissance", e.target.value)} erreur={err("naissance")} />
              <ChampListe label="Sexe (licence FFBB) *" value={f.sexe} onChange={(e) => maj("sexe", e.target.value)} erreur={err("sexe")}>
                <option value="">Choisir…</option>
                <option value="F">Féminin</option>
                <option value="M">Masculin</option>
              </ChampListe>
            </div>
            {annee && categorie ? (
              <div className="note-orange note-orange--categorie">
                <strong>{categorie}</strong>
                Catégorie indicative pour la saison {props.saison} — confirmée par le club.
              </div>
            ) : null}
            <ChampListe
              label="Équipe souhaitée"
              value={f.equipe}
              onChange={(e) => maj("equipe", e.target.value)}
              aide="La répartition finale est faite par la Commission technique selon le niveau et les places."
            >
              <option value="">Je ne sais pas — le club me conseillera</option>
              {proposees.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </ChampListe>
          </>
        ) : null}

        {etape === 2 ? (
          <>
            {mineur ? (
              <div className="champs" style={{ "--min": "220px" } as React.CSSProperties}>
                <ChampTexte label="Responsable légal·e — prénom et nom *" value={f.respNom} onChange={(e) => maj("respNom", e.target.value)} autoComplete="name" erreur={err("respNom")} />
                <ChampListe label="Lien avec l'enfant" value={f.respLien} onChange={(e) => maj("respLien", e.target.value)}>
                  <option value="Parent">Parent</option>
                  <option value="Tuteur / tutrice">Tuteur / tutrice</option>
                  <option value="Autre">Autre</option>
                </ChampListe>
              </div>
            ) : null}
            <div className="champs" style={{ "--min": "220px" } as React.CSSProperties}>
              <ChampTexte label="E-mail *" type="email" value={f.email} onChange={(e) => maj("email", e.target.value)} autoComplete="email" inputMode="email" erreur={err("email")} />
              <ChampTexte label="Téléphone portable *" type="tel" value={f.tel} onChange={(e) => maj("tel", e.target.value)} autoComplete="tel" inputMode="tel" erreur={err("tel")} />
              <ChampTexte label="Code postal" value={f.cp} onChange={(e) => maj("cp", e.target.value)} autoComplete="postal-code" inputMode="numeric" />
              <ChampTexte label="Ville" value={f.ville} onChange={(e) => maj("ville", e.target.value)} autoComplete="address-level2" />
            </div>
          </>
        ) : null}

        {etape === 3 ? (
          <>
            <Choix
              legende="Autorisation de droit à l'image *"
              aide="Photos de match et d'entraînement publiées sur le site et les réseaux du club. Votre choix est modifiable à tout moment."
              nom="image"
              valeur={f.image}
              onChange={(v) => maj("image", v)}
              erreur={err("image")}
              options={[
                ["oui", "Oui, j'autorise"],
                ["non", "Non, je n'autorise pas"],
              ]}
            />
            <Choix
              legende="Santé *"
              nom="sante"
              bloc
              valeur={f.sante}
              onChange={(v) => maj("sante", v)}
              erreur={err("sante")}
              options={[
                ["questionnaire", "Mineur : réponses « non » à toutes les questions du questionnaire de santé"],
                ["certificat", "Je fournirai un certificat médical"],
              ]}
            />
            <CaseACocher encadree checked={f.assuranceB} onChange={(e) => maj("assuranceB", e.target.checked)}>
              Je souhaite l'option d'assurance <strong>formule B</strong> (indemnités journalières, +5 €)
            </CaseACocher>
            <fieldset className="groupe-champs">
              <legend>Un coup de main au club ? (facultatif)</legend>
              <div className="rangee rangee--8">
                {commissions.map((c) => {
                  const coche = f.benevolat.includes(c);
                  return (
                    <label key={c} className="puce-choix">
                      <input
                        type="checkbox"
                        checked={coche}
                        onChange={() => maj("benevolat", coche ? f.benevolat.filter((x) => x !== c) : [...f.benevolat, c])}
                      />
                      {c}
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <CaseACocher checked={f.charte} onChange={(e) => maj("charte", e.target.checked)}>
              J'ai lu et j'accepte la{" "}
              <a href={props.charte} target="_blank" rel="noopener">
                charte de l'adhérent
              </a>{" "}
              *
            </CaseACocher>
            <CaseACocher checked={f.rgpd} onChange={(e) => maj("rgpd", e.target.checked)}>
              J'accepte que ces informations soient utilisées pour gérer l'adhésion et la licence FFBB.{" "}
              <Link href="/mentions-legales#confidentialite">Confidentialité</Link> *
            </CaseACocher>
            <Erreur message={err("accords")} />
          </>
        ) : null}

        {etape === 4 ? (
          <>
            <dl className="recap">
              {[
                ["Demande", f.type === "reinscription" ? "Réinscription" : "Nouvelle inscription"],
                ["Joueur / joueuse", `${f.prenom} ${f.nom}`],
                ["Naissance", `${f.naissance.split("-").reverse().join("/")} · ${categorie}`],
                ["Équipe souhaitée", f.equipe || "À définir avec le club"],
                ["Contact", `${mineur ? `${f.respNom} · ` : ""}${f.email} · ${f.tel}`],
                ["Droit à l'image", f.image === "oui" ? "Autorisé" : "Refusé"],
                ["Bénévolat", f.benevolat.length ? f.benevolat.join(", ") : "—"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <div className="total">
              <span className="total__label">Cotisation estimée</span>
              <strong className="total__valeur" style={{ fontSize: 40 }}>
                {estimation}
              </strong>
            </div>
          </>
        ) : null}

        <Piege valeur={f.hp} onChange={(v) => maj("hp", v)} />
        <p id="form-erreur" role="alert" className="erreur-globale">
          {erreurGlobale}
        </p>
        <div className="assistant__boutons">
          {etape > 1 ? (
            <button
              type="button"
              className="btn btn--l btn--retour"
              onClick={() => {
                setEtape(etape - 1);
                setErreurs({});
              }}
            >
              <span className="fleche fleche--gauche" aria-hidden="true">←</span> Retour
            </button>
          ) : null}
          <button type="submit" className="btn btn--l btn--orange" style={{ marginLeft: "auto" }} disabled={enCours}>
            {etape < 4 ? "Continuer" : enCours ? "Envoi en cours…" : "Envoyer ma demande"}
          </button>
        </div>
      </form>
    </div>
  );
}
