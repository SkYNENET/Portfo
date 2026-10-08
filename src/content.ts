// All the text of the portfolio lives here. Replace the placeholders.
// `cover` is optional: drop an image in /public/covers and set cover: '/covers/my-game.png'.
// Without it, the Roblox icon is used when `placeId` is set, else a soft gradient (`tone`).
//
// Live Roblox stats (players now, visits, likes) need the PLACE ID of each game:
// it is the number in the game URL, roblox.com/games/<placeId>/Name.
// Communities: the GROUP ID is the number in roblox.com/communities/<groupId>/Name.

export type Kind = 'game' | 'map' | 'web'

export interface Entry {
  name: string
  kind: Kind
  tagline: string
  link: string
  tone: [string, string]
  cover?: string
  meta?: string // shown when there are no live stats, e.g. "Luau · DataStore"
  placeId?: number // Roblox games and maps only
  featured?: boolean
}

export interface Community {
  name: string
  platform: string // Discord, Roblox Group, ...
  members?: string // shown when there are no live stats
  groupId?: number // Roblox groups only
  link: string
  tone: [string, string]
}

export const profile = {
  name: 'Your Name',
  role: 'Roblox & Full Stack Developer',
  status: 'Open to internship · next year',
  bio: 'I build Roblox games and web applications. This is my library: everything I have shipped, one click away.',
  email: 'you@example.com',
  github: 'https://github.com/your-username',
  cv: '/cv.pdf',
}

export const entries: Entry[] = [
  {
    name: 'Search For The Egg',
    placeId: 93487925421293,
    kind: 'game',
    tagline: 'TODO: one sentence on what players do and what you built.',
    link: 'https://www.roblox.com/games/93487925421293',
    tone: ['#ffb36b', '#ff6b8b'],
    meta: 'Roblox',
    featured: true,
  },
  {
    name: 'Game Two',
    kind: 'game',
    tagline: 'Short pitch of the game.',
    link: 'https://www.roblox.com/',
    tone: ['#7ec8ff', '#6b7bff'],
    meta: 'Luau',
  },
  {
    name: 'Game Three',
    kind: 'game',
    tagline: 'Short pitch of the game.',
    link: 'https://www.roblox.com/',
    tone: ['#9be39b', '#2fb4a0'],
    meta: 'Luau',
  },
  {
    name: 'Map One',
    kind: 'map',
    tagline: 'A map or experience you designed.',
    link: 'https://www.roblox.com/',
    tone: ['#c9a7ff', '#7a5cff'],
    meta: 'Building · Lighting',
  },
  {
    name: 'Map Two',
    kind: 'map',
    tagline: 'A map or experience you designed.',
    link: 'https://www.roblox.com/',
    tone: ['#ffd36b', '#ff9a4d'],
    meta: 'Building',
  },
  {
    name: 'Web Project One',
    kind: 'web',
    tagline: 'A full stack app and its stack.',
    link: 'https://github.com/',
    tone: ['#a8b3c7', '#4a5568'],
    meta: 'React · TypeScript · Supabase',
  },
  {
    name: 'Web Project Two',
    kind: 'web',
    tagline: 'A full stack app and its stack.',
    link: 'https://github.com/',
    tone: ['#8fd3e8', '#3a86a8'],
    meta: 'Next.js · PostgreSQL',
  },
]

export const communities: Community[] = [
  {
    name: 'Community One',
    platform: 'Discord',
    members: '1.2k members',
    link: 'https://discord.com/',
    tone: ['#8c9eff', '#5865f2'],
  },
  {
    name: 'Group Two',
    platform: 'Roblox Group',
    members: '800 members',
    link: 'https://www.roblox.com/',
    tone: ['#ff9aa8', '#ff5a73'],
  },
  {
    name: 'Community Three',
    platform: 'Discord',
    link: 'https://discord.com/',
    tone: ['#8fe0b5', '#2fb36f'],
  },
]
