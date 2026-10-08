// Contact (#contact) : email + Copy quand connu, sinon « Email coming soon », liens Roblox / GitHub / CV.
//
// CONTRAT (vague B, T9 : ce fichier et Contact.css uniquement)
// Props : aucune
// Classes : .contact .contact-lead .email .copy .email-soon .contact-links
// Regles : mailto rendu seulement si known(profile.email) contient un @ ; Resume seulement si
// known(profile.cv). LinkedIn : ajouter un champ profile.linkedin au schema quand connu (evolution
// du schema, pas de cast).

import { useState } from 'react'
import { profile } from '../content'
import { Ext, known } from '../ui'
import './Contact.css'

export default function Contact() {
  const email = known(profile.email)
  const hasEmail = !!email && email.includes('@')
  const cv = known(profile.cv)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    if (!email) return
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // presse-papiers indisponible (http, permissions) : rien, le mailto reste
    }
  }

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <h2 id="contact-title" className="section-title">Contact</h2>
      <p className="contact-lead">Looking for an internship in 2027. Say hi.</p>
      {hasEmail ? (
        <div className="email">
          <code>{email}</code>
          <button type="button" className="copy" onClick={copy}>
            {copied ? 'Copied' : 'Copy'}
          </button>
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
