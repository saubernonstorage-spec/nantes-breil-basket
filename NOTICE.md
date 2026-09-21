# Notice d'utilisation — site du Nantes Breil Basket

Tout le contenu modifiable est dans **un seul fichier** : `data/nbb.ts`.
Les photos se déposent dans le dossier `public/photos/`.
Aucune connaissance technique n'est nécessaire : on ne change que du texte entre guillemets.

## Modifier le site depuis GitHub (sans rien installer)

1. Ouvrez le dépôt du site sur [github.com](https://github.com), puis le fichier `data/nbb.ts`.
2. Cliquez sur le **crayon** (« Edit this file »).
3. Cherchez le bloc à modifier avec `Ctrl+F` / `Cmd+F` (voir le tableau plus bas).
4. Modifiez le texte **entre les guillemets**.
5. Cliquez sur **Commit changes…**, écrivez en une phrase ce que vous avez changé, validez.
6. Le site se met à jour tout seul en 1 à 2 minutes (Netlify le reconstruit).

**En cas d'erreur** (guillemet ou virgule oubliés…), la mise en ligne est refusée et
**l'ancienne version reste en ligne** : personne ne voit de page cassée. Dans Netlify,
l'onglet **Deploys** affiche la construction en échec ; son journal indique le fichier et
le numéro de ligne à corriger. Corrigez, réenregistrez, c'est reparti.

## Les 3 règles à respecter

1. Ne modifiez que le texte **entre les guillemets** `"comme ceci"`.
2. Gardez la **virgule** en fin de ligne et les accolades `{ }` et crochets `[ ]` en place.
3. Pour écrire une apostrophe dans un texte, utilisez-la normalement : `"l'école"` fonctionne.
   Seul le guillemet droit `"` est interdit à l'intérieur d'un texte (utilisez « » à la place).

## Où modifier quoi ?

| Je veux modifier… | Bloc à chercher dans `data/nbb.ts` |
| --- | --- |
| E-mail, téléphone, adresse, réseaux sociaux, lien d'inscription, boutique, saison | `CLUB` |
| Les chiffres de l'accueil (adhérents, équipes engagées) | `STATS` — le nombre de gymnases est calculé tout seul |
| Les grandes photos (accueil, école de basket, club, stages) | `PHOTOS` |
| L'histoire, les valeurs, le projet associatif et le Label Citoyen | `HISTOIRE`, `VALEURS`, `PROJET` |
| Les membres du bureau | `BUREAU` |
| Les entraîneurs présentés sur la page « Le club » | `ENCADREMENT` |
| Les commissions de bénévoles | `COMMISSIONS` |
| Les actualités de l'accueil | `ACTUS` |
| L'agenda de l'accueil | `AGENDA` |
| L'école d'arbitrage (séances, contact, mémo PDF) | `ARBITRAGE` |
| Les étapes d'inscription, tarifs, documents à fournir, aides | `ETAPES_INSCRIPTION`, `TARIFS`, `DOCUMENTS`, `AIDES` |
| Les questions / réponses de la FAQ | `FAQ` |
| Les adresses et accès des gymnases, le repère sur la carte | `GYMNASES` |
| Les règles des salles, les objets trouvés | `INFOS_PRATIQUES` |
| La note sur le groupement HPB (page Équipes) | `NOTE_HPB` |
| Les partenaires, l'offre de partenariat | `PARTENAIRES`, `OFFRE_PARTENARIAT`, `NOTE_PARTENARIAT` |
| Les stages des vacances | `STAGES`, `STAGE_TARIFS`, `STAGE_INFOS`, `STAGE_JOURNEE`, `STAGE_A_PREVOIR` |
| Les albums de la galerie | `ALBUMS` |
| Les mentions légales (RNA, SIRET, hébergeur…) | `MENTIONS` |
| Les catégories de la page Équipes, les photos d'équipe | `CATEGORIES`, `PHOTOS_EQUIPES` |
| Le planning des entraînements | `SLOTS` |

Tous les `[À COMPLÉTER]` visibles sur le site correspondent à une information
manquante : remplacez-les au fur et à mesure. **N'inventez pas de tarif, de score
ou de nom** — laissez `[À COMPLÉTER]` tant que l'information n'est pas validée.
Certains messages d'aide disparaissent d'eux-mêmes une fois l'information saisie
(« ajoutez les noms des élus… », « montants à compléter avant publication… »).

## Publier une actualité

Dans le bloc `ACTUS`, copiez un article entier (de `{` à `},`), collez-le **en haut
de la liste** (les trois premiers s'affichent sur l'accueil) et changez :

```ts
  {
    titre: "Victoire des U13F1 au tournoi de Noël",
    tag: "Jeunes",              // étiquette orange affichée au-dessus du titre
    date: "12 décembre 2026",
    chapo: "Deux ou trois phrases de résumé.",
    photo: "/photos/actus/tournoi-noel.jpg",  // ou laissez "PHOTO — 1200×750 px"
    lien: "/stages",            // une page du site, ou une adresse complète https://…
  },
```

## Mettre à jour l'agenda

Dans le bloc `AGENDA`, la première date est la plus proche. Chaque ligne a trois
champs : `date` (texte court, ex. `"18 oct."`), `titre` et `lieu`. Supprimez une ligne
passée, copiez-en une pour ajouter une date.

## Modifier le planning des entraînements

Le planning est la **source unique** du site : les fiches équipes, la liste des
gymnases et les chiffres de l'accueil en sont déduits.

Dans le bloc `SLOTS`, chaque créneau ressemble à ceci :

```ts
  { id: "Joe_LU_1730", gymnase: "Joël Paon", jour: "Lundi", debut: "17:30", fin: "18:30", duree: "1 h", equipes: ["U11F1", "U9F1"], coachs: ["Clément"] },
```

- Pour **déplacer** un créneau : changez `jour`, `debut`, `fin` et `duree`.
- Pour **ajouter** une équipe sur un créneau : ajoutez-la dans `equipes: [...]`.
- Pour **créer** un créneau : copiez une ligne complète et changez ses valeurs
  (gardez un `id` unique, par exemple `Joe_MA_1900`).
- Le `jour` s'écrit avec une majuscule : `"Lundi"`, `"Mardi"`… (sinon la mise en ligne est refusée).
- Le nom du `gymnase` doit être écrit **exactement** comme dans le bloc `GYMNASES`.
- Une nouvelle équipe apparaît automatiquement dans les filtres et dans la page
  Équipes, classée par son nom : `Micro…`/`U7`/`U9…`/`U11…` en mini-basket,
  `U13…`/`U15…`/`U18…` en jeunes, `SF…`/`SM…` en seniors, le reste en loisirs.

## Remplacer les photos

Chaque emplacement gris rayé indique le format attendu (« PHOTO — 1200×750 px »).

1. Sur GitHub, ouvrez le dossier `public/photos/`, puis **Add file → Upload files**
   et déposez votre photo (nom sans espace ni accent, ex. `mini-basket-2026.jpg`).
2. Dans `data/nbb.ts`, remplacez le texte `"PHOTO — …"` par le chemin de la photo,
   **sans** le mot `public` : `"/photos/mini-basket-2026.jpg"`.
3. Pour les grandes photos (bloc `PHOTOS`), complétez aussi `alt` : une courte
   description de l'image pour les personnes malvoyantes.

Deux règles :

- **Poids** : exportez en JPG à 1600 px de large maximum, moins de 300 Ko par photo
  (le site redimensionne automatiquement, mais inutile d'envoyer des fichiers de 5 Mo).
- **Droit à l'image** : aucune photo de mineur sans autorisation signée. Privilégiez
  les plans larges et ne mettez jamais de nom d'enfant en légende ou dans le nom du fichier.

Cas particuliers :

- **Photos d'équipe** : bloc `PHOTOS_EQUIPES`, une ligne par équipe, par exemple
  `"U11F1": "/photos/equipes/u11f1.jpg",`
- **Logos des partenaires** : champ `logo` (PNG à fond transparent) et `site` (adresse
  de leur site, facultative) dans le bloc `PARTENAIRES`.
- **Galerie** : champ `photo` (couverture) et `lien` (album complet sur Google Photos,
  Facebook…) dans le bloc `ALBUMS`.
- **Portraits** : champ `photo` dans `ENCADREMENT` et `BUREAU`.
- **Logo du club** : remplacez `public/logo-nbb.png` (et `app/icon.png` pour l'icône
  de l'onglet du navigateur).

## Ouvrir ou fermer un stage des vacances

Dans le bloc `STAGES`, chaque période a sa fiche et ses semaines. Deux champs pilotent l'affichage :

- `statut:` le texte de la pastille — `"Inscriptions ouvertes"` affiche les boutons
  « Inscrire mon enfant » ; tout autre texte (`"Complet"`, `"Programme à venir"`…) les masque.
- `places:` le nombre de places restantes, affiché sous les dates de chaque semaine.

Seules les semaines des périodes « Inscriptions ouvertes » sont proposées dans le
formulaire d'inscription en ligne. Pensez à mettre à jour `STAGE_TARIFS` et la phrase
`tarifsNote` du bloc `STAGE_INFOS` quand les tarifs changent.

## Où arrivent les messages des formulaires ?

Le formulaire de contact et l'inscription aux stages envoient un e-mail aux adresses
choisies par le club (« Répondre » renvoie directement vers la famille). Ces adresses
et le compte de messagerie utilisé se règlent **dans Netlify**, pas dans `data/nbb.ts` :
voir le `README.md` (partie « Envoi des formulaires »). Tant que ce réglage n'est pas
fait, les visiteurs voient un message les invitant à écrire directement par e-mail.

## Ce qui reste à compléter avant la mise en ligne

1. **Coordonnées du club** : e-mail, téléphone, adresse (bloc `CLUB`) et délai de réponse annoncé.
2. **Lien du formulaire d'inscription** en ligne (bloc `CLUB`, champ `inscription`).
3. **Envoi des formulaires** : réglage de la messagerie dans Netlify (voir `README.md`).
4. **Mentions légales** : RNA, SIRET, responsable de publication, durée de conservation (bloc `MENTIONS`).
5. **Adresses des gymnases** (bloc `GYMNASES`), avec `lat` / `lon` pour les épingler sur la carte.
6. **Tarifs** des licences et de l'offre partenaires, **bureau**, **histoire**, **projet associatif**.
7. **Photos** : accueil, école de basket, club, stages, équipes, partenaires.
8. **Widget classements** Score'n'co (emplacement réservé sur la page Calendrier).
