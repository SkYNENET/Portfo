# Portfolio: full handoff

Everything needed to continue this project from another machine, another GitHub account or another
Claude. Written 2026-10-08. Nothing in here is secret: there are no API keys, tokens or env vars.

## 1. What this is

A personal portfolio for a **Roblox developer and full stack developer** (student, looking for an
internship next year). The owner speaks French, the **site is in English**.

Concept: the site looks like a **game library / launcher** (think Steam or a game launcher):
- left sidebar (profile + Home / Games / Maps / Web filters),
- big featured banner with a Play button,
- grid of portrait cover cards, every card is a clickable link to the real Roblox game, map or project,
- right rail with **live Roblox stats**, **communities** (Discord / Roblox groups, Join buttons), About, Contact.

Visitors must be able to see every game, map and community the owner created, and click through.

## 2. Quick start

Needs Node 22+.

```bash
git clone -b claude/confident-gauss-xseto1 https://github.com/SkYNENET/Portfolio.git
cd Portfolio
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build (must pass)
npm run lint       # oxlint
```

Or unzip `portfolio-handoff.zip` (same files, no git history) and run the same commands.
To own the repo: create a new GitHub repo, then `git init && git add -A && git commit && git push`.

## 3. Stack and layout

React 19 + TypeScript + Vite 8, plain CSS, `framer-motion` and `lucide-react` are installed but
currently unused. Hosting: Vercel (Hobby, free). No backend besides one serverless function.

```
api/roblox.ts        Vercel serverless function: public Roblox stats (see section 5)
src/content.ts       ALL copy and data: profile, entries (games/maps/web), communities
src/App.tsx          the whole UI (sidebar, banner, grid, right rail)
src/App.css          layout + components; src/index.css = tokens (colors, radius, shadow)
src/roblox.ts        useRoblox() hook + number formatting
docs/DEPLOY.md       domain (OVHcloud) + Vercel + DNS guide, in French
docs/inspiration/    the 3 reference screenshots from the owner (Pinterest)
public/              static files (put covers in public/covers/, CV as public/cv.pdf)
```

Editing content: change `src/content.ts` only. Entry fields: `name, kind (game|map|web), tagline, link,
tone [gradient colors], cover? (image path), meta?, placeId? (Roblox), featured?`. Community fields:
`name, platform, members?, groupId? (Roblox group), link, tone`.

## 4. Design decisions (from the owner)

- "Very very classic, a bit Apple-like", white or light grey background, readable black text.
- Reuse a bit of the **Roblox widget** look for style (cover cards, player counts, green live dot, Play button).
- Layout like a **game library** (Steam / launcher), with clickable links to the owner's games.
- Earlier idea, replaced: a pure white single column of black text. Still a good fallback.
- References in `docs/inspiration/`:
  1. dark bento-grid wireframe (one big card left, several smaller cards right),
  2. a game library page: grid of portrait covers, filter and search, pagination,
  3. a launcher app: left sidebar, big hero banner, "resume my games" row, friends list on the right.
- Currently implemented: tokens `--bg #f5f5f7`, white cards, radius 20px, Inter font, no dark mode.
- Not done yet: real covers, hover details, a modal or page per game, animations, a dark mode.

## 5. Live Roblox stats (verified working)

Browsers cannot call Roblox directly (no CORS), so the page calls `/api/roblox?places=ID,ID&groups=ID`
and `api/roblox.ts` fetches Roblox's public APIs server-side, cached 5 minutes at the edge:
- `apis.roblox.com/universes/v1/places/{placeId}/universe` (place id to universe id)
- `games.roblox.com/v1/games` (playing, visits, favorites), `.../games/votes` (likes, dislikes)
- `thumbnails.roblox.com/v1/games/icons` (cover image), `groups.roblox.com/v1/groups/{id}` (members)

Only fixed endpoints and numeric IDs are used (not an open proxy). If Roblox fails, the page silently
falls back to the static text in `content.ts`.

**Verified on 2026-10-08** from a Vercel preview: place `93487925421293` is "Search For The Egg"
(9,275 visits, 169 favorites, 49 up and 16 down votes, 0 playing at that moment).

How to add a game: take the number in `roblox.com/games/<placeId>/Name`, put it in `placeId`, set `link`.
How to add a community: the number in `roblox.com/communities/<groupId>/Name` goes in `groupId`.

Limits:
- Public data only. Revenue, retention and daily active users are not public. They would need a
  Roblox Creator Hub Open Cloud API key, stored as a Vercel environment variable (never in the repo,
  never in a chat). The owner probably does not want revenue shown publicly anyway.
- `npm run dev` does not run `api/` so stats are absent locally. Test on a Vercel preview (or `npx vercel dev`).
- No Roblox MCP connector exists in the owner's Claude account; none is needed.

## 6. Deployment

- Vercel project `portfolio`, connected to the GitHub repo. Every push to a branch gets a preview URL
  (the branch alias is stable: `portfolio-git-<branch>-<team>.vercel.app`).
- Production branch is `main`. **The work lives on `claude/confident-gauss-xseto1`, not merged yet.**
- Previews are behind Vercel Authentication: only the logged-in owner sees them. To share a link,
  turn it off in Project Settings, Deployment Protection (ask the owner first).
- To recreate under another account: vercel.com/new, import the repo, framework "Vite" (auto-detected),
  no env vars, Deploy. The `api/` folder is picked up automatically.
- Domain: buy at OVHcloud (domain only, no hosting needed), add it in Vercel, set DNS. Full steps and
  price research (some prices unverified) in `docs/DEPLOY.md`. Vercel Hobby is non-commercial use only.

## 7. Status and TODO (in order)

Done: Vite + React scaffold, library UI (responsive, checked at 1440px and 390px), live stats pipeline,
Vercel project with automatic preview deploys, domain/hosting research.

Placeholder content still to replace in `src/content.ts`:
1. `profile`: real name, email, GitHub URL, bio, status line, CV file at `public/cv.pdf`.
2. Entry 1 is a real game ("Search For The Egg"): it needs a one-line tagline. The other 6 entries
   and 3 communities are fake placeholders (names, links, colors).
3. Real games / maps / web projects: names, `placeId`, links, category, one-line pitch.
4. Communities: Discord links and Roblox group ids.
5. Covers: optional custom art in `public/covers/` (otherwise the Roblox icon is used).

Product ideas, not started: a detail modal per game (screenshots, role, tech), sort by players or
visits, "currently playing" sorting, an experience/education section, contact form (mailto or Formspree),
SEO / OpenGraph image, favicon, analytics, custom domain.

## 8. Resume (CV) for future internships

No data about internships, jobs or school projects exists yet: the owner never provided it, and the old
site's content was deliberately dropped (the owner said it was an unrelated school project, so it may
not even be theirs). `docs/RESUME_DATA.md` is the fill-in sheet plus the rules; start the next session by
having Claude interview the owner with it, then generate the resume (PDF/DOCX, FR and/or EN).
The portfolio can later get a `/resume` section fed by the same data.

## 9. Things to know

- **Privacy:** the GitHub repo is public. Its `main` branch still holds an OLD school-project site that
  contains a phone number and school email, and old commits keep it in history. The owner asked to drop
  that project. Cleaning `main` and the history (force-push or a fresh repo) was NOT done. Do not
  reintroduce personal data. The zip in this handoff has no history for that reason.
- The owner's old Roblox games from that old site were deliberately not reused. Ask which games to show.
- The Claude cloud sandbox used so far blocks roblox.com. Real tests go through Vercel.
- The Claude in Chrome extension was not reachable from that sandbox.

## 10. Prompts for the next Claude

> Read `CLAUDE.md` and `HANDOFF.md` in this repo, then `src/content.ts`, `src/App.tsx`, `src/App.css`.
> Run `npm install && npm run dev`. Keep the English UI and the clean Apple-like game-library style.
> Ask me for the real games, maps, communities and Roblox IDs, put them in `src/content.ts`, and show me
> screenshots after each change (`npm run build` and `npm run lint` must pass before you commit).

For the resume, a separate session:

> Read `HANDOFF.md` and `docs/RESUME_DATA.md`. Interview me one section at a time (in French) to fill it:
> education, internships, jobs, projects, skills. Never invent facts. Then build my resume, 1 page, ATS-friendly,
> as PDF or DOCX, in French and English.
