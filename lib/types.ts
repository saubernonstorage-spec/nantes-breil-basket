/** Types du contenu (data/nbb.ts). Rien à modifier ici pour mettre à jour le site. */

export type Jour = "Lundi" | "Mardi" | "Mercredi" | "Jeudi" | "Vendredi" | "Samedi" | "Dimanche";

export type CleCategorie = "mini" | "jeunes" | "seniors" | "loisirs";

/** Une photo : chemin dans public/ (ex. "/photos/accueil.jpg") et description pour les personnes malvoyantes. */
export type Photo = { src: string; alt: string };

export type Club = {
  nom: string;
  sigle: string;
  quartier: string;
  ville: string;
  saison: string;
  fondation: string;
  siteUrl: string;
  adresse: string;
  boiteAuxLettres: string;
  email: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  whatsapp: string;
  boutique: string;
  ffbb: string;
  emailLicenceFFBB: string;
  memoArbitrage: string;
  delaiReponseContact: string;
  delaiReponseInscription: string;
  plaquettePartenaires: string;
  reductionImpot: string;
};

/** Période d'ouverture de la boutique : dates AAAA-MM-JJ incluses. */
export type OuvertureBoutique = { debut: string; fin: string };

/** Services de l'association qui reçoivent les e-mails du site (EMAILS_SERVICES). */
export type ServiceEmail = "contact" | "inscriptions" | "arbitrage" | "stages" | "partenariat" | "benevolat" | "site";

export type Chiffre = { valeur: string; label: string };

export type DateAgenda = {
  date: string;
  jour: string;
  num: string;
  mois: string;
  titre: string;
  texte: string;
  lieu: string;
  type: string;
  lien?: string;
  /** Photo de l'affiche (fenêtre « prochain événement » à l'ouverture du site), chemin dans public/. */
  affiche?: string;
};

/** Convocations d'un match à domicile (le match lui-même vient de la FFBB). date : AAAA-MM-JJ. */
export type Convocation = {
  date: string;
  equipe: string;
  arbitres: string;
  table: string;
  otm: string;
};

/** Match absent de la FFBB : salle (+ convocations) à domicile, lieu (adresse) à l'extérieur. */
export type MatchManuel = {
  date: string;
  equipe: string;
  heure: string;
  adversaire: string;
  salle?: string;
  lieu?: string;
  arbitres?: string;
  table?: string;
  otm?: string;
};

export type Diplome = { nom: string; url?: string };

export type Entraineur = {
  prenom: string;
  nom: string;
  role: string;
  photo: string;
  diplomes: Diplome[];
  arrivee: string;
};

export type MembreBureau = { nom: string; role: string; detail: string; photo: string };
export type MembreComite = { nom: string; detail: string };

export type Commission = { nom: string; role: string; temps: string; recrute?: boolean };

export type EtapeHistoire = { annee: string; titre: string; texte: string };
export type BlocTexte = { titre: string; texte: string };

export type Tarif = {
  cle: string;
  categorie: string;
  detail: string;
  prix: number;
  prixB: number;
};

export type Lien = { nom: string; url: string };

/** [entraînements par semaine, matchs le week-end, effectif maximum] */
export type Capacite = [number, boolean, number];

export type QuestionFaq = { q: string; r: string };

export type Transport = { mode: string; arret: string; lignes: string[] };

export type Gymnase = {
  nom: string;
  role: string;
  adresse: string;
  acces: string;
  transports?: Transport[];
  parking?: boolean;
  partenaire?: boolean;
};

export type Partenaire = { nom: string; activite: string; ville: string; adresse?: string; logo: string; logoClair?: boolean; site?: string };

export type OffrePartenariat = { nom: string; montant: string; inclus: string[]; vedette?: boolean };

export type SemaineStage = {
  id: string;
  nom: string;
  dates: string;
  debut?: string;
  fin?: string;
  nesDe?: number;
  nesA?: number;
  licenciesFFBB?: boolean;
};

export type Stage = {
  id: string;
  periode: string;
  semaines: SemaineStage[];
};

export type StatutStage = "licencies" | "carteBlanche" | "nonLicencies";

/** jours : nombre de jours de la semaine complète à ce prix (absent = tarif à la journée). */
export type TarifStage = { formule: string; jours?: number } & Record<StatutStage, string>;

export type ReductionStage = { enfants: number; taux: number; texte: string };

export type SeanceArbitrage = { date: string; heure: string; lieu: string };

export type Album = { id: string; titre: string; couverture: string; photos: Photo[] };

/** [gymnase, jour, début, fin, équipes, coachs] */
export type LigneCreneau = [string, Jour, string, string, string[], string[]];

export type Creneau = {
  gymnase: string;
  jour: Jour;
  debut: string;
  fin: string;
  equipes: string[];
  coachs: string[];
};

export type Categorie = {
  cle: CleCategorie;
  nom: string;
  ages: string;
  resume: string;
};

export type LigneClassement = {
  rang: number;
  equipe: string;
  j: number;
  v: number;
  d: number;
  pts: number;
  nbb?: boolean;
  /** Identifiant FFBB du club (classements automatiques) : sert à retrouver son logo. */
  club?: string;
};

export type Classement = { championnat: string; maj: string; lignes: LigneClassement[] };
