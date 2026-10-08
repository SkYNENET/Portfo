import { useEffect, useState } from 'react'

export interface GameStats {
  name?: string
  playing: number
  visits: number
  favorites: number
  likes: number
  dislikes: number
  icon?: string
}

export interface GroupStats {
  members: number
  icon?: string
}

export interface RobloxData {
  games: Record<string, GameStats>
  groups: Record<string, GroupStats>
}

const EMPTY: RobloxData = { games: {}, groups: {} }

// Live public stats from /api/roblox (see api/roblox.ts). Silent when unavailable
// (local dev, Roblox down, no IDs set): the page then shows the static text.
export function useRoblox(placeIds: number[], groupIds: number[]): RobloxData {
  const [data, setData] = useState<RobloxData>(EMPTY)
  const key = `${placeIds.join(',')}|${groupIds.join(',')}`

  useEffect(() => {
    const [places, groups] = key.split('|')
    if (!places && !groups) return
    const controller = new AbortController()
    fetch(`/api/roblox?places=${places}&groups=${groups}`, { signal: controller.signal })
      .then((res) => (res.ok ? (res.json() as Promise<RobloxData>) : EMPTY))
      .then(setData)
      .catch(() => {})
    return () => controller.abort()
  }, [key])

  return data
}

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
export const fmt = (n: number) => compact.format(n)

export const likedPercent = (s: GameStats): number | null => {
  const total = s.likes + s.dislikes
  return total > 0 ? Math.round((s.likes / total) * 100) : null
}
