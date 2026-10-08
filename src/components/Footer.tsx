// Footer pleine largeur : identite courte et phrase de methode sur les chiffres.
//
// CONTRAT (vague B, T9 : ce fichier et Footer.css uniquement)
// Props : aucune
// Classes : .foot
// Regles : ville / ecole ajoutees seulement quand known(profile.location) (jamais TO CONFIRM).

import { profile } from '../content'
import { Ext, at, known } from '../ui'
import './Footer.css'

export default function Footer() {
  const location = known(profile.location)
  const handle = at(profile.handle)
  return (
    <footer className="foot">
      <span>
        {profile.name}
        {location ? ` · ${location}` : ''}
      </span>
      <span>
        Roblox {profile.robloxProfile ? <Ext href={profile.robloxProfile}>{handle}</Ext> : handle} ·{' '}
        <Ext href={profile.github}>GitHub SkYNENET</Ext>
      </span>
      <span>Every number comes from Roblox public APIs, cached five minutes. Nothing is self-reported.</span>
    </footer>
  )
}
