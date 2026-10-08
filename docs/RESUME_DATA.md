# Resume data sheet

Purpose: collect every fact needed to build the owner's resume (CV) for internships and jobs, then
let Claude generate it. **Only the section "Verified facts" is known. Everything else is empty on
purpose: do not invent anything, ask the owner.**

The owner speaks French. Ask which resume language(s) to produce (French and/or English).

## How to use

Give this file and `HANDOFF.md` to Claude and say:
"Interview me section by section to fill `docs/RESUME_DATA.md` (one section at a time, short questions,
propose wording for my bullets). When it is complete, build my resume: 1 page, reverse chronological,
quantified bullets, simple ATS-friendly layout, as PDF or DOCX, in the language(s) I picked."

## Verified facts (the only ones)

- GitHub account that owns the portfolio repo: `SkYNENET` (public handle).
- Roblox game: **Search For The Egg**, https://www.roblox.com/games/93487925421293 (place id 93487925421293).
  Public stats read on 2026-10-08: 9,275 visits, 169 favorites, 49 likes and 16 dislikes.
  To confirm with the owner: their role (solo dev? team? scripter/builder/designer?), launch date, tech.
- The portfolio itself (React + TypeScript + Vite, Vercel, serverless function for live Roblox stats)
  is a project the owner can list. See `HANDOFF.md`.

## 1. Identity and contact (to fill)

Full name / public name:
City, country / willing to relocate or remote:
Email to put on the resume (never use a private one without asking):
Phone (optional, only if the owner wants it on the resume):
LinkedIn / GitHub / portfolio URL (the portfolio will have its own domain later):
Photo on the resume? (common in France, not in the US):

## 2. Target

Type: internship / apprenticeship / junior job:
Field: Roblox / game dev, full stack web, other:
Duration and start date (the owner wants an internship next year):
Location / remote:
Companies or kinds of companies targeted:

## 3. Education (to fill)

School, program, years, current level:
Relevant courses and modules:
Grades or ranking (optional):

## 4. Work experience and internships (to fill, one block per experience)

- Company / client, city:
- Role / title, dates (month-year), full-time or part-time:
- Context: what the company does, team size:
- Missions (3 to 5 bullets, each: action verb + what + result with a number):
- Tech and tools:
- Proof / link / referee (optional):

Include: internships, freelance and commissions (Roblox commissions count), jobs, volunteering, community
management, moderating, running a Discord or a Roblox group.

## 5. Projects (to fill)

Roblox games and maps (for each: name, link, place id, role, dates, team, tech such as Luau, DataStore,
client/server architecture, anti-cheat, monetisation; public metrics like visits, peak players,
favorites, likes, which the portfolio can fetch live):
School projects (name, language, what it does, what was hard, repo link):
Web / full stack projects (name, stack, features, link, repo):
Open source or hackathons:

## 6. Skills (to fill)

Languages (Luau, TypeScript, C, Python, ...), only what the owner is honest about, with a level:
Frameworks and libraries:
Databases and backend:
Tools (Git, Linux, Roblox Studio, Figma, ...):
Soft skills with a real example each:

## 7. Other (to fill)

Spoken languages and level:
Certifications and awards:
Associations, volunteering, community leadership:
Interests (short, relevant):

## 8. Rules for the Claude building the resume

- Never invent or inflate facts. If a number is missing, ask. Mark guesses as "to confirm".
- Quantify (visits, players, users, lines of code, team size, duration) only with real numbers.
- One page, clear hierarchy, no tables for layout, no icons that break ATS parsing.
- No phone number or home address unless the owner explicitly asks for it.
- Tailor a version per target (Roblox studio vs web company) from the same data.
