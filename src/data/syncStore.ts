import { createStore, del, entries, set } from 'idb-keyval'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Item } from '../types'
import { localStore, type Store } from './store'

type Pending = { op: 'save' } | { op: 'delete'; imagePath?: string }

const BUCKET = 'photos'
const LINK_SECONDS = 60 * 60 * 24 * 7
/** Changes that haven't reached the server yet, for example while offline. */
const pending = createStore('my-cozy-fall-pending', 'ops')

/**
 * Keeps a full copy in this browser so the app opens instantly and works offline,
 * and sends each change to Supabase. The newest saved change wins.
 */
export function syncStore(db: SupabaseClient): Store {
  const userId = async () => {
    const { data } = await db.auth.getSession()
    if (!data.session) throw new Error('Not signed in')
    return data.session.user.id
  }

  const dropPhoto = async (path?: string) => {
    if (path) await db.storage.from(BUCKET).remove([path])
  }

  const link = async (path: string) => {
    const { data, error } = await db.storage.from(BUCKET).createSignedUrl(path, LINK_SECONDS)
    if (error) throw error
    return data.signedUrl
  }

  async function push(item: Item): Promise<Item> {
    const next = { ...item }
    if (next.image?.startsWith('data:')) {
      const blob = await (await fetch(next.image)).blob()
      const path = `${await userId()}/${next.id}-${Date.now()}.jpg`
      const { error } = await db.storage.from(BUCKET).upload(path, blob, { contentType: 'image/jpeg' })
      if (error) throw error
      await dropPhoto(next.imagePath)
      next.imagePath = path
      next.image = await link(path)
    } else if (next.imagePath && !next.image?.includes(next.imagePath)) {
      // The photo was removed, or swapped for a poster or cover.
      await dropPhoto(next.imagePath)
      next.imagePath = undefined
    }
    const data = { ...next, image: next.imagePath ? undefined : next.image }
    const { error } = await db.from('items').upsert({ id: next.id, data, updated_at: new Date().toISOString() })
    if (error) throw error
    return next
  }

  async function pushDelete(id: string, imagePath?: string) {
    const { error } = await db.from('items').delete().eq('id', id)
    if (error) throw error
    await dropPhoto(imagePath)
  }

  async function flush() {
    const ops = await entries<string, Pending>(pending)
    const cached = new Map((await localStore.list()).map((i) => [i.id, i]))
    for (const [id, change] of ops) {
      if (change.op === 'delete') {
        await pushDelete(id, change.imagePath)
      } else {
        const item = cached.get(id)
        if (item) await localStore.save(await push(item))
      }
      await del(id, pending)
    }
  }

  async function fetchAll(): Promise<Item[]> {
    const { data, error } = await db.from('items').select('data')
    if (error) throw error
    const items = data.map((row) => row.data as Item)
    const paths = items.flatMap((i) => (i.imagePath ? [i.imagePath] : []))
    if (paths.length) {
      const { data: links, error: linkError } = await db.storage.from(BUCKET).createSignedUrls(paths, LINK_SECONDS)
      if (linkError) throw linkError
      const byPath = new Map(links.map((l) => [l.path, l.signedUrl]))
      for (const item of items) if (item.imagePath) item.image = byPath.get(item.imagePath) ?? undefined
    }
    return items
  }

  return {
    async list() {
      try {
        await flush()
        const items = await fetchAll()
        await localStore.replaceAll(items)
        return items
      } catch {
        return localStore.list()
      }
    },

    async save(item) {
      await localStore.save(item)
      await set(item.id, { op: 'save' } satisfies Pending, pending)
      try {
        const saved = await push(item)
        await localStore.save(saved)
        await del(item.id, pending)
        return saved
      } catch {
        return item
      }
    },

    async remove(id) {
      const item = (await localStore.list()).find((i) => i.id === id)
      await localStore.remove(id)
      await set(id, { op: 'delete', imagePath: item?.imagePath } satisfies Pending, pending)
      try {
        await pushDelete(id, item?.imagePath)
        await del(id, pending)
      } catch {
        // Sent on the next sync.
      }
    },

    async replaceAll(items) {
      const keep = new Set(items.map((i) => i.id))
      for (const old of await this.list()) if (!keep.has(old.id)) await this.remove(old.id)
      for (const item of items) await this.save(item)
    },
  }
}
