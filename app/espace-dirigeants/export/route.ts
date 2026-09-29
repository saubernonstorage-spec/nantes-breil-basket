import { estConnecte } from "@/lib/session";
import { lister, TABLES, type Table } from "@/lib/stockage";

/** Export CSV (séparateur « ; », encodage lisible par Excel) des demandes d'un onglet. */
export async function GET(requete: Request) {
  if (!(await estConnecte())) return new Response("Accès réservé.", { status: 401 });
  const table = new URL(requete.url).searchParams.get("table") ?? "";
  if (!TABLES.includes(table as Table)) return new Response("Table inconnue.", { status: 400 });

  const lignes = await lister(table as Table);
  const colonnes = [...new Set(lignes.flatMap((l) => Object.keys(l.champs)))];
  // Inscriptions aux stages : date d'envoi de l'e-mail de confirmation.
  const stages = table === "stages";
  // Une cellule qui commence par = + - @ serait interprétée comme une formule par Excel.
  const cellule = (v: string) => `"${v.replace(/^([=+\-@])/, "'$1").replace(/"/g, '""')}"`;
  const csv =
    "﻿" +
    [
      ["Numéro", "Reçu le", "Statut", ...(stages ? ["Confirmation envoyée le"] : []), ...colonnes].map(cellule).join(";"),
      ...lignes.map((l) =>
        [
          l.id,
          new Date(l.recuLe).toLocaleString("fr-FR", { timeZone: "Europe/Paris" }),
          l.statut,
          ...(stages ? [l.confirmationEnvoyee ? new Date(l.confirmationEnvoyee).toLocaleString("fr-FR", { timeZone: "Europe/Paris" }) : ""] : []),
          ...colonnes.map((c) => l.champs[c] ?? ""),
        ]
          .map(cellule)
          .join(";"),
      ),
    ].join("\r\n");

  const jour = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="nbb-${table}-${jour}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
