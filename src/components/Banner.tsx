// Banniere « featured » : carte blanche scindee, texte noir a gauche, miniature 16:9 a droite.
//
// CONTRAT (vague B, T6 : ce fichier et Banner.css uniquement)
// Props : { roblox: RobloxState }
// Classes : .banner .banner-text .chip .banner-tagline .banner-stats .play .banner-media .banner-ph
// Regles : h2 (pas h1) ; le bouton Play est le SEUL lien, etendu a toute la carte par ::after ;
// « N playing now » seulement si > 0 ; stats statiques (meta) tant que le live n'est pas pret ;
// image = cover > thumbnail 16:9 > icone carree > degrade neutre.

import { entries } from '../content'
import { fmt, likedPercent, type RobloxState } from '../roblox'
import { Ext, KIND_LABEL, gradient, splitMeta } from '../ui'
import './Banner.css'

export interface BannerProps {
  roblox: RobloxState
}

export default function Banner({ roblox }: BannerProps) {
  const featured = entries.find((e) => e.featured) ?? entries[0]
  const s = featured.placeId ? roblox.data.games[featured.placeId] : undefined
  const ready = roblox.status === 'ready' && s !== undefined
  const img = featured.cover ?? s?.thumbnail ?? s?.icon
  const liked = s ? likedPercent(s) : null
  const isWeb = featured.kind === 'web'

  return (
    <section className="banner" aria-labelledby="featured-title">
      <div className="banner-text">
        <span className="chip">Featured {KIND_LABEL[featured.kind].toLowerCase()}</span>
        <h2 id="featured-title">{featured.name}</h2>
        <p className="banner-tagline">{featured.tagline}</p>
        <p className="banner-stats num">
          {ready && s ? (
            <>
              {s.playing > 0 && (
                <span>
                  <span className="live" aria-hidden="true" /> {fmt(s.playing)} playing now
                </span>
              )}
              <span>{fmt(s.visits)} visits</span>
              {liked !== null && <span>{liked}% liked</span>}
              <span>{fmt(s.favorites)} favorites</span>
            </>
          ) : (
            splitMeta(featured.meta).map((x) => <span key={x}>{x}</span>)
          )}
        </p>
        <Ext
          className="play btn primary"
          href={featured.link}
          label={`${featured.name} on ${isWeb ? 'GitHub' : 'Roblox'} (opens in new tab)`}
        >
          {isWeb ? 'Open' : 'Play'}
        </Ext>
      </div>
      <div className="banner-media" aria-hidden="true">
        {img ? (
          <img src={img} alt="" width={768} height={432} fetchPriority="high" decoding="async" />
        ) : (
          <div className="banner-ph" style={{ background: gradient(featured.tone) }} />
        )}
      </div>
    </section>
  )
}
