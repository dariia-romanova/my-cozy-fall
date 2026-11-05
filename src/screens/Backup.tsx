import { useState } from 'react'
import { useItems } from '../data/ItemsContext'
import { BackLink } from '../components'
import { supabase } from '../data/supabase'
import type { Item } from '../types'

/** Puts uploaded photos inside the backup, because their online links expire. */
async function packPhoto(item: Item): Promise<Item> {
  if (!item.imagePath || !item.image?.startsWith('http')) return item
  try {
    const blob = await (await fetch(item.image)).blob()
    const image = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
    return { ...item, image, imagePath: undefined }
  } catch {
    return item
  }
}

export function Backup() {
  const { items, replaceAll } = useItems()
  const [message, setMessage] = useState('')

  const download = async () => {
    setMessage('Packing your photos…')
    const packed = await Promise.all(items.map(packPhoto))
    const blob = new Blob([JSON.stringify({ version: 1, items: packed }, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `my-cozy-fall-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
    setMessage('Backup saved')
  }

  const restore = async (file?: File) => {
    if (!file) return
    try {
      const data = JSON.parse(await file.text()) as { items?: Item[] }
      if (!Array.isArray(data.items) || data.items.some((i) => !i.id || !i.title)) throw new Error('bad file')
      if (!window.confirm(`Replace your list with ${data.items.length} items from this backup?`)) return
      await replaceAll(data.items)
      setMessage('Backup restored')
    } catch {
      setMessage("That file isn't a cozy fall backup.")
    }
  }

  return (
    <main className="screen">
      <BackLink href="#/" label="Home" />
      <h1 className="item-title">Back up my list</h1>
      <p className="meta">Save everything to a file, or bring it back from one.</p>
      <div className="actions">
        <button className="btn primary" onClick={download}>Save backup</button>
        <label className="btn">
          Restore backup
          <input className="sr-only" type="file" accept="application/json,.json" onChange={(e) => restore(e.target.files?.[0])} />
        </label>
      </div>
      {message && <p className="meta" role="status">{message}</p>}
      {supabase && <button className="quiet-link plain" onClick={() => supabase?.auth.signOut()}>Sign out</button>}
      <p className="credit">This product uses the TMDB API but is not endorsed or certified by TMDB. Book covers come from Open Library.</p>
    </main>
  )
}
