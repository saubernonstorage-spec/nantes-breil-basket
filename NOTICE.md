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
6. Le site se met à jour tout seul en deux à trois minutes (Hostinger le reconstruit).

**En cas d'erreur** (guillemet ou virgule oubliés…), la mise en ligne est refusée et
**l'ancienne version reste en ligne** : personne ne voit de page cassée. Dans le hPanel Hostinger,
l'application Node.js affiche la construction en échec ; son journal indique le fichier et
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
n'est pas validée par le bureau. Tout texte qui contient encore `[À COMPLÉTER]` ou `[À CONFIRMER]`
**n'est pas affiché sur le site** : il apparaît dès que la marque est remplacée par la vraie
information. La liste de ce qui reste à fournir est dans l'Espace dirigeants, onglet
**« À compléter sur le site »**, avec pour chaque élément son emplacement dans `data/nbb.ts`.

## 2. Où modifier quoi ?

| Je veux modifier… | Bloc à chercher dans `data/nbb.ts` |
| --- | --- |
| E-mail, téléphone, adresse, réseaux sociaux, boutique, saison, délais de réponse | `CLUB` |
| Adresse d'expédition unique des e-mails du site (noreply), à déclarer dans Brevo | `EMAIL_EXPEDITEUR` |
| Adresse de chaque service (inscriptions, stages, arbitrage, partenariat, bénévolat, site, contact) | `EMAILS_SERVICES` |
| Service qui reçoit chaque sujet du formulaire Contact | `SERVICE_PAR_SUJET` |
| Texte de l'accusé de réception envoyé automatiquement après un message de la page Contact (repères {nom}, {sujet}, {reference}, {delai}, {email}) | `CONTACT_ACCUSE` |
| Ouvrir ou fermer les inscriptions au club (`false` : fenêtre « Inscriptions fermées » sur les boutons d'inscription, formulaire remplacé par un message, lien vers Contact) | `INSCRIPTIONS_OUVERTES` |
| Périodes d'ouverture de la boutique (en dehors, les boutons « Boutique » affichent « Boutique fermée » et la prochaine ouverture) | `OUVERTURES_BOUTIQUE` |
| Les chiffres de l'accueil (adhérents, équipes engagées) | `STATS` — le nombre de gymnases est calculé tout seul |
| Les grandes photos (accueil, club, écoles, stages) | `PHOTOS` |
| Les dates de l'agenda | `AGENDA` |
| Équipes dont le prochain match à domicile est mis en avant en haut de l'accueil, avec compte à rebours (date, heure, adversaire viennent de la FFBB) | `EQUIPES_A_L_AFFICHE` |
| Heure de début d'une date (`heure: "20:30"`), utilisée par le compte à rebours du prochain événement (accueil et page Agenda ; sans heure : minuit) | `heure` dans `AGENDA` |
| Affiche ou flyer de chaque date, format portrait A4 (page Agenda et fenêtre « prochain événement » ouverte une fois par visite) | `affiche` dans `AGENDA` |
| Les convocations des matchs (les matchs eux-mêmes viennent de la FFBB, voir § 3) | `CONVOCATIONS`, `MATCHS_MANUELS` (et `ADRESSES_SALLES`, `SALLES_FFBB`, `NOMS_CLUBS`) |
| Les entraîneurs (photo, diplômes, arrivée au club) | `ENCADREMENT` |
| Le bureau, le comité directeur | `BUREAU`, `COMITE` |
| Les commissions de bénévoles (« On recrute ») | `COMMISSIONS` |
| L'histoire, les valeurs, le projet | `HISTOIRE`, `VALEURS`, `PROJET` |
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
| Les classements de la page Équipes (automatiques, voir § 3) | `EQUIPES_FFBB` (et `CLASSEMENTS` pour une saisie à la main) |
| Les mentions légales (RNA, SIRET, hébergeur, durées de conservation) | `MENTIONS` |

## 3. Chaque semaine : les convocations du week-end

Les **matchs** (date, heure, adversaire, salle, adresse) arrivent **tout seuls** de la FFBB, chaque nuit
(`data/matchs-ffbb.json`, voir plus bas) : un changement d'horaire ou de salle est repris la nuit
suivante. Il ne reste à saisir que ce que la FFBB ne connaît pas :

1. **Les convocations** (arbitres, table de marque, OTM) se saisissent dans l'**Espace dirigeants**,
   onglet **« Convocations »** : les matchs à domicile des 4 prochains week-ends (celui en cours compris) y sont listés,
   avec cinq cases : Arbitre 1 et 2, Table 1 et 2, OTM. Chaque case propose les adhérents (onglet
   « Adhérents », à importer d'abord), les noms déjà utilisés et les équipes du club (U15M1…), puis
   « Enregistrer les convocations ». La page Matchs est mise à jour aussitôt, sans republier le site.
   Plusieurs noms : séparés par des virgules (ils s'affichent l'un sous l'autre). Quand la FFBB désigne
   des arbitres officiels, le site affiche « Officiels » (la table et l'OTM restent à saisir). Un match
   à domicile sans convocation affiche « — » et reste listé dans l'onglet « À compléter ».
   Le bloc `CONVOCATIONS` de `data/nbb.ts` reste possible (même format : date, équipe, arbitres, table,
   otm) ; une saisie de l'Espace dirigeants l'emporte sur lui.
2. **`MATCHS_MANUELS`** : les matchs absents de la FFBB (plateaux U9, matchs amicaux…). À domicile,
   indiquez `salle` (un nom de `ADRESSES_SALLES`) et les convocations ; à l'extérieur, `lieu` (adresse
   complète). Un match manuel remplace celui de la FFBB de la même équipe le même jour.
3. La page Matchs affiche **cinq week-ends** : le précédent (« Terminée »), celui de la semaine
   (« Prochains matchs », affiché par défaut) et les trois suivants (« À venir ») ; elle bascule seule
   chaque lundi. Chez les jeunes, la FFBB ne publie le calendrier que phase par phase : un week-end
   au-delà de la phase en cours reste vide jusqu'à la publication de la suivante. Les anciennes lignes de `CONVOCATIONS` et `MATCHS_MANUELS` peuvent être effacées.
4. Les salles du club sont reconnues grâce à `SALLES_FFBB` (identifiant FFBB → nom de la salle dans
   `ADRESSES_SALLES`). Une autre salle s'affiche avec le nom donné par la FFBB. Les matchs à domicile
   sont regroupés par salle, dans l'ordre d'`ADRESSES_SALLES`.
5. La FFBB écrit les noms des clubs en capitales et sans accents : `NOMS_CLUBS` donne le nom à afficher
   (« ESPERANCE SPORTIVE DE CROSSAC » → « Espérance Sportive de Crossac ») ; un club absent de la liste
   est simplement remis en minuscules.

Sur la page Matchs, chacun choisit entre l'affichage **Tableau** et **Cartes** (les cartes sont
proposées d'office sur téléphone). Rien à régler.

Les **résultats** (tableau « Scores officiels FFBB » en bas de la page Matchs) et les **classements**
(page Équipes, « Voir le classement ») sont **automatiques** : chaque nuit, une tâche GitHub (onglet
« Actions » du dépôt → « Données FFBB ») les récupère auprès de la FFBB et met à jour
`data/resultats-ffbb.json` et `data/classements-ffbb.json` s'ils ont changé ; Hostinger republie alors le
site. Rien à saisir, et ces fichiers ne se modifient pas à la main. Les 10 derniers week-ends de
résultats sont proposés.

- Chaque équipe du site est reliée à son équipe FFBB dans `EQUIPES_FFBB` (ex. `U15M2: "U15-M-2"`). Les
  équipes CTC décalent la numérotation (l'U15HPB est l'équipe 1 du NBB en U15 masculins) ; celles que
  la Similienne engage portent le préfixe `SIM-` (l'U18HPB est `SIM-U18-M-1`). **À chaque
  nouvelle phase ou saison**, vérifiez ces correspondances : les adversaires du classement doivent être
  ceux des matchs de l'équipe.
- Pour forcer une mise à jour : « Actions » → « Données FFBB » → « Run workflow ».
- Un classement saisi à la main dans `CLASSEMENTS` remplace le classement automatique de l'équipe.
- Le **calendrier des matchs** (`data/matchs-ffbb.json`) couvre de 3 semaines avant à 6 semaines après
  chaque mise à jour, pour toutes les équipes reliées dans `EQUIPES_FFBB`. Les équipes sans numéro à la
  FFBB (U9, micro-basket) n'y sont pas : leurs matchs vont dans `MATCHS_MANUELS`.
- Les **logos des clubs** (matchs et classements) viennent aussi de la FFBB : la même tâche les
  enregistre dans `public/logos/` (liste dans `data/logos-ffbb.json`, à ne pas modifier à la main). Pour
  un match saisi à la main, le logo est retrouvé d'après le nom de l'adversaire : écrivez-le comme à la
  FFBB (« Carquefou Basket 1 », « Erdre 2 »…). Un club inconnu s'affiche avec ses initiales.
- La récupération passe par une bibliothèque communautaire (`ffbb-data-client`), pas par un service
  officiel de la FFBB : si elle cesse de fonctionner, GitHub envoie un e-mail d'échec et le site garde
  simplement les derniers matchs, classements et résultats connus (les matchs peuvent alors être
  ajoutés dans `MATCHS_MANUELS`).

## 4. Les autres mises à jour

- **Agenda** (`AGENDA`) : la date au format `"2026-11-21"` sert au tri ; les dates passées
  disparaissent seules. `lien` (facultatif) rend le titre cliquable, ex. `"/stages"`.
- **Planning** (`SLOTS`) : une ligne = un créneau. Les pages Entraînements, Équipes, Écoles et Infos
  se recalculent automatiquement. Le nom du gymnase doit être écrit comme dans `GYMNASES`.
- **Stages** (`STAGES`, dans l'ordre du calendrier) : ajoutez les semaines dans `semaines`, avec
  `debut` (date du lundi) pour permettre l'inscription à la journée, `fin` (date du dernier jour)
  seulement si la semaine ne finit pas le vendredi (Noël : du lundi au jeudi), et les années de
  naissance acceptées (`nesDe`, `nesA`). Le prix d'une semaine complète dépend de sa durée : une
  ligne par durée dans `STAGE_TARIFS` (`jours: 5`, et `jours: 4` pour Noël) ; quelques jours seulement
  sont facturés à la journée, sans dépasser la semaine complète. Les inscriptions s'ouvrent et se ferment seules :
  celles d'une semaine ferment la veille de son premier jour à midi (le dimanche à midi pour une
  semaine qui commence le lundi). Quand toutes
  les semaines d'une période sont passées, sa carte devient grise « Inscriptions fermées » et la
  période suivante s'ouvre, à condition que ses semaines soient saisies (sinon : « Inscriptions à venir »).
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
bleu nuit). Sans photo, le site affiche un motif aux
couleurs du club (ou les initiales pour un portrait) : rien n'est cassé.

**Mineurs** : ne publiez que les enfants dont l'autorisation de droit à l'image est « Oui »
(visible dans l'Espace dirigeants). Préférez les plans larges, sans nom.

## 6. Les demandes reçues : l'Espace dirigeants

Pied de page → **Espace dirigeants** (adresse `/espace-dirigeants`). On s'y connecte avec le mot
de passe du bureau, défini dans le hPanel Hostinger (variable `ADMIN_PASSWORD`, voir `README.md`).

- Trois onglets de demandes : **Inscriptions** (préinscriptions), **Stages**, **Messages** (formulaire de
  contact) ; plus **Convocations** (matchs à domicile, voir § 3) et **À compléter sur le site**.
- **Adhérents** : la base des licenciés. Déposez (glisser-déposer ou clic) l'export des licences de FBI,
  « exporterLicenceDonnees.xlsx » : il remplace toute la base. Seuls le prénom et le nom, la date de
  qualification, la catégorie et l'e-mail sont conservés (les autres colonnes de l'export ne sont pas
  enregistrées). Recherche par nom ou e-mail, filtre par catégorie. Les colonnes « Entraînement » et
  « Match » se choisissent dans la liste des équipes du club et s'enregistrent aussitôt (bordure verte) ;
  elles sont gardées à part, par nom, et survivent donc au dépôt d'un nouvel export. « Supprimer la base » l'efface ; pensez à la supprimer ou à la
  remplacer en fin de saison.
- Chaque demande a un numéro (`INS-…`, `STA-…`, `MSG-…`), un statut à tenir à jour
  (À traiter, Confirmé, Liste d'attente, Payé, Refusé) et un bouton **Supprimer**.
- **Exporter en CSV** ouvre la liste dans Excel.
- Si l'envoi d'e-mails est configuré (SMTP), chaque demande arrive aussi par e-mail ;
  « Répondre » écrit directement à la famille.
- **Stages** (présentés en tableau) : deux statuts seulement, automatiques et non modifiables à la
  main : « À traiter » à l'arrivée, « Confirmé » une fois l'e-mail envoyé. Une fois le règlement
  reçu, **Confirmer par e-mail** (colonne Confirmation) demande une confirmation, puis envoie le message au
  parent (copie cachée au club, réponses sur l'adresse du club) ; la date d'envoi s'affiche.
  **Renvoyer l'e-mail** permet un nouvel envoi ; **Supprimer** est en fin de ligne. Le texte du message se modifie dans `STAGE_CONFIRMATION` (`data/nbb.ts`).
  L'envoi demande que la messagerie SMTP soit configurée chez Hostinger (voir `README.md`) ; sinon le
  bouton reste grisé.

Les demandes contiennent des données personnelles, souvent de mineurs : supprimez-les une fois
la saison ou le stage terminés (durées dans `MENTIONS`), et ne partagez pas le mot de passe
en dehors du bureau.
