/**
 * Planning des entraînements — SOURCE UNIQUE DE VÉRITÉ.
 * Pour modifier le planning, éditez simplement ce fichier :
 * le site (planning, équipes, gymnases, page d'accueil) se met à jour tout seul.
 */

export const DAYS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
] as const;

export type Jour = (typeof DAYS)[number];

export type Slot = {
  id: string;
  gymnase: string;
  jour: Jour;
  /** Format "HH:MM" */
  debut: string;
  /** Format "HH:MM" */
  fin: string;
  /** Texte affiché, ex. "1 h 30" */
  duree: string;
  equipes: string[];
  coachs: string[];
};

export const SLOTS: Slot[] = [
  {
    id: "Bre_JE_1830",
    gymnase: "Breil",
    jour: "Jeudi",
    debut: "18:30",
    fin: "19:30",
    duree: "1 h",
    equipes: [
      "U11M2"
    ],
    coachs: [
      "Romane"
    ]
  },
  {
    id: "Bre_JE_1930",
    gymnase: "Breil",
    jour: "Jeudi",
    debut: "19:30",
    fin: "20:45",
    duree: "1 h 15",
    equipes: [
      "U15HPB"
    ],
    coachs: [
      "Hugo"
    ]
  },
  {
    id: "Bre_MA_1830",
    gymnase: "Breil",
    jour: "Mardi",
    debut: "18:30",
    fin: "20:00",
    duree: "1 h 30",
    equipes: [
      "U15F1",
      "U13F1"
    ],
    coachs: [
      "Clément",
      "Célia"
    ]
  },
  {
    id: "Bre_ME_1715",
    gymnase: "Breil",
    jour: "Mercredi",
    debut: "17:15",
    fin: "18:30",
    duree: "1 h 15",
    equipes: [
      "U11F2"
    ],
    coachs: [
      "Clément"
    ]
  },
  {
    id: "Cou_VE_1800",
    gymnase: "Coubertin",
    jour: "Vendredi",
    debut: "18:00",
    fin: "19:00",
    duree: "1 h",
    equipes: [
      "U11M1",
      "U11F1"
    ],
    coachs: [
      "Hugo",
      "CC"
    ]
  },
  {
    id: "Cou_VE_1900",
    gymnase: "Coubertin",
    jour: "Vendredi",
    debut: "19:00",
    fin: "20:00",
    duree: "1 h",
    equipes: [
      "U15M3",
      "U18M2",
      "U18M3"
    ],
    coachs: [
      "Hugo",
      "CC"
    ]
  },
  {
    id: "Der_JE_2030",
    gymnase: "Dervallières",
    jour: "Jeudi",
    debut: "20:30",
    fin: "22:00",
    duree: "1 h 30",
    equipes: [
      "SM2",
      "SM3"
    ],
    coachs: [
      "Lionel"
    ]
  },
  {
    id: "Der_MA_2000",
    gymnase: "Dervallières",
    jour: "Mardi",
    debut: "20:00",
    fin: "22:00",
    duree: "2 h",
    equipes: [
      "Loisirs"
    ],
    coachs: [
      "Autonomie"
    ]
  },
  {
    id: "Der_ME_2000",
    gymnase: "Dervallières",
    jour: "Mercredi",
    debut: "20:00",
    fin: "22:00",
    duree: "2 h",
    equipes: [
      "Loisirs"
    ],
    coachs: [
      "Autonomie"
    ]
  },
  {
    id: "Flo_LU_1815",
    gymnase: "Floreska-Guépin",
    jour: "Lundi",
    debut: "18:15",
    fin: "19:45",
    duree: "1 h 30",
    equipes: [
      "U13F2"
    ],
    coachs: [
      "Romane",
      "Lucy"
    ]
  },
  {
    id: "Flo_LU_1945",
    gymnase: "Floreska-Guépin",
    jour: "Lundi",
    debut: "19:45",
    fin: "21:00",
    duree: "1 h 15",
    equipes: [
      "U15M2",
      "U13M2"
    ],
    coachs: [
      "Clément",
      "Romane"
    ]
  },
  {
    id: "Flo_MA_1815",
    gymnase: "Floreska-Guépin",
    jour: "Mardi",
    debut: "18:15",
    fin: "19:30",
    duree: "1 h 15",
    equipes: [
      "U18F1",
      "U18F2"
    ],
    coachs: [
      "Romane"
    ]
  },
  {
    id: "Flo_MA_1930",
    gymnase: "Floreska-Guépin",
    jour: "Mardi",
    debut: "19:30",
    fin: "20:45",
    duree: "1 h 15",
    equipes: [
      "U18HPB"
    ],
    coachs: [
      "Romane"
    ]
  },
  {
    id: "Flo_MA_2045",
    gymnase: "Floreska-Guépin",
    jour: "Mardi",
    debut: "20:45",
    fin: "22:15",
    duree: "1 h 30",
    equipes: [
      "SM3"
    ],
    coachs: [
      "Romane"
    ]
  },
  {
    id: "Flo_ME_1730",
    gymnase: "Floreska-Guépin",
    jour: "Mercredi",
    debut: "17:30",
    fin: "19:00",
    duree: "1 h 30",
    equipes: [
      "U11M1"
    ],
    coachs: [
      "Hugo"
    ]
  },
  {
    id: "Flo_ME_1900",
    gymnase: "Floreska-Guépin",
    jour: "Mercredi",
    debut: "19:00",
    fin: "20:30",
    duree: "1 h 30",
    equipes: [
      "U15HPB"
    ],
    coachs: [
      "Hugo"
    ]
  },
  {
    id: "Joë_JE_1730",
    gymnase: "Joël Paon",
    jour: "Jeudi",
    debut: "17:30",
    fin: "19:00",
    duree: "1 h 30",
    equipes: [
      "U13M3"
    ],
    coachs: [
      "Hugo"
    ]
  },
  {
    id: "Joë_JE_1900",
    gymnase: "Joël Paon",
    jour: "Jeudi",
    debut: "19:00",
    fin: "20:30",
    duree: "1 h 30",
    equipes: [
      "U18M2"
    ],
    coachs: [
      "Célia"
    ]
  },
  {
    id: "Joë_JE_2030",
    gymnase: "Joël Paon",
    jour: "Jeudi",
    debut: "20:30",
    fin: "22:30",
    duree: "2 h",
    equipes: [
      "SM1"
    ],
    coachs: [
      "Hugo"
    ]
  },
  {
    id: "Joë_LU_1730",
    gymnase: "Joël Paon",
    jour: "Lundi",
    debut: "17:30",
    fin: "18:30",
    duree: "1 h",
    equipes: [
      "U11F1",
      "U9F1"
    ],
    coachs: [
      "Clément"
    ]
  },
  {
    id: "Joë_LU_1830",
    gymnase: "Joël Paon",
    jour: "Lundi",
    debut: "18:30",
    fin: "19:30",
    duree: "1 h",
    equipes: [
      "U9M1",
      "U11M2"
    ],
    coachs: [
      "Clément"
    ]
  },
  {
    id: "Joë_LU_2100",
    gymnase: "Joël Paon",
    jour: "Lundi",
    debut: "21:00",
    fin: "22:30",
    duree: "1 h 30",
    equipes: [
      "U18HPB"
    ],
    coachs: [
      "Romane"
    ]
  },
  {
    id: "Joë_MA_1800",
    gymnase: "Joël Paon",
    jour: "Mardi",
    debut: "18:00",
    fin: "19:30",
    duree: "1 h 30",
    equipes: [
      "U13M2",
      "U15M2"
    ],
    coachs: [
      "Hugo"
    ]
  },
  {
    id: "Joë_MA_1930",
    gymnase: "Joël Paon",
    jour: "Mardi",
    debut: "19:30",
    fin: "21:00",
    duree: "1 h 30",
    equipes: [
      "U15HPB"
    ],
    coachs: [
      "Hugo"
    ]
  },
  {
    id: "Joë_MA_2100",
    gymnase: "Joël Paon",
    jour: "Mardi",
    debut: "21:00",
    fin: "22:30",
    duree: "1 h 30",
    equipes: [
      "SM1"
    ],
    coachs: [
      "Hugo"
    ]
  },
  {
    id: "Joë_ME_1300",
    gymnase: "Joël Paon",
    jour: "Mercredi",
    debut: "13:00",
    fin: "14:15",
    duree: "1 h 15",
    equipes: [
      "U9M3"
    ],
    coachs: [
      "Romane",
      "CC"
    ]
  },
  {
    id: "Joë_ME_1415",
    gymnase: "Joël Paon",
    jour: "Mercredi",
    debut: "14:15",
    fin: "15:30",
    duree: "1 h 15",
    equipes: [
      "U11M3"
    ],
    coachs: [
      "Romane",
      "CC"
    ]
  },
  {
    id: "Joë_ME_1530",
    gymnase: "Joël Paon",
    jour: "Mercredi",
    debut: "15:30",
    fin: "17:00",
    duree: "1 h 30",
    equipes: [
      "U13F1"
    ],
    coachs: [
      "Clément"
    ]
  },
  {
    id: "Joë_ME_1700",
    gymnase: "Joël Paon",
    jour: "Mercredi",
    debut: "17:00",
    fin: "18:15",
    duree: "1 h 15",
    equipes: [
      "U9M2"
    ],
    coachs: [
      "Romane"
    ]
  },
  {
    id: "Joë_ME_1815",
    gymnase: "Joël Paon",
    jour: "Mercredi",
    debut: "18:15",
    fin: "19:30",
    duree: "1 h 15",
    equipes: [
      "U9M1",
      "U9F1"
    ],
    coachs: [
      "Romane",
      "Célia"
    ]
  },
  {
    id: "Joë_ME_1930",
    gymnase: "Joël Paon",
    jour: "Mercredi",
    debut: "19:30",
    fin: "21:00",
    duree: "1 h 30",
    equipes: [
      "U15M3"
    ],
    coachs: [
      "Célia"
    ]
  },
  {
    id: "Joë_ME_2100",
    gymnase: "Joël Paon",
    jour: "Mercredi",
    debut: "21:00",
    fin: "22:30",
    duree: "1 h 30",
    equipes: [
      "SM2"
    ],
    coachs: [
      "Lionel"
    ]
  },
  {
    id: "Joë_SA_0900",
    gymnase: "Joël Paon",
    jour: "Samedi",
    debut: "09:00",
    fin: "10:00",
    duree: "1 h",
    equipes: [
      "U7"
    ],
    coachs: [
      "Clément",
      "Romane"
    ]
  },
  {
    id: "Joë_SA_1000",
    gymnase: "Joël Paon",
    jour: "Samedi",
    debut: "10:00",
    fin: "11:00",
    duree: "1 h",
    equipes: [
      "Micro 1 (2021)"
    ],
    coachs: [
      "Clément",
      "Romane"
    ]
  },
  {
    id: "Joë_SA_1100",
    gymnase: "Joël Paon",
    jour: "Samedi",
    debut: "11:00",
    fin: "12:00",
    duree: "1 h",
    equipes: [
      "Micro 2 (2022-23)"
    ],
    coachs: [
      "Clément",
      "Romane",
      "Célia"
    ]
  },
  {
    id: "Joë_VE_1730",
    gymnase: "Joël Paon",
    jour: "Vendredi",
    debut: "17:30",
    fin: "19:00",
    duree: "1 h 30",
    equipes: [
      "U15F1"
    ],
    coachs: [
      "Clément",
      "Célia"
    ]
  },
  {
    id: "Joë_VE_1900",
    gymnase: "Joël Paon",
    jour: "Vendredi",
    debut: "19:00",
    fin: "20:30",
    duree: "1 h 30",
    equipes: [
      "U15F2"
    ],
    coachs: [
      "Clément"
    ]
  },
  {
    id: "Joë_VE_2030",
    gymnase: "Joël Paon",
    jour: "Vendredi",
    debut: "20:30",
    fin: "22:30",
    duree: "2 h",
    equipes: [
      "SF1",
      "U18F1"
    ],
    coachs: [
      "Clément"
    ]
  },
  {
    id: "Luc_ME_1930",
    gymnase: "Lucien David",
    jour: "Mercredi",
    debut: "19:30",
    fin: "21:00",
    duree: "1 h 30",
    equipes: [
      "U18M3"
    ],
    coachs: [
      "Clément"
    ]
  },
  {
    id: "Luc_ME_2100",
    gymnase: "Lucien David",
    jour: "Mercredi",
    debut: "21:00",
    fin: "22:30",
    duree: "1 h 30",
    equipes: [
      "SF1"
    ],
    coachs: [
      "Clément"
    ]
  },
  {
    id: "Sim_JE_1830",
    gymnase: "Similienne",
    jour: "Jeudi",
    debut: "18:30",
    fin: "19:45",
    duree: "1 h 15",
    equipes: [
      "U13HPB"
    ],
    coachs: [
      "Clément (Sim)"
    ]
  },
  {
    id: "Sim_MA_1830",
    gymnase: "Similienne",
    jour: "Mardi",
    debut: "18:30",
    fin: "19:45",
    duree: "1 h 15",
    equipes: [
      "U13HPB"
    ],
    coachs: [
      "Clément (Sim)"
    ]
  },
  {
    id: "Vic_JE_2000",
    gymnase: "Victor Hugo",
    jour: "Jeudi",
    debut: "20:00",
    fin: "21:00",
    duree: "1 h",
    equipes: [
      "U18HPB"
    ],
    coachs: [
      "Romane"
    ]
  },
  {
    id: "Vic_MA_2100",
    gymnase: "Victor Hugo",
    jour: "Mardi",
    debut: "21:00",
    fin: "22:30",
    duree: "1 h 30",
    equipes: [
      "SF2"
    ],
    coachs: [
      "Steeve"
    ]
  },
  {
    id: "Vic_VE_1800",
    gymnase: "Victor Hugo",
    jour: "Vendredi",
    debut: "18:00",
    fin: "19:00",
    duree: "1 h",
    equipes: [
      "U13HPB"
    ],
    coachs: [
      "Clément Sim"
    ]
  }
];
