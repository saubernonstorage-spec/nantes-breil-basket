import "server-only";

import ExcelJS from "exceljs";

/**
 * Base des adhérents : l'export des licences de la FFBB (FBI → « exporterLicenceDonnees.xlsx »), déposé
 * dans l'Espace dirigeants. Chaque dépôt remplace toute la base (l'export est complet). Seuls le nom
 * (« Prénom Nom »), la date de qualification, la catégorie et l'e-mail sont gardés : les autres colonnes ne
 * sont jamais enregistrées. Les équipes d'entraînement et de match saisies par les dirigeants sont stockées
 * à part (`Affectations`, par nom) et survivent donc aux nouveaux dépôts.
 */

export type Adherent = { nom: string; qualification?: string; categorie: string; email: string };
/** Équipes saisies dans l'onglet Adhérents, par nom d'adhérent. */
export type Affectation = { entrainement: string; match: string };
export type Affectations = Record<string, Affectation>;
export type BaseAdherents = { importeLe: string; fichier: string; adherents: Adherent[] };

/** Colonnes de l'export utilisées. */
const COLONNES = { prenom: "Prénom", nom: "Nom", qualification: "Qualification", categorie: "Catégorie", email: "E-mail" };

/** Taille maximale du fichier déposé. */
export const TAILLE_MAX = 5 * 1024 * 1024;

/**
 * Lit la première feuille de l'export (la première ligne donne les colonnes) et n'en garde que prénom +
 * nom, date de qualification (JJ/MM/AAAA), catégorie et e-mail. Erreur lisible si ce n'est pas l'export des licences.
 */
export async function lireExport(contenu: ArrayBuffer, fichier: string): Promise<BaseAdherents> {
  const classeur = new ExcelJS.Workbook();
  await classeur.xlsx.load(contenu);
  const feuille = classeur.worksheets[0];
  if (!feuille) throw new Error("Le fichier ne contient aucune feuille.");

  const position = new Map<string, number>();
  feuille.getRow(1).eachCell({ includeEmpty: true }, (cellule, n) => {
    position.set(cellule.text.trim(), n);
  });
  const manquantes = Object.values(COLONNES).filter((c) => !position.has(c));
  if (manquantes.length) {
    throw new Error(`Ce n'est pas l'export des licences : colonne${manquantes.length > 1 ? "s" : ""} manquante${manquantes.length > 1 ? "s" : ""} (${manquantes.join(", ")}).`);
  }

  const adherents: Adherent[] = [];
  feuille.eachRow({ includeEmpty: false }, (ligne, n) => {
    if (n === 1) return;
    const valeur = (c: string) => ligne.getCell(position.get(c)!).text.trim();
    const nom = [valeur(COLONNES.prenom), valeur(COLONNES.nom)].filter(Boolean).join(" ");
    if (nom) {
      adherents.push({
        nom,
        qualification: valeur(COLONNES.qualification),
        categorie: valeur(COLONNES.categorie),
        email: valeur(COLONNES.email),
      });
    }
  });
  if (!adherents.length) throw new Error("Le fichier ne contient aucun adhérent.");

  adherents.sort((x, y) => x.nom.localeCompare(y.nom, "fr"));
  return { importeLe: new Date().toISOString(), fichier, adherents };
}
