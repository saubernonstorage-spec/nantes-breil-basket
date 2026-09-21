/**
 * ─────────────────────────────────────────────────────────────
 *  CONTENU DU SITE — NANTES BREIL BASKET
 *  Tout le texte modifiable du site est dans ce seul fichier.
 *  Remplacez les "[À COMPLÉTER]" par vos informations.
 *  Aucune connaissance technique requise : ne changez que le texte
 *  entre guillemets, gardez les virgules et les accolades en place.
 *  Mode d'emploi détaillé : NOTICE.md
 * ─────────────────────────────────────────────────────────────
 */

import type {
  Actu,
  Aide,
  Album,
  Arbitrage,
  Categorie,
  Club,
  Commission,
  Creneau,
  DateAgenda,
  Entraineur,
  EtapeHistoire,
  Gymnase,
  MembreBureau,
  OffrePartenariat,
  Partenaire,
  PhotoPage,
  QuestionFaq,
  Stage,
  Tarif,
  TarifStage,
  Valeur,
} from "@/lib/types";

export const CLUB: Club = {
  nom: "Nantes Breil Basket",
  sigle: "NBB",
  quartier: "Breil / Hauts-Pavés",
  ville: "Nantes",
  baseline: "Le basket de quartier, version grand club.",
  // Adresse du site une fois en ligne (sert au référencement et aux aperçus de partage).
  siteUrl: "https://nantes-breil-basket.fr",
  adresse: "Gymnase Joël Paon — [À COMPLÉTER] adresse complète, 44000 Nantes",
  email: "[À COMPLÉTER] contact@nantes-breil-basket.fr",
  telephone: "[À COMPLÉTER]",
  facebook: "https://www.facebook.com/people/Nantes-Breil-Basket/100063796590330/",
  instagram: "https://www.instagram.com/nantesbreilbasket44/",
  whatsapp: "https://chat.whatsapp.com/J4An3XN8EZXG0BbuQFjzvC",
  boutique: "https://app.grinta.eu/nbb44/adult/official",
  // Lien du formulaire d'inscription en ligne (commence par https://).
  inscription: "[À COMPLÉTER] lien du formulaire d'inscription en ligne",
  ffbb: "https://resultats.ffbb.com/",
  // Widget Score'n'co des matchs de la semaine (page Calendrier).
  scorenco: "https://widgets.scorenco.com/week-events/194332",
  saison: "2026-2027",
  // Délai de réponse annoncé après l'envoi d'un formulaire, ex. "48 h".
  delaiReponse: "[À COMPLÉTER] h",
};

/**
 * Chiffres de l'accueil.
 * Seuls ces deux-là se saisissent à la main : le nombre de gymnases est
 * calculé automatiquement depuis le planning.
 */
export const STATS = {
  adherents: "411",
  equipes: "28", // équipes engagées en championnat
};

/**
 * Grandes photos des pages. Remplacez le texte "PHOTO — …" par le chemin
 * de votre photo déposée dans public/photos/ (ex. "/photos/accueil.jpg").
 * `alt` = description de la photo pour les personnes malvoyantes.
 */
export const PHOTOS: Record<"accueil" | "ecole" | "club" | "stages", PhotoPage> = {
  accueil: {
    photo: "PHOTO PLEIN CADRE — action en match, paysage, 2400×1400 px",
    alt: "Action de match au gymnase Joël Paon",
  },
  ecole: {
    photo: "PHOTO — séance de mini-basket, paysage, 1600×1200 px",
    alt: "Séance de mini-basket au Nantes Breil Basket",
  },
  club: {
    photo: "PHOTO — vie de club (bar, tournoi, remise de récompenses), 1400×1100 px",
    alt: "Vie du club au Nantes Breil Basket",
  },
  stages: {
    photo: "PHOTO — stage des vacances, paysage, 1600×1100 px",
    alt: "Stage des vacances au gymnase Joël Paon",
  },
};

/** Grands axes affichés sur la page « Le club ». */
export const VALEURS: Valeur[] = [
  { titre: "Accueillir tout le monde", texte: "Du micro-basket dès 3 ans aux loisirs adultes, filles et garçons, débutants ou confirmés : chacun trouve son niveau et son créneau." },
  { titre: "Former avant tout", texte: "Une école de basket labellisée 3 étoiles par la FFBB et des entraîneurs identifiés sur chaque créneau." },
  { titre: "Faire vivre le quartier", texte: "[À COMPLÉTER] — actions menées avec les écoles, la maison de quartier et les partenaires du Breil et des Hauts-Pavés." },
  { titre: "Compter sur les bénévoles", texte: "Table de marque, arbitrage, transports, bar : le club tourne grâce aux parents et aux joueurs volontaires." },
];

export const HISTOIRE: EtapeHistoire[] = [
  { annee: "[À COMPLÉTER]", texte: "Création du club dans le quartier du Breil. [À COMPLÉTER] : quelques lignes sur les débuts, les fondateurs et le premier gymnase." },
  { annee: "[À COMPLÉTER]", texte: "[À COMPLÉTER] — étape marquante : montée d'une équipe, ouverture de l'école de basket, fusion ou changement de nom." },
  { annee: "[À COMPLÉTER]", texte: "Obtention du label École de Mini-Basket 3 étoiles de la FFBB." },
  { annee: CLUB.saison, texte: "411 adhérents, 28 équipes engagées et 8 gymnases utilisés chaque semaine." },
];

/** Projet associatif et labels (page « Le club »). */
export const PROJET = {
  texte: "[À COMPLÉTER] — résumez ici les grands axes votés par le bureau : formation des jeunes, féminisation, arbitrage, santé et citoyenneté, ouverture au quartier. Trois à cinq phrases suffisent ; un document PDF complet peut être joint.",
  labelCitoyen: "[À COMPLÉTER] : niveau obtenu et actions valorisées.",
};

/** Bureau : les intitulés sont prêts, ajoutez les prénoms/noms. */
export const BUREAU: MembreBureau[] = [
  { role: "Président·e", nom: "[À COMPLÉTER]", photo: "PORTRAIT" },
  { role: "Vice-président·e", nom: "[À COMPLÉTER]", photo: "PORTRAIT" },
  { role: "Trésorier·ère", nom: "[À COMPLÉTER]", photo: "PORTRAIT" },
  { role: "Secrétaire", nom: "[À COMPLÉTER]", photo: "PORTRAIT" },
  { role: "Responsable école de basket", nom: "[À COMPLÉTER]", photo: "PORTRAIT" },
  { role: "Responsable arbitrage", nom: "[À COMPLÉTER]", photo: "PORTRAIT" },
];

/**
 * Entraîneurs présentés sur la page « Le club ».
 * `depuis` = année d'arrivée au club. `presentation` = une phrase, deux maxi.
 */
export const ENCADREMENT: Entraineur[] = [
  {
    prenom: "Clément",
    role: "Entraîneur",
    depuis: "[À COMPLÉTER]",
    presentation:
      "Du mini-basket aux seniors : il encadre les U9, U11, U13, U15 et l'équipe SF1. [À COMPLÉTER] — diplôme et rôle exact dans le club.",
    photo: "PORTRAIT",
  },
  {
    prenom: "Romane",
    role: "Entraîneure",
    depuis: "[À COMPLÉTER]",
    presentation:
      "Elle accueille les plus jeunes au micro-basket le samedi matin et suit les U9, U13, U18 et SM3. [À COMPLÉTER] — diplôme et rôle exact.",
    photo: "PORTRAIT",
  },
  {
    prenom: "Hugo",
    role: "Entraîneur",
    depuis: "[À COMPLÉTER]",
    presentation:
      "Des U11 aux seniors masculins SM1, avec les groupes du groupement HPB. [À COMPLÉTER] — diplôme et rôle exact.",
    photo: "PORTRAIT",
  },
  {
    prenom: "Célia",
    role: "Entraîneure",
    depuis: "[À COMPLÉTER]",
    presentation:
      "Elle encadre les U9, U15 et U18 et épaule les séances du samedi matin. [À COMPLÉTER] — diplôme et rôle exact.",
    photo: "PORTRAIT",
  },
];

/**
 * Commissions : les groupes de bénévoles qui font tourner le club.
 * `nom` = intitulé de la commission, `role` = sa mission en une phrase.
 * Ajoutez `referent: "Prénom Nom"` si vous voulez afficher un nom de contact.
 */
export const COMMISSIONS: Commission[] = [
  { nom: "Évènements", role: "Organise les temps forts du club : fête de fin de saison, soirées, animations au gymnase." },
  { nom: "Communication", role: "Site internet, réseaux sociaux, affiches et relations avec la presse locale." },
  { nom: "Matériel", role: "Ballons, maillots, chasubles et équipements : suivi des stocks et des commandes." },
  { nom: "Secrétariat", role: "Licences, dossiers d'inscription, courriers et lien avec le comité et la ligue." },
  { nom: "Sponsoring", role: "Recherche et suivi des partenaires et des contreparties." },
  { nom: "Trésorerie", role: "Budget, cotisations, subventions et suivi des comptes du club." },
  { nom: "Ressources humaines", role: "Salariés et bénévoles : recrutement, plannings et accompagnement." },
  { nom: "Technique", role: "Projet sportif, constitution des groupes et suivi des entraîneurs." },
  { nom: "Tournois", role: "Préparation et organisation des tournois et plateaux accueillis par le club." },
  { nom: "Arbitrage", role: "Formation et accompagnement des arbitres et des officiels de table." },
  { nom: "Parents", role: "Relais entre les familles et le club : accompagnements, déplacements, coups de main." },
];

/**
 * Actualités : la plus récente en haut (les trois premières s'affichent sur l'accueil).
 * Pour en ajouter une, copiez un bloc complet (de { à },) et collez-le en haut.
 * `lien` : une page du site ("/planning", "/stages"…) ou une adresse web complète.
 */
export const ACTUS: Actu[] = [
  {
    titre: "Planning des entraînements 2026-2027",
    tag: "Saison " + CLUB.saison,
    date: "[À COMPLÉTER]",
    chapo: "Tous les créneaux par équipe et par gymnase, filtrables en un clic sur la page Planning.",
    photo: "PHOTO — 1200×750 px",
    lien: "/planning",
  },
  {
    titre: "Ouverture de la boutique du club",
    tag: "Boutique",
    date: "[À COMPLÉTER]",
    chapo: "Maillots, sweats et accessoires aux couleurs du NBB, à commander en ligne.",
    photo: "PHOTO — 1200×750 px",
    lien: CLUB.boutique,
  },
  {
    titre: "En route vers la saison " + CLUB.saison + " !",
    tag: "Vie du club",
    date: "[À COMPLÉTER]",
    chapo: "Reprise des entraînements, équipes engagées et nouveautés de l'année.",
    photo: "PHOTO — 1200×750 px",
    lien: "/planning",
  },
  {
    titre: "[À COMPLÉTER] — titre de votre prochain article",
    tag: "[À COMPLÉTER]",
    date: "[À COMPLÉTER]",
    chapo: "[À COMPLÉTER] — deux ou trois phrases de résumé.",
    photo: "PHOTO — 1200×750 px",
    lien: "/",
  },
];

/**
 * Agenda du club : les dates importantes à venir, affichées sur l'accueil.
 * La première de la liste est la plus proche. Pour en retirer une, supprimez
 * son bloc ; pour en ajouter une, copiez un bloc et changez les trois champs.
 */
export const AGENDA: DateAgenda[] = [
  { date: "[À COMPLÉTER]", titre: "Reprise des entraînements", lieu: "Tous les gymnases" },
  { date: "[À COMPLÉTER]", titre: "Stage des vacances de la Toussaint", lieu: "Gymnase Joël Paon" },
  { date: "[À COMPLÉTER]", titre: "Assemblée générale du club", lieu: "[À COMPLÉTER]" },
  { date: "[À COMPLÉTER]", titre: "Journée du mini-basket", lieu: "[À COMPLÉTER]" },
];

/** École d'arbitrage (section de l'accueil). Les séances changent chaque saison. */
export const ARBITRAGE: Arbitrage = {
  intro:
    "Siffler, c'est encore jouer. L'école d'arbitrage fait découvrir les règles à tous les licenciés, élève le niveau des arbitrages du club et accompagne les plus motivés jusqu'au statut d'officiel.",
  objectifs: [
    "Promouvoir l'arbitrage en interne et faire découvrir cette facette du jeu",
    "Découvrir les aspects réglementaires du basket",
    "Améliorer le niveau de l'arbitrage au club",
    "Amener les plus motivés à devenir officiels",
  ],
  formation: [
    "Tous les U15 et U18 ont un entraînement consacré à l'arbitrage avant chaque période de vacances.",
    "Une formation complémentaire est menée avec le club de la Similienne, 4 samedis dans l'année, pour celles et ceux qui veulent approfondir.",
  ],
  seancesTitre: "Séances 2026/2027",
  seancesIntro:
    "Ouvertes des U13 aux séniors, animées par les arbitres officiels et les entraîneurs. Le parcours complet est recommandé.",
  seances: [
    { date: "Sam. 05/09 · 14h-17h", lieu: "La Similienne" },
    { date: "Sam. 17/10 · 10h-12h", lieu: "Joël Paon" },
    { date: "Sam. 20/02 · 10h-12h", lieu: "La Similienne" },
    { date: "Sam. 17/04 · 10h-12h", lieu: "Joël Paon" },
  ],
  contact: {
    nom: "Clément Meunier",
    email: "clement.meunier@nbb44.fr",
    telephone: "06 04 45 11 65",
  },
  memo: "https://nantes-breil-basket.fr/public/5071/upload/files/arbitrage/memo-de-l-arbitrage-2.pdf",
};

/** Étapes d'inscription (page Inscriptions). */
export const ETAPES_INSCRIPTION: string[] = [
  "Viens essayer : deux séances découverte sur le créneau de ta catégorie.",
  "Remplissez le formulaire d'inscription en ligne — lien : [À COMPLÉTER].",
  "Fournissez les documents : justificatif de santé, photo, droit à l'image.",
  "Réglez la cotisation — montants par catégorie dans le tableau ci-dessous.",
];

/** Tarifs : n'inventez rien, complétez avec les montants votés par le bureau. */
export const TARIFS: Tarif[] = [
  { categorie: "Micro-basket (2021-2023)", age: "3 à 5 ans", prix: "[À COMPLÉTER] €" },
  { categorie: "U7 / U9", age: "6 à 8 ans", prix: "[À COMPLÉTER] €" },
  { categorie: "U11 / U13", age: "9 à 12 ans", prix: "[À COMPLÉTER] €" },
  { categorie: "U15 / U18", age: "13 à 17 ans", prix: "[À COMPLÉTER] €" },
  { categorie: "Seniors", age: "18 ans et +", prix: "[À COMPLÉTER] €" },
  { categorie: "Loisirs", age: "18 ans et +", prix: "[À COMPLÉTER] €" },
];

export const DOCUMENTS: string[] = [
  "Formulaire d'inscription complété et signé",
  "Certificat médical ou questionnaire de santé, selon l'âge et la situation",
  "Une photo d'identité récente",
  "Autorisation de droit à l'image (obligatoire pour les mineurs)",
  "Règlement de la cotisation — moyens acceptés : [À COMPLÉTER]",
];

export const AIDES: Aide[] = [
  { titre: "Pass'Sport", texte: "[À COMPLÉTER] — préciser si le club accepte le Pass'Sport et le montant déduit." },
  { titre: "Aides de la Ville / du CCAS", texte: "[À COMPLÉTER] — dispositifs nantais acceptés par le club." },
  { titre: "Coupons sport / comité d'entreprise", texte: "[À COMPLÉTER]" },
];

/** Questions fréquentes (pages Inscriptions et Infos pratiques). */
export const FAQ: QuestionFaq[] = [
  { q: "À partir de quel âge mon enfant peut-il commencer ?", r: "Dès 3 ans au micro-basket, le samedi matin au gymnase Joël Paon. Les groupes sont constitués par année de naissance : Micro 1 (2021) et Micro 2 (2022-2023)." },
  { q: "Peut-on essayer avant de s'inscrire ?", r: "Oui. Deux séances d'essai sont possibles sur le créneau de la catégorie concernée. Prévenez l'entraîneur ou écrivez-nous avant de venir." },
  { q: "Combien coûte la licence ?", r: "Les montants varient selon la catégorie — voir le tableau des tarifs sur la page Inscriptions. [À COMPLÉTER] : préciser ce que comprend la cotisation (licence FFBB, assurance, équipement)." },
  { q: "Quels documents faut-il fournir ?", r: "Formulaire d'inscription, justificatif de santé, photo, autorisation de droit à l'image pour les mineurs, et le règlement de la cotisation." },
  { q: "Où et quand mon enfant s'entraîne-t-il ?", r: "Tout est sur la page Planning : filtrez par équipe, par gymnase ou par jour. Le club utilise 8 gymnases nantais, les créneaux changent selon la catégorie." },
  { q: "Comment sont organisés les déplacements du week-end ?", r: "[À COMPLÉTER] — préciser l'organisation du covoiturage, les horaires de rendez-vous et le rôle des parents accompagnateurs." },
  { q: "Faut-il être bénévole quand on inscrit son enfant ?", r: "Ce n'est pas obligatoire, mais le club vit grâce aux parents : table de marque, arbitrage, transports, bar. Une formation courte est proposée pour la table de marque." },
  { q: "Où acheter les maillots et les tenues du club ?", r: "Sur la boutique en ligne officielle du NBB, accessible depuis l'accueil et le bas de chaque page." },
  { q: "Mon enfant apparaît sur une photo, comment la faire retirer ?", r: "Écrivez-nous : toute photo est retirée du site sur simple demande. Aucune photo de mineur n'est publiée sans autorisation de droit à l'image signée." },
];

/**
 * Gymnases : le nom doit être écrit exactement comme dans le planning (SLOTS).
 * `lat` / `lon` (facultatifs) : coordonnées GPS pour épingler le gymnase sur la carte
 * (clic droit sur openstreetmap.org → « Afficher l'adresse »).
 */
export const GYMNASES: Gymnase[] = [
  { nom: "Joël Paon", role: "Gymnase principal du club", adresse: "42 rue des Hauts Pavés, 44000 Nantes", acces: "Bus lignes 3, 12, 23 et C2", lat: 47.22448, lon: -1.56495 },
  { nom: "Floreska-Guépin", role: "Jeunes et seniors", adresse: "[À COMPLÉTER]", acces: "[À COMPLÉTER]" },
  { nom: "Breil", role: "Jeunes", adresse: "[À COMPLÉTER]", acces: "[À COMPLÉTER]" },
  { nom: "Dervallières", role: "Seniors et loisirs", adresse: "[À COMPLÉTER]", acces: "[À COMPLÉTER]" },
  { nom: "Coubertin", role: "Jeunes", adresse: "[À COMPLÉTER]", acces: "[À COMPLÉTER]" },
  { nom: "Lucien David", role: "Jeunes et seniors", adresse: "[À COMPLÉTER]", acces: "[À COMPLÉTER]" },
  { nom: "Victor Hugo", role: "Jeunes et seniors", adresse: "[À COMPLÉTER]", acces: "[À COMPLÉTER]" },
  { nom: "Similienne", role: "Groupement HPB", adresse: "[À COMPLÉTER]", acces: "[À COMPLÉTER]" },
];

/** Encadrés de la page Infos pratiques. */
export const INFOS_PRATIQUES = {
  regles: "Chaussures de salle propres obligatoires, gourde personnelle, pas de chewing-gum. [À COMPLÉTER] — ajouter les consignes propres à chaque salle (vestiaires, tribunes, accès parents).",
  objetsTrouves: "Une caisse est à la table de marque du gymnase Joël Paon. [À COMPLÉTER] — préciser la personne à contacter.",
};

/** Texte affiché sous les fiches équipes, à propos du groupement HPB. */
export const NOTE_HPB =
  "Les équipes HPB (U13HPB, U15HPB, U18HPB) sont issues d'un groupement — [À COMPLÉTER] : préciser les clubs partenaires et le championnat concerné.";

/**
 * Partenaires. `logo` : chemin du logo déposé dans public/photos/partenaires/
 * (PNG à fond transparent), `site` : adresse de leur site (facultatif).
 */
export const PARTENAIRES: Partenaire[] = [
  { nom: "AR'PAYSAGE", activite: "Aménagement paysager — Le Temple-de-Bretagne", logo: "LOGO — PNG fond transparent", site: "" },
  { nom: "MOODERS", activite: "Enregistrement sonore et édition musicale — Nantes", logo: "LOGO — PNG fond transparent", site: "" },
  { nom: "EMMATITIA", activite: "Atelier photo — Nantes", logo: "LOGO — PNG fond transparent", site: "" },
  { nom: "Perspectives Renov' Habitat", activite: "Menuiserie bois et PVC — Port-Saint-Père", logo: "LOGO — PNG fond transparent", site: "" },
];

export const OFFRE_PARTENARIAT: OffrePartenariat[] = [
  { nom: "Soutien", montant: "[À COMPLÉTER] €", inclus: ["Logo sur le site du club", "Mention sur les réseaux sociaux", "[À COMPLÉTER]"] },
  { nom: "Partenaire", montant: "[À COMPLÉTER] €", inclus: ["Logo sur le site et en bas de page", "Panneau au gymnase Joël Paon", "Invitations aux événements du club", "[À COMPLÉTER]"] },
  { nom: "Partenaire majeur", montant: "[À COMPLÉTER] €", inclus: ["Logo sur les maillots", "Visibilité sur tous les supports du club", "Soirée entreprise au gymnase", "[À COMPLÉTER]"] },
];

export const NOTE_PARTENARIAT =
  "Le club est une association loi 1901 : votre soutien peut ouvrir droit à une réduction d'impôt. [À COMPLÉTER] — préciser le régime applicable avec votre comptable.";

/**
 * ─────────────────────────────────────────────────────────────
 *  STAGES DES VACANCES SCOLAIRES (académie de Nantes, zone B)
 *  Un bloc par période. Le premier de la liste s'affiche en haut.
 *  `statut` : "Inscriptions ouvertes" affiche les boutons d'inscription ;
 *  tout autre texte ("Complet", "Programme à venir"…) les masque.
 *  Seules les périodes « Inscriptions ouvertes » apparaissent dans le
 *  formulaire d'inscription.
 * ─────────────────────────────────────────────────────────────
 */
export const STAGES: Stage[] = [
  {
    periode: "Stages d'automne 2026",
    public: "U9 à U13 (garçons et filles)",
    lieu: "Gymnase Joël Paon",
    statut: "Inscriptions ouvertes",
    contenu: "Technique individuelle le matin, tournois et jeux l'après-midi.",
    // Une entrée par semaine de stage. Ajoutez-en autant que nécessaire.
    semaines: [
      { nom: "Semaine 1", dates: "Du 19 au 23 octobre", places: "[À COMPLÉTER] places" },
      { nom: "Semaine 2", dates: "Du 26 au 30 octobre", places: "[À COMPLÉTER] places" },
    ],
  },
  {
    periode: "Vacances de Noël",
    public: "[À COMPLÉTER]",
    lieu: "[À COMPLÉTER]",
    statut: "Programme à venir",
    contenu: "[À COMPLÉTER] — contenu du stage.",
    semaines: [{ nom: "Semaine 1", dates: "[À COMPLÉTER]", places: "[À COMPLÉTER] places" }],
  },
  {
    periode: "Vacances d'hiver",
    public: "[À COMPLÉTER]",
    lieu: "[À COMPLÉTER]",
    statut: "Programme à venir",
    contenu: "[À COMPLÉTER] — contenu du stage.",
    semaines: [{ nom: "Semaine 1", dates: "[À COMPLÉTER]", places: "[À COMPLÉTER] places" }],
  },
  {
    periode: "Vacances de printemps",
    public: "[À COMPLÉTER]",
    lieu: "[À COMPLÉTER]",
    statut: "Programme à venir",
    contenu: "[À COMPLÉTER] — contenu du stage.",
    semaines: [{ nom: "Semaine 1", dates: "[À COMPLÉTER]", places: "[À COMPLÉTER] places" }],
  },
  {
    periode: "Stage d'été",
    public: "[À COMPLÉTER]",
    lieu: "[À COMPLÉTER]",
    statut: "Programme à venir",
    contenu: "[À COMPLÉTER] — contenu du stage.",
    semaines: [{ nom: "Semaine 1", dates: "[À COMPLÉTER]", places: "[À COMPLÉTER] places" }],
  },
];

/** Journée type et affaires à prévoir, affichées sur la page Stages. */
export const STAGE_JOURNEE: { heure: string; texte: string }[] = [
  { heure: "9 h 00", texte: "Accueil au gymnase par les encadrants." },
  { heure: "9 h 30 – 12 h 00", texte: "Ateliers techniques : dribble, tir, passe, jeu à deux." },
  { heure: "12 h 00 – 14 h 00", texte: "Pause déjeuner — repas tiré du sac (pique-nique), non fourni par le club." },
  { heure: "14 h 00 – 16 h 30", texte: "Tournois, concours de tirs et jeux collectifs." },
  { heure: "17 h 00", texte: "Goûter, fermeture du gymnase et départ." },
];

/**
 * Tarifs des stages. Une ligne par formule, une colonne par statut.
 * « Carte blanche » = dispositif de la Ville de Nantes.
 */
export const STAGE_TARIFS: TarifStage[] = [
  { formule: "À la journée", licencies: "18 €", carteBlanche: "12 €", nonLicencies: "22 €" },
  { formule: "Forfait semaine (5 jours)", licencies: "80 €", carteBlanche: "50 €", nonLicencies: "100 €" },
];

export const STAGE_INFOS = {
  tarifsNote: "Tarifs des stages d'automne 2026. « Carte blanche » : dispositif de la Ville de Nantes, sur présentation du justificatif.",
  paiement: "[À COMPLÉTER]", // moyens de paiement acceptés
  annulation: "[À COMPLÉTER] — conditions de remboursement en cas d'absence ou d'annulation du stage par le club.",
};

export const STAGE_A_PREVOIR: string[] = [
  "Chaussures de salle propres et tenue de sport",
  "Gourde d'eau (1 L minimum) et goûter",
  "Repas du midi tiré du sac (pique-nique)",
  "Licence FFBB à jour ou attestation d'assurance pour les non-licenciés",
  "Autorisation parentale signée, fournie à l'inscription",
];

/**
 * Albums de la galerie. `photo` : photo de couverture ;
 * `lien` : adresse de l'album complet (Google Photos, Facebook…), facultatif.
 */
export const ALBUMS: Album[] = [
  { titre: "Journée du mini-basket", meta: "[À COMPLÉTER] photos · [À COMPLÉTER] date", photo: "PHOTO DE COUVERTURE", lien: "" },
  { titre: "Match SM1 à domicile", meta: "[À COMPLÉTER] photos · [À COMPLÉTER] date", photo: "PHOTO DE COUVERTURE", lien: "" },
  { titre: "Tournoi de fin de saison", meta: "[À COMPLÉTER] photos · [À COMPLÉTER] date", photo: "PHOTO DE COUVERTURE", lien: "" },
  { titre: "Stage des vacances", meta: "[À COMPLÉTER] photos · [À COMPLÉTER] date", photo: "PHOTO DE COUVERTURE", lien: "" },
  { titre: "Soirée des bénévoles", meta: "[À COMPLÉTER] photos · [À COMPLÉTER] date", photo: "PHOTO DE COUVERTURE", lien: "" },
  { titre: "[À COMPLÉTER] nouvel album", meta: "[À COMPLÉTER]", photo: "PHOTO DE COUVERTURE", lien: "" },
];

/** Mentions légales (page « Mentions légales & confidentialité »). */
export const MENTIONS = {
  siege: "Gymnase Joël Paon, [À COMPLÉTER] 44000 Nantes",
  rna: "[À COMPLÉTER]",
  siret: "[À COMPLÉTER]",
  responsablePublication: "[À COMPLÉTER]",
  contact: "[À COMPLÉTER]",
  hebergeur: "[À COMPLÉTER] — nom, adresse et téléphone de l'hébergeur (par exemple Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis, si le site est déployé sur Vercel).",
  conservationMois: "[À COMPLÉTER]",
};

/**
 * Catégories de la page Équipes. Une équipe est rangée automatiquement
 * selon son nom : Micro…/U7/U9…/U11… en mini-basket, U13…/U15…/U18… en jeunes,
 * SF…/SM… en seniors, le reste en loisirs.
 */
export const CATEGORIES: Categorie[] = [
  { cle: "mini", nom: "Mini-basket", ages: "3 à 10 ans", resume: "Micro-basket, U7, U9 et U11 — l'école de basket labellisée 3 étoiles.", photo: "PHOTO — groupe mini-basket" },
  { cle: "jeunes", nom: "Jeunes", ages: "11 à 17 ans", resume: "U13, U15 et U18, en championnat départemental et régional.", photo: "PHOTO — équipe jeunes" },
  { cle: "seniors", nom: "Seniors", ages: "18 ans et +", resume: "Deux équipes féminines et trois masculines engagées en championnat.", photo: "PHOTO — équipe senior" },
  { cle: "loisirs", nom: "Loisirs", ages: "18 ans et +", resume: "Basket détente en autonomie, deux soirs par semaine aux Dervallières.", photo: "PHOTO — section loisirs" },
];

/**
 * Photos d'équipe (page Équipes), par nom d'équipe tel qu'écrit dans le planning.
 * Exemple : "U11F1": "/photos/equipes/u11f1.jpg",
 */
export const PHOTOS_EQUIPES: Record<string, string> = {};

/**
 * ─────────────────────────────────────────────────────────────
 *  PLANNING DES ENTRAÎNEMENTS — source unique du site.
 *  Les pages Planning, Équipes, la liste des gymnases et les
 *  chiffres de l'accueil sont calculés à partir de ce tableau.
 * ─────────────────────────────────────────────────────────────
 */
export const SLOTS: Creneau[] = [
  { id: "Bre_JE_1830", gymnase: "Breil", jour: "Jeudi", debut: "18:30", fin: "19:30", duree: "1 h", equipes: ["U11M2"], coachs: ["Romane"] },
  { id: "Bre_JE_1930", gymnase: "Breil", jour: "Jeudi", debut: "19:30", fin: "20:45", duree: "1 h 15", equipes: ["U15HPB"], coachs: ["Hugo"] },
  { id: "Bre_MA_1830", gymnase: "Breil", jour: "Mardi", debut: "18:30", fin: "20:00", duree: "1 h 30", equipes: ["U15F1", "U13F1"], coachs: ["Clément", "Célia"] },
  { id: "Bre_ME_1715", gymnase: "Breil", jour: "Mercredi", debut: "17:15", fin: "18:30", duree: "1 h 15", equipes: ["U11F2"], coachs: ["Clément"] },
  { id: "Cou_VE_1800", gymnase: "Coubertin", jour: "Vendredi", debut: "18:00", fin: "19:00", duree: "1 h", equipes: ["U11M1", "U11F1"], coachs: ["Hugo", "CC"] },
  { id: "Cou_VE_1900", gymnase: "Coubertin", jour: "Vendredi", debut: "19:00", fin: "20:00", duree: "1 h", equipes: ["U15M3", "U18M2", "U18M3"], coachs: ["Hugo", "CC"] },
  { id: "Der_JE_2030", gymnase: "Dervallières", jour: "Jeudi", debut: "20:30", fin: "22:00", duree: "1 h 30", equipes: ["SM2", "SM3"], coachs: ["Lionel"] },
  { id: "Der_MA_2000", gymnase: "Dervallières", jour: "Mardi", debut: "20:00", fin: "22:00", duree: "2 h", equipes: ["Loisirs"], coachs: ["Autonomie"] },
  { id: "Der_ME_2000", gymnase: "Dervallières", jour: "Mercredi", debut: "20:00", fin: "22:00", duree: "2 h", equipes: ["Loisirs"], coachs: ["Autonomie"] },
  { id: "Flo_LU_1815", gymnase: "Floreska-Guépin", jour: "Lundi", debut: "18:15", fin: "19:45", duree: "1 h 30", equipes: ["U13F2"], coachs: ["Romane", "Lucy"] },
  { id: "Flo_LU_1945", gymnase: "Floreska-Guépin", jour: "Lundi", debut: "19:45", fin: "21:00", duree: "1 h 15", equipes: ["U15M2", "U13M2"], coachs: ["Clément", "Romane"] },
  { id: "Flo_MA_1815", gymnase: "Floreska-Guépin", jour: "Mardi", debut: "18:15", fin: "19:30", duree: "1 h 15", equipes: ["U18F1", "U18F2"], coachs: ["Romane"] },
  { id: "Flo_MA_1930", gymnase: "Floreska-Guépin", jour: "Mardi", debut: "19:30", fin: "20:45", duree: "1 h 15", equipes: ["U18HPB"], coachs: ["Romane"] },
  { id: "Flo_MA_2045", gymnase: "Floreska-Guépin", jour: "Mardi", debut: "20:45", fin: "22:15", duree: "1 h 30", equipes: ["SM3"], coachs: ["Romane"] },
  { id: "Flo_ME_1730", gymnase: "Floreska-Guépin", jour: "Mercredi", debut: "17:30", fin: "19:00", duree: "1 h 30", equipes: ["U11M1"], coachs: ["Hugo"] },
  { id: "Flo_ME_1900", gymnase: "Floreska-Guépin", jour: "Mercredi", debut: "19:00", fin: "20:30", duree: "1 h 30", equipes: ["U15HPB"], coachs: ["Hugo"] },
  { id: "Joe_JE_1730", gymnase: "Joël Paon", jour: "Jeudi", debut: "17:30", fin: "19:00", duree: "1 h 30", equipes: ["U13M3"], coachs: ["Hugo"] },
  { id: "Joe_JE_1900", gymnase: "Joël Paon", jour: "Jeudi", debut: "19:00", fin: "20:30", duree: "1 h 30", equipes: ["U18M2"], coachs: ["Célia"] },
  { id: "Joe_JE_2030", gymnase: "Joël Paon", jour: "Jeudi", debut: "20:30", fin: "22:30", duree: "2 h", equipes: ["SM1"], coachs: ["Hugo"] },
  { id: "Joe_LU_1730", gymnase: "Joël Paon", jour: "Lundi", debut: "17:30", fin: "18:30", duree: "1 h", equipes: ["U11F1", "U9F1"], coachs: ["Clément"] },
  { id: "Joe_LU_1830", gymnase: "Joël Paon", jour: "Lundi", debut: "18:30", fin: "19:30", duree: "1 h", equipes: ["U9M1", "U11M2"], coachs: ["Clément"] },
  { id: "Joe_LU_2100", gymnase: "Joël Paon", jour: "Lundi", debut: "21:00", fin: "22:30", duree: "1 h 30", equipes: ["U18HPB"], coachs: ["Romane"] },
  { id: "Joe_MA_1800", gymnase: "Joël Paon", jour: "Mardi", debut: "18:00", fin: "19:30", duree: "1 h 30", equipes: ["U13M2", "U15M2"], coachs: ["Hugo"] },
  { id: "Joe_MA_1930", gymnase: "Joël Paon", jour: "Mardi", debut: "19:30", fin: "21:00", duree: "1 h 30", equipes: ["U15HPB"], coachs: ["Hugo"] },
  { id: "Joe_MA_2100", gymnase: "Joël Paon", jour: "Mardi", debut: "21:00", fin: "22:30", duree: "1 h 30", equipes: ["SM1"], coachs: ["Hugo"] },
  { id: "Joe_ME_1300", gymnase: "Joël Paon", jour: "Mercredi", debut: "13:00", fin: "14:15", duree: "1 h 15", equipes: ["U9M3"], coachs: ["Romane", "CC"] },
  { id: "Joe_ME_1415", gymnase: "Joël Paon", jour: "Mercredi", debut: "14:15", fin: "15:30", duree: "1 h 15", equipes: ["U11M3"], coachs: ["Romane", "CC"] },
  { id: "Joe_ME_1530", gymnase: "Joël Paon", jour: "Mercredi", debut: "15:30", fin: "17:00", duree: "1 h 30", equipes: ["U13F1"], coachs: ["Clément"] },
  { id: "Joe_ME_1700", gymnase: "Joël Paon", jour: "Mercredi", debut: "17:00", fin: "18:15", duree: "1 h 15", equipes: ["U9M2"], coachs: ["Romane"] },
  { id: "Joe_ME_1815", gymnase: "Joël Paon", jour: "Mercredi", debut: "18:15", fin: "19:30", duree: "1 h 15", equipes: ["U9M1", "U9F1"], coachs: ["Romane", "Célia"] },
  { id: "Joe_ME_1930", gymnase: "Joël Paon", jour: "Mercredi", debut: "19:30", fin: "21:00", duree: "1 h 30", equipes: ["U15M3"], coachs: ["Célia"] },
  { id: "Joe_ME_2100", gymnase: "Joël Paon", jour: "Mercredi", debut: "21:00", fin: "22:30", duree: "1 h 30", equipes: ["SM2"], coachs: ["Lionel"] },
  { id: "Joe_SA_0900", gymnase: "Joël Paon", jour: "Samedi", debut: "09:00", fin: "10:00", duree: "1 h", equipes: ["U7"], coachs: ["Clément", "Romane"] },
  { id: "Joe_SA_1000", gymnase: "Joël Paon", jour: "Samedi", debut: "10:00", fin: "11:00", duree: "1 h", equipes: ["Micro 1 (2021)"], coachs: ["Clément", "Romane"] },
  { id: "Joe_SA_1100", gymnase: "Joël Paon", jour: "Samedi", debut: "11:00", fin: "12:00", duree: "1 h", equipes: ["Micro 2 (2022-23)"], coachs: ["Clément", "Romane", "Célia"] },
  { id: "Joe_VE_1730", gymnase: "Joël Paon", jour: "Vendredi", debut: "17:30", fin: "19:00", duree: "1 h 30", equipes: ["U15F1"], coachs: ["Clément", "Célia"] },
  { id: "Joe_VE_1900", gymnase: "Joël Paon", jour: "Vendredi", debut: "19:00", fin: "20:30", duree: "1 h 30", equipes: ["U15F2"], coachs: ["Clément"] },
  { id: "Joe_VE_2030", gymnase: "Joël Paon", jour: "Vendredi", debut: "20:30", fin: "22:30", duree: "2 h", equipes: ["SF1", "U18F1"], coachs: ["Clément"] },
  { id: "Luc_ME_1930", gymnase: "Lucien David", jour: "Mercredi", debut: "19:30", fin: "21:00", duree: "1 h 30", equipes: ["U18M3"], coachs: ["Clément"] },
  { id: "Luc_ME_2100", gymnase: "Lucien David", jour: "Mercredi", debut: "21:00", fin: "22:30", duree: "1 h 30", equipes: ["SF1"], coachs: ["Clément"] },
  { id: "Sim_JE_1830", gymnase: "Similienne", jour: "Jeudi", debut: "18:30", fin: "19:45", duree: "1 h 15", equipes: ["U13HPB"], coachs: ["Clément (Sim)"] },
  { id: "Sim_MA_1830", gymnase: "Similienne", jour: "Mardi", debut: "18:30", fin: "19:45", duree: "1 h 15", equipes: ["U13HPB"], coachs: ["Clément (Sim)"] },
  { id: "Vic_JE_2000", gymnase: "Victor Hugo", jour: "Jeudi", debut: "20:00", fin: "21:00", duree: "1 h", equipes: ["U18HPB"], coachs: ["Romane"] },
  { id: "Vic_MA_2100", gymnase: "Victor Hugo", jour: "Mardi", debut: "21:00", fin: "22:30", duree: "1 h 30", equipes: ["SF2"], coachs: ["Steeve"] },
  { id: "Vic_VE_1800", gymnase: "Victor Hugo", jour: "Vendredi", debut: "18:00", fin: "19:00", duree: "1 h", equipes: ["U13HPB"], coachs: ["Clément Sim"] },
];
