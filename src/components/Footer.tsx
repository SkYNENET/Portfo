// Footer pleine largeur : identite courte et phrase de methode sur les chiffres.
//
// CONTRAT (vague B, T9 : ce fichier et Footer.css uniquement)
// Props : aucune
// Classes : .foot
// Regles : ville / ecole ajoutees seulement quand known(profile.location) (jamais TO CONFIRM).

import { profile } from '../content'
import { Ext, at, known } from '../ui'
import './Footer.css'

/** 'https://github.com/SkYNENET' -> 'SkYNENET' : le pseudo suit content.ts au lieu d'etre recopie ici. */
const githubUser = (url: string): string => url.replace(/\/+$/, '').split('/').pop() ?? ''

export default function Footer() {
  const location = known(profile.location)
  const handle = at(profile.handle)
  const github = githubUser(profile.github)
  return (
    <footer className="foot">
      <span>
        {profile.name}
        {location ? ` · ${location}` : ''}
      </span>
      <span>
        {/* Sans handle, « Roblox » seul n'aurait rien a designer : le segment entier disparait. */}
        {handle && (
          <>
            Roblox{' '}
            {profile.robloxProfile ? (
              <Ext href={profile.robloxProfile} label="on Roblox (opens in new tab)">
                {handle}
              </Ext>
            ) : (
              handle
            )}
            {' · '}
          </>
        )}
        <Ext href={profile.github}>{github ? `GitHub ${github}` : 'GitHub'}</Ext>
      </span>
      <span>Every number comes from Roblox public APIs, cached five minutes. Nothing is self-reported.</span>
    </footer>
  )
}
