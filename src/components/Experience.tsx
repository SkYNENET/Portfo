// Experience (#experience) : timeline travail + formation depuis content.experience.
//
// CONTRAT (vague B, T8 : ce fichier et Experience.css uniquement)
// Props : aucune
// Classes : .experience .timeline .step (.work / .education / .community) .step-period .step-body
//           .step-head .kind-tag .step-org .tech .step-link
// Regles : une periode ou une org inconnue est masquee via known() (colonne vide, jamais TO CONFIRM) ;
// rend null si la liste est vide.

import { experience, type Experience as Step } from '../content'
import { Ext, known } from '../ui'
import './Experience.css'

const KIND_WORD: Record<Step['kind'], string> = { work: 'Work', education: 'Education', community: 'Community' }

// Le libelle du lien suit la cible : GitHub pour les depots, Roblox pour les profils et groupes.
const linkText = (href: string): string => (href.includes('github.com') ? 'View on GitHub' : 'Open on Roblox')

export default function Experience() {
  if (experience.length === 0) return null
  return (
    <section className="experience" id="experience" aria-labelledby="experience-title">
      <h2 id="experience-title" className="section-title">Experience</h2>
      <ol className="timeline">
        {experience.map((x) => {
          // known() est le dernier verrou : '' ou « TO CONFIRM » dans content.ts ne s'affiche jamais.
          const period = known(x.period)
          const org = known(x.org)
          const summary = known(x.summary)
          return (
            <li key={x.id} className={`step ${x.kind}`}>
              {/* Span vide quand la periode est inconnue : la colonne reste alignee sur desktop. */}
              <span className="step-period num">{period ?? ''}</span>
              <div className="step-body">
                <div className="step-head">
                  <strong>{x.role}</strong>
                  <span className="tag kind-tag">{KIND_WORD[x.kind]}</span>
                </div>
                {org && <span className="step-org">{org}</span>}
                {summary && <p>{summary}</p>}
                {x.tech.length > 0 && (
                  <ul className="tech" aria-label="Technologies">
                    {x.tech.map((t) => (
                      <li key={t} className="tag">{t}</li>
                    ))}
                  </ul>
                )}
                {x.link && (
                  // Mention lecteur d'ecran : quatre liens « Open on Roblox » restent distinguables.
                  <Ext className="step-link" href={x.link} label={`${org ?? x.role} (opens in new tab)`}>
                    {linkText(x.link)}
                  </Ext>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
