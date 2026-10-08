// Fonction serverless Vercel : agrege les stats PUBLIQUES Roblox du portfolio.
// Les navigateurs ne peuvent pas appeler Roblox (pas de CORS) : la page demande GET /api/roblox.
//
// IDs fixes par src/content.ts, pas un proxy : les placeId et groupId servis sont exactement ceux des
// entrees et communautes du site. La query (?places=&groups=, ?mock= en dev) est acceptee pour rester
// compatible avec le hook useRoblox mais jamais lue : une seule cle de cache au CDN, aucun ID libre.
//
// Reponse { games (par placeId), groups (par groupId), fetchedAt, partial } :
// - partial = true des qu'un bloc Roblox (jeux, votes, icones, miniatures, un groupe) a manque ;
//   le front garde alors ses valeurs statiques pour ce qui manque, jamais un 0 invente.
// - likes/dislikes absents quand le bloc votes a echoue (le front n'affiche un % que s'ils existent).
// - Toujours 200 : une panne totale renvoie des blocs vides, jamais un 500 a la page.
// - Cache CDN : 5 min quand tout a repondu, 1 min si partiel, rien si Roblox n'a rien rendu.

import { communities, entries } from '../src/content'

// Un seul jeu d'IDs, derive du contenu : ajouter un placeId dans content.ts suffit.
const PLACES = entries.flatMap((e) => (e.placeId ? [String(e.placeId)] : []))
const GROUPS = communities.flatMap((c) => (c.groupId ? [String(c.groupId)] : []))

// place (le nombre dans l'URL du jeu) -> universe (ce que les API de stats attendent).
// Verifie dans docs/data/roblox.json : evite un appel apis.roblox.com par jeu et par requete.
// La resolution en ligne ne sert qu'a un placeId ajoute a content.ts et encore absent d'ici.
const UNIVERSE_BY_PLACE: Record<string, string> = {
  '136890726201326': '9671942172', // Monster Mayhem
  '113866436980344': '9670382970', // Escape Knockout for Speed
  '93487925421293': '10767332654', // Search For The Egg
  '125815079895321': '9856582217', // Don't Eat Poisoned Slime
  '123100983531502': '7127856984', // Salle Ancienne Rush
  '82734020430701': '7487992065', // Room Rush
  '75594318823554': '9834328401', // Run For Dinosaurs
  '88367844931035': '10016151371', // Lucky Block Factory
}

// Budget temps : 6 s pour toute la fonction, 4 s par appel Roblox (Node 22 local et Vercel).
// Un appel lent devient un bloc manquant (partial), pas une page sans aucune stat.
const TOTAL_TIMEOUT_MS = 6000
const CALL_TIMEOUT_MS = 4000

interface GameStats {
  name?: string
  playing: number
  visits: number
  favorites: number
  likes?: number
  dislikes?: number
  icon?: string // icone carree 512x512 (jaquettes)
  thumbnail?: string // visuel 16:9 768x432 (banniere)
}

interface GroupStats {
  members: number
  icon?: string
}

interface Payload {
  games: Record<string, GameStats>
  groups: Record<string, GroupStats>
  fetchedAt: string
  partial: boolean
}

// Formes des reponses Roblox (verifiees par curl le 2026-10-08), reduites aux champs utilises.
interface Listed<T> {
  data: T[]
}
interface GameRow {
  id: number
  name: string
  playing: number
  visits: number
  favoritedCount: number
}
interface VoteRow {
  id: number
  upVotes: number
  downVotes: number
}
interface Thumb {
  targetId: number
  imageUrl: string | null
}
interface ThumbSet {
  universeId: number
  thumbnails: Thumb[] | null
}

// Resultat d'un bloc (jeux ou groupes) : ses entrees et le drapeau « quelque chose a manque ».
interface Block<T> {
  out: Record<string, T>
  partial: boolean
}

/** GET JSON borne par la deadline globale et un timeout propre ; null (jamais une exception) en cas d'echec. */
async function getJson<T>(url: string, deadline: AbortSignal): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.any([deadline, AbortSignal.timeout(CALL_TIMEOUT_MS)]),
    })
    if (!res.ok) {
      console.warn(url, res.status) // 429 sur groups.roblox.com est frequent : lisible dans les logs Vercel
      return null
    }
    return (await res.json()) as T
  } catch (error) {
    console.warn(url, error instanceof Error ? error.name : 'failed')
    return null
  }
}

/** Roblox repond parfois 200 avec un corps inattendu : on ne garde que la forme { data: [...] }. */
const rows = <T>(x: Listed<T> | null): T[] => (x !== null && Array.isArray(x.data) ? x.data : [])

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)

/** Nombre optionnel : undefined plutot qu'un 0 invente quand Roblox ne l'a pas donne. */
const optNum = (v: unknown): number | undefined => (isNum(v) ? v : undefined)

/** place -> universe : la table d'abord, l'API seulement pour un placeId qu'elle ne connait pas. */
async function universeOf(place: string, deadline: AbortSignal): Promise<string | null> {
  const known = UNIVERSE_BY_PLACE[place]
  if (known) return known
  const r = await getJson<{ universeId: number | null }>(
    `https://apis.roblox.com/universes/v1/places/${place}/universe`,
    deadline,
  )
  const id = r?.universeId
  return isNum(id) ? String(id) : null
}

async function gameStats(deadline: AbortSignal): Promise<Block<GameStats>> {
  if (PLACES.length === 0) return { out: {}, partial: false }
  const pairs = await Promise.all(PLACES.map(async (place) => [place, await universeOf(place, deadline)] as const))
  const resolved = pairs.filter((p): p is readonly [string, string] => p[1] !== null)
  let partial = resolved.length < pairs.length
  if (resolved.length === 0) return { out: {}, partial: true }
  const list = resolved.map(([, universe]) => universe).join(',')

  const [games, votes, icons, thumbs] = await Promise.all([
    getJson<Listed<GameRow>>(`https://games.roblox.com/v1/games?universeIds=${list}`, deadline),
    getJson<Listed<VoteRow>>(`https://games.roblox.com/v1/games/votes?universeIds=${list}`, deadline),
    getJson<Listed<Thumb>>(
      `https://thumbnails.roblox.com/v1/games/icons?universeIds=${list}&size=512x512&format=Png&returnPolicy=PlaceHolder`,
      deadline,
    ),
    getJson<Listed<ThumbSet>>(
      `https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${list}&size=768x432&format=Png&countPerUniverse=1&defaults=true`,
      deadline,
    ),
  ])
  // Un bloc secondaire en echec (votes, images) n'empeche pas les chiffres : il manque, c'est tout.
  if (!games || !votes || !icons || !thumbs) partial = true

  const gameById = new Map(rows(games).map((g) => [String(g.id), g]))
  const voteById = new Map(rows(votes).map((v) => [String(v.id), v]))
  const iconById = new Map(rows(icons).map((i) => [String(i.targetId), i.imageUrl]))
  const thumbById = new Map(rows(thumbs).map((t) => [String(t.universeId), t.thumbnails?.[0]?.imageUrl ?? null]))

  const out: Record<string, GameStats> = {}
  for (const [place, universe] of resolved) {
    const game = gameById.get(universe)
    if (!game || !isNum(game.playing) || !isNum(game.visits) || !isNum(game.favoritedCount)) {
      partial = true // jeu absent ou corps inattendu : le front garde la ligne statique de content.ts
      continue
    }
    const vote = voteById.get(universe)
    out[place] = {
      name: typeof game.name === 'string' ? game.name : undefined,
      playing: game.playing,
      visits: game.visits,
      favorites: game.favoritedCount,
      likes: optNum(vote?.upVotes),
      dislikes: optNum(vote?.downVotes),
      icon: iconById.get(universe) ?? undefined,
      thumbnail: thumbById.get(universe) ?? undefined,
    }
  }
  return { out, partial }
}

async function groupStats(deadline: AbortSignal): Promise<Block<GroupStats>> {
  if (GROUPS.length === 0) return { out: {}, partial: false }
  // groups.roblox.com v1, un appel par groupe (v2 n'a pas memberCount) : le 429 est frequent,
  // chaque echec reste local a son groupe et passe partial.
  const [groups, icons] = await Promise.all([
    Promise.all(
      GROUPS.map((id) => getJson<{ memberCount: number }>(`https://groups.roblox.com/v1/groups/${id}`, deadline)),
    ),
    getJson<Listed<Thumb>>(
      `https://thumbnails.roblox.com/v1/groups/icons?groupIds=${GROUPS.join(',')}&size=150x150&format=Png`,
      deadline,
    ),
  ])
  let partial = icons === null
  const iconById = new Map(rows(icons).map((i) => [String(i.targetId), i.imageUrl]))

  const out: Record<string, GroupStats> = {}
  GROUPS.forEach((id, n) => {
    const members = groups[n]?.memberCount
    if (!isNum(members)) {
      partial = true
      return
    }
    out[id] = { members, icon: iconById.get(id) ?? undefined }
  })
  return { out, partial }
}

// Cache selon la completude : complet = 1 min navigateur / 5 min CDN (+15 min de stale pendant la
// revalidation), partiel = 1 min au CDN seulement, rien du tout = pas de cache pour que la visite
// suivante retente. Vercel lit CDN-Cache-Control en priorite, d'ou la copie.
type Freshness = 'full' | 'partial' | 'none'
const CACHE: Record<Freshness, string> = {
  full: 'public, max-age=60, s-maxage=300, stale-while-revalidate=900',
  partial: 'public, max-age=0, s-maxage=60',
  none: 'no-store',
}

const respond = (body: Payload, freshness: Freshness): Response =>
  Response.json(body, {
    status: 200,
    headers: {
      'Cache-Control': CACHE[freshness],
      'CDN-Cache-Control': CACHE[freshness],
      'X-Content-Type-Options': 'nosniff',
    },
  })

// La requete est acceptee pour compat (le hook envoie ?places=&groups=) mais jamais lue.
export async function GET(_request: Request): Promise<Response> {
  try {
    const deadline = AbortSignal.timeout(TOTAL_TIMEOUT_MS)
    const [games, groups] = await Promise.all([gameStats(deadline), groupStats(deadline)])
    const fetchedAt = new Date().toISOString()
    const nothing = Object.keys(games.out).length + Object.keys(groups.out).length === 0
    const partial = games.partial || groups.partial
    const freshness: Freshness = nothing ? 'none' : partial ? 'partial' : 'full'
    return respond({ games: games.out, groups: groups.out, fetchedAt, partial }, freshness)
  } catch (error) {
    // Jamais de 500 : le front traite une reponse vide comme « rien de live » et garde le statique.
    console.error('api/roblox', error)
    return respond({ games: {}, groups: {}, fetchedAt: new Date().toISOString(), partial: true }, 'none')
  }
}
