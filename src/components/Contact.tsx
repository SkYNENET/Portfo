// Contact (#contact) : email + Copy quand connu, sinon « Email coming soon », liens Roblox / GitHub / CV.
//
// CONTRAT (vague B, T9 : ce fichier et Contact.css uniquement)
// Props : aucune
// Classes : .contact .contact-lead .email .copy .email-soon .contact-links
// Regles : mailto rendu seulement si known(profile.email) contient un @ ; Resume seulement si
// known(profile.cv). LinkedIn : ajouter un champ profile.linkedin au schema quand connu (evolution
// du schema, pas de cast).

import { useEffect, useRef, useState } from 'react'
import { profile } from '../content'
import { Ext, known } from '../ui'
import './Contact.css'

// Duree d'affichage de « Copied » : assez longue pour etre lue, assez courte pour ne pas figer le bouton.
const COPIED_MS = 2000

export default function Contact() {
  const email = known(profile.email)
  // Un email sans @ ferait un mailto casse : il est traite comme inconnu.
  const hasEmail = !!email && email.includes('@')
  const cv = known(profile.cv)
  const [copied, setCopied] = useState(false)
  // Le timer vit dans une ref : un second clic remplace le precedent au lieu d'empiler des retours
  // a « Copy » decales, et le demontage l'annule.
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    if (!email) return
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), COPIED_MS)
    } catch {
      // presse-papiers indisponible (http, permission refusee, navigator.clipboard absent) : rien,
      // l'adresse reste lisible et le lien « Email me » suffit
    }
  }

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <h2 id="contact-title">Contact</h2>
      <p className="contact-lead">Looking for an internship in 2027. Say hi.</p>
      {hasEmail ? (
        <div className="email">
          <code>{email}</code>
          <button type="button" className="copy" onClick={copy}>
            {copied ? 'Copied' : 'Copy'}
          </button>
          {/* Toujours dans le DOM : un role=status cree a la volee n'est pas annonce. */}
          <span className="sr-only" role="status">{copied ? 'Email copied to clipboard' : ''}</span>
        </div>
      ) : (
        <p className="email-soon">Email coming soon · reach me on Roblox or GitHub for now.</p>
      )}
      <div className="contact-links">
        {hasEmail && <a href={`mailto:${email}`}>Email me</a>}
        {profile.robloxProfile && <Ext href={profile.robloxProfile}>Roblox profile</Ext>}
        <Ext href={profile.github}>GitHub</Ext>
        {cv && (
          <Ext className="btn primary" href={cv} type="application/pdf">
            Resume (PDF)
          </Ext>
        )}
      </div>
    </section>
  )
}
