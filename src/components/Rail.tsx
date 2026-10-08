// Rail droit : panneau « Right now » (toujours rendu, zero saut) et « Communities » scinde en
// « My groups » / « Roles in other studios ».
//
// CONTRAT (vague B, T10 : ce fichier et Rail.css uniquement)
// Props : { roblox: RobloxState }
// Classes : .rail .numbers .panel-note .sub .grow .join (+ .panel .panel-title .avatar.sm .tag.role d'index.css)
// Regles : valeurs statiques (facts, meta, members de content.ts) au premier rendu, squelettes a
// largeur reservee (Skel) pendant le chargement, remplacees en place ; « Playing now » seulement
// si > 0 ; « Members across my groups » = groupes Owner + Co-owner uniquement ; bouton « Open » nomme.

import { communities, entries, facts, type Community } from '../content'
import { fmt, fmtFull, legend, liveFact, playingNow, type RobloxState } from '../roblox'
import { Ext, Skel, isOwn, ownGroupIds, parseCount, placeIdsOf, splitMeta, sum } from '../ui'
import './Rail.css'

export interface RailProps {
  roblox: RobloxState
}

const PLACE_IDS = placeIdsOf(entries)
const OWN = ownGroupIds(communities)
const STATIC_NOTE = 'Figures from October 2026'

// Repli statique : visites depuis facts, favoris et membres sommes depuis les meta / members de
// content.ts (instantane du 2026-10-08), pour que le panneau existe des le premier rendu.
const STATIC_VISITS = facts.find((f) => f.live === 'visits')?.value ?? ''
const STATIC_FAVORITES = sum(
  entries.map((e) => parseCount(splitMeta(e.meta).find((x) => x.endsWith('favorites')))),
)
const STATIC_MEMBERS = sum(communities.filter(isOwn).map((c) => parseCount(c.members)))

interface Item {
  b: string
  label: string
}

export default function Rail({ roblox }: RailProps) {
  const { data, status } = roblox
  const ready = status === 'ready'

  // Un agregat live a 0 veut dire « bloc manquant » (429 Roblox, groupe absent) : on garde le statique
  // plutot que d'afficher un faux zero.
  const live = (key: 'visits' | 'favorites' | 'members'): number =>
    ready ? liveFact(data, key, PLACE_IDS, OWN) : 0
  const visits = live('visits') > 0 ? fmt(live('visits')) : STATIC_VISITS
  const favorites = live('favorites') > 0 ? live('favorites') : STATIC_FAVORITES
  const members = live('members') > 0 ? live('members') : STATIC_MEMBERS
  const playing = ready ? playingNow(data, PLACE_IDS) : 0

  const items: Item[] = [
    ...(playing > 0 ? [{ b: fmt(playing), label: 'Playing now' }] : []),
    { b: visits, label: 'Total visits' },
    { b: fmtFull(favorites), label: 'Favorites' },
    ...(OWN.length > 0 ? [{ b: fmtFull(members), label: 'Members across my groups' }] : []),
  ]

  const item = (c: Community) => {
    const g = c.groupId ? data.groups[c.groupId] : undefined
    return (
      <li key={c.groupId ?? c.link}>
        <div className="avatar sm" aria-hidden="true">
          {g?.icon ? <img src={g.icon} alt="" loading="lazy" /> : c.name.charAt(0)}
        </div>
        <div className="grow">
          <strong>{c.name}</strong>
          <span>
            {c.role && <span className="tag role">{c.role}</span>}
            {c.role && ' · '}
            {ready && g ? `${fmtFull(g.members)} members` : c.members}
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
        <h3 className="sub">My groups</h3>
        <ul>{communities.filter(isOwn).map(item)}</ul>
        <p className="panel-note num">{fmtFull(members)} members across my groups</p>
        <h3 className="sub">Roles in other studios</h3>
        <ul>{communities.filter((c) => !isOwn(c)).map(item)}</ul>
      </section>
    </aside>
  )
}
