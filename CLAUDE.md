# Portfolio: project guide for Claude

Personal portfolio of Hector, a Roblox + full stack developer (student, looking for an internship in 2027).
Roblox `Vbrut0x`, GitHub `SkYNENET`. **Read `HANDOFF.md` first**: it has the full state, decisions, deployment
and the list of what to ask the owner. For the resume, use `docs/resume/` (the kit) and `docs/RESUME_DATA.md`
(verified facts plus the fill-in sheet): interview the owner, never invent.

## Rules
- All visible UI text is in **English**, first person singular (the site speaks as Hector). The owner talks to
  you in French; code comments are in French, short, and say why.
- Style: very clean, classic, Apple-like. Light grey page (`--bg`), white cards, soft shadows, black text,
  no dark mode, no heavy effects, system fonts (no third-party request). A game-launcher feel (cover tiles,
  player counts, "Play" button). References: `docs/inspiration/`.
- All copy and data live in `src/content.ts`. It is a **pure data module** (no import, no DOM): `api/roblox.ts`
  imports it server-side to know which place and group IDs to serve. Do not hard-code text in components.
- Never invent a fact about Hector. An unknown field stays `''` or absent in `content.ts`, with the question in a
  comment. **Never "TO CONFIRM" on screen**: every uncertain field goes through `known()` (`src/ui.tsx`), which
  hides an empty or TO CONFIRM value.
- `playing` is displayed only when it is > 0: never "0 playing", never a grey dot. Static figures from
  `content.ts` render on first paint and are replaced **in place** by the live values (no layout shift); a live
  aggregate at 0 keeps the static value.
- One `h1` (Hero). Rail panels are `h2.panel-title`. External links go through `<Ext>` (new tab, screen-reader
  mention).
- `src/index.css` (tokens, primitives), `src/ui.tsx` (helpers, `<Ext>`, `<Skel>`) and `src/roblox.ts` (hook,
  formatting) are shared. Each component has its own `src/components/X.css`; nothing is added to `index.css`.
- Never put personal data (phone number, private email, home address) or secrets in the repo: it will be public.
- Keep it small: React + TypeScript + Vite, plain CSS. No UI framework.

## Commands
- `npm run dev` (http://localhost:5173). `vite dev` serves `/api/roblox` through the middleware in
  `vite.config.ts`, which runs the real `api/roblox.ts` (Roblox is reachable from the Mac). Add
  `?mock=ready|slow|error|partial` to the page URL to serve `dev/roblox-fixture.json` instead and prove each
  state without network (and without Roblox 429s).
- Checks, all must pass before a commit:
  - `npx tsc -p tsconfig.app.json --noEmit` (src)
  - `npx tsc -p tsconfig.api.json --noEmit` (api + src/content.ts)
  - `npx tsc -p tsconfig.node.json --noEmit` (vite.config.ts)
  - `npm run lint` (oxlint with `.oxlintrc.json`: correctness errors block, other categories only warn)
- `npm run build` (`tsc -b && vite build`) is what Vercel runs. `npm run preview` serves that build.
- Data: `python3 docs/data/fetch_roblox.py` refreshes `docs/data/roblox.json`; then update the figures in
  `src/content.ts` by hand (see `docs/data/README.md`).
- Resume: `python3 docs/resume/build.py` (draft) and `--final` (see `docs/resume/README.md`).

## Workflow agents (subagents, scripts)
Forbidden: `npm install` / `npm ci` / `npm update`, `npx` with a package that is not installed (it downloads),
`rm -rf`, `rsync --delete`, `mv` or `cp` onto repo paths, production builds or deploys, and touching
`package.json`, `package-lock.json` or `node_modules`. An agent edits only the files of its task and verifies
with the commands above. Commit only when asked, never directly on `main`.
