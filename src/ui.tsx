// Primitives et helpers partages par tous les composants.
// FICHIER GELE apres la vague A : la vague B l'importe, ne le modifie pas.
//
// REGLES DU SITE (a respecter dans chaque composant) :
// - « playing » n'est affiche que si > 0 : jamais « 0 playing », jamais de pastille grise.
// - Aucune chaine « TO CONFIRM » a l'ecran : tout champ incertain de content.ts passe par known(),
//   qui renvoie undefined pour une valeur vide ou contenant TO CONFIRM (le composant masque alors
//   l'element). Les questions restent en commentaire dans content.ts.
// - Valeurs statiques de content.ts au premier rendu, remplacees EN PLACE par le live : les
//   conteneurs reservent leur hauteur (min-height) et Skel garde le texte en transparent.
// - Un seul h1 (Hero). Liens externes via <Ext> (target _blank + mention lecteur d'ecran).
// - ui.tsx n'importe que les TYPES de content.ts, jamais ses valeurs.

import type { ReactNode } from 'react'
import type { Community, Entry, Kind } from './content'

// ---------- filtres et libelles ----------

export type Filter = 'all' | Kind

export const KIND_LABEL: Record<Kind, string> = { game: 'Game', map: 'Map', web: 'Web' }
export const NAV_LABEL: Record<Filter, string> = { all: 'Home', game: 'Games', map: 'Maps', web: 'Web' }
export const KIND_ORDER: readonly Kind[] = ['game', 'map', 'web']

/** Filtres a afficher : Home puis seulement les kinds presents (« Maps » disparait tant que 0). */
export const navItems = (entries: readonly Pick<Entry, 'kind'>[]): Filter[] => {
  const kinds = new Set(entries.map((e) => e.kind))
  return ['all', ...KIND_ORDER.filter((k) => kinds.has(k))]
}

export const placeIdsOf = (entries: readonly Pick<Entry, 'placeId'>[]): number[] =>
  entries.flatMap((e) => (e.placeId ? [e.placeId] : []))

export const groupIdsOf = (communities: readonly Pick<Community, 'groupId'>[]): number[] =>
  communities.flatMap((c) => (c.groupId ? [c.groupId] : []))

// ---------- groupes ----------

/** Roles qui font d'un groupe « my group » (somme « members across my groups »). */
export const OWN_ROLES: readonly string[] = ['Owner', 'Co-owner']
export const isOwn = (c: Pick<Community, 'role'>): boolean => !!c.role && OWN_ROLES.includes(c.role)
export const ownGroupIds = (communities: readonly Pick<Community, 'role' | 'groupId'>[]): number[] =>
  groupIdsOf(communities.filter(isOwn))

// ---------- texte ----------

/** undefined si la chaine est vide, blanche ou contient TO CONFIRM : dernier verrou avant l'ecran. */
export function known(s?: string): string | undefined {
  if (!s) return undefined
  const t = s.trim()
  if (!t || /TO CONFIRM/i.test(t)) return undefined
  return t
}

/** 'Vbrut0x' ou '@Vbrut0x' -> '@Vbrut0x' ; '' si absent. */
export const at = (handle?: string): string => (handle ? `@${handle.replace(/^@/, '')}` : '')

/** 'Lucky Block Factory' -> 'LB', 'alike.io' -> 'A' : monogramme des jaquettes sans image. */
export const initials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('')

/** '16.7K visits · 96% liked' -> ['16.7K visits', '96% liked'] (meta statiques de content.ts). */
export const splitMeta = (meta?: string): string[] =>
  (meta ?? '')
    .split('·')
    .map((x) => x.trim())
    .filter(Boolean)

/** '4,306 members' -> 4306, '16.7K visits' -> 16700, '' -> 0 : pour sommer les valeurs statiques. */
export function parseCount(s?: string): number {
  // Suffixe K/M en majuscule et colle au nombre (forme de fmt) : le « m » de « members » n'en est pas un.
  const m = /(\d[\d,]*(?:\.\d+)?)([KM])?/.exec(s ?? '')
  if (!m) return 0
  const n = Number(m[1].replaceAll(',', ''))
  if (Number.isNaN(n)) return 0
  return Math.round(n * (m[2] === 'K' ? 1_000 : m[2] === 'M' ? 1_000_000 : 1))
}

// ---------- style ----------

export const gradient = (tone: readonly [string, string]): string =>
  `linear-gradient(145deg, ${tone[0]}, ${tone[1]})`

export const sum = (values: readonly number[]): number => values.reduce((a, b) => a + b, 0)

// ---------- primitives ----------

export interface ExtProps {
  href: string
  children: ReactNode
  className?: string
  /** Mention lue par les lecteurs d'ecran apres le texte, ex. 'Monster Mayhem on Roblox (opens in new tab)'. */
  label?: string
  type?: string
  title?: string
}

/** Lien externe : nouvel onglet, rel noreferrer, mention « opens in new tab » pour les lecteurs d'ecran. */
export function Ext({ href, children, className, label, type, title }: ExtProps) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className} type={type} title={title}>
      {children}
      <span className="sr-only"> {label ?? '(opens in new tab)'}</span>
    </a>
  )
}

export interface SkelProps {
  when: boolean
  children: ReactNode
}

/**
 * Squelette a largeur reservee : quand `when` est vrai, le texte enfant reste dans le DOM en
 * couleur transparente (classe .skeleton), donc la largeur et la hauteur ne bougent pas quand
 * la valeur live remplace la valeur statique.
 */
export function Skel({ when, children }: SkelProps) {
  if (!when) return children
  return (
    <span className="skeleton" aria-busy="true">
      {children}
    </span>
  )
}
