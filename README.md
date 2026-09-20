# Nantes Breil Basket – site web

Site du club, construit avec **Next.js (App Router)**, **React** et **TypeScript**.
Charte graphique reprise de la page « Planning des entraînements » (bleu marine + orange du logo).

## Démarrer

Prérequis : [Node.js 20+](https://nodejs.org), [Git](https://git-scm.com) et [VS Code](https://code.visualstudio.com).

```bash
npm install
npm run dev
```

Ouvrez <http://localhost:3000>. Les modifications s’affichent en direct.

## Où modifier quoi ?

| Je veux…                                   | Fichier                    |
| ------------------------------------------ | -------------------------- |
| Changer le planning (créneaux, coachs…)    | `data/planning.ts`         |
| Renseigner e-mail, téléphone, réseaux…     | `data/club.ts`             |
| Modifier les couleurs / le style           | `app/globals.css` (`:root`) |
| Ajouter une page au menu                   | `data/club.ts` (`NAV_LINKS`) + `app/<nom>/page.tsx` |
| Remplacer le logo                          | `public/logo.png` et `app/icon.png` |

Le planning est la **source unique** : la page Planning, la page Équipes, la liste des gymnases et
les chiffres de l’accueil sont tous calculés à partir de `data/planning.ts`.

## Structure

```
app/            pages (accueil, planning, équipes, contact) + styles globaux
components/     Header, Footer, PageHero, PlanningExplorer (filtres interactifs)
data/           contenu éditable : planning et infos du club
lib/            fonctions utilitaires (tri, catégories, statistiques)
public/         logo
```

## Mettre en ligne (gratuit)

1. Poussez le code sur GitHub.
2. Sur <https://vercel.com>, « Add New… > Project », choisissez le dépôt, puis « Deploy ».
3. Chaque `git push` sur `main` redéploie automatiquement le site.

## Commandes utiles

```bash
npm run dev     # serveur de développement
npm run build   # build de production (à lancer avant de publier pour détecter les erreurs)
npm run start   # lance le build de production en local
```
