"""
Classements et résultats FFBB des équipes du Nantes Breil Basket
→ data/classements-ffbb.json et data/resultats-ffbb.json.

Lancé chaque nuit par GitHub Actions (.github/workflows/donnees-ffbb.yml) ; le site lit ces fichiers
et les associe à ses équipes grâce à EQUIPES_FFBB (data/nbb.ts).

Les données viennent de l'application de la FFBB, par la bibliothèque communautaire ffbb-data-client
(non officielle). Si elle échoue, le script s'arrête sans rien modifier : le site garde les dernières
données connues.

Clé de chaque équipe : « catégorie-sexe-numéro » de la FFBB, ex. « U15-M-2 », « SE-F-1 », précédée du
préfixe du club qui porte l'équipe (« SIM-U18-M-1 » : équipe CTC engagée par la Similienne).
Chaque fichier n'est réécrit que si son contenu a changé (« maj » = date de ce changement).
"""

from __future__ import annotations

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

from ffbb_data_client import FFBBDataClient

# Clubs dont on récupère les équipes : le NBB (code PDL0044034) et la Similienne (PDL0044157),
# qui engage une partie des équipes de la CTC Hauts-Pavés (ex. U18HPB).
CLUBS = {
    8649: ("", "Nantes Breil Basket"),
    8752: ("SIM-", "Similienne Nantes (équipes CTC)"),
}
DATA = Path(__file__).resolve().parent.parent / "data"
SOURCE = "FFBB (application officielle), via ffbb-data-client"


def cle_equipe(prefixe: str, engagement) -> str | None:
    """« U15-M-2 », « SIM-U18-M-1 » ; None pour une équipe sans numéro (ex. U9)."""
    comp = engagement.idCompetition
    if not engagement.numeroEquipe or not comp.categorie:
        return None
    return f"{prefixe}{comp.categorie.code}-{comp.sexe}-{engagement.numeroEquipe}"


def nom_equipe(nom: str | None) -> str:
    """« GRAND LIEU BASKET - 1 » → « GRAND LIEU BASKET 1 » ; « SIMILIENNE NANTES - » → « SIMILIENNE NANTES »."""
    nom = re.sub(r"\s*-\s*$", "", (nom or "").strip())
    return re.sub(r"\s+-\s+(\d+)$", r" \1", nom)


def lignes_classement(client: FFBBDataClient, poule_id: int, engagement_id: str) -> list[dict]:
    """Classement de la poule ; « nbb » marque la ligne de l'équipe elle-même (surlignée sur le site)."""
    lignes = []
    for r in sorted(client.get_classement(poule_id) or [], key=lambda r: r.position or 99):
        numero = r.id_engagement.numero_equipe if r.id_engagement else None
        lignes.append(
            {
                "rang": r.position,
                "equipe": f"{r.organisme_nom} {numero}" if numero else r.organisme_nom,
                "j": r.match_joues or 0,
                "v": r.gagnes or 0,
                "d": r.perdus or 0,
                "pts": r.points or 0,
                "nbb": bool(r.id_engagement) and r.id_engagement.id == engagement_id,
            }
        )
    return lignes


def resultats_equipe(client: FFBBDataClient, poule_id: int, engagement_id: str) -> list[dict]:
    """Matchs joués de l'équipe dans sa poule, du plus ancien au plus récent (scores du point de vue du club)."""
    resultats = []
    for r in client.list_rencontres_by_poule(poule_id) or []:
        if engagement_id not in (r.idEngagementEquipe1, r.idEngagementEquipe2) or not r.joue:
            continue
        domicile = r.idEngagementEquipe1 == engagement_id
        nous, eux = (r.resultatEquipe1, r.resultatEquipe2) if domicile else (r.resultatEquipe2, r.resultatEquipe1)
        if not str(nous or "").isdigit() or not str(eux or "").isdigit():
            continue
        forfait_nous = r.forfaitEquipe1 if domicile else r.forfaitEquipe2
        forfait_eux = r.forfaitEquipe2 if domicile else r.forfaitEquipe1
        resultats.append(
            {
                "date": str(r.date_rencontre).replace(" ", "T")[:16],
                "domicile": domicile,
                "adversaire": nom_equipe(r.nomEquipe2 if domicile else r.nomEquipe1),
                "nous": int(nous),
                "eux": int(eux),
                "forfait": "nous" if forfait_nous else "eux" if forfait_eux else "",
            }
        )
    return sorted(resultats, key=lambda m: m["date"])


def ecrire_si_change(fichier: Path, cle: str, contenu: dict) -> None:
    ancien = json.loads(fichier.read_text(encoding="utf-8")) if fichier.exists() else {}
    if ancien.get(cle) == contenu:
        print(f"{fichier.name} : aucun changement.")
        return
    donnees = {
        "source": SOURCE,
        "clubs": {str(k): nom for k, (_, nom) in CLUBS.items()},
        "maj": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        cle: contenu,
    }
    fichier.write_text(json.dumps(donnees, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{fichier.name} : {len(contenu)} équipes écrites.")


def main() -> int:
    client = FFBBDataClient.create()

    # Championnats seulement (pas les coupes). Si une équipe a deux engagements (changement de phase),
    # on garde le plus récent.
    retenus: dict[str, object] = {}
    for club_id, (prefixe, nom) in CLUBS.items():
        engagements = client.get_equipes(club_id)
        if not engagements:
            print(f"Aucune équipe reçue pour {nom} : fichiers inchangés.", file=sys.stderr)
            return 1
        for e in engagements:
            cle = cle_equipe(prefixe, e)
            if cle is None or e.idCompetition.typeCompetition != "DIV" or not e.idPoule:
                continue
            if cle not in retenus or int(e.idPoule.id) > int(retenus[cle].idPoule.id):
                retenus[cle] = e

    classements: dict[str, dict] = {}
    resultats: dict[str, list] = {}
    for cle, e in sorted(retenus.items()):
        poule_id = int(e.idPoule.id)
        poule = client.get_poule(poule_id, fields=["id", "nom"])
        lignes = lignes_classement(client, poule_id, e.id)
        if lignes:
            championnat = e.idCompetition.nom
            classements[cle] = {
                "championnat": f"{championnat} · {poule.nom}" if poule and poule.nom else championnat,
                "lignes": lignes,
            }
        matchs = resultats_equipe(client, poule_id, e.id)
        if matchs:
            resultats[cle] = matchs

    if not classements:
        print("Aucun classement reçu : fichiers inchangés.", file=sys.stderr)
        return 1

    ecrire_si_change(DATA / "classements-ffbb.json", "classements", classements)
    ecrire_si_change(DATA / "resultats-ffbb.json", "resultats", resultats)
    return 0


if __name__ == "__main__":
    sys.exit(main())
