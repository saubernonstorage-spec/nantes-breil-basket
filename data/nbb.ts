/**
 * ═══════════════════════════════════════════════════════════════
 *  CONTENU DU SITE — NANTES BREIL BASKET (saison 2026-2027)
 *  Tout le contenu « qui bouge » est dans ce fichier : matchs, agenda,
 *  planning, tarifs, stages, bureau, partenaires, FAQ, photos…
 *  Règles : ne changez que le texte entre guillemets "…", gardez les
 *  guillemets, les virgules et les accolades. Remplacez les
 *  « [À COMPLÉTER] ». Une ligne = un élément : copiez-collez pour ajouter.
 *  Mode d'emploi détaillé : NOTICE.md
 * ═══════════════════════════════════════════════════════════════
 */

import type {
  Album,
  Capacite,
  Categorie,
  Chiffre,
  Classement,
  Club,
  Commission,
  DateAgenda,
  Engagement,
  Entraineur,
  EtapeHistoire,
  Gymnase,
  LigneCreneau,
  Lien,
  MembreBureau,
  MembreComite,
  OffrePartenariat,
  Partenaire,
  Photo,
  QuestionFaq,
  ReductionStage,
  SeanceArbitrage,
  Stage,
  Tarif,
  TarifStage,
  BlocTexte,
  WeekEnd,
} from "@/lib/types";

export const CLUB: Club = {
  nom: "Nantes Breil Basket",
  sigle: "NBB",
  quartier: "Breil / Hauts-Pavés",
  ville: "Nantes",
  saison: "2026-2027",
  fondation: "1932",
  // Adresse du site une fois en ligne (référencement, aperçus de partage).
  siteUrl: "https://nantes-breil-basket.fr",
  adresse: "Gymnase Joël Paon\n42 bis rue des Hauts-Pavés\n44000 Nantes",
  boiteAuxLettres: "42 rue des Hauts-Pavés — 1re boîte en haut à gauche, sur le petit parking",
  email: "contact@nbb44.fr",
  facebook: "https://www.facebook.com/people/Nantes-Breil-Basket/100063796590330/",
  instagram: "https://www.instagram.com/nantesbreilbasket44/",
  linkedin: "https://fr.linkedin.com/company/nantes-breil-basket",
  whatsapp: "https://chat.whatsapp.com/J4An3XN8EZXG0BbuQFjzvC",
  boutique: "https://app.grinta.eu/nbb44/adult/official",
  ffbb: "https://competitions.ffbb.com/",
  emailLicenceFFBB: "pdl0044034@ffbb.com",
  memoArbitrage: "https://nantes-breil-basket.fr/public/5071/upload/files/arbitrage/memo-de-l-arbitrage-2.pdf",
  // Délais de réponse annoncés après l'envoi d'un formulaire, ex. "48 h" ou "5 jours".
  delaiReponseContact: "[À COMPLÉTER]",
  delaiReponseInscription: "[À COMPLÉTER]",
  // Lien vers la plaquette partenaires (PDF), commençant par https://.
  plaquettePartenaires: "[À COMPLÉTER]",
  // Page Partenaires, formule mécénat : retirez « [À CONFIRMER…] » une fois l'éligibilité vérifiée pour l'afficher.
  reductionImpot: "Réduction d'impôt possible (association loi 1901) [À CONFIRMER : éligibilité]",
};

/** Mentions légales (page /mentions-legales). */
export const MENTIONS = {
  rna: "[À COMPLÉTER]",
  siret: "[À COMPLÉTER]",
  responsablePublication: "Sébastien Aubernon, président [À CONFIRMER]",
  hebergeur: "Netlify, Inc., 101 2nd Street, San Francisco, CA 94105, États-Unis — www.netlify.com (contact : support@netlify.com).",
  conservationAdhesions: "[À COMPLÉTER] ans",
  conservationMessages: "[À COMPLÉTER] mois",
};

/**
 * Chiffres clés de l'accueil. Le nombre de gymnases est calculé
 * automatiquement à partir de la liste GYMNASES (hors gymnase partenaire).
 */
export const STATS = {
  adherents: "411",
  equipes: "28", // équipes engagées en championnat
};
export const LABEL_ECOLE: Chiffre = { valeur: "★★★", label: "label École de Mini-Basket" };

/**
 * Grandes photos des pages. `src` = chemin de la photo déposée dans public/photos/,
 * `alt` = description de la photo pour les personnes malvoyantes.
 */
export const PHOTOS: Record<"accueil" | "accueilEcole" | "accueilVieClub" | "club" | "ecoles" | "stages", Photo> = {
  accueil: {
    src: "/photos/jeunes-dribble.jpg",
    alt: "Deux jeunes joueuses et joueurs du NBB enchaînent un exercice de dribble au gymnase",
  },
  accueilEcole: {
    src: "/photos/mini-basket-seance.jpg",
    alt: "Séance de mini-basket au gymnase Joël Paon : enfants, parents et éducateurs sur le terrain",
  },
  accueilVieClub: {
    src: "/photos/club-gymnase-groupe.jpg",
    alt: "Une centaine de jeunes licenciés du NBB, bras levés sur les gradins du gymnase, sous la bannière Nantes Breil Basket",
  },
  club: {
    src: "/photos/club-groupe-jeunes.jpg",
    alt: "Les jeunes licenciés du NBB réunis sous la bannière du club",
  },
  ecoles: {
    src: "/photos/mini-basket-coach.jpg",
    alt: "Une entraîneure du NBB entourée d'un groupe d'enfants à l'entraînement",
  },
  stages: {
    src: "/photos/mini-basket-coach.jpg",
    alt: "Une entraîneure du NBB donne des consignes à un groupe d'enfants pendant un stage",
  },
};

/** Agenda du club — le plus proche en premier. Les dates passées disparaissent seules. lieu : "" pour ne rien afficher. */
export const AGENDA: DateAgenda[] = [
  { date: "2026-09-26", jour: "Sam", num: "26", mois: "sept", titre: "Soirée grillades & match RM2", texte: "Premier match à domicile de l'équipe fanion (SM1, 20 h 30).", lieu: "Gymnase Joël Paon · NBB vs Moine Basket", type: "Soirée" },
  { date: "2026-10-19", jour: "Lun", num: "19", mois: "oct", titre: "Stages d'automne", texte: "Deux semaines de stage, du 19 au 30 octobre.", lieu: "", type: "Stage", lien: "/stages" },
  { date: "2026-11-11", jour: "Mer", num: "11", mois: "nov", titre: "Tournoi jeunes", texte: "Tournoi du club pour les équipes U9 à U13.", lieu: "Gymnases Joël Paon et Similienne", type: "Tournoi" },
  { date: "2026-11-21", jour: "Sam", num: "21", mois: "nov", titre: "Soirée burgers & derby RM2", texte: "Un burger, des tribunes pleines, le derby contre Rezé.", lieu: "NBB vs Basket Club Rezé", type: "Soirée" },
  { date: "2026-12-12", jour: "Sam", num: "12", mois: "déc", titre: "Noël du NBB", texte: "Animations et jeux pour les enfants l'après-midi.", lieu: "Gymnase Joël Paon", type: "Fête" },
  { date: "2027-05-06", jour: "Jeu", num: "6", mois: "mai", titre: "Challenge Éric Canonnet", texte: "Challenge U11M Élite entre seize équipes.", lieu: "Joël Paon, Similienne, Breil et Coubertin", type: "Tournoi" },
];

/**
 * MATCHS PAR WEEK-END + CONVOCATIONS (arbitres, table de marque, OTM).
 * Un bloc par week-end, dans l'ordre chronologique. samedi : date du samedi (AAAA-MM-JJ).
 * Un week-end encore vide (domicile et exterieur vides) s'affiche « à venir ».
 * table : équipe qui fournit 2 joueur·ses pour la table de marque.
 * Adresses des salles à domicile : ADRESSES_SALLES ci-dessous.
 */
export const WEEKENDS: WeekEnd[] = [
  {
    titre: "Week-end du 26 & 27 septembre 2026", semaine: "Semaine 39", samedi: "2026-09-26",
    domicile: [
      { salle: "Joël Paon", equipe: "U11M1", jour: "Sam. 26", heure: "13h30", adversaire: "Carquefou Basket 1", arbitres: "Paul P., Hugo C.", table: "2 × U11F2", otm: "Clément M." },
      { salle: "Joël Paon", equipe: "U11F2", jour: "Sam. 26", heure: "14h45", adversaire: "Chabossière Basket Club 2", arbitres: "Paul P., Hugo C.", table: "2 × U11M1", otm: "Clément M." },
      { salle: "Joël Paon", equipe: "U13F1", jour: "Sam. 26", heure: "16h00", adversaire: "ALPC Moulin Nantes Basket 1", arbitres: "Dorian N., Bastien T.", table: "2 × U11F2", otm: "Hugo B." },
      { salle: "Joël Paon", equipe: "U18HPB", jour: "Sam. 26", heure: "18h00", adversaire: "Erdre 2", arbitres: "Officiels", table: "2 × U13F1", otm: "Hugo B." },
      { salle: "Joël Paon", equipe: "SM1", jour: "Sam. 26", heure: "20h30", adversaire: "Moine Basket Club 1", arbitres: "Officiels", table: "Clara J., Inès A.", otm: "—" },
      { salle: "Joël Paon", equipe: "U18F2", jour: "Dim. 27", heure: "09h00", adversaire: "Saint-Herblain Basket Club 2", arbitres: "Tadeusz P., Yannick D.", table: "2 × U15F1", otm: "Clément M." },
      { salle: "Joël Paon", equipe: "U15F1", jour: "Dim. 27", heure: "11h00", adversaire: "ES Pornichet 1", arbitres: "Officiels", table: "2 × U18F2", otm: "Clément M." },
      { salle: "Similienne", equipe: "U13HPB", jour: "Dim. 27", heure: "09h00", adversaire: "ABC des Trois Rivières 1", arbitres: "—", table: "—", otm: "—" },
      { salle: "Breil Malville", equipe: "U11M2", jour: "Sam. 26", heure: "13h30", adversaire: "Bouguenais Basket 2", arbitres: "Abdel Y., Arthur G.", table: "2 × U18M2", otm: "Romane P." },
      { salle: "Breil Malville", equipe: "U18M2", jour: "Sam. 26", heure: "14h45", adversaire: "EB Sorinières 1", arbitres: "Abdel Y.", table: "2 × U15M3", otm: "Romane P." },
      { salle: "Breil Malville", equipe: "U15M3", jour: "Sam. 26", heure: "16h45", adversaire: "AL Garennes Nantes 2", arbitres: "Jonathan-Enzo L., Léo C.", table: "2 × U18M2", otm: "Romane P." },
    ],
    exterieur: [
      { equipe: "U9M1", jour: "Sam. 26", heure: "12h30", adversaire: "Carquefou Basket", lieu: "Rue Louis Armand, 44470 Carquefou" },
      { equipe: "U11F1", jour: "Sam. 26", heure: "13h00", adversaire: "Orvault Sports Basket 1", lieu: "14 rue du Raffuneau, 44700 Orvault" },
      { equipe: "U13M3", jour: "Sam. 26", heure: "13h50", adversaire: "Saint-Herblain Basket Club 2", lieu: "15 bis rue Théophile Guillou, 44800 Saint-Herblain" },
      { equipe: "U13F2", jour: "Sam. 26", heure: "14h15", adversaire: "Orvault Sports Basket 2", lieu: "14 rue du Raffuneau, 44700 Orvault" },
      { equipe: "U15M2", jour: "Sam. 26", heure: "15h00", adversaire: "Vertou Basket 2", lieu: "Allée de la Vigne de Pâques, 44120 Vertou" },
      { equipe: "U13M2", jour: "Sam. 26", heure: "17h45", adversaire: "Bouguenais Basket 2", lieu: "Rue de la Neustrie, 44340 Bouguenais" },
      { equipe: "U15F2", jour: "Sam. 26", heure: "18h00", adversaire: "Orvault Sports Basket 2", lieu: "14 rue du Raffuneau, 44700 Orvault" },
      { equipe: "U18M3", jour: "Sam. 26", heure: "18h30", adversaire: "Nantes Sully Basket 3", lieu: "Rue Henri Cochard, 44000 Nantes" },
      { equipe: "U15HPB", jour: "Dim. 27", heure: "09h45", adversaire: "Hirondelle Basket 1", lieu: "Route Félix Praud, 44450 Saint-Julien-de-Concelles" },
      { equipe: "U11M3", jour: "Dim. 27", heure: "11h00", adversaire: "Bouguenais Basket", lieu: "Rue de la Neustrie, 44340 Bouguenais" },
      { equipe: "SF2", jour: "Dim. 27", heure: "13h15", adversaire: "Erdre Basket Club 2", lieu: "Boulevard du Gesvres, 44240 La Chapelle-sur-Erdre" },
      { equipe: "SM3", jour: "Dim. 27", heure: "15h30", adversaire: "Golf Basket Club Herblinois 2", lieu: "Avenue de l'Angevinière, 44800 Saint-Herblain" },
      { equipe: "SM2", jour: "Dim. 27", heure: "16h15", adversaire: "IBC Indre Basket Club 2", lieu: "7 rue de l'Allier, 44610 Indre" },
      { equipe: "SF1", jour: "Dim. 27", heure: "17h45", adversaire: "Orvault Sports Basket 2", lieu: "14 rue du Raffuneau, 44700 Orvault" },
    ],
  },
  {
    titre: "Week-end du 3 & 4 octobre 2026", semaine: "Semaine 40", samedi: "2026-10-03",
    domicile: [
      { salle: "Joël Paon", equipe: "U9M1", jour: "Sam. 3", heure: "13h30", adversaire: "Similienne Nantes", arbitres: "Gregoire A., Theodore F.", table: "2 × U11M2", otm: "Hugo B." },
      { salle: "Joël Paon", equipe: "U11M2", jour: "Sam. 3", heure: "14h30", adversaire: "Beaujoire Basket Club 2", arbitres: "2 × U18F2", table: "2 × U11M1", otm: "Hugo B." },
      { salle: "Joël Paon", equipe: "U11M1", jour: "Sam. 3", heure: "15h45", adversaire: "Rezé Basket 44 - 1", arbitres: "Theodore F., Basile D.", table: "2 × U11M2", otm: "Clément M." },
      { salle: "Joël Paon", equipe: "U11F2", jour: "Sam. 3", heure: "17h00", adversaire: "Gars d'Herbauges Bouaye 2", arbitres: "Hugo T., Jean-Baptiste H.", table: "2 × U11M1", otm: "Clément M." },
      { salle: "Joël Paon", equipe: "U18F2", jour: "Sam. 3", heure: "18h15", adversaire: "Chabossière Basket Club 2", arbitres: "Jean-Baptiste H., Hugo T.", table: "2 × SM3", otm: "Clément M." },
      { salle: "Joël Paon", equipe: "SM3", jour: "Sam. 3", heure: "20h30", adversaire: "Saint-Herblain Basket Club 2", arbitres: "Bastien G., Clara P.", table: "—", otm: "—" },
      { salle: "Joël Paon", equipe: "U13F1", jour: "Dim. 4", heure: "09h00", adversaire: "Étoile Sportive de Couëron 1", arbitres: "Theodore F., Ninon T.", table: "Haskel M.", otm: "—" },
      { salle: "Joël Paon", equipe: "U15M2", jour: "Dim. 4", heure: "10h45", adversaire: "ASPTT Nantes 2", arbitres: "—", table: "2 × U13F1", otm: "Clément M." },
      { salle: "Joël Paon", equipe: "SM2", jour: "Dim. 4", heure: "13h15", adversaire: "AS Heulinoise Basket Ball 1", arbitres: "Clara J., Maiwenn T.", table: "Rahmalla S., Axel G.", otm: "—" },
      { salle: "Joël Paon", equipe: "SF1", jour: "Dim. 4", heure: "15h30", adversaire: "Espérance Sportive de Crossac 2", arbitres: "—", table: "El-Ambasse B., Charlely Q.", otm: "—" },
      { salle: "Joël Paon", equipe: "SF2", jour: "Dim. 4", heure: "17h45", adversaire: "Basket Club Rezé 2", arbitres: "Ines A., Clara R.", table: "Amélia F.", otm: "—" },
    ],
    exterieur: [
      // Horaire non communiqué sur la feuille du week-end (signalé par un avertissement) : à compléter.
      { equipe: "U11F1", jour: "Sam. 3", heure: "[À COMPLÉTER]", adversaire: "ASPTT Nantes", lieu: "38 rue Appert, 44100 Nantes" },
      { equipe: "U11M3", jour: "Sam. 3", heure: "12h15", adversaire: "ALPC Moulin Nantes Basket 2", lieu: "20 rue du Coudray, 44000 Nantes" },
      { equipe: "U13M2", jour: "Sam. 3", heure: "14h00", adversaire: "Basket Club Basse Loire 1", lieu: "Rue Pierre Mendès France, 44640 Saint-Jean-de-Boiseau" },
      { equipe: "U13M3", jour: "Sam. 3", heure: "16h30", adversaire: "Similienne Nantes 2", lieu: "26 bis rue des Hauts-Pavés, 44000 Nantes" },
      { equipe: "U15F1", jour: "Sam. 3", heure: "18h00", adversaire: "Espérance Sportive de Crossac", lieu: "Impasse des Petits Matelots, 44160 Crossac" },
      { equipe: "U18M3", jour: "Sam. 3", heure: "18h30", adversaire: "AL Chauvinière 2", lieu: "4 rue des Renards, 44300 Nantes" },
      { equipe: "U15M3", jour: "Sam. 3", heure: "18h30", adversaire: "Nantes Sully Basket 1", lieu: "Rue Henri Cochard, 44000 Nantes" },
      { equipe: "SM1", jour: "Sam. 3", heure: "20h30", adversaire: "Avrillé Basket 1", lieu: "Avenue de la Ronde, 49240 Avrillé" },
      { equipe: "U13F2", jour: "Dim. 4", heure: "10h00", adversaire: "Nantes Sully Basket", lieu: "Rue Henri Cochard, 44000 Nantes" },
      { equipe: "U18F1", jour: "Dim. 4", heure: "11h00", adversaire: "Herbadilla La Chevrolière 1", lieu: "Rue du Stade, 44118 La Chevrolière" },
      { equipe: "U15F2", jour: "Dim. 4", heure: "11h00", adversaire: "Treillières Basket Club 3", lieu: "Rue Simone de Beauvoir, 44119 Treillières" },
      { equipe: "U18M2", jour: "Dim. 4", heure: "11h15", adversaire: "Sautron Basket Club 1", lieu: "Rue de la Forêt, 44880 Sautron" },
    ],
  },
  { titre: "Week-end du 10 & 11 octobre 2026", semaine: "Semaine 41", samedi: "2026-10-10", domicile: [], exterieur: [] },
];

/**
 * Salles où le club reçoit, avec leur adresse. Sur la page Matchs, les matchs à domicile sont
 * regroupés par salle, dans l'ordre de cette liste (le nom doit être celui du champ « salle » des matchs).
 */
export const ADRESSES_SALLES: Record<string, string> = {
  "Joël Paon": "42 bis rue des Hauts-Pavés, Nantes",
  "Breil Malville": "34 rue du Breil, Nantes",
  "Similienne": "26 bis rue des Hauts-Pavés, Nantes",
};

/** Encadrement technique (d'après le planning). Complétez les diplômes et l'arrivée au club. */
export const ENCADREMENT: Entraineur[] = [
  { prenom: "Clément", nom: "", role: "Entraîneur salarié", photo: "/photos/coachs/clement.png", diplomes: [{ nom: "BPJEPS" }, { nom: "DETB" }], arrivee: "Au club depuis 2022" },
  { prenom: "Romane", nom: "", role: "Entraîneure salariée", photo: "/photos/coachs/romane.jpg", diplomes: [{ nom: "L3 STAPS" }], arrivee: "Au club depuis 2026" },
  { prenom: "Hugo", nom: "", role: "Entraîneur salarié", photo: "/photos/coachs/hugo.jpg", diplomes: [{ nom: "BPJEPS" }, { nom: "DETB" }], arrivee: "Au club depuis 2025" },
  { prenom: "Célia", nom: "", role: "Entraîneure apprentie", photo: "/photos/coachs/celia.jpg", diplomes: [{ nom: "En formation Négociateur technico-commercial" }], arrivee: "Au club depuis 2025" },
];

/** Bureau. photo : chemin d'un portrait dans public/photos/ (ex. "/photos/bureau/sebastien.jpg"), ou "". */
export const BUREAU: MembreBureau[] = [
  { nom: "Sébastien Aubernon", role: "Président", detail: "Ressources humaines, communication, technique, sponsoring", photo: "" },
  { nom: "Christophe Jan", role: "Vice-président", detail: "Commission évènements", photo: "" },
  { nom: "Séverine Jan", role: "Secrétaire", detail: "Commission secrétariat", photo: "" },
  { nom: "Hervé Deleaune", role: "Secrétaire adjoint", detail: "Ressources humaines, secrétariat", photo: "" },
  { nom: "Jérôme Fournier", role: "Trésorier", detail: "Commission trésorerie", photo: "" },
  { nom: "Jean-Bernard Canin", role: "Trésorier adjoint", detail: "Commission trésorerie", photo: "" },
];
export const COMITE: MembreComite[] = [
  { nom: "Nathalie Calvet", detail: "Commission technique" },
  { nom: "Cyril Cellier", detail: "Commission évènements" },
  { nom: "Clara Jan", detail: "Commission communication" },
  { nom: "Arnaud Le Bras", detail: "Commission tournois" },
  { nom: "Frédéric Ringeard", detail: "Commission trésorerie" },
  { nom: "Sami Saoudi", detail: "Commission sponsoring" },
  { nom: "Jessica Baranowksy", detail: "Bénévole · trésorerie, communication" },
];

/** Commissions : les bénévoles qui font tourner le club. recrute: true = mise en avant « On recrute ». */
export const COMMISSIONS: Commission[] = [
  { nom: "Évènements", recrute: true, role: "Soirées de match, Noël du NBB, fête de fin de saison.", temps: "1 à 2 évènements par trimestre" },
  { nom: "Communication", role: "Site, réseaux sociaux, affiches, photos de match.", temps: "À distance, à votre rythme" },
  { nom: "Matériel", role: "Ballons, maillots, chasubles : stocks et commandes.", temps: "Ponctuel" },
  { nom: "Secrétariat", role: "Licences, dossiers d'inscription, courriers et lien avec le comité et la ligue.", temps: "Surtout mai à septembre" },
  { nom: "Sponsoring", role: "Trouver et accompagner les entreprises qui soutiennent le club.", temps: "Réseau local bienvenu" },
  { nom: "Trésorerie", role: "Budget, cotisations, subventions et suivi des comptes du club.", temps: "Régulier" },
  { nom: "Ressources humaines", recrute: true, role: "Salariés et bénévoles : recrutement, plannings et accompagnement.", temps: "Ponctuel" },
  { nom: "Technique", role: "Projet sportif, constitution des groupes, suivi des entraîneurs.", temps: "Réunions mensuelles" },
  { nom: "Tournois", role: "Organiser les tournois et plateaux accueillis par le club.", temps: "Temps forts ponctuels" },
  { nom: "Arbitrage", role: "Former et accompagner arbitres et officiels de table de marque.", temps: "Formation courte proposée" },
  { nom: "Parents", recrute: true, role: "Le relais entre les familles et le club : déplacements, accompagnements, coups de main.", temps: "Quelques heures par saison" },
];

export const HISTOIRE: EtapeHistoire[] = [
  { annee: "1932", titre: "Les débuts", texte: "La section basket de l'Amicale Laïque naît à l'école de la Rue Noire. Faute de gymnase, on joue dans les cours d'école." },
  { annee: "1949", titre: "Les heures de gloire", texte: "Montée en championnat national. Juniors et cadets brillent en Coupe de France et ancrent la culture de formation du club." },
  { annee: "1980–2000", titre: "Les temps difficiles", texte: "D'autres clubs nantais se créent, les joueurs s'éparpillent. Naissent l'Entente Rue Noire Quai Hoche, puis le NAB." },
  { annee: "2000", titre: "Le renouveau", texte: "Accession à la R1. La fusion du NAB avec le Serpette Omni Sport donne naissance au NBB." },
  { annee: "2004", titre: "Place aux filles", texte: "Création des premières équipes féminines, en U9 et U11." },
  { annee: "2025", titre: "Trois étoiles", texte: "Obtention du label École Française de Mini-Basket 3 étoiles de la FFBB." },
  { annee: "2026", titre: "Aujourd'hui", texte: "411 adhérents, 28 équipes engagées et 7 gymnases utilisés chaque semaine." },
];

export const VALEURS: BlocTexte[] = [
  { titre: "Accueillir tout le monde", texte: "Du micro-basket dès 3 ans aux loisirs adultes, filles et garçons, débutants ou confirmés : chacun trouve son niveau et son créneau." },
  { titre: "Former avec exigence", texte: "Une école labellisée 3 étoiles, des entraîneurs professionnels et une école d'arbitrage pour faire grandir joueurs, coachs et arbitres." },
  { titre: "Vivre ensemble", texte: "Un lieu de partage et de convivialité, qui tient grâce à l'implication et à la bienveillance de chacun." },
];

export const PROJET: BlocTexte[] = [
  { titre: "Projet club", texte: "Garantir l'accès au basket pour tous, dans les meilleures conditions d'accueil, avec des équipes jeunes au niveau régional pour assurer une continuité jusqu'aux seniors." },
  { titre: "Projet sportif", texte: "Construire dès les U9 une identité de jeu collective et dynamique, et accompagner la formation des entraîneurs et des arbitres." },
  { titre: "Organisation", texte: "Une vision à 4 ou 5 saisons : des groupes par niveau pour que chacun progresse à son rythme, et des effectifs anticipés pour garder des groupes équilibrés." },
];

export const ENGAGEMENTS: Engagement[] = [
  { titre: "Joueurs et joueuses", points: ["Assiduité aux entraînements et aux matchs", "Ponctualité, et prévenir le coach en cas d'absence", "Respect des coachs, adversaires, arbitres et officiels", "Répondre aux convocations d'arbitrage et de table de marque", "Soutenir les autres équipes du NBB"] },
  { titre: "Parents", points: ["Vérifier la présence du coach avant de laisser son enfant", "Participer aux déplacements selon l'organisation prévue", "Laver les maillots à tour de rôle", "Encourager dans un esprit positif et respectueux", "Donner un coup de main à la vie du club (bar, évènements…)"] },
];

/**
 * Tarifs 2026-2027 — votés par le bureau (source : nantes-breil-basket.fr).
 * Gardez cet ordre : mini-basket, jeunes 1, 2 et 3 entraînements, seniors, loisirs.
 */
export const TARIFS: Tarif[] = [
  { cle: "mini", categorie: "Mini-basket", detail: "Jusqu'à U7", prix: 160, prixB: 165 },
  { cle: "jeunes1", categorie: "Jeunes loisirs", detail: "1 entraînement / semaine", prix: 180, prixB: 185 },
  { cle: "jeunes2", categorie: "Jeunes compétition", detail: "2 entraînements / semaine", prix: 200, prixB: 205 },
  { cle: "jeunes3", categorie: "Jeunes CTC", detail: "3 entraînements / semaine", prix: 220, prixB: 225 },
  { cle: "seniors", categorie: "Seniors", detail: "Championnat", prix: 220, prixB: 225 },
  { cle: "loisirs", categorie: "Loisirs adultes", detail: "Basket détente", prix: 160, prixB: 165 },
];
export const TARIF_NOTE = "Les options d'assurance de base (formules A et C) sont comprises. Formule B (indemnités journalières) : +5 €.";
export const AIDES = "Aides possibles : Pass'Sport, dispositif Carte blanche de la Ville de Nantes, comités d'entreprise — [À COMPLÉTER : dispositifs acceptés et montants].";

export const PIECES: Lien[] = [
  { nom: "Formulaire d'adhésion", url: "https://nantes-breil-basket.fr/public/5071/upload/files/articles/94/20260501-adhesion.pdf" },
  { nom: "Charte de l'adhérent", url: "https://nantes-breil-basket.fr/public/5071/upload/files/articles/94/20260501-charte.pdf" },
  { nom: "Tarifs 2026-2027", url: "https://nantes-breil-basket.fr/public/5071/upload/files/articles/94/20260501-tarifs.pdf" },
  { nom: "Résumé de l'assurance", url: "https://nantes-breil-basket.fr/public/5071/upload/files/articles/94/resume-assurance.pdf" },
  { nom: "Assurance individuelle accident", url: "https://nantes-breil-basket.fr/public/5071/upload/files/articles/94/assurance-individuelle-accident-sportive.pdf" },
];
export const DOCUMENTS: string[] = [
  "Formulaire d'adhésion complété et signé",
  "Questionnaire de santé (mineurs) ou certificat médical selon la situation",
  "Autorisation de droit à l'image — obligatoire pour les mineurs, oui ou non",
  "Charte de l'adhérent signée",
  "Règlement de la cotisation (chèques encaissés à partir du 1er septembre ou selon votre échéancier)",
];

/**
 * Capacités d'accueil par équipe (article « En route vers la saison 2026-2027 ») :
 * [entraînements par semaine, matchs le week-end (true/false), effectif maximum].
 */
export const CAPACITES: Record<string, Capacite> = {
  U7: [1, false, 20], U9M1: [2, true, 9], U9M2: [1, true, 9], U9M3: [1, false, 20], U9F1: [2, true, 9],
  U11M1: [2, true, 9], U11M2: [2, true, 9], U11M3: [1, true, 15], U11F1: [2, true, 9], U11F2: [1, true, 15],
  U13HPB: [3, true, 6], U13M2: [2, true, 10], U13M3: [1, true, 12], U13F1: [2, true, 12], U13F2: [1, true, 12],
  U15HPB: [3, true, 6], U15M2: [2, true, 10], U15M3: [1, true, 12], U15F1: [2, true, 12], U15F2: [1, true, 12],
  U18HPB: [3, true, 6], U18M2: [2, true, 10], U18M3: [1, true, 12], U18F1: [2, true, 12], U18F2: [1, true, 12],
};

export const FAQ: QuestionFaq[] = [
  { q: "À partir de quel âge peut-on commencer ?", r: "Dès 3 ans au micro-basket, le samedi matin au gymnase Joël Paon : Micro 1 pour les enfants né(e)s en 2021, Micro 2 pour les enfants né(e)s en 2022 et 2023. Ensuite U7, U9, U11… jusqu'aux seniors et aux loisirs adultes." },
  { q: "Peut-on essayer avant de s'inscrire ?", r: "Oui, deux séances d'essai sont possibles dans la catégorie concernée. Écrivez à contact@nbb44.fr pour les planifier." },
  { q: "Combien coûte la licence ?", r: "De 160 € (mini-basket, loisirs adultes) à 220 € (jeunes CTC, seniors), selon le nombre d'entraînements par semaine. Assurance de base comprise ; formule B : +5 €." },
  { q: "Y a-t-il de la place dans toutes les équipes ?", r: "Non : chaque équipe a un effectif maximum et certaines catégories sont complètes. Les réinscriptions sont prioritaires ; en cas de saturation, une liste d'attente est proposée." },
  { q: "Comment est créée la licence FFBB ?", r: "Après réception du règlement, vous recevez un lien personnalisé envoyé par pdl0044034@ffbb.com. Ajoutez cette adresse à vos contacts pour éviter les indésirables." },
  { q: "Où et quand mon enfant s'entraîne-t-il ?", r: "Tout est sur la page Entraînements : filtrez par équipe, par gymnase ou par jour. Le club utilise sept gymnases nantais, plus le gymnase partenaire de la Similienne." },
  { q: "Où trouver les horaires de match du week-end ?", r: "Sur la page Matchs, mise à jour chaque semaine avec les rendez-vous, les lieux et les convocations d'arbitrage et de table." },
  { q: "Faut-il être bénévole quand on inscrit son enfant ?", r: "Ce n'est pas obligatoire, mais le club vit grâce aux parents : table de marque, transports, bar. Une formation courte est proposée pour la table de marque." },
  { q: "Mon enfant apparaît sur une photo, comment la faire retirer ?", r: "Écrivez-nous : la photo est retirée sur simple demande. Aucune photo de mineur n'est publiée sans autorisation de droit à l'image." },
];

/**
 * Couleurs officielles des lignes Naolib : [fond, texte].
 * transports d'un gymnase : { mode, arret, lignes: ["12", "C2"] } ; parking: false = « Pas de parking ».
 */
export const LIGNES_NAOLIB: Record<string, [string, string]> = {
  "1": ["#007A45", "#FFFFFF"], "2": ["#E53138", "#FFFFFF"], "3": ["#0079BC", "#FFFFFF"], "4": ["#FFCD1C", "#000000"], "5": ["#0BBBEF", "#FFFFFF"], "10": ["#FFED00", "#000000"],
  "11": ["#E8B975", "#000000"], "12": ["#A1DAF8", "#000000"], "23": ["#0BBBEF", "#FFFFFF"], "26": ["#009640", "#FFFFFF"], "27": ["#A1DAF8", "#000000"], "28": ["#A1DAF8", "#000000"],
  "30": ["#FFED00", "#000000"], "33": ["#F5B5D3", "#000000"], "36": ["#65C2C4", "#FFFFFF"], "38": ["#009640", "#FFFFFF"], "40": ["#FFED00", "#000000"], "42": ["#C8D300", "#000000"],
  "47": ["#BCA3CE", "#FFFFFF"], "50": ["#FFED00", "#000000"], "59": ["#F5B5D3", "#000000"], "60": ["#FFED00", "#000000"], "66": ["#2581C4", "#FFFFFF"], "67": ["#2581C4", "#FFFFFF"],
  "69": ["#D39E46", "#FFFFFF"], "71": ["#C8D300", "#000000"], "75": ["#E8B975", "#000000"], "77": ["#A1DAF8", "#000000"], "78": ["#F7A600", "#000000"], "79": ["#F5B5D3", "#000000"],
  "80": ["#FFED00", "#000000"], "81": ["#65C2C4", "#FFFFFF"], "85": ["#F5B5D3", "#000000"], "86": ["#0BBBEF", "#FFFFFF"], "87": ["#F7A600", "#000000"], "88": ["#A877B2", "#FFFFFF"],
  "89": ["#76B82A", "#FFFFFF"], "91": ["#009640", "#FFFFFF"], "95": ["#C8D300", "#000000"], "96": ["#F7A600", "#000000"], "97": ["#BCA3CE", "#FFFFFF"], "98": ["#F7A600", "#000000"],
  "1B": ["#00A754", "#FFFFFF"], "3B": ["#2581C4", "#FFFFFF"], "C1": ["#0BBBEF", "#FFFFFF"], "C2": ["#EE7402", "#FFFFFF"], "C3": ["#F7A600", "#000000"], "C4": ["#76B82A", "#FFFFFF"],
  "C6": ["#A877B2", "#FFFFFF"], "C7": ["#C8D300", "#000000"], "C8": ["#C8D300", "#000000"], "C9": ["#F5B5D3", "#000000"], "C20": ["#FFED00", "#000000"], "E1": ["#E30613", "#FFFFFF"],
  "E4": ["#E30613", "#FFFFFF"], "E5": ["#E30613", "#FFFFFF"], "E8": ["#E30613", "#FFFFFF"], "NA": ["#A1DAF8", "#000000"], "TE1": ["#502391", "#FFFFFF"], "TE2": ["#2581C4", "#FFFFFF"],
  "TE3": ["#2581C4", "#FFFFFF"], "N1": ["#2AAAB6", "#FFFFFF"], "N2": ["#2AAAB6", "#FFFFFF"], "N3": ["#2AAAB6", "#FFFFFF"], "NC": ["#FFFFFF", "#232C77"], "NN": ["#F91AFF", "#FFFFFF"],
  "NO": ["#FFFA3E", "#232C77"], "NS": ["#00FFC2", "#232C77"], "LCE": ["#00A754", "#FFFFFF"], "CNO": ["#2581C4", "#FFFFFF"],
};

/**
 * Gymnases. Le nom doit être écrit exactement comme dans le planning (SLOTS).
 * partenaire: true = gymnase partenaire (affiché à part).
 */
export const GYMNASES: Gymnase[] = [
  { nom: "Joël Paon", role: "La maison du club", adresse: "42 bis rue des Hauts-Pavés\n44000 Nantes", acces: "Bus 12 et 23 : arrêt Bruneau · Chronobus C2 : arrêt Bruneau · Tram 3 : arrêt Poitou · Pas de parking",
    transports: [{ mode: "Bus", arret: "Bruneau", lignes: ["12", "23"] }, { mode: "Chronobus", arret: "Bruneau", lignes: ["C2"] }, { mode: "Tram", arret: "Poitou", lignes: ["3"] }], parking: false },
  { nom: "Breil", role: "Gymnase Breil Malville — matchs et entraînements", adresse: "34 rue du Breil\n44100 Nantes", acces: "Bus 10 : arrêt Stade SNUC · Chronobus C8 : arrêt Suzanne Lenglen · Parking",
    transports: [{ mode: "Bus", arret: "Stade SNUC", lignes: ["10"] }, { mode: "Chronobus", arret: "Suzanne Lenglen", lignes: ["C8"] }], parking: true },
  { nom: "Floreska-Guépin", role: "Jeunes et seniors", adresse: "Impasse de la Nobilière\n44000 Nantes", acces: "Bus 26 : arrêt Harouys · Chronobus C6 et C8 : arrêt Harouys · Tram 3 : arrêt Jean Jaurès · Pas de parking",
    transports: [{ mode: "Bus", arret: "Harouys", lignes: ["26"] }, { mode: "Chronobus", arret: "Harouys", lignes: ["C6", "C8"] }, { mode: "Tram", arret: "Jean Jaurès", lignes: ["3"] }], parking: false },
  { nom: "Dervallières", role: "Seniors et loisirs", adresse: "19 rue Jean-Marc Nattier\n44100 Nantes", acces: "[À COMPLÉTER]" },
  { nom: "Coubertin", role: "Jeunes", adresse: "115 boulevard du Massacre\n44100 Nantes", acces: "Chronobus C20 : arrêt Grand Carcouët · Parking",
    transports: [{ mode: "Chronobus", arret: "Grand Carcouët", lignes: ["C20"] }], parking: true },
  { nom: "Lucien David", role: "Jeunes et seniors", adresse: "4B rue des Renards\n44300 Nantes", acces: "Tram 2 : arrêt Boissière · Bus 96 : arrêt Boissière · Parking",
    transports: [{ mode: "Tram", arret: "Boissière", lignes: ["2"] }, { mode: "Bus", arret: "Boissière", lignes: ["96"] }], parking: true },
  { nom: "Victor Hugo", role: "Jeunes et seniors", adresse: "29 rue Paul Bellamy\n44000 Nantes", acces: "Bus 12 et 23 : arrêt St-Stanislas · Chronobus C2 : arrêt St-Stanislas · Pas de parking",
    transports: [{ mode: "Bus", arret: "St-Stanislas", lignes: ["12", "23"] }, { mode: "Chronobus", arret: "St-Stanislas", lignes: ["C2"] }], parking: false },
  { nom: "Similienne", role: "Gymnase partenaire — groupes CTC", adresse: "26 bis rue des Hauts-Pavés\n44000 Nantes", acces: "Bus 12 et 23 : arrêt Bruneau · Chronobus C2 : arrêt Bruneau · Tram 3 : arrêt Poitou · Parking",
    transports: [{ mode: "Bus", arret: "Bruneau", lignes: ["12", "23"] }, { mode: "Chronobus", arret: "Bruneau", lignes: ["C2"] }, { mode: "Tram", arret: "Poitou", lignes: ["3"] }], parking: true, partenaire: true },
];

/**
 * Partenaires (pied de page et page Partenaires).
 * logo : chemin d'un logo dans public/photos/partenaires/ (ex. "/photos/partenaires/emmatitia.png"), ou "".
 * logoClair : true pour un logo blanc ou clair (posé sur fond bleu nuit) ; sinon, il est posé sur fond crème.
 * site : adresse du site du partenaire (le lien s'ouvre dans un nouvel onglet), facultatif.
 */
export const PARTENAIRES: Partenaire[] = [
  {
    nom: "Atelier photo Emmatitia",
    activite: "Atelier photo",
    ville: "Nantes",
    logo: "/photos/partenaires/emmatitia.png",
    logoClair: true,
    site: "https://emmatitia.fr/",
  },
];
export const OFFRE_PARTENARIAT: OffrePartenariat[] = [
  { nom: "Soutien", montant: "[À COMPLÉTER] €", inclus: ["Logo sur le site du club", "Mention sur les réseaux sociaux"] },
  { nom: "Partenaire", montant: "[À COMPLÉTER] €", inclus: ["Logo sur le site et en pied de page", "Panneau au gymnase Joël Paon", "Invitations aux soirées de match"], vedette: true },
  { nom: "Partenaire majeur", montant: "[À COMPLÉTER] €", inclus: ["Logo sur les maillots", "Visibilité sur tous les supports", "Soirée entreprise au gymnase"] },
];

/**
 * STAGES DES VACANCES (zone B), dans l'ordre du calendrier.
 * Les inscriptions s'ouvrent et se ferment seules d'après les dates : celles d'une semaine ferment la veille
 * de son dernier jour à midi (le jeudi à midi) ; quand toutes les semaines d'une période sont fermées, la période
 * s'affiche « Inscriptions fermées » et la suivante s'ouvre, dès que ses semaines (avec debut) sont saisies.
 * debut : date du lundi (AAAA-MM-JJ) — sert à proposer l'inscription à la journée (lundi → vendredi)
 * et à calculer la fermeture des inscriptions.
 * fin : date du dernier jour, seulement si la semaine ne finit pas le vendredi (ex. Noël, du lundi au jeudi).
 * nesDe / nesA : années de naissance acceptées ; licenciesFFBB : true = réservé aux licenciés FFBB, false = tout public.
 */
export const STAGES: Stage[] = [
  { id: "automne-2026", periode: "Stages d'automne",
    semaines: [
      { id: "aut-s1", nom: "Semaine 1", dates: "Du 19 au 23 octobre", debut: "2026-10-19", nesDe: 2012, nesA: 2019, licenciesFFBB: true },
      { id: "aut-s2", nom: "Semaine 2", dates: "Du 26 au 30 octobre", debut: "2026-10-26", nesDe: 2012, nesA: 2020, licenciesFFBB: false },
    ] },
  { id: "noel-2026", periode: "Stages de Noël",
    semaines: [
      { id: "noel-s1", nom: "Semaine 1", dates: "Du 21 au 24 décembre", debut: "2026-12-21", fin: "2026-12-24", nesDe: 2012, nesA: 2019, licenciesFFBB: true },
      { id: "noel-s2", nom: "Semaine 2", dates: "Du 28 au 31 décembre", debut: "2026-12-28", fin: "2026-12-31", nesDe: 2012, nesA: 2020, licenciesFFBB: false },
    ] },
  { id: "hiver-2027", periode: "Stages d'hiver",
    semaines: [
      { id: "hiver-s1", nom: "Semaine 1", dates: "Du 22 au 26 février", debut: "2027-02-22", nesDe: 2012, nesA: 2019, licenciesFFBB: true },
      { id: "hiver-s2", nom: "Semaine 2", dates: "Du 1er au 5 mars", debut: "2027-03-01", nesDe: 2012, nesA: 2020, licenciesFFBB: false },
    ] },
  { id: "printemps-2027", periode: "Stages de printemps",
    semaines: [
      { id: "printemps-s1", nom: "Semaine 1", dates: "Du 19 au 23 avril", debut: "2027-04-19", nesDe: 2012, nesA: 2019, licenciesFFBB: true },
      { id: "printemps-s2", nom: "Semaine 2", dates: "Du 26 au 30 avril", debut: "2027-04-26", nesDe: 2012, nesA: 2020, licenciesFFBB: false },
    ] },
];
/**
 * Tarifs des stages (affichés tels quels sur la page Stages). La ligne sans « jours » est le tarif à la journée ;
 * chaque ligne avec « jours » est le prix d'une semaine complète de ce nombre de jours (5 : du lundi au vendredi,
 * 4 : Noël, du lundi au jeudi). Une semaine incomplète est facturée à la journée, sans dépasser sa semaine complète.
 */
export const STAGE_TARIFS: TarifStage[] = [
  { formule: "À la journée", licencies: "18 €", carteBlanche: "12 €", nonLicencies: "22 €" },
  { formule: "Semaine (5 jours)", jours: 5, licencies: "80 €", carteBlanche: "50 €", nonLicencies: "100 €" },
  { formule: "Semaine de Noël (4 jours)", jours: 4, licencies: "65 €", carteBlanche: "40 €", nonLicencies: "80 €" },
];
/** Réduction famille sur les stages : taux (%) appliqué dès « enfants » inscrits. */
export const STAGE_REDUCTIONS: ReductionStage[] = [
  { enfants: 2, taux: 15, texte: "à partir de deux enfants inscrits" },
  { enfants: 3, taux: 30, texte: "pour trois enfants inscrits" },
];
export const STAGE_JOURNEE: { heure: string; texte: string }[] = [
  { heure: "9 h 00", texte: "Accueil au gymnase" },
  { heure: "9 h 30", texte: "Ateliers techniques : dribble, tir, passe, jeu à deux" },
  { heure: "12 h 00", texte: "Pique-nique tiré du sac (non fourni)" },
  { heure: "14 h 00", texte: "Tournois, concours de tirs, jeux collectifs" },
  { heure: "17 h 00", texte: "Goûter et départ" },
];
export const STAGE_A_PREVOIR: string[] = ["Chaussures de salle propres et tenue de sport", "Gourde (1 L minimum) et goûter", "Pique-nique pour le midi", "Licence FFBB ou attestation d'assurance (non-licenciés)", "Autorisation parentale signée"];
export const STAGE_CONTACT = { nom: "Hervé Deleaune", telephone: "06 34 37 09 72" };

/**
 * E-mail de confirmation d'inscription au stage, envoyé depuis l'Espace dirigeants (onglet Stages,
 * bouton « Confirmer par e-mail »). Modifiable librement ; les repères
 * entre accolades sont remplacés automatiquement :
 *   {enfant} · {parent} · {semaines} (semaines ou jours choisis, avec leurs dates) · {montant}
 *   {journee} (STAGE_JOURNEE) · {a_prevoir} (STAGE_A_PREVOIR) · {contact} (STAGE_CONTACT et e-mail du club)
 */
export const STAGE_CONFIRMATION = {
  sujet: "Inscription au stage confirmée : {enfant}",
  texte: `Bonjour {parent},

Nous avons bien reçu votre règlement : l'inscription de {enfant} au stage du Nantes Breil Basket est confirmée.

Semaines ou jours retenus :
{semaines}

Montant : {montant}

Le déroulé d'une journée :
{journee}

À prévoir dans le sac :
{a_prevoir}

Une question ? Contactez {contact}.

Sportivement,
Le Nantes Breil Basket`,
};

export const ARBITRAGE_SEANCES: SeanceArbitrage[] = [
  { date: "Sam. 5 sept.", heure: "14h–17h", lieu: "Similienne" },
  { date: "Sam. 17 oct.", heure: "10h–12h", lieu: "Joël Paon" },
  { date: "Sam. 20 févr.", heure: "10h–12h", lieu: "Similienne" },
  { date: "Sam. 17 avril", heure: "10h–12h", lieu: "Joël Paon" },
];

/**
 * Albums de la galerie. couverture : photo de couverture ("" = motif du club).
 * photos : les photos de l'album, ex. { src: "/photos/albums/noel/01.jpg", alt: "Le père Noël au gymnase" }.
 * Mineurs : uniquement avec autorisation de droit à l'image « Oui ».
 */
export const ALBUMS: Album[] = [
  { id: "album-mini", titre: "Samedi matin au mini-basket", couverture: "/photos/mini-basket-seance.jpg", photos: [] },
  { id: "album-stage", titre: "Stage des vacances", couverture: "/photos/club-groupe-jeunes.jpg", photos: [] },
  { id: "album-u15f", titre: "Entraînement jeunes", couverture: "/photos/jeunes-dribble.jpg", photos: [] },
  { id: "album-coach", titre: "Au cœur du groupe", couverture: "/photos/mini-basket-coach.jpg", photos: [] },
  { id: "album-sm1", titre: "Soirée de match SM1", couverture: "", photos: [] },
  { id: "album-noel", titre: "Noël du NBB", couverture: "", photos: [] },
];

/**
 * Photos des équipes (fiches de la page Équipes), par nom d'équipe tel qu'écrit dans le planning.
 * Uniquement avec l'autorisation de droit à l'image de chaque joueur mineur.
 */
export const PHOTOS_EQUIPES: Record<string, string> = {
  "Micro 1": "/photos/equipes/micro-1.webp",
};

/**
 * PLANNING DES ENTRAÎNEMENTS — source unique (pages Entraînements, Équipes, Écoles, Infos).
 * Une ligne = un créneau : [gymnase, jour, début, fin, [équipes], [coachs]].
 */
export const SLOTS: LigneCreneau[] = [
  ["Breil", "Jeudi", "18:30", "19:30", ["U11M2"], ["Romane"]], ["Breil", "Jeudi", "19:30", "20:45", ["U15HPB"], ["Hugo"]],
  ["Breil", "Mardi", "18:30", "20:00", ["U15F1", "U13F1"], ["Clément", "Célia"]], ["Breil", "Mercredi", "17:15", "18:30", ["U11F2"], ["Clément"]],
  ["Coubertin", "Vendredi", "18:00", "19:00", ["U11M1", "U11F1"], ["Hugo", "CC"]], ["Coubertin", "Vendredi", "19:00", "20:00", ["U15M3", "U18M2", "U18M3"], ["Hugo", "CC"]],
  ["Dervallières", "Jeudi", "20:30", "22:00", ["SM2", "SM3"], ["Lionel"]], ["Dervallières", "Mardi", "20:00", "22:00", ["Loisirs"], ["En autonomie"]],
  ["Dervallières", "Mercredi", "20:00", "22:00", ["Loisirs"], ["En autonomie"]],
  ["Floreska-Guépin", "Lundi", "18:15", "19:45", ["U13F2"], ["Romane", "Lucy"]], ["Floreska-Guépin", "Lundi", "19:45", "21:00", ["U15M2", "U13M2"], ["Clément", "Romane"]],
  ["Floreska-Guépin", "Mardi", "18:15", "19:30", ["U18F1", "U18F2"], ["Romane"]], ["Floreska-Guépin", "Mardi", "19:30", "20:45", ["U18HPB"], ["Romane"]],
  ["Floreska-Guépin", "Mardi", "20:45", "22:15", ["SM3"], ["Romane"]], ["Floreska-Guépin", "Mercredi", "17:30", "19:00", ["U11M1"], ["Hugo"]],
  ["Floreska-Guépin", "Mercredi", "19:00", "20:30", ["U15HPB"], ["Hugo"]],
  ["Joël Paon", "Jeudi", "17:30", "19:00", ["U13M3"], ["Hugo"]], ["Joël Paon", "Jeudi", "19:00", "20:30", ["U18M2"], ["Célia"]],
  ["Joël Paon", "Jeudi", "20:30", "22:30", ["SM1"], ["Hugo"]], ["Joël Paon", "Lundi", "17:30", "18:30", ["U11F1", "U9F1"], ["Clément"]],
  ["Joël Paon", "Lundi", "18:30", "19:30", ["U9M1", "U11M2"], ["Clément"]], ["Joël Paon", "Lundi", "21:00", "22:30", ["U18HPB"], ["Romane"]],
  ["Joël Paon", "Mardi", "18:00", "19:30", ["U13M2", "U15M2"], ["Hugo"]], ["Joël Paon", "Mardi", "19:30", "21:00", ["U15HPB"], ["Hugo"]],
  ["Joël Paon", "Mardi", "21:00", "22:30", ["SM1"], ["Hugo"]], ["Joël Paon", "Mercredi", "13:00", "14:15", ["U9M3"], ["Romane", "CC"]],
  ["Joël Paon", "Mercredi", "14:15", "15:30", ["U11M3"], ["Romane", "CC"]], ["Joël Paon", "Mercredi", "15:30", "17:00", ["U13F1"], ["Clément"]],
  ["Joël Paon", "Mercredi", "17:00", "18:15", ["U9M2"], ["Romane"]], ["Joël Paon", "Mercredi", "18:15", "19:30", ["U9M1", "U9F1"], ["Romane", "Célia"]],
  ["Joël Paon", "Mercredi", "19:30", "21:00", ["U15M3"], ["Célia"]], ["Joël Paon", "Mercredi", "21:00", "22:30", ["SM2"], ["Lionel"]],
  ["Joël Paon", "Samedi", "09:00", "10:00", ["U7"], ["Clément", "Romane"]], ["Joël Paon", "Samedi", "10:00", "11:00", ["Micro 1"], ["Clément", "Romane"]],
  ["Joël Paon", "Samedi", "11:00", "12:00", ["Micro 2"], ["Clément", "Romane", "Célia"]],
  ["Joël Paon", "Vendredi", "17:30", "19:00", ["U15F1"], ["Clément", "Célia"]], ["Joël Paon", "Vendredi", "19:00", "20:30", ["U15F2"], ["Clément"]],
  ["Joël Paon", "Vendredi", "20:30", "22:30", ["SF1", "U18F1"], ["Clément"]],
  ["Lucien David", "Mercredi", "19:30", "21:00", ["U18M3"], ["Clément"]], ["Lucien David", "Mercredi", "21:00", "22:30", ["SF1"], ["Clément"]],
  ["Similienne", "Jeudi", "18:30", "19:45", ["U13HPB"], ["Clément (Similienne)"]], ["Similienne", "Mardi", "18:30", "19:45", ["U13HPB"], ["Clément (Similienne)"]],
  ["Victor Hugo", "Jeudi", "20:00", "21:00", ["U18HPB"], ["Romane"]], ["Victor Hugo", "Mardi", "21:00", "22:30", ["SF2"], ["Steeve"]],
  ["Victor Hugo", "Vendredi", "18:00", "19:00", ["U13HPB"], ["Clément (Similienne)"]],
];

export const CATEGORIES: Categorie[] = [
  { cle: "mini", nom: "École de mini-basket", ages: "3 à 10 ans", resume: "Micro-basket, U7, U9 et U11 : l'école labellisée 3 étoiles.", image: "/photos/mini-basket-gymnase-zoom.jpg" },
  { cle: "jeunes", nom: "Jeunes", ages: "11 à 17 ans", resume: "U13, U15 et U18, du championnat départemental à l'accès région (groupes CTC).", image: "/photos/jeunes-dribble.jpg" },
  { cle: "seniors", nom: "Seniors", ages: "18 ans et +", resume: "Deux équipes féminines et trois masculines, dont l'équipe fanion en RM2.", image: "" },
  { cle: "loisirs", nom: "Loisirs", ages: "Adultes", resume: "Basket détente en autonomie, deux soirs par semaine aux Dervallières.", image: "" },
];

/** Années de naissance des groupes de micro-basket. */
export const NAISSANCE: Record<string, string> = { "Micro 1": "2021", "Micro 2": "2022 et 2023" };

/**
 * Catégorie FFBB selon l'année de naissance (saison 2026-2027) : décalez toutes
 * les années d'un an à chaque nouvelle saison.
 */
export const CATEGORIES_AGE: { categorie: string; nesDe: number; nesA: number }[] = [
  { categorie: "Seniors", nesDe: 1900, nesA: 2008 },
  { categorie: "U18", nesDe: 2009, nesA: 2011 },
  { categorie: "U15", nesDe: 2012, nesA: 2013 },
  { categorie: "U13", nesDe: 2014, nesA: 2015 },
  { categorie: "U11", nesDe: 2016, nesA: 2017 },
  { categorie: "U9", nesDe: 2018, nesA: 2019 },
  { categorie: "U7", nesDe: 2020, nesA: 2020 },
  { categorie: "Micro 1", nesDe: 2021, nesA: 2021 },
  { categorie: "Micro 2", nesDe: 2022, nesA: 2023 },
];

/**
 * CLASSEMENTS AUTOMATIQUES — correspondance entre les équipes du site et celles engagées à la FFBB
 * (« catégorie-sexe-numéro » FFBB). Les classements sont récupérés chaque nuit dans
 * data/classements-ffbb.json (voir NOTICE.md) et affichés dans « Voir le classement » (page Équipes).
 * Les équipes CTC (HPB) décalent la numérotation : l'U15HPB est l'équipe 1 du NBB en U15 masculins,
 * l'U15M2 l'équipe 2… Préfixe « SIM- » : équipe CTC engagée par la Similienne (ex. l'U18HPB).
 * À revérifier à chaque nouvelle phase ou saison (adversaires de la poule = adversaires des matchs).
 */
export const EQUIPES_FFBB: Record<string, string> = {
  SM1: "SE-M-1", SM2: "SE-M-2", SM3: "SE-M-3",
  SF1: "SE-F-1", SF2: "SE-F-2",
  U18HPB: "SIM-U18-M-1", U18M2: "U18-M-1", U18M3: "U18-M-2",
  U18F1: "U18-F-1", U18F2: "U18-F-2",
  U15HPB: "U15-M-1", U15M2: "U15-M-2", U15M3: "U15-M-3",
  U15F1: "U15-F-1", U15F2: "U15-F-2",
  U13HPB: "U13-M-1", U13M2: "U13-M-2", U13M3: "U13-M-3",
  U13F1: "U13-F-1", U13F2: "U13-F-2",
  U11M1: "U11-M-1", U11M2: "U11-M-2", U11M3: "U11-M-3",
  U11F1: "U11-F-1", U11F2: "U11-F-2",
};

/**
 * CLASSEMENTS SAISIS À LA MAIN — facultatif : un bloc ici remplace le classement automatique de l'équipe
 * (à recopier depuis competitions.ffbb.com). nbb: true sur la ligne du club.
 * Exemple :
 * SM1: { championnat: "Régionale masculine 2 · Poule B", maj: "28 septembre 2026",
 *   lignes: [ { rang: 1, equipe: "Nantes Breil Basket", j: 3, v: 3, d: 0, pts: 6, nbb: true }, … ] },
 */
export const CLASSEMENTS: Record<string, Classement> = {};
