// Composition de la page dans l'ordre du plan : sidebar, main (hero, banniere, library, experience,
// contact), rail, footer. L'etat (filtre, recherche) et le fetch Roblox vivent ici, le reste dans src/components.

import { useState } from 'react'
import { communities, entries } from './content'
import { useRoblox } from './roblox'
import { groupIdsOf, placeIdsOf, type Filter } from './ui'
import Banner from './components/Banner'
import Contact from './components/Contact'
import Experience from './components/Experience'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Library from './components/Library'
import Rail from './components/Rail'
import Sidebar from './components/Sidebar'
import './App.css'

const PLACE_IDS = placeIdsOf(entries)
const GROUP_IDS = groupIdsOf(communities)

export default function App() {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const roblox = useRoblox(PLACE_IDS, GROUP_IDS)

  return (
    <div className="shell">
      <Sidebar filter={filter} onFilter={setFilter} />
      <main className="main">
        <Hero roblox={roblox} />
        <Banner roblox={roblox} />
        <Library filter={filter} onFilter={setFilter} query={query} onQuery={setQuery} roblox={roblox} />
        <Experience />
        <Contact />
      </main>
      <Rail roblox={roblox} />
      <Footer />
    </div>
  )
}
