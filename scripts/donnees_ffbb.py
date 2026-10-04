"""
Classements, résultats et calendrier FFBB des équipes du Nantes Breil Basket
→ data/classements-ffbb.json, data/resultats-ffbb.json et data/matchs-ffbb.json ;
logos des clubs rencontrés → public/logos/<id du club>.webp, listés dans data/logos-ffbb.json.

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

import io
import json
import re
import sys
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

from ffbb_data_client import FFBBDataClient
from PIL import Image, ImageChops

# Clubs dont on récupère les équipes : le NBB (code PDL0044034) et la Similienne (PDL0044157),
# qui engage une partie des équipes de la CTC Hauts-Pavés (ex. U18HPB).
CLUBS = {
    8649: ("", "Nantes Breil Basket"),
    8752: ("SIM-", "Similienne Nantes (équipes CTC)"),
}
RACINE = Path(__file__).resolve().parent.parent
DATA = RACINE / "data"
LOGOS = RACINE / "public" / "logos"
SOURCE = "FFBB (application officielle), via ffbb-data-client"
# Adresse des images de la FFBB ; taille maximale des logos enregistrés (en pixels).
ASSETS = "https://api.ffbb.com/assets/"
TAILLE_LOGO = 160
# Calendrier des matchs gardé : de 3 semaines avant à 6 semaines après le jour de la mise à jour.
JOURS_AVANT, JOURS_APRES = 21, 42


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


def lignes_classement(client: FFBBDataClient, poule_id: int, engagement_id: str, clubs: dict) -> list[dict]:
    """
    Classement de la poule ; « nbb » marque la ligne de l'équipe elle-même (surlignée sur le site),
    « club » est l'identifiant FFBB du club (pour son logo). Les clubs rencontrés sont ajoutés à `clubs`.
    """
    lignes = []
    for r in sorted(client.get_classement(poule_id) or [], key=lambda r: r.position or 99):
        numero = r.id_engagement.numero_equipe if r.id_engagement else None
        if r.organisme_id:
            clubs[str(r.organisme_id)] = (r.organisme_nom, r.organisme_logo_id)
        lignes.append(
            {
                "rang": r.position,
                "equipe": f"{r.organisme_nom} {numero}" if numero else r.organisme_nom,
                "club": str(r.organisme_id or ""),
                "j": r.match_joues or 0,
                "v": r.gagnes or 0,
                "d": r.perdus or 0,
                "pts": r.points or 0,
                "nbb": bool(r.id_engagement) and r.id_engagement.id == engagement_id,
            }
        )
    return lignes


def heure_match(horaire, date) -> str:
    """« 1530 » (ou la date « 2026-10-04 15:30:00 ») → « 15h30 » ; "" si l'horaire n'est pas encore fixé."""
    h = str(horaire or "").strip()
    if h.isdigit() and len(h) in (3, 4) and int(h) > 0:
        h = h.zfill(4)
        return f"{h[:2]}h{h[2:]}"
    heure = str(date or "")[11:16]
    return heure.replace(":", "h") if heure and heure != "00:00" else ""


def salle_ffbb(client: FFBBDataClient, salle, salles: dict) -> str:
    """
    Identifiant FFBB de la salle d'un match ; ses nom, adresse, code postal et ville sont ajoutés à
    `salles` (la ville vient de la recherche de salles de la FFBB, la fiche de salle ne la donne pas).
    """
    sid = str(getattr(salle, "id", None) or salle or "").strip()
    if not sid or sid in salles:
        return sid
    fiche = client.get_salle(sid)
    nom, adresse, cp, ville = (getattr(fiche, "libelle", "") or "", getattr(fiche, "adresse", "") or "", "", "")
    for recherche in (adresse, nom):
        if not recherche or ville:
            continue
        resultat = client.search_salles(recherche)
        for h in getattr(resultat, "hits", None) or []:
            carto = getattr(getattr(h, "cartographie", None), "cartographie_id", "")
            commune = getattr(h, "commune", None)
            if commune and (carto == f"S-{sid}" or str(getattr(h, "id", "")) == sid):
                cp = getattr(commune, "code_postal", "") or getattr(commune, "codePostal", "") or ""
                ville = getattr(commune, "libelle", "") or ""
                break
    salles[sid] = {"nom": nom, "adresse": adresse, "cp": str(cp), "ville": ville}
    return sid


def calendrier_matchs(client: FFBBDataClient, engagements: dict, clubs: dict) -> dict:
    """
    Matchs des équipes du club (joués ou non) de JOURS_AVANT jours avant à JOURS_APRES jours après
    aujourd'hui, du point de vue du club : date, heure, domicile, adversaire, club adverse (logo), salle.
    Les salles déjà connues (fichier précédent) ne sont pas redemandées à la FFBB.
    """
    fichier = DATA / "matchs-ffbb.json"
    salles = json.loads(fichier.read_text(encoding="utf-8")).get("calendrier", {}).get("salles", {}) if fichier.exists() else {}
    debut = (datetime.now(timezone.utc) - timedelta(days=JOURS_AVANT)).date().isoformat()
    fin = (datetime.now(timezone.utc) + timedelta(days=JOURS_APRES)).date().isoformat()
    matchs, vus = [], set()
    for poule_id in sorted({poule for _, poule in engagements.values()}):
        for r in client.list_rencontres_by_poule(poule_id) or []:
            date = str(r.date_rencontre or "")[:10]
            if not debut <= date <= fin:
                continue
            for nous, eux in ((1, 2), (2, 1)):
                engagement = str(getattr(r, f"idEngagementEquipe{nous}") or "")
                if engagement not in engagements or (r.id, engagement) in vus:
                    continue
                vus.add((r.id, engagement))
                club = getattr(r, f"idOrganismeEquipe{eux}")
                club = str(getattr(club, "id", None) or club or "")
                if club and club not in clubs:  # adversaire hors des classements (coupe) : son logo aussi
                    o = client.get_organisme(int(club))
                    if o:
                        logo = getattr(o, "logo", None)
                        clubs[club] = (o.nom, getattr(logo, "id", None) or logo)
                matchs.append(
                    {
                        "equipe": engagements[engagement][0],
                        "date": date,
                        "heure": heure_match(r.horaire, r.date_rencontre),
                        "domicile": nous == 1,
                        "adversaire": nom_equipe(getattr(r, f"nomEquipe{eux}")),
                        "club": club,
                        "salle": salle_ffbb(client, r.salle, salles),
                        # Arbitres officiels désignés par la FFBB (identifiants « …-ARB-1 », sans les noms).
                        "officiels": any("ARB" in str(o) for o in (r.officiels or [])),
                    }
                )
    matchs.sort(key=lambda m: (m["date"], m["heure"], m["equipe"]))
    utilisees = {m["salle"] for m in matchs}
    return {"matchs": matchs, "salles": {k: v for k, v in sorted(salles.items()) if k in utilisees}}


def logo_webp(logo_id: str) -> bytes | None:
    """Logo d'un club sur le serveur de la FFBB, réduit à TAILLE_LOGO pixels et converti en WebP."""
    requete = urllib.request.Request(ASSETS + logo_id, headers={"User-Agent": "okhttp/4.12.0"})
    try:
        with urllib.request.urlopen(requete, timeout=30) as reponse:
            image = Image.open(io.BytesIO(reponse.read()))
            image.load()
    except Exception as erreur:  # logo manquant ou illisible : le site affiche les initiales du club
        print(f"Logo {logo_id} illisible : {erreur}", file=sys.stderr)
        return None
    image = image.convert("RGBA")
    # Marges blanches ou transparentes retirées : le logo remplit sa pastille sur le site.
    blanc = Image.new("RGB", image.size, (255, 255, 255))
    encre = ImageChops.difference(image.convert("RGB"), blanc).convert("L").point(lambda v: 255 if v > 24 else 0)
    opaque = image.getchannel("A").point(lambda v: 255 if v > 24 else 0)
    cadre = ImageChops.multiply(encre, opaque).getbbox()
    if cadre:
        image = image.crop(cadre)
    image.thumbnail((TAILLE_LOGO, TAILLE_LOGO))
    sortie = io.BytesIO()
    image.save(sortie, "WEBP", quality=85, method=6)
    return sortie.getvalue()


def mettre_a_jour_logos(clubs: dict) -> None:
    """
    Télécharge les logos nouveaux ou changés (repérés par l'identifiant d'image de la FFBB) dans
    public/logos/ et réécrit data/logos-ffbb.json s'il a changé. Les logos déjà connus sont gardés.
    """
    fichier = DATA / "logos-ffbb.json"
    anciens = json.loads(fichier.read_text(encoding="utf-8")).get("logos", {}) if fichier.exists() else {}
    LOGOS.mkdir(parents=True, exist_ok=True)
    logos = dict(anciens)
    for club, (nom, logo_id) in sorted(clubs.items()):
        ancien = anciens.get(club, {})
        chemin = LOGOS / f"{club}.webp"
        if logo_id and (ancien.get("image") != logo_id or not chemin.exists()):
            contenu = logo_webp(logo_id)
            if contenu:
                chemin.write_bytes(contenu)
            else:
                logo_id = ancien.get("image") if chemin.exists() else None
        elif not logo_id:
            logo_id = ancien.get("image") if chemin.exists() else None
        logos[club] = {
            "nom": nom,
            "logo": f"/logos/{club}.webp" if logo_id and chemin.exists() else "",
            "image": logo_id or "",
        }
    ecrire_si_change(fichier, "logos", logos, "clubs écrits")


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


def ecrire_si_change(fichier: Path, cle: str, contenu: dict, quoi: str = "équipes écrites") -> None:
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
    print(f"{fichier.name} : {len(contenu)} {quoi}.")


def main() -> int:
    client = FFBBDataClient.create()

    # Championnats seulement (pas les coupes). Si une équipe a deux engagements (changement de phase),
    # on garde le plus récent.
    retenus: dict[str, object] = {}
    # Pour le calendrier des matchs : tous les engagements (championnats et coupes), id → (clé, poule).
    tous: dict[str, tuple[str, int]] = {}
    for club_id, (prefixe, nom) in CLUBS.items():
        engagements = client.get_equipes(club_id)
        if not engagements:
            print(f"Aucune équipe reçue pour {nom} : fichiers inchangés.", file=sys.stderr)
            return 1
        for e in engagements:
            cle = cle_equipe(prefixe, e)
            if cle is None or not e.idPoule:
                continue
            tous[str(e.id)] = (cle, int(e.idPoule.id))
            if e.idCompetition.typeCompetition != "DIV":
                continue
            if cle not in retenus or int(e.idPoule.id) > int(retenus[cle].idPoule.id):
                retenus[cle] = e

    # Clubs rencontrés (id FFBB → nom, identifiant de l'image du logo), dont le NBB et la Similienne.
    clubs: dict[str, tuple] = {}
    for club_id in CLUBS:
        o = client.get_organisme(club_id)
        if o:
            logo = getattr(o, "logo", None)
            clubs[str(club_id)] = (o.nom, getattr(logo, "id", None) or logo)

    classements: dict[str, dict] = {}
    resultats: dict[str, list] = {}
    for cle, e in sorted(retenus.items()):
        poule_id = int(e.idPoule.id)
        poule = client.get_poule(poule_id, fields=["id", "nom"])
        lignes = lignes_classement(client, poule_id, e.id, clubs)
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

    calendrier = calendrier_matchs(client, tous, clubs)
    if calendrier["matchs"]:
        ecrire_si_change(DATA / "matchs-ffbb.json", "calendrier", calendrier, "rubriques écrites (matchs et salles)")
    else:
        print("Aucun match reçu : matchs-ffbb.json inchangé.", file=sys.stderr)

    mettre_a_jour_logos(clubs)
    return 0


if __name__ == "__main__":
    sys.exit(main())
