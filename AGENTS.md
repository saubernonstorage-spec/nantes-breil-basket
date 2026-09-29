<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Site du Nantes Breil Basket — repères pour les agents

- Site en français, maintenu par des bénévoles, fidèle à l'export Claude Design « Site Nantes Breil Basket ».
  Tout le contenu (listes, chiffres, dates, tarifs, noms, liens, photos) est dans `data/nbb.ts` ; toute
  nouvelle information éditable y va aussi (jamais en dur dans une page), et `NOTICE.md` est mis à jour.
  Les pages ne gardent que les textes fixes de la maquette (titres, paragraphes).
- Ne jamais inventer de tarif, de score, de date ni de nom : laisser `[À COMPLÉTER]`.
- Le planning (`SLOTS`) est la source unique ; équipes, gymnases, week-ends et chiffres sont calculés dans
  `lib/nbb.ts` (réservé au serveur, `import "server-only"`). Les composants client reçoivent les données en
  props et n'importent que `lib/utils.ts` (fonctions pures), `lib/formulaires.ts`, `lib/consentement.ts`
  et des types (`import type`).
- Styles : `app/globals.css` (variables de la charte sous `:root`, une section par page). Texte orange sur fond clair :
  `--orange-texte` (caramel, contraste AA) ; l'orange vif `--orange` est réservé aux fonds sombres, boutons et aplats
  (liste des blocs sombres dans la règle `:is(...) .surtitre`). Les pages
  intérieures commencent par `EntetePage` (`components/Page.tsx`), qui remonte sous l'en-tête collant.
- Photos : `components/Photo.tsx` (next/image, motif de remplacement si le chemin est vide) ; lignes de
  terrain décoratives : `components/Terrain.tsx`. Fenêtres modales : `components/Fenetre.tsx` (`<dialog>`).
- Formulaires : Server Actions dans `app/actions.ts` (validation serveur, anti-spam), enregistrement dans
  `lib/stockage.ts` (Netlify Blobs, région UE ; fichier `.donnees/` en local) et e-mail facultatif
  (`lib/email.ts`). Espace dirigeants : `app/espace-dirigeants/` + `lib/session.ts` (`ADMIN_PASSWORD`).
  Variables documentées dans `.env.example`.
- Contenus tiers (carte Google Maps, widget de résultats) seulement après consentement :
  `ContenuConsenti` dans `components/Cookies.tsx`. Aucun outil de mesure d'audience.
- Animations : tout le mouvement est regroupé à la fin de `app/globals.css` (section « Animations et
  micro-interactions »), sous `@media (prefers-reduced-motion: no-preference)`. Chaque effet doit servir
  (arrivée d'un contenu, lien cliquable, action confirmée, contenu mis à jour) : court, discret, jamais en
  boucle. Apparition au défilement : `components/Apparitions.tsx` (liste `CIBLES`, contenu éditorial
  seulement ; pas les listes utilitaires) — sans JavaScript ni animation demandée, rien n'est masqué.
  Parallaxe et en-tête au défilement en CSS (`animation-timeline`). Les animations utilisent
  `translate`/`scale`/`opacity` ; `transform` est réservé au survol et au placement des motifs de terrain.
  Flèches animées : `<span className="fleche fleche--bas|diag|gauche" aria-hidden="true">`.
- Avant de livrer : `npm run lint` puis `npm run build`.
