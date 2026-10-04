# Nantes Breil Basket — site web

Site du club de basket Nantes Breil Basket (quartier Breil / Hauts-Pavés, Nantes), construit à
partir de l'export **Claude Design** « Site Nantes Breil Basket » (15 pages, charte bleu nuit /
orange, titres Big Shoulders, texte Instrument Sans, étiquettes JetBrains Mono, lignes de terrain
en filigrane).

- **Stack** : Next.js 16 (App Router, Turbopack), React 19, TypeScript, CSS simple (`app/globals.css`).
- **Contenu** : un seul fichier, `data/nbb.ts`, modifiable sans développeur — voir [`NOTICE.md`](NOTICE.md).
- **Formulaires** (préinscription, stages, contact) : Server Actions ; les demandes sont enregistrées
  et consultables dans l'**Espace dirigeants**, et envoyées par e-mail si un SMTP est configuré.

## Démarrer en local

Prérequis : [Node.js 22.12+](https://nodejs.org) (testé avec Node 24).

```bash
npm install
npm run dev
```

Puis ouvrez <http://localhost:3000>. Les modifications s'affichent en direct.

| Commande | Rôle |
| --- | --- |
| `npm run dev` | serveur de développement |
| `npm run build` | build de production (vérifie aussi les types : à lancer avant de publier) |
| `npm run start` | lance le build de production en local |
| `npm run lint` | vérification ESLint (règles Next.js, accessibilité) |

Pour tester l'Espace dirigeants en local, créez un fichier `.env.local` avec `ADMIN_PASSWORD=…`
(modèle : `.env.example`). En local, les demandes sont enregistrées dans `.donnees/demandes.json`
(ignoré par Git) et les e-mails non configurés s'affichent dans le terminal.

## Pages

| Page | Adresse | Contenu |
| --- | --- | --- |
| Accueil | `/` | bandeau et chiffres clés, accès rapides, écoles, agenda, réseaux, encadrement, bénévolat et partenariat, catégories d'équipes |
| Le club | `/club` | histoire, valeurs et projet, charte, bureau et comité (`#bureau`), commissions (`#commissions`) |
| Écoles | `/ecoles` | école de mini-basket 3 étoiles, samedi matin, cotisation, école d'arbitrage (`#arbitrage`) |
| Équipes | `/equipes` | une fiche par équipe (coachs, créneaux, gymnases), photo agrandissable, classement |
| Entraînements | `/planning` | planning filtrable par équipe / gymnase / jour (`/planning?equipe=U11F1`), impression |
| Matchs | `/matchs` | matchs du week-end à domicile et à l'extérieur, convocations, itinéraires, résultats (après accord) |
| Stages | `/stages` | dates, tarifs, réduction famille, journée type, inscription à la semaine ou à la journée |
| Agenda | `/agenda` | temps forts à venir |
| Infos pratiques | `/infos` | carte (après accord), gymnases et lignes Naolib (`/infos#gym-breil`), règles, FAQ (`#faq`) |
| Inscriptions | `/inscriptions` | étapes, tarifs, documents, PDF, préinscription en 4 étapes |
| Galerie | `/galerie` | albums photos, droit à l'image |
| Partenaires | `/partenaires` | partenaires, partenariat et mécénat, formules |
| Contact | `/contact` | réponses rapides, formulaire (`/contact?sujet=benevolat` présélectionne le sujet), coordonnées |
| Mentions légales | `/mentions-legales` | éditeur, hébergement, données personnelles (`#confidentialite`), cookies (`#cookies`) |
| Espace dirigeants | `/espace-dirigeants` | demandes reçues, statuts, suppression, export CSV (accès par mot de passe, non référencé) |

Les anciennes adresses (`/calendrier`, `/le-club`, `/rejoindre`, `/actualites`…) sont redirigées
vers les nouvelles (`next.config.ts`).

## Structure

```
data/nbb.ts            tout le contenu éditable (textes, planning, matchs, stages, tarifs…)
lib/nbb.ts             calculs à partir du contenu (équipes, gymnases, week-ends…) — serveur uniquement
lib/utils.ts           petites fonctions pures (formats, calcul des stages, cotisation) — aussi côté navigateur
lib/stockage.ts        enregistrement des demandes (Netlify Blobs en ligne, fichier local sinon)
lib/session.ts         connexion à l'Espace dirigeants
lib/email.ts           envoi des e-mails (SMTP)
lib/consentement.ts    choix du visiteur sur les contenus externes (carte, résultats)
app/                   une page par dossier, layout, styles, actions serveur des formulaires
components/            en-tête, pied de page, bandeau cookies, planning, matchs, formulaires…
public/                logo, image de partage, photos (public/photos/), lignes de terrain (public/terrain/)
data/*-ffbb.json       classements, résultats, calendrier des matchs et logos FFBB (générés, ne pas modifier)
public/logos/          logos des clubs (générés, WebP 160 px)
scripts/donnees_ffbb.py récupération de ces données (Python, bibliothèque ffbb-data-client)
.github/workflows/     tâche GitHub quotidienne qui lance ce script et publie les changements
NOTICE.md              mode d'emploi pour les bénévoles
```

Les **classements**, les **résultats**, le **calendrier des matchs** et les **logos des clubs** sont récupérés chaque nuit par GitHub Actions (`donnees-ffbb.yml`), grâce à la
bibliothèque communautaire `ffbb-data-client` (non officielle). En local :
`pip install -r scripts/requirements-ffbb.txt` puis `python scripts/donnees_ffbb.py`.

Le **planning** (`SLOTS`) est la source unique : fiches équipes, filtres, créneaux du samedi,
nombre de créneaux par gymnase en sont calculés.

## Mettre en ligne (Netlify, gratuit)

Le site est hébergé sur **Netlify** : offre gratuite sans carte bancaire, usage commercial
autorisé (partenaires, boutique), Next.js pris en charge sans configuration (pages statiques,
régénération horaire de l'accueil, de l'agenda et des matchs, Server Actions, `next/image`).
Chaque modification enregistrée sur la branche `main` redéploie le site automatiquement ; si la
construction échoue, l'ancienne version reste en ligne.

### Variables d'environnement (Netlify → Project configuration → Environment variables)

| Variable | Obligatoire | Rôle |
| --- | --- | --- |
| `ADMIN_PASSWORD` | oui, pour l'Espace dirigeants | mot de passe du bureau (phrase longue) ; le changer déconnecte tout le monde |
| `ADMIN_SECRET` | non | chaîne aléatoire supplémentaire pour signer la session |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | pour les confirmations de stage | serveur d'envoi des e-mails (Brevo, voir ci-dessous ; Gmail : mot de passe d'application) : transmission des demandes au club et e-mails de confirmation d'inscription au stage envoyés aux parents depuis l'Espace dirigeants |
| `FORM_TO` | avec SMTP | destinataire(s) des messages, séparés par des virgules |
| `FORM_TO_INSCRIPTIONS`, `FORM_TO_STAGES` | non | destinataires des préinscriptions et des stages (sinon `FORM_TO`) |
| `FORM_FROM` | oui avec Brevo | adresse d'expédition (sinon `SMTP_USER`) : avec Brevo, un expéditeur validé du domaine du club (`contact@nbb44.fr`) |

Après avoir ajouté ou modifié une variable, relancez un déploiement (Deploys → Trigger deploy).

### Envoi des e-mails avec Brevo

Le domaine `nbb44.fr` est déjà déclaré dans un compte Brevo (enregistrement `brevo-code` et clé DKIM
`mail._domainkey` dans la zone DNS, chez OVH) : utilisez ce compte plutôt que d'en créer un autre,
sinon il faut refaire la vérification du domaine.

1. Brevo → **Expéditeurs, domaines et IP dédiées** : le domaine `nbb44.fr` doit être « Authentifié »
   (sinon, ajouter chez OVH les enregistrements indiqués par Brevo, sans créer de second SPF) et
   l'expéditeur `contact@nbb44.fr` (« Nantes Breil Basket ») validé.
2. Brevo → **SMTP et API** → onglet **SMTP** : noter l'identifiant SMTP (souvent `…@smtp-brevo.com`)
   et générer une clé SMTP (affichée une seule fois ; ce n'est pas la clé API).
3. Netlify → variables : `SMTP_HOST` = `smtp-relay.brevo.com`, `SMTP_PORT` = `587`,
   `SMTP_USER` = l'identifiant SMTP, `SMTP_PASS` = la clé SMTP, `FORM_FROM` = `contact@nbb44.fr`,
   `FORM_TO` = l'adresse qui reçoit les demandes ; puis redéployer.
4. Tester avec le formulaire de contact, puis **Confirmer par e-mail** sur une inscription au stage faite
   avec votre propre adresse. Les envois apparaissent dans Brevo (Transactionnel → Logs) ; en cas
   d'échec, la raison est dans Netlify (Logs & metrics → Functions).

Netlify n'a pas d'adresse IP fixe : si l'envoi échoue avec « 525 Unauthorized IP address », désactivez le
blocage des adresses IP inconnues dans Brevo (Sécurité → IP autorisées). L'offre gratuite de Brevo
permet 300 e-mails par jour.

### Où vont les demandes ?

Les demandes des formulaires sont enregistrées dans **Netlify Blobs** (stockage inclus dans
Netlify, données hébergées dans l'Union européenne, à Francfort) et consultées dans l'Espace
dirigeants. Sans SMTP, rien n'est envoyé par e-mail mais rien n'est perdu. En cas d'échec des deux,
le visiteur est invité à écrire directement par e-mail ou WhatsApp.

### Nom de domaine

Pour brancher `nantes-breil-basket.fr` : réglages du projet → Domain management. Vérifiez
`CLUB.siteUrl` dans `data/nbb.ts` (référencement, aperçus de partage, plan du site).

## Choix techniques

- **Fidélité à la maquette** : couleurs, typographies, espacements, rayons et composants de l'export
  Claude Design sont repris dans `app/globals.css` (variables sous `:root`). Sans photo fournie, un
  motif aux couleurs du club (ou des initiales) s'affiche à la place (`components/Photo.tsx`).
- **RGPD** : polices auto-hébergées (aucune requête vers Google pour les visiteurs), aucun cookie
  publicitaire ni outil de mesure d'audience ; carte Google Maps et widget de résultats chargés
  uniquement après accord (bandeau, choix conservé 6 mois, « Gérer les cookies » en pied de page).
  La maquette prévoyait une option « mesure d'audience » : aucun outil de ce type n'étant installé,
  elle n'est pas proposée.
- **Sécurité** : Espace dirigeants protégé par mot de passe (cookie signé, `httpOnly`, 12 h), non
  indexé ; formulaires validés côté serveur, anti-spam sans service tiers (champ piège, délai
  minimal, question anti-robot pour le contact) ; export CSV protégé contre les formules Excel.
- **Accessibilité** : textes orange sur fond clair en caramel (`--orange-texte`, contraste AA), orange vif réservé aux fonds sombres ; lien d'évitement, navigation clavier, fenêtres modales natives (`<dialog>` :
  focus conservé, Échap), erreurs reliées aux champs, textes alternatifs, animations désactivées
  si l'utilisateur le demande (`prefers-reduced-motion`).
- **Référencement local** : titres et descriptions par page, adresses canoniques, `sitemap.xml`,
  `robots.txt`, données structurées `SportsClub` (schema.org), image de partage, manifeste.
- **Animations** : discrètes et utiles — en-tête de page qui se pose dans l'ordre de lecture, blocs
  éditoriaux qui apparaissent à chaque entrée dans l'écran, en descendant comme en remontant (légère cascade dans une rangée),
  photos qui « respirent » au survol des cartes cliquables, flèches qui avancent d'un cran, FAQ qui se
  déplie, fondu court quand un filtre met à jour une liste, montant du stage qui signale son changement,
  fenêtres et bandeau cookies qui entrent en douceur, en-tête qui se détache au défilement. Tout est
  regroupé à la fin de `app/globals.css` (+ `components/Apparitions.tsx`) et désactivé si le visiteur a
  demandé moins d'animations ; sans JavaScript, rien n'est masqué.
- **Robustesse** : filtres du planning gardés dans l'adresse (liens partageables) ; sans
  JavaScript, le planning complet reste affiché.
