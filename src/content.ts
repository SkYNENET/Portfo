// Tout le texte et les donnees du portfolio vivent ici. Aucun texte en dur dans les composants.
//
// SOURCE DES DONNEES
// - Roblox : docs/data/roblox.json, collecte le 2026-10-08 via les API publiques Roblox
//   (users, friends, games, groups, thumbnails). Pour regenerer : `python3 docs/data/fetch_roblox.py`
//   depuis la racine du depot (user id 7893763634 par defaut, sortie docs/data/roblox.json).
// - GitHub : repos publics de https://github.com/SkYNENET (README d'alike.io lu le 2026-10-08).
// - Les chiffres statiques ci-dessous (visites, membres...) sont des instantanes : en prod,
//   /api/roblox (api/roblox.ts) les remplace par les valeurs live quand Roblox repond.
//
// SELECTION
// - 26 experiences publiques au total (56 914 visites, 530 favoris cumules). Seules les 8 qui
//   comptent sont listees ; les 18 autres (0 a 458 visites) sont des tests, prototypes, doublons
//   ou quiz hors sujet et ne doivent pas apparaitre.
// - Groupes : ceux qu'il possede ou ou il a un vrai role. "Infinity Studios" exclu (simple supporter).
//
// TO CONFIRM (a demander a Hector, ne rien inventer) :
// - nom de famille, ecole et annee, ville, email public, LinkedIn
// - son role exact sur chaque jeu (solo ? scripteur ? builder ? equipe ?) et la tech au-dela de Luau
// - ce que fait exactement roblox-followers-api
// - Escape Knockout for Speed : aucune description publique, genre inconnu
// - periodes des roles Head Developer (Vorld) et Admin (PDK • Community)
// - ecole de la piscine Python (fevrier 2026), date et duree souhaitees du stage, langues parlees
// - les Discord des communautes (aucun lien public connu)
//
// `cover` est optionnel : une image dans /public/covers et cover: '/covers/mon-jeu.png'.
// Sans cover, l'icone Roblox est utilisee quand `placeId` est renseigne, sinon le degrade `tone`.
// placeId = le nombre dans roblox.com/games/<placeId>/Name ; groupId = celui de roblox.com/communities/<groupId>/Name.

export type Kind = 'game' | 'map' | 'web'

export interface Entry {
  name: string
  kind: Kind
  tagline: string
  link: string
  tone: [string, string]
  cover?: string
  meta?: string // affiche quand il n'y a pas de stats live, ex. "Luau · Roblox Studio"
  placeId?: number // jeux et maps Roblox uniquement
  featured?: boolean
  role?: string // TO CONFIRM pour tous les jeux : absent tant qu'Hector n'a pas repondu
  tech?: string[]
  year?: string // annee de creation
  team?: string // groupe Roblox createur, 'Personal' (compte perso) ou 'Solo'
  highlights?: string[] // puces factuelles tirees de la description publique (futur detail par jeu)
}

export interface Community {
  name: string
  platform: string // Discord, Roblox Group, ...
  members?: string // affiche quand il n'y a pas de stats live
  groupId?: number // groupes Roblox uniquement
  link: string
  tone: [string, string]
  role?: string // son role dans le groupe
}

export interface Profile {
  name: string
  handle?: string
  role: string
  status: string
  bio: string
  email: string
  github: string
  cv: string
  robloxUserId?: number
  robloxProfile?: string
  location?: string
}

export interface Fact {
  value: string
  label: string
  // Quelle stat agregee de /api/roblox peut remplacer `value` quand Roblox repond.
  live?: 'visits' | 'favorites' | 'members' | 'games'
}

export interface Experience {
  id: string
  kind: 'work' | 'education' | 'community'
  period: string
  role: string
  org: string
  summary: string
  tech: string[]
  link?: string
}

export const profile: Profile = {
  name: 'Hector', // nom de famille TO CONFIRM
  handle: 'Vbrut0x',
  role: 'Roblox & Full Stack Developer',
  status: 'Open to internship · 2027',
  bio: 'Roblox developer since 2025: 26 public experiences and about 57K visits, built and published through the Roblox groups I own and run. Also shipping web games in TypeScript, and looking for an internship in 2027.',
  email: '', // TO CONFIRM : email public a demander a Hector (jamais un email prive)
  github: 'https://github.com/SkYNENET',
  cv: '/cv.pdf', // fichier a deposer dans public/cv.pdf
  robloxUserId: 7893763634,
  robloxProfile: 'https://www.roblox.com/users/7893763634/profile',
  // location: TO CONFIRM
}

// Les 3 chiffres cles du hero. Instantanes du 2026-10-08.
// - visits : total des 26 experiences (56 914). Le live sommera les 8 jeux listes (~56K), ecart negligeable.
// - 26 experiences : pas de `live` volontairement, /api/roblox ne connait que les 8 placeId du site.
// - members : somme des 7 groupes listes dans `communities` (16 683), meme calcul que le live.
export const facts: Fact[] = [
  { value: '57K', label: 'visits across his Roblox games', live: 'visits' },
  { value: '26', label: 'experiences published on Roblox' },
  { value: '17K', label: 'members across his Roblox communities', live: 'members' },
]

// Jeux : tries par visites decroissantes. Taglines fideles aux descriptions publiques Roblox.
// role : TO CONFIRM pour chaque jeu (solo, scripteur, builder, equipe ?), donc absent.
// tech : seuls Luau et Roblox Studio sont certains, le reste est TO CONFIRM.
export const entries: Entry[] = [
  {
    name: 'Monster Mayhem',
    kind: 'game',
    placeId: 136890726201326,
    tagline: 'Play as a monster whose only goal is to destroy everything, an unofficial remake of the old Godzilla Simulator (beta).',
    link: 'https://www.roblox.com/games/136890726201326',
    tone: ['#9fb8c8', '#3d5a6c'],
    meta: 'Luau · Roblox Studio',
    tech: ['Luau', 'Roblox Studio'],
    year: '2026',
    team: 'OG Game 2017',
    featured: true, // le plus joue : 16 721 visites, 267 favoris, 96% liked (219/8)
    highlights: ['Unofficial remake of the old Godzilla Simulator', 'Still in beta test'],
  },
  {
    name: 'Escape Knockout for Speed',
    kind: 'game',
    placeId: 113866436980344,
    // TO CONFIRM : aucune description publique sur Roblox, genre inconnu, ne pas deviner.
    tagline: 'Published under Hyper | Games.',
    link: 'https://www.roblox.com/games/113866436980344',
    tone: ['#ff9a8b', '#e0445a'],
    meta: 'Luau · Roblox Studio',
    tech: ['Luau', 'Roblox Studio'],
    year: '2026',
    team: 'Hyper | Games',
  },
  {
    name: 'Search For The Egg',
    kind: 'game',
    placeId: 93487925421293,
    tagline: 'A chill beach game about digging through a giant pile of sand to find a buried egg: sell your sand, upgrade your tools and get a crab helper.',
    link: 'https://www.roblox.com/games/93487925421293',
    tone: ['#ffe08a', '#f4a259'],
    meta: 'Luau · Roblox Studio',
    tech: ['Luau', 'Roblox Studio'],
    year: '2026',
    team: 'Chill Games fr',
    highlights: [
      'Dig with your hands, a shovel, a bucket and more',
      'Solo or with friends, plus a Hard mode with a much bigger pile',
      'Class roll, best-time leaderboard',
    ],
  },
  {
    name: "Don't Eat Poisoned Slime",
    kind: 'game',
    placeId: 125815079895321,
    tagline: 'Spin for cash rewards, then eat slimes 1v1 at the table: one of them is poisoned by your enemy, build win streaks.',
    link: 'https://www.roblox.com/games/125815079895321',
    tone: ['#c0f58a', '#45b36b'],
    meta: 'Luau · Roblox Studio',
    tech: ['Luau', 'Roblox Studio'],
    year: '2026',
    team: 'AVortexGame',
    highlights: ['1v1 duels at the table', 'Win streaks and collectible chairs'],
  },
  {
    name: 'Salle Ancienne Rush',
    kind: 'game',
    placeId: 123100983531502,
    tagline: 'RNG door adventure: every door opens on a room of varying rarity, with a leaderboard to track your progress.',
    link: 'https://www.roblox.com/games/123100983531502',
    tone: ['#c9a7ff', '#7a5cff'],
    meta: 'Luau · Roblox Studio',
    tech: ['Luau', 'Roblox Studio'],
    year: '2025',
    team: 'Personal', // publie sur son compte perso, son premier jeu (2 jours apres la creation du compte)
    highlights: ['Rooms of varying rarity behind each door', 'Each player spawns in their own starting room'],
  },
  {
    name: 'Room Rush',
    kind: 'game',
    placeId: 82734020430701,
    tagline: 'Open doors to discover rooms of various rarities, then sell them or display them at the spawn from your inventory.',
    link: 'https://www.roblox.com/games/82734020430701',
    tone: ['#9ecbff', '#4f7cff'],
    meta: 'Luau · Roblox Studio',
    tech: ['Luau', 'Roblox Studio'],
    year: '2025',
    team: 'Hyper | Games',
    highlights: ['Rooms of various rarities', 'Inventory: sell or display your rooms'],
  },
  {
    name: 'Run For Dinosaurs',
    kind: 'game',
    placeId: 75594318823554,
    tagline: "Run fast, get stronger, don't fall: collect dinosaurs to earn money and buy more speed while the ground disappears behind you.",
    link: 'https://www.roblox.com/games/75594318823554',
    tone: ['#f2c48a', '#b8763a'],
    meta: 'Luau · Roblox Studio',
    tech: ['Luau', 'Roblox Studio'],
    year: '2026',
    team: 'Hyper | Games',
    highlights: ['Disappearing ground, blocks to dodge', 'Dinosaurs earn money offline, upgradable base'],
  },
  {
    name: 'Lucky Block Factory', // titre Roblox exact : "[UPD] Lucky Block Factory"
    kind: 'game',
    placeId: 88367844931035,
    tagline: 'Your factory prints Lucky Blocks and the money never stops flowing: turn it into a production empire.',
    link: 'https://www.roblox.com/games/88367844931035',
    tone: ['#ffb3d9', '#d94f9e'],
    meta: 'Luau · Roblox Studio',
    tech: ['Luau', 'Roblox Studio'],
    year: '2026',
    team: 'Lucky Block Factory Group',
    highlights: ['Automatic Lucky Block production', 'Sell blocks, upgrade the factory'],
  },

  // Web (GitHub SkYNENET)
  {
    name: 'alike.io',
    kind: 'web',
    tagline: 'Top-down HTML5 Canvas survival game inspired by diep.io: stat progression, melee axe combat, hunter bot waves and a shrinking zone.',
    link: 'https://github.com/SkYNENET/alike.io',
    tone: ['#a8b3c7', '#4a5568'],
    meta: 'TypeScript · HTML5 Canvas · Vite',
    tech: ['TypeScript', 'HTML5 Canvas', 'Vite'],
    year: '2026',
    team: 'Solo',
    highlights: [
      'Systems split into AI, melee and zone managers (src/systems)',
      'Custom Canvas renderer (src/render/Renderer.ts)',
      'WASD / ZQSD, mouse aim, dash, stat upgrades on keys 1 to 9',
    ],
  },
  {
    name: 'roblox-followers-api',
    kind: 'web',
    // TO CONFIRM : pas de README, index.js + package.json seulement ; verifier ce qu'elle fait exactement.
    tagline: 'Small Node.js API around Roblox follower data.',
    link: 'https://github.com/SkYNENET/roblox-followers-api',
    tone: ['#8fd3e8', '#3a86a8'],
    meta: 'Node.js',
    tech: ['Node.js'],
    year: '2025',
  },
  {
    name: 'This portfolio',
    kind: 'web',
    tagline: 'Game-library style portfolio with live public Roblox stats aggregated by a single Vercel serverless function.',
    link: 'https://github.com/SkYNENET/Portfolio',
    tone: ['#d9d9de', '#6e6e73'],
    meta: 'React · TypeScript · Vite · Vercel',
    tech: ['React', 'TypeScript', 'Vite', 'Vercel'],
    year: '2026',
  },
]

// Groupes Roblox : les 5 qu'il possede (ou co-possede) et ses 2 roles chez les autres.
// Membres : instantane du 2026-10-08, remplace par le live quand /api/roblox repond.
export const communities: Community[] = [
  {
    name: 'Hyper | Games',
    platform: 'Roblox Group',
    members: '511 members',
    groupId: 35726151,
    link: 'https://www.roblox.com/communities/35726151',
    tone: ['#9ecbff', '#4f7cff'],
    role: 'Owner', // son groupe principal : 5 jeux publics
  },
  {
    name: 'AVortexGame',
    platform: 'Roblox Group',
    members: '331 members',
    groupId: 292694018,
    link: 'https://www.roblox.com/communities/292694018',
    tone: ['#c0f58a', '#45b36b'],
    role: 'Co-owner', // role "Owners" (rank 254), le proprietaire du groupe est quelqu'un d'autre
  },
  {
    name: 'Lucky Block Factory Group',
    platform: 'Roblox Group',
    members: '164 members',
    groupId: 272607461,
    link: 'https://www.roblox.com/communities/272607461',
    tone: ['#ffb3d9', '#d94f9e'],
    role: 'Owner',
  },
  {
    name: 'Chill Games fr',
    platform: 'Roblox Group',
    members: '140 members',
    groupId: 1095885752,
    link: 'https://www.roblox.com/communities/1095885752',
    tone: ['#ffe08a', '#f4a259'],
    role: 'Owner',
  },
  {
    name: 'OG Game 2017',
    platform: 'Roblox Group',
    members: '80 members',
    groupId: 35631030,
    link: 'https://www.roblox.com/communities/35631030',
    tone: ['#9fb8c8', '#3d5a6c'],
    role: 'Owner',
  },
  {
    name: 'Vorld',
    platform: 'Roblox Group',
    members: '4.3K members',
    groupId: 35476292,
    link: 'https://www.roblox.com/communities/35476292',
    tone: ['#c9a7ff', '#7a5cff'],
    role: 'Head Developer',
  },
  {
    name: 'PDK • Community',
    platform: 'Roblox Group',
    members: '11.2K members',
    groupId: 923178524,
    link: 'https://www.roblox.com/communities/923178524',
    tone: ['#ff9a8b', '#e0445a'],
    role: 'Admin',
  },
]

// Timeline travail + formation. Periodes "TO CONFIRM" = inconnues des donnees publiques.
export const experience: Experience[] = [
  {
    id: 'roblox-indie',
    kind: 'work',
    period: 'Jan 2025 – present',
    role: 'Roblox Developer',
    org: 'Independent, Roblox',
    summary: 'Published 26 public experiences since the account was created in January 2025, about 57K visits and 530 favorites in total, the best one at 96% liked.',
    tech: ['Luau', 'Roblox Studio'],
    link: 'https://www.roblox.com/users/7893763634/profile',
  },
  {
    id: 'hyper-games',
    kind: 'work',
    period: '2025 – present',
    role: 'Owner',
    org: 'Hyper | Games (Roblox group)',
    summary: 'Runs a 511-member Roblox group that publishes 5 public games, including Escape Knockout for Speed, Room Rush and Run For Dinosaurs.',
    tech: ['Luau', 'Roblox Studio', 'Community management'],
    link: 'https://www.roblox.com/communities/35726151',
  },
  {
    id: 'vorld',
    kind: 'work',
    period: 'TO CONFIRM',
    role: 'Head Developer',
    org: 'Vorld (Roblox group)',
    summary: 'Head Developer role in a 4,300-member Roblox group.', // missions exactes TO CONFIRM
    tech: ['Luau', 'Roblox Studio'],
    link: 'https://www.roblox.com/communities/35476292',
  },
  {
    id: 'pdk-community',
    kind: 'community',
    period: 'TO CONFIRM',
    role: 'Admin',
    org: 'PDK • Community (Roblox group)',
    summary: 'Admin of an 11,000-member Roblox community.', // missions exactes TO CONFIRM
    tech: ['Community management'],
    link: 'https://www.roblox.com/communities/923178524',
  },
  {
    id: 'python-pool',
    kind: 'education',
    period: 'Feb 2026',
    role: 'Python pool, 10 days',
    org: 'TO CONFIRM (school)',
    summary: 'Ten daily Python exercise repositories pushed to GitHub from 12 to 21 February 2026 (Day01Pool to PoolDay10).',
    tech: ['Python', 'Git'],
    link: 'https://github.com/SkYNENET',
  },
]
