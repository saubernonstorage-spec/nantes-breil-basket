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
  telephone: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  whatsapp: string;
  boutique: string;
  ffbb: string;
  widgetResultats: string;
  emailLicenceFFBB: string;
  memoArbitrage: string;
  delaiReponseContact: string;
  delaiReponseInscription: string;
  plaquettePartenaires: string;
};

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
};

export type MatchDomicile = {
  salle: string;
  equipe: string;
  jour: string;
  heure: string;
  adversaire: string;
  arbitres: string;
  table: string;
  otm: string;
};

export type MatchExterieur = {
  equipe: string;
  jour: string;
  heure: string;
  adversaire: string;
  lieu: string;
};

export type WeekEnd = {
  titre: string;
  semaine: string;
  samedi: string;
  domicile: MatchDomicile[];
  exterieur: MatchExterieur[];
};

export type Diplome = { nom: string; url?: string };

export type Entraineur = {
  prenom: string;
  nom: string;
  role: string;
  photo: string;
  presentation: string;
  diplomes: Diplome[];
  arrivee: string;
};

export type MembreBureau = { nom: string; role: string; detail: string; photo: string };
export type MembreComite = { nom: string; detail: string };

export type Commission = { nom: string; role: string; temps: string; recrute?: boolean };

export type EtapeHistoire = { annee: string; titre: string; texte: string };
export type BlocTexte = { titre: string; texte: string };
export type Engagement = { titre: string; points: string[] };

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

export type Partenaire = { nom: string; activite: string; ville: string; logo: string; logoClair?: boolean; site?: string };

export type OffrePartenariat = { nom: string; montant: string; inclus: string[]; vedette?: boolean };

export type SemaineStage = {
  id: string;
  nom: string;
  dates: string;
  debut?: string;
  nesDe?: number;
  nesA?: number;
  licenciesFFBB?: boolean;
};

export type Stage = {
  id: string;
  periode: string;
  public: string;
  lieu: string;
  ouvert: boolean;
  semaines: SemaineStage[];
};

export type StatutStage = "licencies" | "carteBlanche" | "nonLicencies";

export type TarifStage = { formule: string } & Record<StatutStage, string>;

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
  image: string;
};

export type LigneClassement = {
  rang: number;
  equipe: string;
  j: number;
  v: number;
  d: number;
  pts: number;
  nbb?: boolean;
};

export type Classement = { championnat: string; maj: string; lignes: LigneClassement[] };
