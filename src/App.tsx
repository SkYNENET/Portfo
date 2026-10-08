import { useMemo, useState } from 'react'
import { communities, entries, profile, type Kind } from './content'
import { fmt, likedPercent, useRoblox } from './roblox'
import './App.css'

type Filter = 'all' | Kind

const NAV: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Home' },
  { id: 'game', label: 'Games' },
  { id: 'map', label: 'Maps' },
  { id: 'web', label: 'Web' },
]

const KIND_LABEL: Record<Kind, string> = { game: 'Game', map: 'Map', web: 'Web' }

const PLACE_IDS = entries.flatMap((e) => (e.placeId ? [e.placeId] : []))
const GROUP_IDS = communities.flatMap((c) => (c.groupId ? [c.groupId] : []))

const gradient = (tone: [string, string]) =>
  `linear-gradient(145deg, ${tone[0]}, ${tone[1]})`

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0)

export default function App() {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const roblox = useRoblox(PLACE_IDS, GROUP_IDS)

  const featured = entries.find((e) => e.featured) ?? entries[0]
  const featuredStats = featured.placeId ? roblox.games[featured.placeId] : undefined
  const featuredLiked = featuredStats ? likedPercent(featuredStats) : null

  const games = Object.values(roblox.games)
  const groups = Object.values(roblox.groups)
  const hasStats = games.length > 0 || groups.length > 0

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return entries.filter(
      (e) =>
        (filter === 'all' || e.kind === filter) &&
        (!q || `${e.name} ${e.tagline} ${e.meta ?? ''}`.toLowerCase().includes(q)),
    )
  }, [filter, query])

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="me">
          <div className="avatar" aria-hidden>
            {profile.name.charAt(0)}
          </div>
          <div>
            <strong>{profile.name}</strong>
            <span>{profile.role}</span>
          </div>
        </div>

        <nav aria-label="Library">
          {NAV.map((n) => (
            <button
              key={n.id}
              className={filter === n.id ? 'nav-item active' : 'nav-item'}
              onClick={() => setFilter(n.id)}
            >
              {n.label}
              <em>{n.id === 'all' ? entries.length : entries.filter((e) => e.kind === n.id).length}</em>
            </button>
          ))}
        </nav>

        <p className="status">
          <i /> {profile.status}
        </p>
      </aside>

      <main className="main">
        <a className="banner" href={featured.link} target="_blank" rel="noreferrer"
           style={{ background: gradient(featured.tone) }}>
          {(featured.cover ?? featuredStats?.icon) && (
            <img src={featured.cover ?? featuredStats?.icon} alt="" />
          )}
          <div className="banner-text">
            <span className="chip">Featured {KIND_LABEL[featured.kind]}</span>
            <h1>{featured.name}</h1>
            <p>{featured.tagline}</p>
            {featuredStats && (
              <p className="banner-stats">
                <span>{fmt(featuredStats.playing)} playing now</span>
                <span>{fmt(featuredStats.visits)} visits</span>
                {featuredLiked !== null && <span>{featuredLiked}% liked</span>}
              </p>
            )}
            <span className="play">{featured.kind === 'web' ? 'Open' : 'Play'}</span>
          </div>
        </a>

        <div className="bar">
          <h2>Library</h2>
          <input
            type="search"
            placeholder="Search"
            aria-label="Search the library"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="grid">
          {visible.map((e) => {
            const s = e.placeId ? roblox.games[e.placeId] : undefined
            const image = e.cover ?? s?.icon
            return (
              <a key={e.name} className="tile" href={e.link} target="_blank" rel="noreferrer">
                <div className="cover" style={{ background: gradient(e.tone) }}>
                  {image ? <img src={image} alt="" loading="lazy" /> : <b>{e.name}</b>}
                  <span className="kind">{KIND_LABEL[e.kind]}</span>
                </div>
                <strong>{e.name}</strong>
                {s ? (
                  <span className="stats">
                    <i className={s.playing > 0 ? 'live on' : 'live'} />
                    {fmt(s.playing)} playing · {fmt(s.visits)} visits
                  </span>
                ) : (
                  <span>{e.meta ?? e.tagline}</span>
                )}
              </a>
            )
          })}
          {visible.length === 0 && <p className="empty">Nothing here yet.</p>}
        </div>
      </main>

      <aside className="rail">
        {hasStats && (
          <section className="panel">
            <h3>Live stats</h3>
            <div className="numbers">
              {games.length > 0 && (
                <>
                  <div>
                    <b>{fmt(sum(games.map((g) => g.playing)))}</b>
                    <span>Playing now</span>
                  </div>
                  <div>
                    <b>{fmt(sum(games.map((g) => g.visits)))}</b>
                    <span>Total visits</span>
                  </div>
                  <div>
                    <b>{fmt(sum(games.map((g) => g.favorites)))}</b>
                    <span>Favorites</span>
                  </div>
                </>
              )}
              {groups.length > 0 && (
                <div>
                  <b>{fmt(sum(groups.map((g) => g.members)))}</b>
                  <span>Community members</span>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="panel">
          <h3>Communities</h3>
          <ul>
            {communities.map((c) => {
              const g = c.groupId ? roblox.groups[c.groupId] : undefined
              return (
                <li key={c.name}>
                  <div className="avatar sm" style={{ background: gradient(c.tone) }} aria-hidden>
                    {g?.icon ? <img src={g.icon} alt="" /> : c.name.charAt(0)}
                  </div>
                  <div className="grow">
                    <strong>{c.name}</strong>
                    <span>
                      {[c.platform, g ? `${fmt(g.members)} members` : c.members]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                  </div>
                  <a className="join" href={c.link} target="_blank" rel="noreferrer">
                    Join
                  </a>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="panel">
          <h3>About</h3>
          <p>{profile.bio}</p>
        </section>

        <section className="panel">
          <h3>Contact</h3>
          <p className="links">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
            <a href={profile.cv}>Resume (PDF)</a>
          </p>
        </section>
      </aside>
    </div>
  )
}
