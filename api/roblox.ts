// Vercel serverless function: collects PUBLIC Roblox stats for the portfolio.
// Browsers can't call Roblox directly (no CORS), so the page asks this endpoint:
//   GET /api/roblox?places=123,456&groups=789
// Only fixed Roblox endpoints are called and IDs must be numeric: it is not an open proxy.
// Results are cached at the edge for 5 minutes, so Roblox is hit rarely.

const MAX_IDS = 30

interface GameStats {
  name?: string
  playing: number
  visits: number
  favorites: number
  likes: number
  dislikes: number
  icon?: string
}

interface GroupStats {
  members: number
  icon?: string
}

interface Thumbs {
  data: { targetId: number; imageUrl: string | null }[]
}

const parseIds = (raw: string | null): string[] => {
  const ids = (raw ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => /^\d{1,19}$/.test(s))
  return [...new Set(ids)].slice(0, MAX_IDS)
}

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    })
    return res.ok ? ((await res.json()) as T) : null
  } catch {
    return null
  }
}

async function gameStats(placeIds: string[]): Promise<Record<string, GameStats>> {
  // place id (the number in the game URL) -> universe id (what the stats APIs use)
  const resolved = await Promise.all(
    placeIds.map(async (place) => {
      const r = await getJson<{ universeId: number | null }>(
        `https://apis.roblox.com/universes/v1/places/${place}/universe`,
      )
      return [place, r?.universeId ? String(r.universeId) : null] as const
    }),
  )
  const known = resolved.filter((p): p is readonly [string, string] => p[1] !== null)
  if (known.length === 0) return {}
  const list = known.map(([, universe]) => universe).join(',')

  const [games, votes, icons] = await Promise.all([
    getJson<{ data: { id: number; name: string; playing: number; visits: number; favoritedCount: number }[] }>(
      `https://games.roblox.com/v1/games?universeIds=${list}`,
    ),
    getJson<{ data: { id: number; upVotes: number; downVotes: number }[] }>(
      `https://games.roblox.com/v1/games/votes?universeIds=${list}`,
    ),
    getJson<Thumbs>(
      `https://thumbnails.roblox.com/v1/games/icons?universeIds=${list}&size=512x512&format=Png&returnPolicy=PlaceHolder`,
    ),
  ])

  const out: Record<string, GameStats> = {}
  for (const [place, universe] of known) {
    const game = games?.data.find((g) => String(g.id) === universe)
    if (!game) continue
    const vote = votes?.data.find((v) => String(v.id) === universe)
    const icon = icons?.data.find((i) => String(i.targetId) === universe)?.imageUrl
    out[place] = {
      name: game.name,
      playing: game.playing,
      visits: game.visits,
      favorites: game.favoritedCount,
      likes: vote?.upVotes ?? 0,
      dislikes: vote?.downVotes ?? 0,
      icon: icon ?? undefined,
    }
  }
  return out
}

async function groupStats(groupIds: string[]): Promise<Record<string, GroupStats>> {
  if (groupIds.length === 0) return {}
  const [groups, icons] = await Promise.all([
    Promise.all(
      groupIds.map((id) => getJson<{ memberCount: number }>(`https://groups.roblox.com/v1/groups/${id}`)),
    ),
    getJson<Thumbs>(
      `https://thumbnails.roblox.com/v1/groups/icons?groupIds=${groupIds.join(',')}&size=150x150&format=Png`,
    ),
  ])

  const out: Record<string, GroupStats> = {}
  groupIds.forEach((id, n) => {
    const group = groups[n]
    if (!group) return
    const icon = icons?.data.find((i) => String(i.targetId) === id)?.imageUrl
    out[id] = { members: group.memberCount, icon: icon ?? undefined }
  })
  return out
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const [games, groups] = await Promise.all([
    gameStats(parseIds(searchParams.get('places'))),
    groupStats(parseIds(searchParams.get('groups'))),
  ])

  const gotNothing = Object.keys(games).length + Object.keys(groups).length === 0
  return Response.json(
    { games, groups, fetchedAt: new Date().toISOString() },
    {
      headers: {
        // Don't cache a total failure (Roblox down), so the next visit retries.
        'Cache-Control': gotNothing ? 'no-store' : 'public, s-maxage=300, stale-while-revalidate=900',
      },
    },
  )
}
