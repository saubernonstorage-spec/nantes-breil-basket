# Notice — faire vivre le site du NBB

Tout le contenu qui bouge est dans **un seul fichier** : `data/nbb.ts`.
Les photos se déposent dans le dossier `public/photos/`.
Aucune connaissance technique n'est nécessaire : on ne change que du texte entre guillemets.

## 1. Modifier le site depuis GitHub (sans rien installer)

1. Ouvrez le dépôt du site sur [github.com](https://github.com), puis le fichier `data/nbb.ts`.
2. Cliquez sur le **crayon** (« Edit this file »).
3. Cherchez le bloc à modifier avec `Ctrl+F` / `Cmd+F` (voir le tableau plus bas).
4. Modifiez le texte **entre les guillemets**.
5. Cliquez sur **Commit changes…**, écrivez en une phrase ce que vous avez changé, validez.
6. Le site se met à jour tout seul en une à deux minutes (Netlify le reconstruit).

**En cas d'erreur** (guillemet ou virgule oubliés…), la mise en ligne est refusée et
**l'ancienne version reste en ligne** : personne ne voit de page cassée. Dans Netlify,
l'onglet **Deploys** affiche la construction en échec ; son journal indique le fichier et
le numéro de ligne à corriger. Corrigez, réenregistrez, c'est reparti.

### Les 3 règles à respecter

1. Ne modifiez que le texte **entre les guillemets** `"comme ceci"`.
2. Gardez la **virgule** en fin de ligne et les accolades `{ }` et crochets `[ ]` en place.
   Pour ajouter un élément à une liste, copiez une ligne existante, collez-la, changez les valeurs.
3. Les apostrophes s'écrivent normalement : `"l'école"` fonctionne. Seul le guillemet droit `"`
   est interdit à l'intérieur d'un texte (utilisez « » à la place).

Cherchez `[À COMPLÉTER]` : ce sont les informations qui manquent encore (RNA, SIRET, montants
de partenariat, diplômes des coachs, délais de réponse, plaquette partenaires…). **N'inventez
pas de tarif, de score, de date ni de nom** : laissez `[À COMPLÉTER]` tant que l'information
n'est pas validée par le bureau.

## 2. Où modifier quoi ?

| Je veux modifier… | Bloc à chercher dans `data/nbb.ts` |
| --- | --- |
| E-mail, téléphone, adresse, réseaux sociaux, boutique, saison, délais de réponse | `CLUB` |
| Les chiffres de l'accueil (adhérents, équipes engagées) | `STATS` — le nombre de gymnases est calculé tout seul |
| Les grandes photos (accueil, club, écoles, stages) | `PHOTOS` |
| Les dates de l'agenda | `AGENDA` |
| Les matchs du week-end et les convocations | `WEEKENDS` (et `ADRESSES_SALLES`) |
| Les entraîneurs (photo, diplômes, arrivée au club) | `ENCADREMENT` |
| Le bureau, le comité directeur | `BUREAU`, `COMITE` |
| Les commissions de bénévoles (« On recrute ») | `COMMISSIONS` |
| L'histoire, les valeurs, le projet, la charte | `HISTOIRE`, `VALEURS`, `PROJET`, `ENGAGEMENTS` |
| Les tarifs, les aides, les documents et PDF à télécharger | `TARIFS`, `TARIF_NOTE`, `AIDES`, `DOCUMENTS`, `PIECES` |
| Les effectifs et le nombre d'entraînements par équipe | `CAPACITES` |
| Les questions / réponses de la FAQ | `FAQ` |
| Les gymnases, leurs accès en bus et tram | `GYMNASES` (couleurs des lignes : `LIGNES_NAOLIB`) |
| Les partenaires (nom, logo, lien vers leur site) et l'offre de partenariat | `PARTENAIRES`, `OFFRE_PARTENARIAT` |
| Les stages des vacances | `STAGES`, `STAGE_TARIFS`, `STAGE_REDUCTIONS`, `STAGE_JOURNEE`, `STAGE_A_PREVOIR`, `STAGE_CONTACT` |
| Les séances de l'école d'arbitrage | `ARBITRAGE_SEANCES` |
| Les albums de la galerie | `ALBUMS` |
| Les photos d'équipe | `PHOTOS_EQUIPES` |
| Le planning des entraînements | `SLOTS` |
| Les catégories d'âge (à décaler d'un an chaque saison) | `CATEGORIES_AGE`, `NAISSANCE` |
| Les classements affichés sur la page Équipes | `CLASSEMENTS` |
| Les mentions légales (RNA, SIRET, hébergeur, durées de conservation) | `MENTIONS` |

## 3. Chaque semaine : les matchs du week-end

Dans le bloc `WEEKENDS` (un bloc par week-end, dans l'ordre chronologique) :

1. Renseignez `titre`, `semaine` et `samedi` (date du samedi, au format `"2026-10-03"`).
2. Une ligne par match dans `domicile` (avec arbitres, table, OTM) et `exterieur` (avec l'adresse).
   Un week-end laissé vide s'affiche « À venir ».
3. Vous pouvez publier plusieurs week-ends à l'avance : la page Matchs affiche par défaut le
   week-end à venir et bascule seule sur le suivant dès le lundi.
4. Une nouvelle salle à domicile ? Ajoutez son adresse dans `ADRESSES_SALLES`.

Les **résultats** viennent du widget externe (lien `widgetResultats` dans `CLUB`) : rien à saisir.
Les **classements** de la page Équipes se recopient depuis competitions.ffbb.com (site de la FFBB) dans `CLASSEMENTS`
(un exemple est donné dans le fichier).

## 4. Les autres mises à jour

- **Agenda** (`AGENDA`) : la date au format `"2026-11-21"` sert au tri ; les dates passées
  disparaissent seules. `lien` (facultatif) rend le titre cliquable, ex. `"/stages"`.
- **Planning** (`SLOTS`) : une ligne = un créneau. Les pages Entraînements, Équipes, Écoles et Infos
  se recalculent automatiquement. Le nom du gymnase doit être écrit comme dans `GYMNASES`.
- **Stages** (`STAGES`) : `ouvert: true` ouvre les inscriptions en ligne ; ajoutez les semaines dans
  `semaines`, avec `debut` (date du lundi) pour permettre l'inscription à la journée, et les années
  de naissance acceptées (`nesDe`, `nesA`).
- **Tarifs** (`TARIFS`, `STAGE_TARIFS`) : montants votés par le bureau uniquement.
- **Nouvelle saison** : changez `saison` dans `CLUB`, décalez d'un an les années de `CATEGORIES_AGE`
  et de `NAISSANCE`, puis mettez à jour tarifs, planning et PDF.

## 5. Changer une photo

1. Préparez la photo : JPG ou WebP, 2400 px de large au maximum pour les grands bandeaux,
   1200 px pour les cartes, moins de 400 Ko si possible (le site crée ensuite les bonnes tailles).
2. Sur GitHub, ouvrez le dossier `public/photos/` → **Add file → Upload files**.
3. Dans `data/nbb.ts`, indiquez le chemin, par exemple `"/photos/equipes/u11f1.jpg"`, et une
   description pour les personnes malvoyantes quand le bloc a un champ `alt`.

Où indiquer le chemin : `PHOTOS` (grands bandeaux), `ENCADREMENT` et `BUREAU` (`photo`),
`PHOTOS_EQUIPES` (une ligne par équipe), `ALBUMS` (`couverture` et `photos`),
`PARTENAIRES` (`logo`, avec `logoClair: true` pour un logo blanc : il est alors posé sur fond
bleu nuit), `CATEGORIES` (`image`). Sans photo, le site affiche un motif aux
couleurs du club (ou les initiales pour un portrait) : rien n'est cassé.

**Mineurs** : ne publiez que les enfants dont l'autorisation de droit à l'image est « Oui »
(visible dans l'Espace dirigeants). Préférez les plans larges, sans nom.

## 6. Les demandes reçues : l'Espace dirigeants

Pied de page → **Espace dirigeants** (adresse `/espace-dirigeants`). On s'y connecte avec le mot
de passe du bureau, défini dans Netlify (variable `ADMIN_PASSWORD`, voir `README.md`).

- Trois onglets : **Inscriptions** (préinscriptions), **Stages**, **Messages** (formulaire de contact).
- Chaque demande a un numéro (`INS-…`, `STA-…`, `MSG-…`), un statut à tenir à jour
  (À traiter, Confirmé, Liste d'attente, Payé, Refusé) et un bouton **Supprimer**.
- **Exporter en CSV** ouvre la liste dans Excel.
- Si l'envoi d'e-mails est configuré (SMTP), chaque demande arrive aussi par e-mail ;
  « Répondre » écrit directement à la famille.

Les demandes contiennent des données personnelles, souvent de mineurs : supprimez-les une fois
la saison ou le stage terminés (durées dans `MENTIONS`), et ne partagez pas le mot de passe
en dehors du bureau.
