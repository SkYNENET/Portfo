// Config Vite : React plus deux plugins maison.
// - seoHtml : remplace %SITE_URL% et %OG_IMAGE% d'index.html par des URL absolues, car les unfurlers
//   (Discord, LinkedIn, X) refusent une og:image relative. L'origine vient de Vercel
//   (VERCEL_PROJECT_PRODUCTION_URL, sinon VERCEL_URL du preview), localhost:5173 hors Vercel.
// - devApi : dev uniquement : par défaut exécute le vrai api/roblox.ts (Roblox joignable depuis le Mac),
//   ?mock=ready|slow|error|partial sert dev/roblox-fixture.json pour prouver les états sans réseau ni 429.
//   Le build de prod n'en voit rien (apply: 'serve') : sur Vercel, api/ est servi par la plateforme.

import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin, type ViteDevServer } from 'vite'

function seoHtml(): Plugin {
  return {
    name: 'seo-html',
    transformIndexHtml(html) {
      const origin = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL ?? 'localhost:5173'}`
      return html.replaceAll('%SITE_URL%', origin + '/').replaceAll('%OG_IMAGE%', origin + '/og.png')
    },
  }
}

// Forme de dev/roblox-fixture.json : la meme que la reponse de /api/roblox (RobloxData de src/roblox.ts).
interface FixtureGame {
  name?: string
  playing: number
  visits: number
  favorites: number
  likes?: number
  dislikes?: number
  icon?: string
  thumbnail?: string
}

interface Fixture {
  _note?: string
  games: Record<string, FixtureGame>
  groups: Record<string, { members: number; icon?: string }>
  fetchedAt?: string
  partial?: boolean
}

function devApi(): Plugin {
  return {
    name: 'dev-roblox-api',
    apply: 'serve',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/roblox', async (req, res) => {
        // `use(path, …)` retire le prefixe de req.url : on repart de l'URL d'origine.
        const url = new URL(req.originalUrl ?? req.url ?? '', 'http://localhost')
        const mock = url.searchParams.get('mock')
        try {
          if (mock) {
            // Fixture relue a chaque requete : modifiable sans relancer le serveur.
            const body = JSON.parse(readFileSync(new URL('./dev/roblox-fixture.json', import.meta.url), 'utf8')) as Fixture
            if (mock === 'slow') await new Promise((r) => setTimeout(r, 3000))
            if (mock === 'error') {
              res.statusCode = 503
              res.end('{}')
              return
            }
            if (mock === 'partial') {
              // Un bloc Roblox en echec (votes, miniatures) : jamais un 0 invente, le front masque.
              for (const g of Object.values(body.games)) {
                delete g.likes
                delete g.dislikes
                delete g.thumbnail
              }
              body.partial = true
            }
            body.fetchedAt = new Date().toISOString()
            res.setHeader('content-type', 'application/json')
            res.setHeader('cache-control', 'no-store')
            res.end(JSON.stringify(body))
            return
          }
          // Vite ne fait pas tourner les fonctions Vercel : on appelle le handler GET directement
          // (API web uniquement : fetch, Request, Response, presentes dans Node 22).
          const mod = (await server.ssrLoadModule('/api/roblox.ts')) as {
            GET: (request: Request) => Promise<Response>
          }
          const out = await mod.GET(new Request(url))
          res.statusCode = out.status
          out.headers.forEach((v, k) => res.setHeader(k, v))
          res.end(await out.text())
        } catch (e) {
          res.statusCode = 500
          res.end(String(e))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seoHtml(), devApi()],
})
