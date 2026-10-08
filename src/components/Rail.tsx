// Rail droit : panneau « Right now » (toujours rendu, zero saut) et « Communities » scinde en
// « My groups » / « Roles in other studios ».
//
// CONTRAT (vague B, T10 : ce fichier et Rail.css uniquement)
// Props : { roblox: RobloxState }
// Classes : .rail .numbers .panel-note .sub .grow .join (+ .panel .panel-title .avatar.sm .tag.role d'index.css)
// Regles : valeurs statiques (facts, meta, members de content.ts) au premier rendu, squelettes a
// largeur reservee (Skel) pendant le chargement, remplacees en place ; « Playing now » seulement
// si > 0 ; « Members across my groups » = groupes Owner + Co-owner uniquement ; bouton « Open » nomme.

import { communities, entries, facts, type Community, type Entry } from '../content'
import { fmt, fmtFull, legend, liveFact, playingNow, type RobloxData, type RobloxState } from '../roblox'
import { Ext, Skel, isOwn, ownGroupIds, parseCount, placeIdsOf, splitMeta, sum } from '../ui'
import './Rail.css'

export interface RailProps {
  roblox: RobloxState
}

type GameKey = 'visits' | 'favorites'

const PLACE_IDS = placeIdsOf(entries)
const OWN = ownGroupIds(communities)
const GAMES = entries.filter((e) => e.placeId !== undefined)
const MINE = communities.filter(isOwn)
const OTHERS = communities.filter((c) => !isOwn(c))
const STATIC_NOTE = 'Figures from October 2026'

// Chiffre statique d'un jeu, lu dans sa meta de content.ts : '16.7K visits · 267 favorites' -> 16700 / 267.
const metaCount = (e: Entry, key: GameKey): number =>
  parseCount(splitMeta(e.meta).find((x) => x.endsWith(key)))

// Repli statique du panneau (instantane du 2026-10-08) pour qu'il existe des le premier rendu :
// visites = la chaine du hero (« 56K+ », que le live ne contredit jamais), favoris et membres sommes
// depuis content.ts. Aucun chiffre code en dur ici.
const STATIC_VISITS_SUM = sum(GAMES.map((e) => metaCount(e, 'visits')))
const STATIC_VISITS =
  facts.find((f) => f.live === 'visits')?.value ?? (STATIC_VISITS_SUM > 0 ? fmt(STATIC_VISITS_SUM) : '')
const STATIC_FAVORITES = sum(GAMES.map((e) => metaCount(e, 'favorites')))
const STATIC_MEMBERS = sum(MINE.map((c) => parseCount(c.members)))

// Live element par element avec repli statique : un jeu ou un groupe absent de la reponse (429 Roblox,
// etat partial) garde son chiffre de content.ts. La ligne « members across my groups » reste ainsi
// egale a la somme de la liste affichee juste au-dessus, et aucun total n'est sous-estime.
const gameStat = (data: RobloxData, e: Entry, key: GameKey): number => {
  const live = e.placeId ? data.games[e.placeId] : undefined
  return live ? live[key] : metaCount(e, key)
}
const groupMembers = (data: RobloxData, c: Community): number => {
  const live = c.groupId ? data.groups[c.groupId] : undefined
  return live ? live.members : parseCount(c.members)
}

interface Item {
  b: string
  label: string
}

export default function Rail({ roblox }: RailProps) {
  const { data, status } = roblox
  const ready = status === 'ready'
  // Il faut au moins un jeu (ou un groupe) dans la reponse pour quitter le statique : jamais un faux zero.
  const gamesLive = ready && liveFact(data, 'games', PLACE_IDS, OWN) > 0
  const groupsLive = ready && OWN.some((id) => data.groups[id] !== undefined)

  const visits = gamesLive ? fmt(sum(GAMES.map((e) => gameStat(data, e, 'visits')))) : STATIC_VISITS
  const favorites = gamesLive ? sum(GAMES.map((e) => gameStat(data, e, 'favorites'))) : STATIC_FAVORITES
  const members = groupsLive ? sum(MINE.map((c) => groupMembers(data, c))) : STATIC_MEMBERS
  const playing = ready ? playingNow(data, PLACE_IDS) : 0

  const items: Item[] = [
    ...(playing > 0 ? [{ b: fmt(playing), label: 'Playing now' }] : []),
    ...(visits ? [{ b: visits, label: 'Total visits' }] : []),
    ...(favorites > 0 ? [{ b: fmtFull(favorites), label: 'Favorites' }] : []),
    ...(members > 0 ? [{ b: fmtFull(members), label: 'Members across my groups' }] : []),
  ]

  const item = (c: Community) => {
    const g = c.groupId ? data.groups[c.groupId] : undefined
    const count = ready && g ? `${fmtFull(g.members)} members` : c.members
    return (
      <li key={c.groupId ?? c.link}>
        <div className="avatar sm" aria-hidden="true">
          {g?.icon ? <img src={g.icon} alt="" loading="lazy" /> : c.name.charAt(0)}
        </div>
        <div className="grow">
          <strong>{c.name}</strong>
          <span>
            {c.role && <span className="tag role">{c.role}</span>}
            {c.role && count && ' · '}
            {count}
          </span>
        </div>
        <Ext className="join" href={c.link} label={`${c.name} on ${c.platform} (opens in new tab)`}>
          Open
        </Ext>
      </li>
    )
  }

  return (
    <aside className="rail" aria-label="Live stats and communities">
      <section className="panel" aria-labelledby="live-title" aria-busy={status === 'loading'}>
        <h2 className="panel-title" id="live-title">Right now</h2>
        <div className="numbers num">
          {items.map((i) => (
            <div key={i.label}>
              <b>
                <Skel when={status === 'loading'}>{i.b}</Skel>
              </b>
              <span>{i.label}</span>
            </div>
          ))}
        </div>
        <p className="panel-note">{legend(roblox, STATIC_NOTE)}</p>
      </section>

      <section className="panel" aria-labelledby="communities-title">
        <h2 className="panel-title" id="communities-title">Communities</h2>
        {MINE.length > 0 && (
          <>
            <h3 className="sub">My groups</h3>
            <ul>{MINE.map(item)}</ul>
            {members > 0 && <p className="panel-note num">{fmtFull(members)} members across my groups</p>}
          </>
        )}
        {OTHERS.length > 0 && (
          <>
            <h3 className="sub">Roles in other studios</h3>
            <ul>{OTHERS.map(item)}</ul>
          </>
        )}
      </section>
    </aside>
  )
}
