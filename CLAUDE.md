# Portfolio: project guide for Claude

Personal portfolio of a Roblox + full stack developer (student, looking for an internship).
**Read `HANDOFF.md` first**: it has the full state, decisions, deployment and TODO list.
For the resume/CV work, use `docs/RESUME_DATA.md` (empty on purpose: interview the owner, never invent).

## Rules
- All visible UI text is in **English** (the owner talks to you in French).
- Style: very clean, classic, Apple-like. Light grey page (`--bg`), white cards, soft shadows,
  black text, no dark mode, no heavy effects. A Roblox-widget / game-launcher feel
  (cover cards, player counts, "Play" buttons). References: `docs/inspiration/`.
- All copy and data live in `src/content.ts`. Do not hard-code text in components.
- Never put personal data (phone number, private email) or secrets in the repo.
- Keep it small: React + TypeScript + plain CSS. No UI framework.

## Commands
- `npm install`, `npm run dev` (http://localhost:5173), `npm run build`, `npm run lint`
- Roblox stats come from `api/roblox.ts` (Vercel function). `vite dev` does not run it, so locally
  the page shows the static text; test stats on a Vercel preview.
