import { clear, createStore, del, entries, set } from 'idb-keyval'
import type { Item } from '../types'
import { supabase } from './supabase'
import { syncStore } from './syncStore'

/** Everything the app needs from storage. */
export interface Store {
  list(): Promise<Item[]>
  /** Returns the item as stored, which can include a new photo link. */
  save(item: Item): Promise<Item>
  remove(id: string): Promise<void>
  replaceAll(items: Item[]): Promise<void>
}

const db = createStore('my-cozy-fall', 'items')

export const localStore: Store = {
  async list() {
    const rows = await entries<string, Item>(db)
    return rows.map(([, item]) => item)
  },
  async save(item) {
    await set(item.id, item, db)
    return item
  },
  remove: (id) => del(id, db),
  async replaceAll(items) {
    await clear(db)
    await Promise.all(items.map((item) => set(item.id, item, db)))
  },
}

export const store: Store = supabase ? syncStore(supabase) : localStore
