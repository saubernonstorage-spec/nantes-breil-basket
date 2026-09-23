<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Site du Nantes Breil Basket — repères pour les agents

- Site en français, maintenu par des bénévoles. Tout le contenu est dans `data/nbb.ts` ; toute
  nouvelle information éditable y va aussi (jamais en dur dans une page), et `NOTICE.md` est mis à jour.
- Ne jamais inventer de tarif, de score, de date ni de nom : laisser `[À COMPLÉTER]`.
- Le planning (`SLOTS`) est la source unique ; équipes, gymnases et chiffres sont calculés dans `lib/nbb.ts`
  (réservé au serveur). Les composants client reçoivent les données en props et n'importent que `lib/utils.ts`.
- Styles : `app/globals.css` (variables de la charte sous `:root`), fidèles à la maquette Claude Design.
- Formulaires : Server Actions dans `app/actions.ts`, envoi SMTP dans `lib/email.ts` (variables dans `.env.example`).
- Contenus tiers (Score'n'co) seulement après consentement : `components/EmbedConsenti.tsx`.
- Animations : tout le mouvement est regroupé à la fin de `app/globals.css`, sous
  `@media (prefers-reduced-motion: no-preference)`. Apparitions et parallaxes en CSS pur
  (`animation-timeline`, aucun script, aucun bloc caché si le navigateur ne gère pas) ; seuls les effets
  qui suivent la souris passent par `components/EffetsPointeur.tsx` (classe `curseur` + `--px`/`--py`).
  Les animations utilisent `translate`/`scale`, jamais `transform`, réservé au survol.
- Avant de livrer : `npm run lint` puis `npm run build`.
