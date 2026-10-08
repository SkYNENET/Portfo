// Library (#work) : barre (titre, tri segmente, recherche) et grille de jaquettes carrees.
//
// CONTRAT (vague B, T7 : ce fichier et Library.css uniquement)
// Props : { filter: Filter; onFilter; query: string; onQuery: (q: string) => void; roblox: RobloxState }
// Classes : .library .bar .seg .grid .tile .cover .placeholder .mono .kind .proof .on-cover
//           .stats .tile-tagline .empty
// Regles : chaque tuile est un lien direct vers le jeu ; badge de preuve « 16.7K visits » (live sinon
// meta statique) ; pastille verte seulement si playing > 0 ; ligne stats = live ou meta (jamais
// « 0 playing ») ; badge Game/Web seulement en vue Home ; compteur aria-live sr-only.

import { useMemo, useState } from 'react'
import { entries, type Entry } from '../content'
import { fmt, likedPercent, type RobloxState } from '../roblox'
import { KIND_LABEL, NAV_LABEL, initials, parseCount, splitMeta, type Filter } from '../ui'
import './Library.css'

export interface LibraryProps {
  filter: Filter
  onFilter: (f: Filter) => void
  query: string
  onQuery: (q: string) => void
  roblox: RobloxState
}

type Sort = 'visits' | 'newest' | 'name'
const SORTS: { id: Sort; label: string }[] = [
  { id: 'visits', label: 'Most visited' },
  { id: 'newest', label: 'Newest' },
  { id: 'name', label: 'A–Z' },
]

const haystack = (e: Entry) =>
  [e.name, e.tagline, e.meta, e.team, e.year, ...(e.tech ?? [])].filter(Boolean).join(' ').toLowerCase()

/** Fragment « 16.7K visits » de la meta statique : badge de preuve quand le live manque, absent pour le web. */
const staticProof = (e: Entry): string | undefined => splitMeta(e.meta).find((x) => x.endsWith('visits'))

/** Visites statiques en nombre (16.7K -> 16700), 0 pour le web : repli de tri quand un jeu n'a pas de live. */
const staticVisits = (e: Entry): number => parseCount(staticProof(e))

export default function Library({ filter, onFilter, query, onQuery, roblox }: LibraryProps) {
  const [sort, setSort] = useState<Sort>('visits')
  const { data, status } = roblox
  const ready = status === 'ready'

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = entries
      .map((e, i) => ({ e, i }))
      .filter(({ e }) => (filter === 'all' || e.kind === filter) && (!q || haystack(e).includes(q)))
    // L'ordre de content.ts (visites decroissantes du 2026-10-08) sert de depart et de departage.
    if (sort === 'visits' && ready) {
      // Un jeu absent de la reponse (partial, 429 Roblox) garde sa place grace a sa meta statique
      // au lieu de tomber derriere ceux qui ont repondu ; le web, sans visites, reste en queue.
      const visits = (e: Entry) => (e.placeId ? data.games[e.placeId]?.visits : undefined) ?? staticVisits(e)
      list.sort((a, b) => visits(b.e) - visits(a.e) || a.i - b.i)
    } else if (sort === 'newest') {
      list.sort((a, b) => (b.e.year ?? '').localeCompare(a.e.year ?? '') || a.i - b.i)
    } else if (sort === 'name') {
      list.sort((a, b) => a.e.name.localeCompare(b.e.name))
    }
    return list.map(({ e }) => e)
  }, [filter, query, sort, ready, data])

  const clear = () => {
    onQuery('')
    onFilter('all')
  }

  return (
    <section className="library" id="work" aria-labelledby="work-title">
      <div className="bar">
        <h2 id="work-title" className="section-title">Work</h2>
        <div className="seg" role="group" aria-label="Sort">
          {SORTS.map((s) => (
            <button key={s.id} type="button" aria-pressed={sort === s.id} onClick={() => setSort(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Search"
          aria-label="Search the library"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
        />
      </div>
      <p className="sr-only" aria-live="polite">
        {visible.length} {visible.length === 1 ? 'item' : 'items'}
      </p>

      <div className="grid">
        {visible.map((e) => {
          const s = e.placeId ? data.games[e.placeId] : undefined
          const live = ready && s !== undefined
          const image = e.cover ?? s?.icon
          const proof = live && s ? `${fmt(s.visits)} visits` : staticProof(e)
          return (
            <a key={e.placeId ?? e.link} className="tile" href={e.link} target="_blank" rel="noreferrer">
              <div className={image ? 'cover' : 'cover placeholder'}>
                {image ? (
                  <img src={image} alt="" loading="lazy" decoding="async" width={512} height={512} />
                ) : (
                  <b className="mono" aria-hidden="true">{initials(e.name)}</b>
                )}
                {filter === 'all' && <span className="kind" aria-hidden="true">{KIND_LABEL[e.kind]}</span>}
                {proof && <span className="proof num" aria-hidden="true">{proof}</span>}
                {live && s && s.playing > 0 && <span className="live on-cover" aria-hidden="true" />}
              </div>
              <strong>{e.name}</strong>
              <span className="sr-only">, {KIND_LABEL[e.kind]}, opens in new tab</span>
              <span className="stats num">
                {live && s ? (
                  <>
                    {s.playing > 0 && <>{fmt(s.playing)} playing · </>}
                    {fmt(s.visits)} visits ·{' '}
                    {/* QA : meme forme que la meta statique (« 96% liked » au milieu), sinon la ligne
                        perdait un segment au passage en live et la grille changeait de hauteur. */}
                    {likedPercent(s) !== null && <>{likedPercent(s)}% liked · </>}
                    {fmt(s.favorites)} favorites
                  </>
                ) : (
                  (e.meta ?? e.year ?? '')
                )}
              </span>
              <span className="tile-tagline">{e.tagline}</span>
            </a>
          )
        })}
        {visible.length === 0 && (
          <p className="empty" role="status">
            {query ? (
              <>
                No results for “{query}”{filter !== 'all' && ` in ${NAV_LABEL[filter]}`}.{' '}
                <button type="button" className="link-btn" onClick={clear}>Clear search</button>
              </>
            ) : filter === 'all' ? (
              'Nothing here yet.'
            ) : (
              `No ${NAV_LABEL[filter].toLowerCase()} yet.`
            )}
          </p>
        )}
      </div>
    </section>
  )
}
