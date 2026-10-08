// Tout le texte et les donnees du portfolio vivent ici. Aucun texte en dur dans les composants.
// Module de donnees PUR : aucun import, aucun DOM (api/roblox.ts l'importera cote serveur).
//
// SOURCE DES DONNEES
// - Roblox : docs/data/roblox.json, collecte le 2026-10-08 via les API publiques Roblox
//   (users, friends, games, groups, thumbnails). Pour regenerer : `python3 docs/data/fetch_roblox.py`
//   depuis la racine du depot (user id 7893763634 par defaut, sortie docs/data/roblox.json).
// - GitHub : repos publics de https://github.com/SkYNENET (README d'alike.io lu le 2026-10-08).
// - Les chiffres statiques ci-dessous (visites, membres...) sont des instantanes du 2026-10-08 :
//   en prod, /api/roblox (api/roblox.ts) les remplace EN PLACE par les valeurs live quand Roblox repond.
//
// REGLES D'ECRITURE
// - Texte visible en anglais, a la premiere personne du singulier (« my games », « I build ») :
//   decision editoriale, le site parle comme Hector.
// - Jamais « TO CONFIRM » dans une chaine visible : un champ inconnu est vide ('') ou absent, et la
//   question reste ici en commentaire. Les composants passent par known() (src/ui.tsx) qui masque
//   une valeur vide ou contenant TO CONFIRM.
// - Ne rien inventer sur Hector : chaque chiffre vient de docs/data/roblox.json ou de GitHub.
//
// SELECTION
// - 26 experiences publiques au total (56 914 visites, 530 favoris cumules). Seules les 8 qui
//   comptent sont listees (56 068 visites et 530 favoris a elles seules). Les 18 autres sont des
//   tests, prototypes, doublons ou quiz hors sujet et ne doivent JAMAIS apparaitre :
//   ANGEL or DEMON (458 visites), Poop Fighting (107), Steal Stats (105), Idle Second [NEW] (52),
//   Shot first (45), Shoot First (23), LFI ou RN (11, quiz politique), Dungeons of Regret (9),
//   testpoop (8), Game FR (8), Experience sans titre (7), [REPLASE] Forgotten Shores (5), 40% (4),
//   Tie india Simulator (3), Untitled Game (1), TestCashGrab (0), 2 x [TITLE UNAVAILABLE] (0).
// - Groupes : ceux qu'il possede ou ou il a un vrai role. "Infinity Studios" exclu (simple supporter).
//
// TO CONFIRM (a demander a Hector, ne rien inventer) :
// - nom de famille, ecole et annee, ville, email public, LinkedIn (champ a ajouter au schema)
// - son role exact sur chaque jeu (solo ? scripteur ? builder ? equipe ?) et la tech au-dela de Luau
// - ce que fait exactement roblox-followers-api
// - Escape Knockout for Speed : aucune description publique, genre inconnu
// - periodes et missions des roles Head Developer (Vorld) et Admin (PDK • Community)
// - ecole de la piscine Python (fevrier 2026), date et duree souhaitees du stage, langues parlees
// - les Discord des communautes (aucun lien public connu)
// - public/cv.pdf : mettre cv: '/cv.pdf' quand docs/resume/cv-hector-en.pdf final est copie dans
//   public/ par le proprietaire (le fichier n'existe pas encore, donc cv: '' et aucun lien rendu)
//
// `cover` est optionnel : une image dans /public/covers et cover: '/covers/mon-jeu.png'.
// Sans cover, l'icone Roblox est utilisee quand `placeId` est renseigne, sinon le degrade `tone`
// (fond de chargement neutre pour les jeux, monogramme pour le web).
// placeId = le nombre dans roblox.com/games/<placeId>/Name ; groupId = celui de roblox.com/communities/<groupId>/Name.

export type Kind = 'game' | 'map' | 'web'

export interface Entry {
  name: string
  kind: Kind
  tagline: string
  link: string
  tone: [string, string]
  cover?: string
  meta?: string // ligne statique sous la jaquette quand le live manque : stats du 2026-10-08 (jeux) ou tech (web)
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
  platform: string // Roblox group, Discord, ...
  members?: string // affiche quand il n'y a pas de stats live
  groupId?: number // groupes Roblox uniquement
  link: string
  tone: [string, string]
  role?: string // son role dans le groupe ; 'Owner' et 'Co-owner' = « my groups » (voir isOwn dans ui.tsx)
}

export interface Profile {
  name: string
  handle?: string // sans @, les composants l'ajoutent (helper at())
  role: string
  status: string
  bio: string
  email: string // '' tant qu'aucun email public n'est connu : jamais rendu vide
  github: string
  cv: string // '' tant que public/cv.pdf n'existe pas : aucun lien rendu
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
  period: string // '' si inconnue : le composant masque la colonne
  role: string
  org: string // '' si inconnue : le composant la masque
  summary: string
  tech: string[]
  link?: string
}

export const profile: Profile = {
  name: 'Hector', // nom de famille TO CONFIRM
  handle: 'Vbrut0x',
  role: 'Roblox & Full Stack Developer', // formulation du proprietaire
  status: 'Open to internship · 2027',
  // 1 035 abonnes, 511 membres Hyper | Games, 4 autres groupes possedes : chiffres du 2026-10-08.
  bio: 'Roblox developer since January 2025: 26 public experiences, 56K+ visits and 1,035 followers, owner of Hyper | Games (511 members) and four other groups, Head Developer at Vorld. I also build for the web in TypeScript: a diep.io-style survival game, this site and its live-stats API. Student, looking for an internship in 2027.',
  email: '', // TO CONFIRM : email public a demander a Hector (jamais un email prive)
  github: 'https://github.com/SkYNENET',
  cv: '', // '/cv.pdf' des que public/cv.pdf existe (voir TO CONFIRM en tete)
  robloxUserId: 7893763634,
  robloxProfile: 'https://www.roblox.com/users/7893763634/profile',
  // location: TO CONFIRM
}

// Les 3 chiffres cles du hero. Instantanes du 2026-10-08.
// - visits : somme des 8 jeux listes (56 068) arrondie vers le bas avec « + », jamais « 56.9K » :
//   le live (meme somme sur les 8 placeId) ne doit jamais contredire la valeur statique.
// - games : les 8 jeux a placeId ; le live compte ceux que /api/roblox renvoie (8 si tout repond).
// - 96% liked : Monster Mayhem, 219 votes pour / 8 contre. Statique volontairement.
// - L'ancien « 17K members » a ete retire : il additionnait Vorld et PDK • Community, ou il n'est
//   que Head Developer / Admin (surpromesse). Les membres de SES groupes (1 226) vivent dans le rail.
export const facts: Fact[] = [
  { value: '56K+', label: 'visits across my Roblox games', live: 'visits' },
  { value: '8', label: 'public games shipped since 2025', live: 'games' },
  { value: '96%', label: 'liked on Monster Mayhem' },
]

// Degrade neutre de chargement : la jaquette reelle (icone Roblox) arrive par /api/roblox.
const NEUTRAL: [string, string] = ['#e8e8ed', '#d2d2d7']

// Jeux : tries par visites decroissantes. Taglines fideles aux descriptions publiques Roblox.
// meta = ligne de stats statique du 2026-10-08 au format de fmt (compact) : la meme forme que le live.
// role : TO CONFIRM pour chaque jeu (solo, scripteur, builder, equipe ?), donc absent, jamais « I built ».
// tech : seuls Luau et Roblox Studio sont certains, le reste est TO CONFIRM.
export const entries: Entry[] = [
  {
    name: 'Monster Mayhem',
    kind: 'game',
    placeId: 136890726201326,
    tagline: 'Play as a monster whose only goal is to destroy everything, an unofficial remake of the old Godzilla Simulator (beta).',
    link: 'https://www.roblox.com/games/136890726201326',
    tone: NEUTRAL,
    meta: '16.7K visits · 96% liked · 267 favorites', // 16 721 visites, 219/8 votes, 267 favoris
    tech: ['Luau', 'Roblox Studio'],
    year: '2026',
    team: 'OG Game 2017',
    featured: true, // le plus joue
    highlights: ['Unofficial remake of the old Godzilla Simulator', 'Still in beta test'],
  },
  {
    name: 'Escape Knockout for Speed',
    kind: 'game',
    placeId: 113866436980344,
    // TO CONFIRM : aucune description publique sur Roblox, genre inconnu, ne pas deviner.
    tagline: 'Published under Hyper | Games.',
    link: 'https://www.roblox.com/games/113866436980344',
    tone: NEUTRAL,
    meta: '10.2K visits · 25 favorites', // 10 164 visites, 25 favoris
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
    tone: NEUTRAL,
    meta: '9.3K visits · 169 favorites', // 9 275 visites, 169 favoris
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
    tone: NEUTRAL,
    meta: '7K visits · 18 favorites', // 7 004 visites, 18 favoris
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
    tone: NEUTRAL,
    // Favoris inclus pour que la somme statique des favoris du rail fasse bien 530 (= total du compte).
    meta: '4.5K visits · 92% liked · 20 favorites', // 4 468 visites, 46/4 votes, 20 favoris
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
    tone: NEUTRAL,
    meta: '4.2K visits · 17 favorites', // 4 151 visites, 17 favoris
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
    tone: NEUTRAL,
    meta: '2.6K visits · 7 favorites', // 2 621 visites, 7 favoris
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
    tone: NEUTRAL,
    meta: '1.7K visits · 7 favorites', // 1 664 visites, 7 favoris
    tech: ['Luau', 'Roblox Studio'],
    year: '2026',
    team: 'Lucky Block Factory Group',
    highlights: ['Automatic Lucky Block production', 'Sell blocks, upgrade the factory'],
  },

  // Web (GitHub SkYNENET) : meta = chaine de tech, pas de stats.
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
    // Ne pas pointer SkYNENET/Portfolio : sa branche main contient un vieux projet avec des donnees
    // personnelles. Remplacer par le repo propre une fois publie.
    link: 'https://github.com/SkYNENET',
    tone: ['#d9d9de', '#6e6e73'],
    meta: 'React · TypeScript · Vite · Vercel',
    tech: ['React', 'TypeScript', 'Vite', 'Vercel'],
    year: '2026',
  },
]

// Groupes Roblox : les 5 qu'il possede (ou co-possede) et ses 2 roles chez les autres.
// Membres : instantane du 2026-10-08 au format complet (fmtFull), remplace par le live quand
// /api/roblox repond. Somme des groupes Owner + Co-owner = 1 226 (« members across my groups »).
export const communities: Community[] = [
  {
    name: 'Hyper | Games',
    platform: 'Roblox group',
    members: '511 members',
    groupId: 35726151,
    link: 'https://www.roblox.com/communities/35726151',
    tone: ['#9ecbff', '#4f7cff'],
    role: 'Owner', // son groupe principal : 5 jeux publics (date de creation du groupe inconnue, donc pas « Founder »)
  },
  {
    name: 'AVortexGame',
    platform: 'Roblox group',
    members: '331 members',
    groupId: 292694018,
    link: 'https://www.roblox.com/communities/292694018',
    tone: ['#c0f58a', '#45b36b'],
    role: 'Co-owner', // role "Owners" (rank 254), le proprietaire du groupe est quelqu'un d'autre
  },
  {
    name: 'Lucky Block Factory Group',
    platform: 'Roblox group',
    members: '164 members',
    groupId: 272607461,
    link: 'https://www.roblox.com/communities/272607461',
    tone: ['#ffb3d9', '#d94f9e'],
    role: 'Owner',
  },
  {
    name: 'Chill Games fr',
    platform: 'Roblox group',
    members: '140 members',
    groupId: 1095885752,
    link: 'https://www.roblox.com/communities/1095885752',
    tone: ['#ffe08a', '#f4a259'],
    role: 'Owner',
  },
  {
    name: 'OG Game 2017',
    platform: 'Roblox group',
    members: '80 members',
    groupId: 35631030,
    link: 'https://www.roblox.com/communities/35631030',
    tone: ['#9fb8c8', '#3d5a6c'],
    role: 'Owner',
  },
  {
    name: 'Vorld',
    platform: 'Roblox group',
    members: '4,306 members',
    groupId: 35476292,
    link: 'https://www.roblox.com/communities/35476292',
    tone: ['#c9a7ff', '#7a5cff'],
    role: 'Head Developer',
  },
  {
    name: 'PDK • Community',
    platform: 'Roblox group',
    members: '11,151 members',
    groupId: 923178524,
    link: 'https://www.roblox.com/communities/923178524',
    tone: ['#ff9a8b', '#e0445a'],
    role: 'Admin',
  },
]

// Timeline travail + formation. Une periode ou une organisation inconnue reste '' (masquee par le
// composant), jamais « TO CONFIRM » dans la valeur.
export const experience: Experience[] = [
  {
    id: 'roblox-indie',
    kind: 'work',
    period: 'Jan 2025 – present',
    role: 'Roblox Developer',
    org: 'Independent, Roblox',
    summary: 'I have published 26 public experiences since I created the account in January 2025: about 57K visits and 530 favorites in total, my best game at 96% liked.',
    tech: ['Luau', 'Roblox Studio'],
    link: 'https://www.roblox.com/users/7893763634/profile',
  },
  {
    id: 'hyper-games',
    kind: 'work',
    period: '2025 – present', // premier jeu du groupe : avril 2025 ; date de creation du groupe TO CONFIRM
    role: 'Owner',
    org: 'Hyper | Games (Roblox group)',
    summary: 'I run a 511-member Roblox group that publishes 5 public games, including Escape Knockout for Speed, Room Rush and Run For Dinosaurs.',
    tech: ['Luau', 'Roblox Studio', 'Community management'],
    link: 'https://www.roblox.com/communities/35726151',
  },
  {
    id: 'vorld',
    kind: 'work',
    period: '', // TO CONFIRM
    role: 'Head Developer',
    org: 'Vorld (Roblox group)',
    summary: 'I hold the Head Developer rank in a 4,306-member Roblox group.', // missions exactes TO CONFIRM
    tech: ['Luau', 'Roblox Studio'],
    link: 'https://www.roblox.com/communities/35476292',
  },
  {
    id: 'pdk-community',
    kind: 'community',
    period: '', // TO CONFIRM
    role: 'Admin',
    org: 'PDK • Community (Roblox group)',
    summary: 'I hold the Admin rank in an 11,151-member Roblox community.', // missions exactes TO CONFIRM
    tech: ['Community management'],
    link: 'https://www.roblox.com/communities/923178524',
  },
  {
    id: 'python-pool',
    kind: 'education',
    period: 'Feb 2026',
    role: 'Python pool, 10 days',
    org: '', // ecole TO CONFIRM
    summary: 'Ten daily Python exercise repositories I pushed to GitHub from 12 to 21 February 2026 (Day01Pool to PoolDay10).',
    tech: ['Python', 'Git'],
    link: 'https://github.com/SkYNENET',
  },
]
