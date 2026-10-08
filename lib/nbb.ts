/**
 * Données calculées à partir de `data/nbb.ts` : équipes, gymnases, matchs, stages…
 * Rien à modifier ici pour mettre à jour le contenu.
 * (Réservé au serveur : les composants du navigateur reçoivent ces données en props.)
 */
import "server-only";

import {
  ADRESSES_SALLES,
  AGENDA,
  CAPACITES,
  CATEGORIES,
  CLASSEMENTS,
  CONVOCATIONS,
  EQUIPES_A_L_AFFICHE,
  EQUIPES_FFBB,
  CLUB,
  GYMNASES,
  LABEL_ECOLE,
  LIGNES_NAOLIB,
  MATCHS_MANUELS,
  NAISSANCE,
  NOMS_CLUBS,
  PHOTOS_EQUIPES,
  SALLES_FFBB,
  SLOTS,
  STAGES,
  STAGE_A_PREVOIR,
  STAGE_CONFIRMATION,
  CONTACT_ACCUSE,
  STAGE_CONTACT,
  STAGE_JOURNEE,
  STAGE_TARIFS,
  STATS,
  TARIFS,
} from "@/data/nbb";
import type { Chiffre, Classement, CleCategorie, Creneau, Jour, LigneClassement, SemaineStage, Stage, StatutStage, Tarif } from "@/lib/types";
import * as DONNEES from "@/data/nbb";
import classementsFFBB from "@/data/classements-ffbb.json";
import logosFFBB from "@/data/logos-ffbb.json";
import matchsFFBB from "@/data/matchs-ffbb.json";
import resultatsFFBB from "@/data/resultats-ffbb.json";
import { aCompleter, duree, heure, heureCourte, itineraire, majuscule, MARQUE_A_COMPLETER, montant, pluriel, slug, type PrixCotisation, type PrixStage } from "@/lib/utils";

export const JOURS: Jour[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const collator = new Intl.Collator("fr", { numeric: true });
const cmp = (a: string, b: string) => collator.compare(a, b);

/** Date du jour à Nantes, au format AAAA-MM-JJ. */
export function aujourdhui(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date());
}

/** Date AAAA-MM-JJ (+ décalage en jours) à midi UTC, pour formater sans surprise de fuseau. */
function dateDe(iso: string, decalage = 0): Date {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + decalage);
  return d;
}

function formater(d: Date, options: Intl.DateTimeFormatOptions): string {
  return d.toLocaleDateString("fr-FR", { timeZone: "UTC", ...options });
}

/** Première année de la saison : "2026-2027" → 2026. */
export function anneeSaison(): number {
  return Number(CLUB.saison.slice(0, 4));
}

/* ───────── Planning et équipes ───────── */

export const CRENEAUX: Creneau[] = SLOTS.map(([gymnase, jour, debut, fin, equipes, coachs]) => ({
  gymnase,
  jour,
  debut,
  fin,
  equipes,
  coachs,
}));

export function categorieDe(e: string): CleCategorie {
  if (/^Micro|^U7$|^U9|^U11/.test(e)) return "mini";
  if (/^U13|^U15|^U18/.test(e)) return "jeunes";
  if (/^SF|^SM/.test(e)) return "seniors";
  return "loisirs";
}

export function toutesLesEquipes(): string[] {
  return [...new Set(CRENEAUX.flatMap((s) => s.equipes))].sort(cmp);
}

export function creneauxDe(e: string): Creneau[] {
  return CRENEAUX.filter((s) => s.equipes.includes(e)).sort(
    (a, b) => JOURS.indexOf(a.jour) - JOURS.indexOf(b.jour) || a.debut.localeCompare(b.debut),
  );
}

export function tarifDe(e: string): Tarif {
  const c = categorieDe(e);
  if (/^Micro|^U7$/.test(e)) return TARIFS[0];
  if (c === "seniors") return TARIFS[4];
  if (c === "loisirs") return TARIFS[5];
  const n = (CAPACITES[e] ?? [creneauxDe(e).length])[0];
  return n >= 3 ? TARIFS[3] : n === 2 ? TARIFS[2] : TARIFS[1];
}

/** "Micro 1" → "Micro 1 · né(e)s en 2021". */
export function avecNaissance(e: string): string {
  return NAISSANCE[e] ? `${e} · né(e)s en ${NAISSANCE[e]}` : e;
}

/** "U11F2" → "U11 féminines 2", "U13HPB" → "U13 masculins · CTC"… */
export function libelleEquipe(n: string): string {
  let m: RegExpMatchArray | null;
  if ((m = n.match(/^(U\d+)(M|F)(\d)$/))) return `${m[1]} ${m[2] === "F" ? "féminines" : "masculins"} ${m[3]}`;
  if ((m = n.match(/^(U\d+)HPB$/))) return `${m[1]} masculins · CTC`;
  if ((m = n.match(/^S(M|F)(\d)$/))) return `Seniors ${m[1] === "F" ? "féminines" : "masculins"} ${m[2]}`;
  if (/^Micro/.test(n)) return avecNaissance(n);
  if (n === "U7") return "U7 · mixte";
  if (n === "Loisirs") return "Loisirs adultes";
  return n;
}

export function ancreGymnase(nom: string): string {
  return `gym-${slug(nom)}`;
}

export type CreneauEquipe = { jour: Jour; horaire: string; gymnase: string; lienGymnase: string };

export type FicheEquipe = {
  nom: string;
  libelle: string;
  ancre: string;
  coachs: string;
  creneaux: CreneauEquipe[];
  ctc: boolean;
  photo: string;
  classement: {
    championnat: string;
    maj: string;
    lignes: { rang: number; equipe: string; j: number; v: number; d: number; pts: number; nbb: boolean; logo: string }[];
    sansCompetition: boolean;
  };
};

/* ───────── Logos des clubs (scripts/donnees_ffbb.py → public/logos/, data/logos-ffbb.json) ───────── */

const LOGOS = (logosFFBB as { logos: Record<string, { nom: string; logo: string }> }).logos;

/** « Rezé Basket 44 - 1 » → « rezebasket44 » : sans accents, ponctuation ni numéro d'équipe. */
function nomCompact(nom: string, sansNumero: boolean): string {
  let n = nom.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  if (sansNumero) n = n.replace(/\s*-?\s*\d+$/, "");
  return n.replace(/[^a-z0-9]/g, "");
}

const CLUBS_FFBB = Object.values(LOGOS)
  .filter((c) => c.logo)
  .map((c) => ({ cle: nomCompact(c.nom, false), logo: c.logo }));

/**
 * Logo d'un club d'après son identifiant FFBB, sinon d'après son nom (MATCHS_MANUELS, CLASSEMENTS : « Erdre 2 », « IBC Indre Basket
 * Club 2 »…) : nom identique, sinon seul club dont le nom commence par (ou contient) celui-ci. "" si
 * aucun club ne correspond ou s'il y a un doute : le site affiche alors les initiales.
 */
export function logoClub(nom: string, club?: string): string {
  if (club && LOGOS[club]?.logo) return LOGOS[club].logo;
  const cle = nomCompact(nom, true);
  if (cle.length < 3) return "";
  const unique = (liste: typeof CLUBS_FFBB) => (liste.length === 1 ? liste[0].logo : "");
  return (
    CLUBS_FFBB.find((c) => c.cle === cle)?.logo ||
    unique(CLUBS_FFBB.filter((c) => c.cle.startsWith(cle))) ||
    unique(CLUBS_FFBB.filter((c) => c.cle.includes(cle)))
  );
}

/** Classements récupérés chaque nuit à la FFBB (scripts/donnees_ffbb.py → data/classements-ffbb.json). */
const FFBB = classementsFFBB as { maj: string; classements: Record<string, { championnat: string; lignes: LigneClassement[] }> };

/** Classement automatique d'une équipe du site (correspondance EQUIPES_FFBB), daté de son dernier changement. */
function classementAutomatique(nom: string): Classement | undefined {
  const c = FFBB.classements[EQUIPES_FFBB[nom] ?? ""];
  if (!c) return undefined;
  const maj = new Date(FFBB.maj).toLocaleDateString("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "long", year: "numeric" });
  return { championnat: c.championnat, maj, lignes: c.lignes };
}

export function ficheEquipe(nom: string): FicheEquipe {
  const cr = creneauxDe(nom);
  const cap = CAPACITES[nom];
  // Un classement saisi à la main (CLASSEMENTS) l'emporte sur le classement automatique.
  const c = CLASSEMENTS[nom] ?? classementAutomatique(nom);
  const sansCompetition = (cap ? !cap[1] : false) || /^Micro|^U7$|^Loisirs/.test(nom) || categorieDe(nom) === "loisirs";
  return {
    nom,
    libelle: libelleEquipe(nom),
    ancre: `equipe-${slug(nom)}`,
    // "" si aucun coach n'est indiqué dans le planning : la ligne « Coach » n'est alors pas affichée.
    coachs: [...new Set(cr.flatMap((s) => s.coachs))].join(", "),
    creneaux: cr.map((s) => ({
      jour: s.jour,
      horaire: `${heure(s.debut)} – ${heure(s.fin)}`,
      gymnase: s.gymnase,
      lienGymnase: `/infos#${ancreGymnase(s.gymnase)}`,
    })),
    ctc: /HPB/.test(nom),
    photo: PHOTOS_EQUIPES[nom] ?? "",
    classement: {
      championnat: c?.championnat ?? "",
      maj: c?.maj ?? "",
      lignes: (c?.lignes ?? []).map((l) => ({ ...l, nbb: !!l.nbb, logo: logoClub(l.equipe, l.club) })),
      sansCompetition,
    },
  };
}

export function equipesParCategorie() {
  return CATEGORIES.map((c) => {
    const equipes = toutesLesEquipes()
      .filter((e) => categorieDe(e) === c.cle)
      .map(ficheEquipe);
    return { ...c, equipes, nb: pluriel(equipes.length, "groupe") };
  });
}

/** Créneaux du samedi matin (micro-basket et U7), pour la page Écoles. */
export function creneauxSamedi() {
  return CRENEAUX.filter((s) => s.jour === "Samedi")
    .sort((a, b) => a.debut.localeCompare(b.debut))
    .map((s) => ({
      nom: s.equipes.join(" · "),
      naissance: s.equipes.map((e) => NAISSANCE[e]).filter(Boolean).join(", "),
      horaire: `${heureCourte(s.debut)} – ${heureCourte(s.fin)}`,
    }));
}

export type CreneauPlanning = {
  cle: string;
  jour: Jour;
  horaire: string;
  duree: string;
  gymnase: string;
  lienGymnase: string;
  equipes: string[];
  etiquettes: string[];
  coachs: string;
};

export function planning(): CreneauPlanning[] {
  return [...CRENEAUX]
    .sort(
      (a, b) =>
        JOURS.indexOf(a.jour) - JOURS.indexOf(b.jour) ||
        a.debut.localeCompare(b.debut) ||
        a.gymnase.localeCompare(b.gymnase),
    )
    .map((s, i) => ({
      cle: `${i}`,
      jour: s.jour,
      horaire: `${heure(s.debut)} – ${heure(s.fin)}`,
      duree: duree(s.debut, s.fin),
      gymnase: s.gymnase,
      lienGymnase: `/infos#${ancreGymnase(s.gymnase)}`,
      equipes: s.equipes,
      etiquettes: s.equipes.map(avecNaissance),
      coachs: s.coachs.join(", "),
    }));
}

export function gymnasesUtilises(): string[] {
  return [...new Set(CRENEAUX.map((s) => s.gymnase))].sort(cmp);
}

export function joursUtilises(): Jour[] {
  return JOURS.filter((j) => CRENEAUX.some((s) => s.jour === j));
}

/* ───────── Gymnases ───────── */

export function gymnasesNantes() {
  return GYMNASES.filter((g) => !g.partenaire);
}

export type FicheGymnase = {
  nom: string;
  role: string;
  adresse: string;
  acces: string;
  ancre: string;
  nb: string;
  itineraire: string;
  lienPlanning: string;
  partenaire: boolean;
  parking: boolean | null;
  transports: { mode: string; arret: string; lignes: { num: string; label: string; fond: string; texte: string }[] }[];
};

export function fichesGymnases(): FicheGymnase[] {
  return GYMNASES.map((g) => {
    const n = CRENEAUX.filter((s) => s.gymnase === g.nom).length;
    return {
      nom: g.nom,
      role: g.role,
      adresse: g.adresse,
      acces: g.acces,
      ancre: ancreGymnase(g.nom),
      nb: `${n} créneau${n > 1 ? "x" : ""}`,
      itineraire: itineraire(g.adresse),
      lienPlanning: `/planning?gymnase=${encodeURIComponent(g.nom)}`,
      partenaire: !!g.partenaire,
      parking: typeof g.parking === "boolean" ? g.parking : null,
      transports: (g.transports ?? []).map((t) => ({
        ...t,
        lignes: t.lignes.map((num) => {
          const [fond, texte] = LIGNES_NAOLIB[num] ?? ["#18366F", "#FFFFFF"];
          return { num, label: `${t.mode} ${num}`, fond, texte };
        }),
      })),
    };
  });
}

/* ───────── Accueil ───────── */

export function chiffresAccueil(): Chiffre[] {
  return [
    { valeur: STATS.adherents, label: "adhérents" },
    { valeur: STATS.equipes, label: "équipes engagées" },
    { valeur: String(gymnasesNantes().length), label: "gymnases à Nantes" },
    LABEL_ECOLE,
  ];
}

/** Dates de l'agenda à venir (toutes si elles sont passées). */
export function agendaAVenir(max?: number) {
  const jour = aujourdhui();
  const futurs = AGENDA.filter((a) => a.date >= jour);
  const liste = futurs.length ? futurs : AGENDA;
  return max ? liste.slice(0, max) : liste;
}

/* ───────── Matchs du week-end ───────── */

/** Samedi (AAAA-MM-JJ) du week-end d'un match : même semaine, du lundi au dimanche. */
function samediDe(jour: string): string {
  const d = dateDe(jour);
  const j = d.getUTCDay();
  return dateDe(jour, j === 0 ? -1 : 6 - j).toISOString().slice(0, 10);
}

type MatchFFBB = {
  equipe: string;
  date: string;
  heure: string;
  domicile: boolean;
  adversaire: string;
  club: string;
  salle: string;
  /** Arbitres officiels désignés par la FFBB : « Officiels » remplace les arbitres des CONVOCATIONS. */
  officiels?: boolean;
};
type SalleFFBB = { nom: string; adresse: string; cp: string; ville: string };
/** Calendrier récupéré chaque nuit à la FFBB (scripts/donnees_ffbb.py → data/matchs-ffbb.json). */
const CALENDRIER = (matchsFFBB as { calendrier: { matchs: MatchFFBB[]; salles: Record<string, SalleFFBB> } }).calendrier;

/** Mots laissés en minuscules quand un nom FFBB (en capitales) est remis en forme. */
const PETITS_MOTS = new Set([
  ...["de", "du", "des", "la", "le", "les", "et", "sur", "en", "aux", "au", "d", "l", "bis", "ter"],
  // Voies d'une adresse, après le numéro (« 38 rue Appert »).
  ...["rue", "avenue", "allée", "allee", "boulevard", "impasse", "place", "route", "chemin", "quai"],
]);
/** Sigles gardés en capitales (clubs : AL, ES, BC, ASPTT…). */
const SIGLES = new Set(["AC", "AL", "ALPC", "ALS", "AS", "ASPTT", "BC", "CS", "CTC", "EB", "ES", "IBC", "JALT", "NBH", "RC", "SC", "US"]);

/**
 * « SAINT BREVIN BASKET CLUB » → « Saint Brevin Basket Club », « 26 BIS RUE DE LA FORET » → « 26 bis Rue de
 * la Foret » : sigles et nombres gardés tels quels. Les accents que la FFBB n'écrit pas ne peuvent pas
 * être retrouvés : NOMS_CLUBS (data/nbb.ts) corrige le nom des clubs.
 */
function enForme(texte: string): string {
  let premier = true;
  return texte.replace(/[\p{L}\d]+/gu, (mot) => {
    const debut = premier;
    premier = false;
    const minuscule = mot.toLowerCase();
    if (/\d/.test(mot) || SIGLES.has(mot)) return mot;
    if (!debut && PETITS_MOTS.has(minuscule)) return minuscule;
    return minuscule.charAt(0).toUpperCase() + minuscule.slice(1);
  });
}

/**
 * Nom affiché d'une équipe adverse de la FFBB : « IE - CTC POLE WEST NANTAIS - ETOILE SPORTIVE DE
 * COUERON 1 » → « Étoile Sportive de Couëron 1 » (NOMS_CLUBS, sinon remis en forme).
 */
export function nomAdversaire(nomFFBB: string): string {
  const nom = nomFFBB.replace(/^IE - (?:.* - )?/, "").trim();
  if (NOMS_CLUBS[nom]) return NOMS_CLUBS[nom];
  const [, base, numero] = nom.match(/^(.*?)(?:\s*-?\s*(\d+))?$/) ?? [nom, nom, ""];
  const affiche = NOMS_CLUBS[base] ?? enForme(base);
  return numero ? `${affiche} ${numero}` : affiche;
}

/** Match du site, qu'il vienne de la FFBB ou de MATCHS_MANUELS. convocation : à domicile seulement. */
type MatchSite = {
  date: string;
  equipe: string;
  heure: string;
  domicile: boolean;
  adversaire: string;
  logo: string;
  salle: string;
  adresse: string;
  lieu: string;
  manuel: boolean;
  /** Arbitres officiels désignés par la FFBB. */
  officiels: boolean;
  /** Convocation saisie (Espace dirigeants, CONVOCATIONS ou match manuel), telle quelle. */
  saisie?: { arbitres: string; table: string; otm: string };
  /** Convocation affichée : « Officiels » si la FFBB en a désigné, « — » pour un champ vide. */
  convocation?: { arbitres: string; table: string; otm: string };
};

/** Convocation d'un match (date AAAA-MM-JJ, équipe du site), saisie dans data/nbb.ts ou en ligne. */
export type ConvocationSaisie = { date: string; equipe: string; arbitres: string; table: string; otm: string };

/** Convocation affichée : champs vides → « — », arbitres officiels de la FFBB prioritaires. */
function convocationAffichee(saisie: { arbitres: string; table: string; otm: string } | undefined, officiels: boolean) {
  if (!saisie && !officiels) return undefined;
  const ou = (v: string | undefined) => v?.trim() || "—";
  return { arbitres: officiels ? "Officiels" : ou(saisie?.arbitres), table: ou(saisie?.table), otm: ou(saisie?.otm) };
}

/** Équipe du site d'une clé FFBB (« U15-M-2 » → « U15M2 ») : correspondance EQUIPES_FFBB. */
function equipesParCleFFBB(): Map<string, string> {
  return new Map(Object.entries(EQUIPES_FFBB).filter(([, cle]) => cle).map(([nom, cle]) => [cle, nom]));
}

/**
 * Tous les matchs connus : calendrier FFBB des équipes du site (avec leurs CONVOCATIONS) et
 * MATCHS_MANUELS. Un match manuel remplace celui de la FFBB de la même équipe le même jour.
 */
function matchsDuSite(enLigne: ConvocationSaisie[] = []): MatchSite[] {
  const equipeDe = equipesParCleFFBB();
  // Les convocations saisies dans l'Espace dirigeants l'emportent sur celles de data/nbb.ts.
  const convocations = new Map<string, ConvocationSaisie>(
    [...CONVOCATIONS, ...enLigne].map((c) => [`${c.date}|${c.equipe}`, c]),
  );
  const manuels: MatchSite[] = MATCHS_MANUELS.map((m) => {
    const saisie = !m.salle
      ? undefined
      : (convocations.get(`${m.date}|${m.equipe}`) ?? { arbitres: m.arbitres ?? "", table: m.table ?? "", otm: m.otm ?? "" });
    return {
    date: m.date,
    equipe: m.equipe,
    heure: m.heure,
    domicile: !!m.salle,
    adversaire: m.adversaire,
    logo: logoClub(m.adversaire),
    salle: m.salle ?? "",
    adresse: m.salle ? (ADRESSES_SALLES[m.salle] ?? "") : "",
    lieu: m.lieu ?? "",
    manuel: true,
    officiels: false,
    saisie,
    convocation: convocationAffichee(saisie, false),
    };
  });
  const remplaces = new Set(manuels.map((m) => `${m.date}|${m.equipe}`));
  const ffbb = CALENDRIER.matchs.flatMap((m): MatchSite[] => {
    const equipe = equipeDe.get(m.equipe);
    if (!equipe || remplaces.has(`${m.date}|${equipe}`)) return [];
    const s = CALENDRIER.salles[m.salle];
    const salleClub = SALLES_FFBB[m.salle];
    const lieu = s
      ? [enForme(s.nom), enForme(s.adresse), [s.cp, enForme(s.ville)].filter(Boolean).join(" ")].filter(Boolean).join(", ")
      : "";
    const c = convocations.get(`${m.date}|${equipe}`);
    return [
      {
        date: m.date,
        equipe,
        heure: m.heure,
        domicile: m.domicile,
        adversaire: nomAdversaire(m.adversaire),
        logo: logoClub(m.adversaire, m.club),
        salle: salleClub ?? (s ? enForme(s.nom) : "Salle à confirmer"),
        adresse: salleClub ? (ADRESSES_SALLES[salleClub] ?? "") : lieu,
        lieu,
        manuel: false,
        officiels: m.domicile && !!m.officiels,
        saisie: m.domicile ? c : undefined,
        convocation: m.domicile ? convocationAffichee(c, !!m.officiels) : undefined,
      },
    ];
  });
  return [...ffbb, ...manuels];
}

export type MatchDomicileVue = {
  cle: string;
  jourCle: string;
  jourLabel: string;
  equipe: string;
  /** "" : horaire pas encore fixé (« À confirmer »). */
  heure: string;
  adversaire: string;
  /** Logo du club adverse ("" si inconnu). */
  logo: string;
  salle: string;
  adresse: string;
  /** Fiche de la salle sur la page Infos pratiques ("" si elle n'y figure pas). */
  lienSalle: string;
  /** Un nom par arbitre (saisis séparés par des virgules dans CONVOCATIONS) ; « — » sans convocation. */
  arbitres: string[];
  /** Un nom par personne à la table (même saisie). */
  table: string[];
  otm: string;
  /** Score du match une fois joué (résultats FFBB). */
  resultat?: ScoreMatch;
};

/** Score d'un match joué, NBB en premier. */
export type ScoreMatch = { nous: number; eux: number; issue: IssueMatch };

export type MatchExterieurVue = {
  cle: string;
  jourCle: string;
  jourLabel: string;
  equipe: string;
  heure: string;
  adversaire: string;
  logo: string;
  lieu: string;
  itineraire: string;
  resultat?: ScoreMatch;
};

/** Place d'un week-end par rapport à aujourd'hui : « semaine » = du lundi au dimanche de ce week-end. */
export type MomentWeekend = "passe" | "semaine" | "a-venir";

export type WeekEndVue = {
  titre: string;
  semaine: string;
  moment: MomentWeekend;
  dates: string;
  vide: boolean;
  domicile: MatchDomicileVue[];
  exterieur: MatchExterieurVue[];
};

/** "26–27 sept." (ou "31 oct. – 1 nov.") : le samedi et le dimanche d'un week-end. */
function datesWeekend(samedi: string): string {
  const sa = dateDe(samedi);
  const di = dateDe(samedi, 1);
  const court = (d: Date) => formater(d, { day: "numeric", month: "short" });
  return sa.getUTCMonth() === di.getUTCMonth() ? `${sa.getUTCDate()}–${court(di)}` : `${court(sa)} – ${court(di)}`;
}

/** « Week-end du 3 & 4 octobre 2026 » (ou « du 31 octobre & 1 novembre 2026 »). */
function titreWeekend(samedi: string): string {
  const sa = dateDe(samedi);
  const di = dateDe(samedi, 1);
  const debut = sa.getUTCMonth() === di.getUTCMonth() ? String(sa.getUTCDate()) : formater(sa, { day: "numeric", month: "long" });
  return `Week-end du ${debut} & ${formater(di, { day: "numeric", month: "long", year: "numeric" })}`;
}

/** Numéro de semaine ISO 8601 (« Semaine 40 »). */
function semaineIso(jour: string): string {
  const d = dateDe(jour);
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const debutAnnee = Date.UTC(d.getUTCFullYear(), 0, 1);
  return `Semaine ${Math.ceil(((d.getTime() - debutAnnee) / 86400000 + 1) / 7)}`;
}

/** Fiche d'une salle de match sur la page Infos pratiques (« Breil Malville » → gymnase « Breil »). */
function lienSalle(salle: string): string {
  const g = GYMNASES.find((x) => salle === x.nom || salle.startsWith(`${x.nom} `));
  return g ? `/infos#${ancreGymnase(g.nom)}` : "";
}

/** Rang d'une salle dans ADRESSES_SALLES (les salles absentes de la liste passent après). */
function rangSalle(salle: string): number {
  const i = Object.keys(ADRESSES_SALLES).indexOf(salle);
  return i < 0 ? Infinity : i;
}

/** Ordre chronologique : date, puis heure (un horaire pas encore fixé passe en dernier). */
function ordreChrono(a: { date: string; heure: string }, b: { date: string; heure: string }): number {
  return a.date.localeCompare(b.date) || (a.heure || "99h").localeCompare(b.heure || "99h");
}

/** Scores FFBB par « date|équipe du site » (calculés une seule fois). */
let scoresParMatch: Map<string, ScoreMatch> | null = null;
function scoreDe(date: string, equipe: string): ScoreMatch | undefined {
  if (!scoresParMatch) {
    scoresParMatch = new Map();
    const equipeDe = equipesParCleFFBB();
    for (const [cle, matchs] of Object.entries(RESULTATS.resultats)) {
      const nom = equipeDe.get(cle);
      if (!nom) continue;
      for (const m of matchs) {
        const issue: IssueMatch = m.nous > m.eux ? "victoire" : m.nous < m.eux ? "defaite" : "nul";
        scoresParMatch.set(`${m.date.slice(0, 10)}|${nom}`, { nous: m.nous, eux: m.eux, issue });
      }
    }
  }
  return scoresParMatch.get(`${date}|${equipe}`);
}

function weekendVue(samedi: string, i: number, matchs: MatchSite[]): WeekEndVue {
  const jour = aujourdhui();
  const dimanche = dateDe(samedi, 1).toISOString().slice(0, 10);
  const lundi = dateDe(samedi, -5).toISOString().slice(0, 10);
  const moment: MomentWeekend = dimanche < jour ? "passe" : lundi <= jour ? "semaine" : "a-venir";
  const duWeekend = matchs.filter((m) => samediDe(m.date) === samedi).sort(ordreChrono);
  const libelle = (date: string) => majuscule(formater(dateDe(date), { weekday: "long", day: "numeric", month: "long" }));
  const noms = (texte: string) => texte.split(/\s*,\s*/);
  return {
    titre: titreWeekend(samedi),
    semaine: semaineIso(samedi),
    moment,
    dates: datesWeekend(samedi),
    vide: duWeekend.length === 0,
    // Regroupés par salle (ordre d'ADRESSES_SALLES), puis par jour et par heure dans chaque salle.
    domicile: duWeekend
      .filter((m) => m.domicile)
      .sort((a, b) => rangSalle(a.salle) - rangSalle(b.salle) || a.salle.localeCompare(b.salle, "fr") || ordreChrono(a, b))
      .map((m, k) => ({
        cle: `${i}-d${k}`,
        jourCle: `${i}|${m.date}`,
        jourLabel: libelle(m.date),
        equipe: m.equipe,
        heure: m.heure,
        adversaire: m.adversaire,
        logo: m.logo,
        salle: m.salle,
        adresse: m.adresse,
        lienSalle: lienSalle(m.salle),
        arbitres: noms(m.convocation?.arbitres ?? "—"),
        table: noms(m.convocation?.table ?? "—"),
        otm: m.convocation?.otm ?? "—",
        resultat: scoreDe(m.date, m.equipe),
      })),
    exterieur: duWeekend
      .filter((m) => !m.domicile)
      .map((m, k) => ({
        cle: `${i}-e${k}`,
        jourCle: `${i}|${m.date}`,
        jourLabel: libelle(m.date),
        equipe: m.equipe,
        heure: m.heure,
        adversaire: m.adversaire,
        logo: m.logo,
        lieu: m.lieu,
        itineraire: m.lieu ? itineraire(m.lieu) : "",
        resultat: scoreDe(m.date, m.equipe),
      })),
  };
}

/**
 * Week-ends à venir affichés (page Matchs) et à préparer (onglet Convocations), celui de la semaine compris.
 * Le calendrier FFBB en couvre 6 semaines (JOURS_APRES, scripts/donnees_ffbb.py).
 */
const SEMAINES_A_VENIR = 4;

/** Samedi du week-end de la semaine en cours (on bascule sur le suivant chaque lundi). */
function samediCourant(): string {
  return samediDe(aujourdhui());
}

/**
 * Les week-ends de la page Matchs : le précédent, celui de la semaine en cours et les SEMAINES_A_VENIR - 1 suivants.
 * equipes : celles qui jouent l'un de ces 3 week-ends.
 */
export function matchsAffiches(enLigne: ConvocationSaisie[] = []): { weekends: WeekEndVue[]; indexDefaut: number; equipes: string[] } {
  const courant = samediCourant();
  const matchs = matchsDuSite(enLigne);
  const weekends = [-1, ...Array.from({ length: SEMAINES_A_VENIR }, (_, k) => k)].map((semaine, i) => weekendVue(dateDe(courant, 7 * semaine).toISOString().slice(0, 10), i, matchs));
  const equipes = [...new Set(weekends.flatMap((w) => [...w.domicile, ...w.exterieur]).map((m) => m.equipe))].sort(cmp);
  return { weekends, indexDefaut: 1, equipes };
}

/**
 * Matchs à domicile (FFBB) du week-end en cours et du suivant sans convocation saisie : signalés dans
 * l'Espace dirigeants.
 */
function convocationsManquantes(enLigne: ConvocationSaisie[]): MatchSite[] {
  const courant = samediCourant();
  const suivants = [courant, dateDe(courant, 7).toISOString().slice(0, 10)];
  return matchsDuSite(enLigne)
    // Sans convocation saisie (des arbitres officiels ne suffisent pas : table et OTM restent à désigner).
    .filter((m) => m.domicile && !m.saisie && suivants.includes(samediDe(m.date)))
    .sort(ordreChrono);
}

/** Un match à domicile dans l'onglet « Convocations » de l'Espace dirigeants. */
export type MatchAConvoquer = {
  cle: string;
  date: string;
  jour: string;
  heure: string;
  equipe: string;
  adversaire: string;
  salle: string;
  officiels: boolean;
  arbitres: string;
  table: string;
  otm: string;
};

/**
 * Matchs à domicile des SEMAINES_A_VENIR prochains week-ends (en cours compris), avec leur convocation actuelle (champs bruts,
 * "" si rien n'est saisi), et les suggestions des champs : équipes du club (« U11M2 ») et noms déjà utilisés.
 */
export function matchsAConvoquer(enLigne: ConvocationSaisie[] = []): {
  weekends: { samedi: string; titre: string; matchs: MatchAConvoquer[] }[];
  suggestions: { equipes: string[]; noms: string[] };
} {
  const courant = samediCourant();
  const matchs = matchsDuSite(enLigne).filter((m) => m.domicile);
  const brut = (v: string | undefined) => (v === "—" ? "" : (v ?? ""));
  const weekends = Array.from({ length: SEMAINES_A_VENIR }, (_, k) => 7 * k).map((decalage) => {
    const samedi = dateDe(courant, decalage).toISOString().slice(0, 10);
    return {
      samedi,
      titre: titreWeekend(samedi),
      matchs: matchs
        .filter((m) => samediDe(m.date) === samedi)
        .sort((a, b) => ordreChrono(a, b) || rangSalle(a.salle) - rangSalle(b.salle))
        .map((m) => ({
          cle: `${m.date}|${m.equipe}`,
          date: m.date,
          jour: majuscule(formater(dateDe(m.date), { weekday: "long", day: "numeric", month: "long" })),
          heure: m.heure,
          equipe: m.equipe,
          adversaire: m.adversaire,
          salle: m.salle,
          officiels: m.officiels,
          arbitres: brut(m.saisie?.arbitres),
          table: brut(m.saisie?.table),
          otm: brut(m.saisie?.otm),
        })),
    };
  });
  const noms = new Set<string>();
  for (const c of [...CONVOCATIONS, ...MATCHS_MANUELS, ...enLigne]) {
    for (const v of [c.arbitres, c.table, c.otm]) {
      for (const n of (v ?? "").split(/\s*,\s*/)) {
        if (n && n !== "—" && n !== "Officiels" && !/^\d+\s*×/.test(n)) noms.add(n);
      }
    }
  }
  return {
    weekends,
    suggestions: { equipes: toutesLesEquipes(), noms: [...noms].sort(cmp) },
  };
}

/* ───────── Résultats FFBB ───────── */

export type IssueMatch = "victoire" | "defaite" | "nul";
export type ResultatVue = {
  cle: string;
  equipe: string;
  heure: string;
  domicile: boolean;
  adversaire: string;
  nous: number;
  eux: number;
  issue: IssueMatch;
  forfait: "" | "nous" | "eux";
};
export type JourResultats = { cle: string; label: string; resultats: ResultatVue[] };
export type SemaineResultats = { cle: string; dates: string; jours: JourResultats[] };

type ResultatFFBB = { date: string; domicile: boolean; adversaire: string; nous: number; eux: number; forfait: string };
/** Résultats récupérés chaque nuit à la FFBB (scripts/donnees_ffbb.py → data/resultats-ffbb.json). */
const RESULTATS = resultatsFFBB as { maj: string; resultats: Record<string, ResultatFFBB[]> };
/** Nombre de week-ends de résultats proposés sur la page Matchs (les plus récents). */
const WEEKENDS_RESULTATS = 10;

/**
 * Résultats des équipes du site (celles reliées dans EQUIPES_FFBB), par week-end du plus récent au plus
 * ancien, puis par jour et par heure. maj : date du dernier changement, en toutes lettres.
 */
export function resultatsParWeekend(): { semaines: SemaineResultats[]; maj: string } {
  const equipeDe = new Map(Object.entries(EQUIPES_FFBB).filter(([, cle]) => cle).map(([nom, cle]) => [cle, nom]));
  const parSamedi = new Map<string, Map<string, ResultatVue[]>>();
  for (const [cle, matchs] of Object.entries(RESULTATS.resultats)) {
    const equipe = equipeDe.get(cle);
    if (!equipe) continue;
    for (const m of matchs) {
      const jour = m.date.slice(0, 10);
      const samedi = samediDe(jour);
      const jours = parSamedi.get(samedi) ?? new Map<string, ResultatVue[]>();
      parSamedi.set(samedi, jours);
      jours.set(jour, [
        ...(jours.get(jour) ?? []),
        {
          cle: `${cle}-${m.date}`,
          equipe,
          heure: m.date.slice(11, 16).replace(":", "h"),
          domicile: m.domicile,
          adversaire: nomAdversaire(m.adversaire),
          nous: m.nous,
          eux: m.eux,
          issue: m.nous > m.eux ? "victoire" : m.nous < m.eux ? "defaite" : "nul",
          forfait: m.forfait === "nous" || m.forfait === "eux" ? m.forfait : "",
        },
      ]);
    }
  }
  const semaines = [...parSamedi.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, WEEKENDS_RESULTATS)
    .map(([samedi, jours]) => ({
      cle: samedi,
      dates: datesWeekend(samedi),
      jours: [...jours.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([jour, resultats]) => ({
          cle: jour,
          label: majuscule(formater(dateDe(jour), { weekday: "long", day: "numeric", month: "long" })),
          resultats: resultats.sort((a, b) => a.heure.localeCompare(b.heure) || cmp(a.equipe, b.equipe)),
        })),
    }));
  const maj = new Date(RESULTATS.maj).toLocaleDateString("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "long", year: "numeric" });
  return { semaines, maj };
}

/* ───────── Stages ───────── */

/** Par défaut, une semaine de stage dure 5 jours, du lundi (debut) au vendredi. */
const JOURS_STAGE = 5;
/** Les inscriptions d'une semaine ferment à cette heure (Paris), la veille de son premier jour. */
const HEURE_CLOTURE_STAGE = "12:00";
const HEURE_CLOTURE_STAGE_TEXTE = "midi";

/** Date et heure à Paris, au format AAAA-MM-JJTHH:MM (se compare comme une chaîne). */
function maintenantParis(): string {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Paris",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date())
      .map((x) => [x.type, x.value]),
  );
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

export type EtatStage = "ouvertes" | "fermees" | "a-venir";
/** cloture : fin des inscriptions en toutes lettres, ex. "jeudi 22 octobre, midi" ("" sans date). */
export type SemaineStageVue = SemaineStage & { fermee: boolean; cloture: string };
export type StageVue = Omit<Stage, "semaines"> & { etat: EtatStage; semaines: SemaineStageVue[] };

/** Nombre de jours d'une semaine de stage : de debut à fin si elle est indiquée, sinon du lundi au vendredi. */
function joursDeStage(w: SemaineStage): number {
  if (!w.debut) return 0;
  if (!w.fin) return JOURS_STAGE;
  return Math.max(1, Math.round((dateDe(w.fin).getTime() - dateDe(w.debut).getTime()) / 86_400_000) + 1);
}

/** Veille du premier jour d'une semaine de stage : jour de fermeture de ses inscriptions. */
function veillePremierJour(debut: string): Date {
  return dateDe(debut, -1);
}

/** Les inscriptions d'une semaine ferment la veille de son premier jour à midi (maintenant : heure de Paris). */
function semaineFermee(w: SemaineStage, maintenant: string): boolean {
  if (!w.debut) return false;
  return maintenant >= `${veillePremierJour(w.debut).toISOString().slice(0, 10)}T${HEURE_CLOTURE_STAGE}`;
}

/** "jeudi 22 octobre, midi" : quand ferment les inscriptions de la semaine. */
function clotureSemaine(w: SemaineStage): string {
  if (!w.debut) return "";
  const jour = formater(veillePremierJour(w.debut), { weekday: "long", day: "numeric", month: "long" });
  return `${jour}, ${HEURE_CLOTURE_STAGE_TEXTE}`;
}

/**
 * État des inscriptions de chaque période, d'après la date du jour : une période est fermée quand
 * toutes ses semaines le sont ; la première période qui ne l'est pas est ouverte (si ses dates sont
 * saisies) et les suivantes sont à venir. La suivante s'ouvre donc seule quand la précédente ferme.
 */
export function stagesVue(): StageVue[] {
  const maintenant = maintenantParis();
  let courante = false;
  return STAGES.map((s) => {
    const semaines = s.semaines.map((w) => ({ ...w, fermee: semaineFermee(w, maintenant), cloture: clotureSemaine(w) }));
    const datees = semaines.filter((w) => w.debut);
    let etat: EtatStage = "a-venir";
    if (datees.length && datees.every((w) => w.fermee)) etat = "fermees";
    else if (!courante) {
      courante = true;
      if (datees.length) etat = "ouvertes";
    }
    return { ...s, semaines, etat };
  });
}

export type JourStage = { id: string; court: string; long: string };
export type SemaineOuverte = SemaineStage & { periode: string; stage: string; jours: JourStage[]; cloture: string };

/** Semaines proposées dans le formulaire : celles de la période ouverte dont les inscriptions ne sont pas fermées. */
export function semainesOuvertes(): SemaineOuverte[] {
  return stagesVue().filter((s) => s.etat === "ouvertes").flatMap((s) =>
    s.semaines.filter((w) => !w.fermee).map((w) => {
      const jours: JourStage[] = [];
      if (w.debut) {
        for (let i = 0; i < joursDeStage(w); i++) {
          const d = dateDe(w.debut, i);
          const iso = d.toISOString().slice(0, 10);
          jours.push({
            id: `${w.id}:${iso}`,
            court: majuscule(formater(d, { weekday: "short", day: "numeric" })),
            long: formater(d, { weekday: "long", day: "numeric", month: "long" }),
          });
        }
      }
      return { ...w, periode: s.periode, stage: s.id, jours };
    }),
  );
}

export function prixStage(statut: StatutStage): PrixStage {
  const journee = STAGE_TARIFS.find((t) => !t.jours);
  return {
    jour: journee ? montant(journee[statut]) : 0,
    semaine: Object.fromEntries(STAGE_TARIFS.filter((t) => t.jours).map((t) => [t.jours, montant(t[statut])])),
  };
}

/** Années de naissance proposées dans le formulaire de stage. */
export function anneesStage(): string[] {
  const an = anneeSaison();
  return Array.from({ length: 13 }, (_, i) => String(an - 5 - i));
}

/**
 * « Stages d'automne · Semaine 2 (semaine complète) » (récapitulatif enregistré avec l'inscription)
 * → « Stages d'automne, semaine 2 (du 26 au 30 octobre) : semaine complète ».
 */
function ligneSemaineStage(recap: string): string {
  const m = recap.match(/^(.+?) · (.+?)(?: \(semaine complète\)| : (.+))$/);
  if (!m) return recap;
  const [, periode, nom, jours] = m;
  const dates = STAGES.find((s) => s.periode === periode)?.semaines.find((w) => w.nom === nom)?.dates;
  const semaine = `${periode}, ${nom.charAt(0).toLowerCase()}${nom.slice(1)}${dates ? ` (${dates.charAt(0).toLowerCase()}${dates.slice(1)})` : ""}`;
  return `${semaine} : ${jours ?? "semaine complète"}`;
}

export type MessageConfirmation = { sujet: string; texte: string };

/** Accusé de réception d'un message de contact (modèle CONTACT_ACCUSE), tel qu'il sera envoyé. */
export function messageAccuseContact(v: { nom: string; sujet: string; reference: string; email: string }): MessageConfirmation {
  const valeurs: Record<string, string> = {
    ...v,
    delai: aCompleter(CLUB.delaiReponseContact) ? "dès que possible" : `sous ${CLUB.delaiReponseContact}`,
  };
  const remplir = (modele: string) => modele.replace(/\{(\w+)\}/g, (repere, cle: string) => valeurs[cle] ?? repere);
  return { sujet: remplir(CONTACT_ACCUSE.sujet), texte: remplir(CONTACT_ACCUSE.texte) };
}

/** E-mail de confirmation d'une inscription au stage (modèle STAGE_CONFIRMATION), tel qu'il sera envoyé. */
export function messageConfirmationStage(champs: Record<string, string>): MessageConfirmation {
  const valeurs: Record<string, string> = {
    enfant: champs["Enfant"] ?? "",
    parent: champs["Parent"] ?? "",
    semaines: (champs["Semaines / jours"] ?? "")
      .split(" ; ")
      .filter(Boolean)
      .map((s) => `- ${ligneSemaineStage(s)}`)
      .join("\n"),
    montant: champs["Montant"] ?? "",
    journee: STAGE_JOURNEE.map((j) => `- ${j.heure} : ${j.texte}`).join("\n"),
    a_prevoir: STAGE_A_PREVOIR.map((a) => `- ${a}`).join("\n"),
    contact: `${STAGE_CONTACT.nom} au ${STAGE_CONTACT.telephone}, ou en répondant à cet e-mail`,
  };
  const remplir = (modele: string) => modele.replace(/\{(\w+)\}/g, (repere, cle: string) => valeurs[cle] ?? repere);
  return { sujet: remplir(STAGE_CONFIRMATION.sujet), texte: remplir(STAGE_CONFIRMATION.texte) };
}

/* ───────── Inscriptions ───────── */

/** Tarifs utiles au formulaire de préinscription (estimation de la cotisation). */
export function donneesCotisation() {
  const prix = (t: Tarif): PrixCotisation => ({ prix: t.prix, prixB: t.prixB });
  const jeunes = [TARIFS[1], TARIFS[2], TARIFS[3]].map(prix).sort((a, b) => a.prix - b.prix);
  return {
    tarifsEquipes: Object.fromEntries(toutesLesEquipes().map((e) => [e, prix(tarifDe(e))])) as Record<string, PrixCotisation>,
    mini: prix(TARIFS[0]),
    seniors: prix(TARIFS[4]),
    jeunes: { min: jeunes[0], max: jeunes[jeunes.length - 1] },
  };
}

/** Un adhérent né cette année-là est-il mineur pendant la saison ? */
export function estMineur(annee: number): boolean {
  return annee >= anneeSaison() - 17;
}

/* ───────── Espace dirigeants : informations encore à fournir ───────── */

export type ManqueSite = { section: string; page?: string; element: string; champ: string; valeur: string; chemin: string };

/** Titre lisible (et page concernée) de chaque bloc de data/nbb.ts qui peut contenir « [À COMPLÉTER] ». */
const SECTIONS_MANQUES: Record<string, { titre: string; page?: string }> = {
  CLUB: { titre: "Informations du club" },
  MENTIONS: { titre: "Mentions légales", page: "/mentions-legales" },
  ENCADREMENT: { titre: "Entraîneurs (accueil)", page: "/" },
  AIDES: { titre: "Aides à la cotisation (Inscriptions)", page: "/inscriptions#tarifs" },
  GYMNASES: { titre: "Gymnases (Infos pratiques)", page: "/infos" },
  OFFRE_PARTENARIAT: { titre: "Offre de partenariat (Partenaires)", page: "/partenaires" },
  SLOTS: { titre: "Planning des entraînements", page: "/planning" },
  CONVOCATIONS: { titre: "Convocations des matchs à domicile", page: "/matchs" },
  MATCHS_MANUELS: { titre: "Matchs saisis à la main", page: "/matchs" },
};

const CHAMPS_MANQUES: Record<string, string> = {
  delaiReponseContact: "Délai de réponse après un message (page Contact)",
  delaiReponseInscription: "Délai de confirmation d'une préinscription (page Inscriptions)",
  plaquettePartenaires: "Lien de la plaquette partenaires en PDF (page Partenaires)",
  reductionImpot: "Réduction d'impôt du mécénat : éligibilité à confirmer (page Partenaires)",
  rna: "Numéro RNA",
  siret: "Numéro SIRET",
  responsablePublication: "Responsable de la publication",
  conservationAdhesions: "Durée de conservation des adhésions",
  conservationMessages: "Durée de conservation des messages",
  localisationDonnees: "Pays du serveur Hostinger qui stocke les données (Mentions légales)",
  diplomes: "Diplôme",
  arrivee: "Arrivée au club",
  acces: "Accès (bus, tram, parking)",
  montant: "Montant",
  heure: "Horaire du match",
};

/** Nom lisible d'un élément de liste (entraîneur, gymnase, week-end, match…), ou "" s'il n'en a pas. */
function nomElement(x: unknown): string {
  if (x && typeof x === "object") {
    for (const k of ["prenom", "nom", "titre", "formule", "equipe", "id"]) {
      const v = (x as Record<string, unknown>)[k];
      if (typeof v === "string" && v && !MARQUE_A_COMPLETER.test(v)) return v;
    }
  }
  return "";
}

/**
 * Tout ce qui est encore marqué « [À COMPLÉTER] » ou « [À CONFIRMER] » dans data/nbb.ts (masqué sur le site),
 * plus les équipes du planning sans coach. Affiché dans l'Espace dirigeants.
 */
export function manquesDuSite(enLigne: ConvocationSaisie[] = []): ManqueSite[] {
  const manques: ManqueSite[] = [];
  const ajouter = (racine: string, element: string, champ: string, valeur: string, chemin: string) => {
    const s = SECTIONS_MANQUES[racine];
    manques.push({ section: s?.titre ?? racine, page: s?.page, element, champ: CHAMPS_MANQUES[champ] ?? champ, valeur, chemin });
  };
  const parcourir = (v: unknown, chemin: string, racine: string, element: string, champ: string, niveau: number) => {
    if (typeof v === "string") {
      if (MARQUE_A_COMPLETER.test(v)) ajouter(racine, element, champ, v, chemin);
    } else if (Array.isArray(v)) {
      // Chaque élément nommé (entraîneur, gymnase, week-end, puis match d'une équipe…) complète le libellé ;
      // son champ devient alors celui de cet élément (ex. « heure » d'un match).
      v.forEach((x, i) => {
        const nom = nomElement(x) || (niveau === 0 ? `n° ${i + 1}` : "");
        const suite = nom ? [element, nom].filter(Boolean).join(" · ") : element;
        parcourir(x, `${chemin}[${i}]`, racine, suite, nom && niveau > 0 ? "" : champ, niveau + 1);
      });
    } else if (v && typeof v === "object") {
      for (const [k, x] of Object.entries(v)) parcourir(x, `${chemin}.${k}`, racine, element, champ || k, niveau + 1);
    }
  };
  for (const [nom, valeur] of Object.entries(DONNEES)) parcourir(valeur, nom, nom, "", "", 0);
  for (const e of toutesLesEquipes()) {
    if (!ficheEquipe(e).coachs) ajouter("SLOTS", e, "Coach", "Aucun coach indiqué dans le planning", "SLOTS");
  }
  for (const m of convocationsManquantes(enLigne)) {
    const jour = formater(dateDe(m.date), { weekday: "long", day: "numeric", month: "long" });
    ajouter("CONVOCATIONS", `${m.equipe} · ${jour}${m.heure ? ` à ${m.heure}` : ""} contre ${m.adversaire}`, "Arbitres, table et OTM", "Aucune convocation saisie", "CONVOCATIONS");
  }
  return manques;
}

/* ───────── Matchs à l'affiche (accueil) ───────── */

/** Prochain match à domicile d'une équipe mise en avant (EQUIPES_A_L_AFFICHE). heure : « HH:MM » ou "". */
export type MatchAffiche = {
  equipe: string;
  nom: string;
  date: string;
  jourLabel: string;
  heure: string;
  adversaire: string;
  logo: string;
  salle: string;
  lienSalle: string;
};

/**
 * Les prochains matchs à domicile (jusqu'à 3 par équipe, pour que l'accueil passe seul au suivant entre deux
 * régénérations) des équipes de EQUIPES_A_L_AFFICHE, d'après le calendrier FFBB et MATCHS_MANUELS.
 */
export function matchsALAffiche(): MatchAffiche[] {
  const jour = aujourdhui();
  const tous = matchsDuSite().filter((m) => m.domicile && m.date >= jour);
  return EQUIPES_A_L_AFFICHE.flatMap(({ equipe, nom }) =>
    tous
      .filter((m) => m.equipe === equipe)
      .sort(ordreChrono)
      .slice(0, 3)
      .map((m) => ({
        equipe,
        nom,
        date: m.date,
        jourLabel: majuscule(formater(dateDe(m.date), { weekday: "long", day: "numeric", month: "long" })),
        heure: /^\d{1,2}h\d{2}$/.test(m.heure) ? m.heure.replace("h", ":").padStart(5, "0") : "",
        adversaire: m.adversaire,
        logo: m.logo,
        salle: m.salle,
        lienSalle: lienSalle(m.salle),
      })),
  );
}
