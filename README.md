# Nantes Breil Basket — site web

Site du club de basket Nantes Breil Basket (quartier Breil / Hauts-Pavés, Nantes), construit
à partir de la maquette **Claude Design** « Site NBB » (12 pages, charte bleu nuit / orange,
titres Anton, texte Barlow).

- **Stack** : Next.js 16 (App Router, Turbopack), React 19, TypeScript, CSS simple (`app/globals.css`).
- **Toutes les pages sont statiques** : rapides, bien référencées, hébergeables gratuitement.
- **Contenu** : un seul fichier, `data/nbb.ts`, modifiable sans développeur — voir [`NOTICE.md`](NOTICE.md).

## Démarrer en local

Prérequis : [Node.js 20.9+](https://nodejs.org) (testé avec Node 24).

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

## Pages

| Page | Adresse | Contenu |
| --- | --- | --- |
| Accueil | `/` | accroche, chiffres clés, accès rapides (créneau, gymnases, boutique), actus, agenda, école de basket, école d'arbitrage, équipes, partenaires |
| Le club | `/club` | histoire, valeurs, projet associatif, encadrement, bureau, commissions |
| Équipes | `/equipes` | une fiche par équipe (encadrement, créneaux, gymnase), filtre par catégorie |
| Planning | `/planning` | planning filtrable par équipe / gymnase / jour (`/planning?equipe=U11F1`) |
| Calendrier | `/calendrier` | convocations, widget Score'n'co (après consentement), classements, lien FFBB |
| Inscriptions | `/inscriptions` | étapes, tarifs, documents, aides, FAQ |
| Stages | `/stages` | périodes, tarifs, journée type, formulaire d'inscription |
| Galerie | `/galerie` | albums photos, droit à l'image |
| Partenaires | `/partenaires` | partenaires, offre de partenariat |
| Infos pratiques | `/infos` | carte OpenStreetMap, fiches gymnases (`/infos?gym=Breil`), règles, FAQ |
| Contact | `/contact` | formulaire (`/contact?sujet=benevolat` présélectionne le sujet), coordonnées, réseaux |
| Mentions légales | `/mentions-legales` | éditeur, hébergement, données personnelles, cookies, droit à l'image |

Les anciennes adresses du précédent projet (`/le-club`, `/rejoindre`, `/confidentialite`…)
sont redirigées vers les nouvelles (`next.config.ts`).

## Structure

```
data/nbb.ts          tout le contenu éditable (textes, planning, stages, tarifs…)
lib/                 calculs à partir du contenu (équipes, gymnases…), SEO, e-mail, consentement
app/                 une page par dossier, layout, styles (globals.css), actions serveur des formulaires
components/          en-tête, pied de page, planning filtrable, formulaires, bandeau cookies…
public/              logo, image de partage (og-image.png), photos du club (public/photos/)
NOTICE.md            mode d'emploi pour les bénévoles
```

Le **planning** (`SLOTS`) est la source unique : fiches équipes, filtres, liste des gymnases et
chiffres de l'accueil en sont calculés (`lib/nbb.ts`).

## Mettre en ligne (Netlify, gratuit)

Le site est prévu pour **Netlify** : offre gratuite sans carte bancaire, **usage commercial
autorisé** (partenaires, lien boutique), et prise en charge de Next.js sans configuration
(adaptateur OpenNext : pages statiques, Server Actions, `next/image`). L'offre gratuite de Vercel
est, elle, réservée à un usage non commercial.

1. Sur <https://app.netlify.com> : « Add new project → Import an existing project → GitHub »,
   choisissez le dépôt `nantes-breil-basket`, branche `main`. Netlify détecte Next.js tout seul
   (commande `npm run build`), puis « Deploy ».
2. Ajoutez les variables d'environnement de l'envoi des formulaires (ci-dessous), puis redéployez.
3. Branchez le nom de domaine `nantes-breil-basket.fr` (réglages du projet → Domain management) et
   vérifiez `CLUB.siteUrl` dans `data/nbb.ts` (sert au référencement et aux aperçus de partage).

Chaque modification enregistrée sur la branche `main` (par exemple via l'éditeur de GitHub, comme
décrit dans `NOTICE.md`) redéploie automatiquement le site. Si la construction échoue, l'ancienne
version reste en ligne et l'onglet « Deploys » de Netlify affiche l'erreur. En cas de dépassement
des quotas gratuits, Netlify suspend le site jusqu'à la fin du mois, sans jamais facturer.

## Envoi des formulaires (contact et stages)

Les formulaires sont traités par des **Server Actions** (`app/actions.ts`) : validation côté
serveur, protection anti-spam (champ piège invisible + délai minimal de saisie, sans cookie ni
service tiers) puis envoi d'un e-mail par **SMTP** (`lib/email.ts`, avec nodemailer).
« Répondre » dans la messagerie du club répond directement à la famille.

Variables à définir dans Netlify (réglages du projet → Environment variables), modèle dans
`.env.example` :

| Variable | Exemple | Rôle |
| --- | --- | --- |
| `SMTP_HOST` | `smtp.gmail.com`, `ssl0.ovh.net` | serveur d'envoi de la messagerie du club |
| `SMTP_PORT` | `465` ou `587` | port (465 = SSL) |
| `SMTP_USER` | `site@votre-domaine.fr` | compte utilisé pour envoyer |
| `SMTP_PASS` | — | mot de passe (Gmail : « mot de passe d'application ») |
| `FORM_TO` | `bureau@votre-domaine.fr` | destinataire(s) des messages, séparés par des virgules |
| `FORM_TO_STAGES` | `stages@votre-domaine.fr` | facultatif : destinataire des inscriptions aux stages |
| `FORM_FROM` | `site@votre-domaine.fr` | facultatif : adresse d'expédition (par défaut `SMTP_USER`) |

Sans ces variables : en local, le message s'affiche dans le terminal (pour tester) ; en
production, le visiteur est invité à écrire directement par e-mail ou WhatsApp.

## Choix techniques

- **Fidélité à la maquette** : couleurs, typographies, espacements et composants de l'export Claude
  Design sont repris dans `app/globals.css` (variables sous `:root`). Les emplacements photo rayés
  s'affichent tant qu'aucune photo n'est fournie (`components/Photo.tsx`).
- **RGPD** : polices auto-hébergées (aucune requête vers Google pour les visiteurs), aucun cookie
  publicitaire ni outil de mesure d'audience, widget Score'n'co chargé uniquement après accord
  (bandeau + lien « Gérer les cookies », choix conservé 6 mois), carte OpenStreetMap.
- **Accessibilité** : lien d'évitement, navigation clavier (menu mobile fermé par Échap), focus
  visibles, libellés et messages d'erreur reliés aux champs, textes alternatifs, contrastes de la
  charte, animations désactivées si l'utilisateur le demande (`prefers-reduced-motion`).
- **Référencement local** : titres et descriptions par page, adresses canoniques, plan du site
  (`/sitemap.xml`), `robots.txt`, données structurées `SportsClub` (schema.org), image de partage
  (`public/og-image.png`), manifeste pour l'ajout à l'écran d'accueil du téléphone.
- **Robustesse** : filtres du planning et des gymnases gardés dans l'adresse (liens partageables) ;
  sans JavaScript, le planning complet et tous les gymnases restent affichés.
