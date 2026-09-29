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
import type { Chiffre, CleCategorie, Creneau, Jour, SemaineStage, StatutStage, Tarif } from "@/lib/types";
import { duree, heure, heureCourte, itineraire, majuscule, montant, pluriel, slug, type PrixCotisation, type PrixStage } from "@/lib/utils";

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
    coachs: [...new Set(cr.flatMap((s) => s.coachs))].join(", ") || "[À COMPLÉTER]",
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

export type WeekEndVue = {
  titre: string;
  semaine: string;
  num: string;
  dates: string;
  vide: boolean;
  domicile: MatchDomicileVue[];
  exterieur: MatchExterieurVue[];
};

function libelleJour(samedi: string, jour: string): string {
  return majuscule(formater(dateDe(samedi, decalageJour(jour)), { weekday: "long", day: "numeric", month: "long" }));
}

export function weekendsVue(): WeekEndVue[] {
  return WEEKENDS.map((w, i) => {
    const sa = dateDe(w.samedi);
    const di = dateDe(w.samedi, 1);
    const court = (d: Date) => formater(d, { day: "numeric", month: "short" });
    const dates =
      sa.getUTCMonth() === di.getUTCMonth() ? `${sa.getUTCDate()}–${court(di)}` : `${court(sa)} – ${court(di)}`;
    const tri = <T extends { jour: string; heure: string }>(liste: T[]) =>
      [...liste].sort((a, b) => ordreMatch(a.jour, a.heure) - ordreMatch(b.jour, b.heure));
    return {
      titre: w.titre,
      semaine: w.semaine,
      num: w.semaine.replace("Semaine", "Sem."),
      dates,
      vide: w.domicile.length + w.exterieur.length === 0,
      domicile: tri(w.domicile).map((m, k) => ({
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
 * Week-end affiché par défaut : dès que le dimanche est passé, on bascule sur le suivant
 * (même s'il n'est pas encore rempli). avecMatchs : le prochain week-end rempli, sinon le dernier rempli.
 */
export function indexWeekendCourant(avecMatchs = false): number {
  const jour = aujourdhui();
  const plein = (i: number) => WEEKENDS[i].domicile.length + WEEKENDS[i].exterieur.length > 0;
  const dimanche = (i: number) => dateDe(WEEKENDS[i].samedi, 1).toISOString().slice(0, 10);
  let i = WEEKENDS.findIndex((_, k) => (!avecMatchs || plein(k)) && dimanche(k) >= jour);
  if (i < 0 && avecMatchs) {
    for (let k = WEEKENDS.length - 1; k >= 0; k--) {
      if (plein(k)) {
        i = k;
        break;
      }
    }
  }
  return i < 0 ? WEEKENDS.length - 1 : i;
}

export function equipesDesMatchs(): string[] {
  return [...new Set(WEEKENDS.flatMap((w) => [...w.domicile, ...w.exterieur]).map((m) => m.equipe))].sort(cmp);
}

/* ───────── Stages ───────── */

export type JourStage = { id: string; court: string; long: string };
export type SemaineOuverte = SemaineStage & { periode: string; stage: string; jours: JourStage[] };

export function semainesOuvertes(): SemaineOuverte[] {
  return STAGES.filter((s) => s.ouvert).flatMap((s) =>
    s.semaines.map((w) => {
      const jours: JourStage[] = [];
      if (w.debut) {
        for (let i = 0; i < 5; i++) {
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
  return { jour: montant(STAGE_TARIFS[0][statut]), semaine: montant(STAGE_TARIFS[1][statut]) };
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
