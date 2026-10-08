// Stats publiques Roblox cote client : hook useRoblox + helpers de formatage et d'agregation.
// FICHIER GELE apres la vague A : les composants (vague B) l'importent, ne le modifient pas.
//
// Contrat :
// - useRoblox(placeIds, groupIds) renvoie { data, status, fetchedAt, partial }.
//   status 'loading' au premier rendu (ou 'error' direct s'il n'y a aucun id), puis 'ready' ou 'error'.
//   En 'error', data reste vide : les composants gardent leurs valeurs statiques (content.ts).
//   partial = true quand l'API a repondu mais qu'un bloc Roblox a manque (likes, miniatures, un groupe).
// - Le hook ne jette jamais : API absente (vite dev sans middleware), 5xx, JSON invalide, Roblox en
//   panne => 'error', et la page reste identique a son premier rendu.
// - En DEV uniquement, `?mock=ready|slow|error|partial` dans l'URL de la page est transmis a
//   /api/roblox (middleware vite.config.ts) pour prouver chaque etat sans reseau.
// - likes/dislikes sont optionnels : jamais un 0 invente quand le bloc votes a echoue.

import { useEffect, useState } from 'react'

export interface GameStats {
  name?: string
  playing: number
  visits: number
  favorites: number
  likes?: number
  dislikes?: number
  icon?: string // icone carree 512x512 (jaquettes)
  thumbnail?: string // visuel 16:9 768x432 (banniere), present quand l'API le fournit
}

export interface GroupStats {
  members: number
  icon?: string
}

export interface RobloxData {
  games: Record<string, GameStats> // indexe par placeId
  groups: Record<string, GroupStats> // indexe par groupId
  fetchedAt?: string
  partial?: boolean
}

export type RobloxStatus = 'loading' | 'ready' | 'error'

export interface RobloxState {
  data: RobloxData
  status: RobloxStatus
  fetchedAt?: string
  partial: boolean // raccourci : status === 'ready' && data.partial === true
}

// Cles agregees que content.ts peut declarer sur un Fact (`live`) : voir liveFact().
export type LiveKey = 'visits' | 'favorites' | 'members' | 'games'

const EMPTY: RobloxData = { games: {}, groups: {} }

const isAbort = (e: unknown): boolean =>
  typeof e === 'object' && e !== null && (e as { name?: unknown }).name === 'AbortError'

export function useRoblox(placeIds: number[], groupIds: number[]): RobloxState {
  // La cle serialisee evite de relancer le fetch quand les tableaux sont recrees a chaque rendu.
  const key = `${placeIds.join(',')}|${groupIds.join(',')}`
  const [data, setData] = useState<RobloxData>(EMPTY)
  const [status, setStatus] = useState<RobloxStatus>(key === '|' ? 'error' : 'loading')
  const [fetchedAt, setFetchedAt] = useState<string | undefined>(undefined)

  useEffect(() => {
    const [placeList, groupList] = key.split('|')
    if (!placeList && !groupList) return
    const controller = new AbortController()

    // La query est conservee pour compat : l'API durcie (T11) ignore les ids et sert ceux de content.ts.
    let url = `/api/roblox?places=${placeList}&groups=${groupList}`
    if (import.meta.env.DEV) {
      const mock = new URLSearchParams(window.location.search).get('mock')
      if (mock) url += `&mock=${encodeURIComponent(mock)}`
    }

    fetch(url, { signal: controller.signal, headers: { accept: 'application/json' } })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = (await res.json()) as Partial<RobloxData> | null
        if (!json || typeof json.games !== 'object' || json.games === null) throw new Error('bad payload')
        return json
      })
      .then((json) => {
        const at = json.fetchedAt ?? new Date().toISOString()
        const games = json.games ?? {}
        const groups = typeof json.groups === 'object' && json.groups !== null ? json.groups : {}
        // partial aussi derive cote client : un id demande sans entree (429 Roblox sur un groupe,
        // bloc en echec) => « some figures missing » et les composants gardent le statique pour lui.
        const wanted = (ids: string) => (ids ? ids.split(',') : [])
        const missing =
          wanted(placeList).some((id) => games[id] === undefined) ||
          wanted(groupList).some((id) => groups[id] === undefined)
        setData({ games, groups, fetchedAt: at, partial: json.partial === true || missing })
        setFetchedAt(at)
        setStatus('ready')
      })
      .catch((e: unknown) => {
        if (isAbort(e)) return // StrictMode ou demontage : pas une erreur
        if (import.meta.env.DEV) console.debug('[roblox]', e)
        setStatus('error')
      })

    return () => controller.abort()
  }, [key])

  return { data, status, fetchedAt, partial: status === 'ready' && data.partial === true }
}

// ---------- formatage ----------

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
const full = new Intl.NumberFormat('en')

/** '56.1K', '16.7K', '530' : la forme des meta statiques de content.ts. */
export const fmt = (n: number): string => compact.format(n)

/** '16,721', '4,306' : pour les membres et les favoris du rail. */
export const fmtFull = (n: number): string => full.format(n)

/** Pourcentage de votes positifs, null si les votes manquent ou valent 0 (jamais un 0 % invente). */
export const likedPercent = (s: GameStats): number | null => {
  if (s.likes === undefined || s.dislikes === undefined) return null
  const total = s.likes + s.dislikes
  return total > 0 ? Math.round((s.likes / total) * 100) : null
}

// ---------- agregation ----------

const gamesOf = (data: RobloxData, placeIds: number[]): GameStats[] =>
  placeIds.flatMap((id) => (data.games[id] ? [data.games[id]] : []))

/**
 * Agregat live pour un Fact. Ne parcourt QUE les ids passes (jamais les cles brutes de la reponse) :
 * 'visits' / 'favorites' = somme des jeux listes, 'members' = somme des groupes possedes (ownGroupIds),
 * 'games' = nombre de placeIds pour lesquels l'API a renvoye une entree.
 */
export function liveFact(data: RobloxData, key: LiveKey, placeIds: number[], ownGroupIds: number[]): number {
  switch (key) {
    case 'games':
      return placeIds.filter((id) => data.games[id] !== undefined).length
    case 'visits':
      return gamesOf(data, placeIds).reduce((a, g) => a + g.visits, 0)
    case 'favorites':
      return gamesOf(data, placeIds).reduce((a, g) => a + g.favorites, 0)
    case 'members':
      return ownGroupIds.reduce((a, id) => a + (data.groups[id]?.members ?? 0), 0)
  }
}

/** Joueurs connectes sur les jeux listes. A n'afficher que si > 0 (regle du site). */
export const playingNow = (data: RobloxData, placeIds: number[]): number =>
  gamesOf(data, placeIds).reduce((a, g) => a + g.playing, 0)

// ---------- legende d'etat ----------

/** 'just now' (< 60 s), 'N min ago', 'N h ago' ; '' si la date est absente, invalide ou > 24 h. */
export function relativeTime(iso?: string, now: number = Date.now()): string {
  if (!iso) return ''
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return ''
  const s = Math.max(0, Math.round((now - t) / 1000))
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.round(s / 60)} min ago`
  if (s < 86400) return `${Math.round(s / 3600)} h ago`
  return ''
}

/**
 * Phrase d'etat sous les chiffres. `staticNote` decrit l'instantane de content.ts,
 * ex. 'Public Roblox figures, October 2026'.
 */
export function legend(state: RobloxState, staticNote: string): string {
  if (state.status === 'ready') {
    const when = relativeTime(state.fetchedAt)
    const base = when ? `Live from Roblox · updated ${when}` : 'Live from Roblox'
    return state.partial ? `${base} · some figures missing` : base
  }
  if (state.status === 'loading') return `${staticNote} · refreshing live numbers…`
  return `${staticNote} (live stats unavailable right now)`
}
