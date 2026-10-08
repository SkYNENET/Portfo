// Banniere « featured » : carte blanche scindee, texte noir a gauche, miniature 16:9 a droite.
//
// CONTRAT (vague B, T6 : ce fichier et Banner.css uniquement)
// Props : { roblox: RobloxState }
// Classes : .banner .banner-text .chip .banner-tagline .banner-stats .play .banner-media .banner-ph
// Regles : h2 (pas h1, le h1 est Hector dans le Hero) ; le bouton Play est le SEUL lien, etendu a
// toute la carte par ::after ; « N playing now » seulement si > 0 (jamais « 0 playing ») ; stats
// statiques (meta de content.ts) au premier rendu, remplacees EN PLACE par le live quand il est pret
// (ligne a hauteur reservee, pas de squelette) ; en 'error' ou en partial sans ce jeu on garde le
// statique ; image = cover > thumbnail 16:9 > icone carree > degrade neutre (tone).

import { entries } from '../content'
import { fmt, likedPercent, type RobloxState } from '../roblox'
import { Ext, KIND_LABEL, gradient, known, splitMeta } from '../ui'
import './Banner.css'

export interface BannerProps {
  roblox: RobloxState
}

export default function Banner({ roblox }: BannerProps) {
  // Le jeu mis en avant est choisi dans content.ts (featured: true) ; a defaut, le premier de la liste.
  const featured = entries.find((e) => e.featured) ?? entries[0]
  const s = featured.placeId ? roblox.data.games[featured.placeId] : undefined
  // Pret seulement si ce jeu precis a repondu : en partial il peut manquer, on reste alors en statique.
  const ready = roblox.status === 'ready' && s !== undefined
  const img = featured.cover ?? s?.thumbnail ?? s?.icon
  const liked = s ? likedPercent(s) : null
  const isWeb = featured.kind === 'web'
  // known() : dernier verrou, rien de vide ni de « TO CONFIRM » ne doit atteindre l'ecran.
  const tagline = known(featured.tagline)

  return (
    <section className="banner" aria-labelledby="featured-title">
      <div className="banner-text">
        <span className="chip">Featured {KIND_LABEL[featured.kind].toLowerCase()}</span>
        <h2 id="featured-title">{featured.name}</h2>
        {tagline && <p className="banner-tagline">{tagline}</p>}
        <p className="banner-stats num">
          {/* `ready && s` : TS ne deduit pas s depuis ready, la double garde conserve le narrowing. */}
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
            // Meta statique de content.ts, deja au format compact de fmt : meme forme que le live.
            splitMeta(known(featured.meta)).map((x) => <span key={x}>{x}</span>)
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
      {/* Decoratif : le nom et le lien portent deja l'information, l'image est masquee aux lecteurs d'ecran. */}
      <div className="banner-media" aria-hidden="true">
        {img ? (
          // 768x432 = ratio de la miniature Roblox ; fetchPriority high car c'est l'image LCP de la page.
          <img src={img} alt="" width={768} height={432} fetchPriority="high" decoding="async" />
        ) : (
          <div className="banner-ph" style={{ background: gradient(featured.tone) }} />
        )}
      </div>
    </section>
  )
}
