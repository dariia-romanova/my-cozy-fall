import type { Category } from './types'

export interface Found {
  title: string
  detail: string
  image: string
}

const tmdbKey = import.meta.env.VITE_TMDB_KEY as string | undefined

export const canSearch = (category: Category) =>
  category === 'read' || (category === 'watch' && !!tmdbKey)

async function movies(query: string): Promise<Found[]> {
  const params = new URLSearchParams({ query, api_key: tmdbKey ?? '' })
  const res = await fetch(`https://api.themoviedb.org/3/search/movie?${params}`)
  if (!res.ok) throw new Error('TMDB search failed')
  const { results } = await res.json() as {
    results: { title: string; release_date?: string; poster_path: string | null }[]
  }
  return results.filter((r) => r.poster_path).slice(0, 6).map((r) => ({
    title: r.title,
    detail: r.release_date?.slice(0, 4) ?? '',
    image: `https://image.tmdb.org/t/p/w342${r.poster_path}`,
  }))
}

async function books(query: string): Promise<Found[]> {
  const params = new URLSearchParams({ q: query, limit: '12', fields: 'title,author_name,cover_i' })
  const res = await fetch(`https://openlibrary.org/search.json?${params}`)
  if (!res.ok) throw new Error('Open Library search failed')
  const { docs } = await res.json() as {
    docs: { title: string; author_name?: string[]; cover_i?: number }[]
  }
  return docs.filter((d) => d.cover_i).slice(0, 6).map((d) => ({
    title: d.title,
    detail: d.author_name?.[0] ?? '',
    image: `https://covers.openlibrary.org/b/id/${d.cover_i}-L.jpg`,
  }))
}

export const searchPictures = (category: Category, query: string) =>
  (category === 'watch' ? movies(query) : books(query))
