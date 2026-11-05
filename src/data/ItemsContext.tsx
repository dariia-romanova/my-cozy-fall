import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { store } from './store'
import type { Item } from '../types'

interface ItemsApi {
  items: Item[]
  ready: boolean
  error: string | null
  save(item: Item): Promise<void>
  remove(id: string): Promise<void>
  replaceAll(items: Item[]): Promise<void>
}

const Ctx = createContext<ItemsApi | null>(null)
const newestFirst = (rows: Item[]) => [...rows].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

export function ItemsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([])
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(() => store.list().then((rows) => setItems(newestFirst(rows))), [])

  useEffect(() => {
    refresh()
      .catch(() => setError("Couldn't open your list. Try reloading."))
      .finally(() => setReady(true))

    // Picks up changes from your other device when you come back to the app.
    const onReturn = () => {
      if (document.visibilityState === 'visible') refresh().catch(() => {})
    }
    document.addEventListener('visibilitychange', onReturn)
    window.addEventListener('online', onReturn)
    return () => {
      document.removeEventListener('visibilitychange', onReturn)
      window.removeEventListener('online', onReturn)
    }
  }, [refresh])

  const save = useCallback(async (item: Item) => {
    setItems((prev) => (prev.some((i) => i.id === item.id)
      ? prev.map((i) => (i.id === item.id ? item : i))
      : [item, ...prev]))
    try {
      const saved = await store.save(item)
      if (saved.image !== item.image || saved.imagePath !== item.imagePath) {
        setItems((prev) => prev.map((i) => (i.id === saved.id
          ? { ...i, image: saved.image, imagePath: saved.imagePath }
          : i)))
      }
    } catch {
      setError("Couldn't save that change. Try again.")
    }
  }, [])

  const remove = useCallback(async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
    await store.remove(id)
  }, [])

  const replaceAll = useCallback(async (next: Item[]) => {
    await store.replaceAll(next)
    await refresh()
  }, [refresh])

  const api = useMemo(() => ({ items, ready, error, save, remove, replaceAll }), [items, ready, error, save, remove, replaceAll])
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useItems() {
  const api = useContext(Ctx)
  if (!api) throw new Error('useItems needs ItemsProvider')
  return api
}
