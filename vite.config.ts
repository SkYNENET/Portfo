import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin, type ViteDevServer } from 'vite'

/**
 * En dev, Vite ne fait pas tourner les fonctions Vercel : sans ceci, la page
 * locale n'a ni jaquettes ni stats live et on ne voit le vrai rendu que sur
 * un preview Vercel. Ce plugin sert /api/roblox en appelant directement le
 * handler GET de api/roblox.ts (il n'utilise que des API web, fetch/Request/
 * Response, disponibles dans Node 22). Dev uniquement (`apply: 'serve'`),
 * le build de prod n'en voit rien.
 */
function localRobloxApi(): Plugin {
  return {
    name: 'local-roblox-api',
    apply: 'serve',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/roblox', async (req, res) => {
        try {
          // `use(path, …)` retire le prefixe de req.url : on repart de l'URL d'origine
          const url = new URL(req.originalUrl ?? req.url ?? '/', 'http://localhost')
          const mod = (await server.ssrLoadModule('/api/roblox.ts')) as {
            GET: (request: Request) => Promise<Response>
          }
          const response = await mod.GET(new Request(url.toString()))
          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (error) {
          res.statusCode = 500
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify({ error: 'local roblox api failed', detail: String(error) }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localRobloxApi()],
})
