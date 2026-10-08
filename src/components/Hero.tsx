// Hero : le seul h1 de la page (Hector), bio, statut et les 3 chiffres cles de content.facts.
//
// CONTRAT (vague B, T5 : ce fichier et Hero.css uniquement)
// Props : { roblox: RobloxState }
// Classes : .hero .eyebrow .hero-bio .facts .fact .facts-note
// Regles : les valeurs statiques de facts s'affichent au premier paint et sont remplacees EN PLACE
// par le live (pas de squelette, pas d'aria-live, hauteur reservee) ; en partial ou error on garde
// le statique ; 'visits' live s'affiche avec un « + » pour ne jamais contredire « 56K+ ».

import { communities, entries, facts, profile, type Fact } from '../content'
import { fmt, legend, liveFact, type RobloxState } from '../roblox'
import { ownGroupIds, placeIdsOf } from '../ui'
import './Hero.css'

export interface HeroProps {
  roblox: RobloxState
}

const PLACE_IDS = placeIdsOf(entries)
const OWN = ownGroupIds(communities)
const STATIC_NOTE = 'Public Roblox figures, October 2026'

function value(f: Fact, roblox: RobloxState): string {
  if (roblox.status !== 'ready' || !f.live || roblox.partial) return f.value
  const n = liveFact(roblox.data, f.live, PLACE_IDS, OWN)
  if (n <= 0) return f.value
  if (f.live === 'visits') return `${fmt(n)}+`
  if (f.live === 'games') return String(n)
  return fmt(n)
}

export default function Hero({ roblox }: HeroProps) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <p className="eyebrow">{profile.role}</p>
      <h1 id="hero-title">{profile.name}</h1>
      <p className="hero-bio">{profile.bio}</p>
      <p className="pill ok">
        <span className="dot" aria-hidden="true" /> {profile.status}
      </p>
      <ul className="facts" aria-label="Key figures">
        {facts.map((f) => (
          <li key={f.label} className="fact">
            <b className="num">{value(f, roblox)}</b>
            <span>{f.label}</span>
          </li>
        ))}
      </ul>
      <p className="facts-note">{legend(roblox, STATIC_NOTE)}</p>
    </section>
  )
}
