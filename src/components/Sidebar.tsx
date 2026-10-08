// Sidebar gauche : identite, statut, filtres de la bibliotheque, ancres, bouton Resume.
//
// CONTRAT (vague B, T4 : ce fichier et Sidebar.css uniquement)
// Props : { filter: Filter; onFilter: (f: Filter) => void }
// Classes : .sidebar .me .me-text .me-name .me-handle .me-role .me-since .status
//           .filters .site-nav .nav-item .count .resume
// Regles : pas de titre ici (le h1 est dans Hero) ; filtres = boutons aria-pressed construits depuis
// les kinds presents (navItems) ; Resume rendu seulement si known(profile.cv).

import { entries, profile } from '../content'
import { Ext, NAV_LABEL, at, known, navItems, type Filter } from '../ui'
import './Sidebar.css'

export interface SidebarProps {
  filter: Filter
  onFilter: (f: Filter) => void
}

// Calcules une fois au chargement du module : entries est une constante de content.ts.
const NAV = navItems(entries)
const count = (id: Filter) => (id === 'all' ? entries.length : entries.filter((e) => e.kind === id).length)

// Texte UI derive des donnees verifiees du 2026-10-08 (docs/data/roblox.json : 1 035 abonnes,
// compte cree le 2025-01-20). A mettre a jour apres un nouveau fetch_roblox.py.
const SINCE = '1,035 followers · on Roblox since Jan 2025'

export default function Sidebar({ filter, onFilter }: SidebarProps) {
  const cv = known(profile.cv)
  return (
    <aside className="sidebar" aria-label="Profile and navigation">
      <div className="me">
        <div className="avatar" aria-hidden="true">
          {profile.name.charAt(0)}
        </div>
        <div className="me-text">
          <strong className="me-name">{profile.name}</strong>
          {profile.handle && profile.robloxProfile && (
            <Ext className="me-handle" href={profile.robloxProfile} label="on Roblox (opens in new tab)">
              {at(profile.handle)}
            </Ext>
          )}
          <span className="me-role">{profile.role}</span>
        </div>
      </div>
      <p className="me-since num">{SINCE}</p>

      {/* Toujours visible, mobile compris : c'est le message principal pour un recruteur. */}
      <p className="pill ok status">
        <span className="dot" aria-hidden="true" /> {profile.status}
      </p>

      <div role="group" aria-label="Filter the library" className="filters">
        {NAV.map((id) => {
          const n = count(id)
          return (
            <button
              key={id}
              type="button"
              className="nav-item"
              aria-pressed={filter === id}
              onClick={() => onFilter(id)}
            >
              {NAV_LABEL[id]}
              <span className="count num" aria-hidden="true">{n}</span>
              {/* Le compteur visuel est masque aux lecteurs d'ecran, qui recoivent une phrase complete. */}
              <span className="sr-only">, {n} {n === 1 ? 'item' : 'items'}</span>
            </button>
          )
        })}
      </div>

      <nav aria-label="Site" className="site-nav">
        <a className="nav-item" href="#work">Work</a>
        <a className="nav-item" href="#experience">Experience</a>
        <a className="nav-item" href="#contact">Contact</a>
      </nav>

      {/* Aucun lien tant que public/cv.pdf n'existe pas (cv: '' dans content.ts). */}
      {cv && (
        <Ext className="btn primary resume" href={cv} type="application/pdf">
          Resume (PDF)
        </Ext>
      )}
    </aside>
  )
}
