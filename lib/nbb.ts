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
  CLUB,
  GYMNASES,
  LABEL_ECOLE,
  LIGNES_NAOLIB,
  NAISSANCE,
  PHOTOS_EQUIPES,
  SLOTS,
  STAGES,
  STAGE_TARIFS,
  STATS,
  TARIFS,
  WEEKENDS,
} from "@/data/nbb";
import type { Chiffre, CleCategorie, Creneau, Jour, SemaineStage, Stage, StatutStage, Tarif } from "@/lib/types";
import * as DONNEES from "@/data/nbb";
import { duree, heure, heureCourte, itineraire, majuscule, MARQUE_A_COMPLETER, montant, pluriel, slug, type PrixCotisation, type PrixStage } from "@/lib/utils";

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
    lignes: { rang: number; equipe: string; j: number; v: number; d: number; pts: number; nbb: boolean }[];
    sansCompetition: boolean;
  };
};

export function ficheEquipe(nom: string): FicheEquipe {
  const cr = creneauxDe(nom);
  const cap = CAPACITES[nom];
  const c = CLASSEMENTS[nom];
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
      lignes: (c?.lignes ?? []).map((l) => ({ ...l, nbb: !!l.nbb })),
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
      nom: s.equipes.map(avecNaissance).join(" · "),
      horaire: `${heureCourte(s.debut)} – ${heureCourte(s.fin)}`,
      coachs: s.coachs.join(", "),
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

function decalageJour(jour: string): number {
  if (jour.startsWith("Dim")) return 1;
  if (jour.startsWith("Ven")) return -1;
  return 0;
}

function ordreMatch(jour: string, h: string): number {
  return decalageJour(jour) * 10000 + (parseInt(h.replace("h", ""), 10) || 0);
}

export type MatchDomicileVue = {
  cle: string;
  jourCle: string;
  jourLabel: string;
  equipe: string;
  heure: string;
  adversaire: string;
  salle: string;
  adresse: string;
  arbitres: string;
  table: string;
  otm: string;
};

export type MatchExterieurVue = {
  cle: string;
  jourCle: string;
  jourLabel: string;
  equipe: string;
  heure: string;
  adversaire: string;
  lieu: string;
  itineraire: string;
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

function libelleJour(samedi: string, jour: string): string {
  return majuscule(formater(dateDe(samedi, decalageJour(jour)), { weekday: "long", day: "numeric", month: "long" }));
}

/** Rang d'une salle dans ADRESSES_SALLES (les salles absentes de la liste passent après). */
function rangSalle(salle: string): number {
  const i = Object.keys(ADRESSES_SALLES).indexOf(salle);
  return i < 0 ? Infinity : i;
}

export function weekendsVue(): WeekEndVue[] {
  const jour = aujourdhui();
  return WEEKENDS.map((w, i) => {
    const sa = dateDe(w.samedi);
    const di = dateDe(w.samedi, 1);
    const lundi = dateDe(w.samedi, -5).toISOString().slice(0, 10);
    const moment: MomentWeekend = di.toISOString().slice(0, 10) < jour ? "passe" : lundi <= jour ? "semaine" : "a-venir";
    const court = (d: Date) => formater(d, { day: "numeric", month: "short" });
    const dates =
      sa.getUTCMonth() === di.getUTCMonth() ? `${sa.getUTCDate()}–${court(di)}` : `${court(sa)} – ${court(di)}`;
    const tri = <T extends { jour: string; heure: string }>(liste: T[]) =>
      [...liste].sort((a, b) => ordreMatch(a.jour, a.heure) - ordreMatch(b.jour, b.heure));
    return {
      titre: w.titre,
      semaine: w.semaine,
      moment,
      dates,
      vide: w.domicile.length + w.exterieur.length === 0,
      // Regroupés par salle (ordre d'ADRESSES_SALLES), puis par jour et par heure dans chaque salle.
      domicile: tri(w.domicile)
        .sort((a, b) => rangSalle(a.salle) - rangSalle(b.salle) || a.salle.localeCompare(b.salle, "fr"))
        .map((m, k) => ({
          cle: `${i}-d${k}`,
          jourCle: `${i}|${m.jour}`,
          jourLabel: libelleJour(w.samedi, m.jour),
          equipe: m.equipe,
          heure: m.heure,
          adversaire: m.adversaire,
          salle: m.salle,
          adresse: ADRESSES_SALLES[m.salle] ?? "",
          arbitres: m.arbitres,
          table: m.table,
          otm: m.otm,
        })),
      exterieur: tri(w.exterieur).map((m, k) => ({
        cle: `${i}-e${k}`,
        jourCle: `${i}|${m.jour}`,
        jourLabel: libelleJour(w.samedi, m.jour),
        equipe: m.equipe,
        heure: m.heure,
        adversaire: m.adversaire,
        lieu: m.lieu,
        itineraire: itineraire(m.lieu),
      })),
    };
  });
}

/**
 * Les 3 week-ends de la page Matchs : le dernier passé, le week-end courant (le premier dont le
 * dimanche n'est pas passé : on bascule chaque lundi) et le suivant. Les plus anciens ne sont plus
 * affichés : on peut les effacer de WEEKENDS. equipes : celles qui jouent l'un de ces 3 week-ends.
 */
export function matchsAffiches(): { weekends: WeekEndVue[]; indexDefaut: number; equipes: string[] } {
  const tous = weekendsVue();
  const jour = aujourdhui();
  let courant = WEEKENDS.findIndex((w) => dateDe(w.samedi, 1).toISOString().slice(0, 10) >= jour);
  if (courant < 0) courant = tous.length - 1;
  const premier = Math.max(0, courant - 1);
  const weekends = tous.slice(premier, courant + 2);
  const equipes = [...new Set(weekends.flatMap((w) => [...w.domicile, ...w.exterieur]).map((m) => m.equipe))].sort(cmp);
  return { weekends, indexDefaut: courant - premier, equipes };
}

/* ───────── Stages ───────── */

/** Par défaut, une semaine de stage dure 5 jours, du lundi (debut) au vendredi. */
const JOURS_STAGE = 5;
/** Les inscriptions d'une semaine ferment à cette heure (Paris), la veille de son dernier jour. */
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

/** Veille du dernier jour d'une semaine de stage : jour de fermeture de ses inscriptions. */
function veilleDernierJour(debut: string, w: SemaineStage): Date {
  return dateDe(debut, joursDeStage(w) - 2);
}

/** Les inscriptions d'une semaine ferment la veille de son dernier jour à midi (maintenant : heure de Paris). */
function semaineFermee(w: SemaineStage, maintenant: string): boolean {
  if (!w.debut) return false;
  return maintenant >= `${veilleDernierJour(w.debut, w).toISOString().slice(0, 10)}T${HEURE_CLOTURE_STAGE}`;
}

/** "jeudi 22 octobre, midi" : quand ferment les inscriptions de la semaine. */
function clotureSemaine(w: SemaineStage): string {
  if (!w.debut) return "";
  const jour = formater(veilleDernierJour(w.debut, w), { weekday: "long", day: "numeric", month: "long" });
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
  diplomes: "Diplôme",
  arrivee: "Arrivée au club",
  acces: "Accès (bus, tram, parking)",
  montant: "Montant",
};

/** Nom lisible d'un élément de liste (entraîneur, gymnase, formule…). */
function nomElement(x: unknown, i: number): string {
  if (x && typeof x === "object") {
    for (const k of ["prenom", "nom", "titre", "formule", "id"]) {
      const v = (x as Record<string, unknown>)[k];
      if (typeof v === "string" && v && !MARQUE_A_COMPLETER.test(v)) return v;
    }
  }
  return `n° ${i + 1}`;
}

/**
 * Tout ce qui est encore marqué « [À COMPLÉTER] » ou « [À CONFIRMER] » dans data/nbb.ts (masqué sur le site),
 * plus les équipes du planning sans coach. Affiché dans l'Espace dirigeants.
 */
export function manquesDuSite(): ManqueSite[] {
  const manques: ManqueSite[] = [];
  const ajouter = (racine: string, element: string, champ: string, valeur: string, chemin: string) => {
    const s = SECTIONS_MANQUES[racine];
    manques.push({ section: s?.titre ?? racine, page: s?.page, element, champ: CHAMPS_MANQUES[champ] ?? champ, valeur, chemin });
  };
  const parcourir = (v: unknown, chemin: string, racine: string, element: string, champ: string, niveau: number) => {
    if (typeof v === "string") {
      if (MARQUE_A_COMPLETER.test(v)) ajouter(racine, element, champ, v, chemin);
    } else if (Array.isArray(v)) {
      // Premier niveau (liste d'entraîneurs, de gymnases…) : chaque élément est nommé.
      v.forEach((x, i) => parcourir(x, `${chemin}[${i}]`, racine, niveau === 0 ? nomElement(x, i) : element, champ, niveau + 1));
    } else if (v && typeof v === "object") {
      for (const [k, x] of Object.entries(v)) parcourir(x, `${chemin}.${k}`, racine, element, champ || k, niveau + 1);
    }
  };
  for (const [nom, valeur] of Object.entries(DONNEES)) parcourir(valeur, nom, nom, "", "", 0);
  for (const e of toutesLesEquipes()) {
    if (!ficheEquipe(e).coachs) ajouter("SLOTS", e, "Coach", "Aucun coach indiqué dans le planning", "SLOTS");
  }
  return manques;
}
