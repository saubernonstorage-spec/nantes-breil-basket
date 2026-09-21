/**
 * Formes des données du fichier de contenu `data/nbb.ts`.
 * Si un bloc est mal rempli (champ oublié, faute de frappe dans un nom de champ),
 * la vérification de la mise en ligne s'arrête et indique la ligne fautive.
 */

export type Jour = "Lundi" | "Mardi" | "Mercredi" | "Jeudi" | "Vendredi" | "Samedi" | "Dimanche";

/**
 * Champ « photo » : soit le texte affiché dans l'emplacement gris rayé
 * (ex. "PHOTO — 1200×750 px"), soit le chemin d'une vraie photo déposée
 * dans `public/photos/` (ex. "/photos/actus/tournoi.jpg").
 */
export type Photo = string;

export type Club = {
  nom: string;
  sigle: string;
  quartier: string;
  ville: string;
  baseline: string;
  siteUrl: string;
  adresse: string;
  email: string;
  telephone: string;
  facebook: string;
  instagram: string;
  whatsapp: string;
  boutique: string;
  inscription: string;
  ffbb: string;
  scorenco: string;
  saison: string;
  delaiReponse: string;
};

export type PhotoPage = { photo: Photo; alt: string };

export type Valeur = { titre: string; texte: string };
export type EtapeHistoire = { annee: string; texte: string };
export type MembreBureau = { role: string; nom: string; photo: Photo };
export type Entraineur = {
  prenom: string;
  role: string;
  depuis: string;
  presentation: string;
  photo: Photo;
};
export type Commission = { nom: string; role: string; referent?: string };

export type Actu = {
  titre: string;
  tag: string;
  date: string;
  chapo: string;
  photo: Photo;
  lien: string;
};

export type DateAgenda = { date: string; titre: string; lieu: string };

export type Arbitrage = {
  intro: string;
  objectifs: string[];
  formation: string[];
  seancesTitre: string;
  seancesIntro: string;
  seances: { date: string; lieu: string }[];
  contact: { nom: string; email: string; telephone: string };
  memo: string;
};

export type Tarif = { categorie: string; age: string; prix: string };
export type Aide = { titre: string; texte: string };
export type QuestionFaq = { q: string; r: string };

export type Gymnase = {
  nom: string;
  role: string;
  adresse: string;
  acces: string;
  /** Coordonnées GPS (facultatives) pour épingler la carte. */
  lat?: number;
  lon?: number;
};

export type Partenaire = { nom: string; activite: string; logo: Photo; site: string };
export type OffrePartenariat = { nom: string; montant: string; inclus: string[] };

export type SemaineStage = { nom: string; dates: string; places: string };
export type Stage = {
  periode: string;
  public: string;
  lieu: string;
  statut: string;
  contenu: string;
  semaines: SemaineStage[];
};
export type TarifStage = {
  formule: string;
  licencies: string;
  carteBlanche: string;
  nonLicencies: string;
};

export type Album = { titre: string; meta: string; photo: Photo; lien: string };

export type Creneau = {
  id: string;
  gymnase: string;
  jour: Jour;
  debut: string;
  fin: string;
  duree: string;
  equipes: string[];
  coachs: string[];
};

export type CleCategorie = "mini" | "jeunes" | "seniors" | "loisirs";
export type Categorie = {
  cle: CleCategorie;
  nom: string;
  ages: string;
  resume: string;
  photo: Photo;
};
