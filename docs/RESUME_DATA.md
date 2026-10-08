# Resume data sheet

Purpose: collect every fact needed to build the owner's resume (CV) for internships and jobs, then
let Claude generate it. **Only the section "Verified facts" is known. Everything else is empty on
purpose: do not invent anything, ask the owner.**

The owner (Hector) speaks French. Ask which resume language(s) to produce (French and/or English).

## How to use

The resume kit lives in `docs/resume/`: `resume.data.json` (the data, `"TO CONFIRM"` where unknown),
`QUESTIONS.md` (the interview, section by section, in French), `build.py` (JSON + template to HTML and PDF).
The verified facts below are already in `resume.data.json`; the fill-in sections 1 to 8 are the same questions
as `QUESTIONS.md`, kept here so a reader of this file alone knows what is missing.

Give this file and `HANDOFF.md` to Claude and say:
"Interview me section by section to fill `docs/RESUME_DATA.md` (one section at a time, short questions,
propose wording for my bullets). When it is complete, build my resume: 1 page, reverse chronological,
quantified bullets, simple ATS-friendly layout, as PDF or DOCX, in the language(s) I picked."

## Verified facts (the only ones)

Sources: `docs/data/roblox.json` (public Roblox APIs, collected 2026-10-08 with `docs/data/fetch_roblox.py`)
and the public GitHub profile `SkYNENET` (read 2026-10-08). The same figures are in `src/content.ts`.
Anything marked TO CONFIRM here is unknown and must be asked.

### Account

- First name: Hector (given by his friend, the owner of this machine). Last name, school, year, city: TO CONFIRM.
- Roblox: `@Vbrut0x`, user id 7893763634, https://www.roblox.com/users/7893763634/profile.
  Account created 2025-01-20. 1,035 followers, 46 friends, 4 following. Retired Roblox badges: Homestead,
  Bricksmith, Friendship.
- 26 public experiences in total (own account plus the groups where he holds a rank): 56,914 visits and
  530 favorites combined. Only the 8 games below are shown on the portfolio (56,068 visits, all 530 favorites);
  the other 18 are tests, prototypes, duplicates or an off-topic quiz and are never displayed (named list at
  the top of `src/content.ts`).
- GitHub: `SkYNENET`, https://github.com/SkYNENET, 11 public repositories.

### The 8 Roblox games (sorted by visits, figures of 2026-10-08)

| Game | Place id | Published by | Created | Visits | Favorites | Likes / dislikes |
|---|---|---|---|---|---|---|
| Monster Mayhem | 136890726201326 | OG Game 2017 (his group) | 2026-02-03 | 16,721 | 267 | 219 / 8 (96%) |
| Escape Knockout for Speed | 113866436980344 | Hyper \| Games (his group) | 2026-02-03 | 10,164 | 25 | 33 / 18 |
| Search For The Egg | 93487925421293 | Chill Games fr (his group) | 2026-09-20 | 9,275 | 169 | 49 / 16 |
| Don't Eat Poisoned Slime | 125815079895321 | AVortexGame (co-owned) | 2026-03-08 | 7,004 | 18 | 13 / 3 |
| Salle Ancienne Rush | 123100983531502 | his own account | 2025-01-22 | 4,468 | 20 | 46 / 4 (92%) |
| Room Rush | 82734020430701 | Hyper \| Games (his group) | 2025-04-04 | 4,151 | 17 | 25 / 4 |
| Run For Dinosaurs | 75594318823554 | Hyper \| Games (his group) | 2026-03-04 | 2,621 | 7 | 10 / 1 |
| Lucky Block Factory (Roblox title "[UPD] Lucky Block Factory") | 88367844931035 | Lucky Block Factory Group (his group) | 2026-04-10 | 1,664 | 7 | 15 / 3 |

Game link = `https://www.roblox.com/games/<place id>`. Notes from the public descriptions:
- Monster Mayhem: unofficial remake of the old Godzilla Simulator, still labelled beta test.
- Escape Knockout for Speed: no public description on Roblox, genre unknown (TO CONFIRM, do not guess).
- Salle Ancienne Rush: his first game, two days after the account was created; the description credits
  `j_judes` for the graphics.
- Room Rush: the description credits `@HyperDev7` (development), `@mykinglisa` (scripter) and `@BlueShotss`
  (VFX) and does not name Vbrut0x: his role there is TO CONFIRM before any claim.
- For every game: his role (solo, scripter, builder, team of how many), what he coded himself and the tools
  beyond Luau and Roblox Studio are TO CONFIRM. Only Luau and Roblox Studio are certain.

### Roblox groups and roles (groups.roblox.com, 2026-10-08)

| Group | Group id | Members | His rank | Shown as |
|---|---|---|---|---|
| Hyper \| Games | 35726151 | 511 | Propriétaire (rank 255), 5 public games, 17,011 visits combined | Owner |
| AVortexGame | 292694018 | 331 | "Owners" (rank 254), the group owner is BlueShotss | Co-owner |
| Lucky Block Factory Group | 272607461 | 164 | Owner (rank 255) | Owner |
| Chill Games fr | 1095885752 | 140 | Owner (rank 255) | Owner |
| OG Game 2017 | 35631030 | 80 | Propriétaire (rank 255) | Owner |
| Vorld | 35476292 | 4,306 | Head Developer (rank 120), owner PoppTwin | Head Developer |
| PDK • Community | 923178524 | 11,151 | Admin (rank 254), owner Hexiiiy | Admin |

- Owned or co-owned groups combined: 1,226 members (the "members across my groups" line of the site).
  Vorld and PDK • Community are not his groups: never add their members to his.
- Dates and concrete missions of the Vorld and PDK • Community roles: TO CONFIRM. Creation date of
  Hyper | Games: TO CONFIRM (hence "Owner", not "Founder").
- Not shown anywhere: Infinity Studios (1,926 members, "Top supporter" rank 250: a supporter, not a role),
  and small groups of 2 to 13 members where he holds a high rank (No Flop Games, Hyper | UGC, Our Poopy
  Games, Coins House, Century-Inc, Flouz Industries, Vortex | Minigames, Game france). Discord links: none
  known publicly.

### GitHub (public repositories of SkYNENET, read 2026-10-08)

- `alike.io`: top-down HTML5 Canvas survival game inspired by diep.io, TypeScript + Vite; stat progression,
  melee axe combat, hunter bot waves, shrinking zone; code split into systems (AI, melee, zone manager) and a
  custom renderer; last update 2026-06-17. Solo or not, duration, playable URL: TO CONFIRM.
- `roblox-followers-api`: Node.js, August 2025, `index.js` + `package.json`, no README. What it does exactly
  is TO CONFIRM (the portfolio only says "small Node.js API around Roblox follower data").
- Ten daily Python repositories (`Day01Pool` to `PoolDay10`) pushed from 12 to 21 February 2026: a 10-day
  Python bootcamp ("piscine"). School or organiser: TO CONFIRM.

### This portfolio

- React 19 + TypeScript + Vite 8, plain CSS, hosted on Vercel, one serverless function (`api/roblox.ts`)
  aggregating live public Roblox stats. See `HANDOFF.md`. How much of it Hector built himself is TO CONFIRM
  before listing it on his resume.

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
Duration and start date (the owner wants an internship in 2027):
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
