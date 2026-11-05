import { useState, type FormEvent } from 'react'
import { useItems } from '../data/ItemsContext'
import { BackLink } from '../components'
import { compressImage } from '../image'
import { go } from '../router'
import { canSearch, searchPictures, type Found } from '../search'
import { STICKERS } from '../stickers'
import { CATEGORIES, MOODS, type Category, type Item } from '../types'

export function EditItem({ item, category }: { item?: Item; category?: Category }) {
  const { items, save, remove } = useItems()
  const [title, setTitle] = useState(item?.title ?? '')
  const [cat, setCat] = useState<Category>(item?.category ?? category ?? 'watch')
  const [mood, setMood] = useState(item?.mood)
  const [image, setImage] = useState(item?.image)
  const [error, setError] = useState('')
  const [found, setFound] = useState<Found[] | null>(null)
  const [searching, setSearching] = useState(false)

  const find = async () => {
    if (!title.trim()) return setError('Type a name first.')
    setSearching(true)
    setError('')
    try {
      setFound(await searchPictures(cat, title.trim()))
    } catch {
      setError("Search isn't working right now. Try again.")
    } finally {
      setSearching(false)
    }
  }

  const onFile = async (file?: File) => {
    if (!file) return
    try {
      setImage(await compressImage(file))
      setError('')
    } catch {
      setError("That photo didn't load. Try another one.")
    }
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const name = title.trim()
    if (!name) return setError('Give it a name first.')
    const next: Item = item
      ? { ...item, title: name, category: cat, mood, image }
      : {
          id: crypto.randomUUID(), title: name, category: cat, mood, image, progress: 0, note: '',
          sticker: STICKERS[items.length % STICKERS.length], createdAt: new Date().toISOString(),
        }
    await save(next)
    go(`/item/${next.id}`)
  }

  const onDelete = async () => {
    if (item && window.confirm(`Remove ${item.title} from your list?`)) {
      await remove(item.id)
      go(`/list/${item.category}`)
    }
  }

  return (
    <main className="screen">
      <BackLink href={item ? `#/item/${item.id}` : '#/'} label={item ? item.title : 'Home'} />
      <h1 className="item-title">{item ? 'Edit' : 'Add something cozy'}</h1>
      <form onSubmit={submit} className="form">
        <label>
          <span className="name">Name</span>
          <input value={title} onChange={(e) => { setTitle(e.target.value); setError('') }} placeholder="Chunky scarf" />
        </label>

        <div>
          <span className="name">Type</span>
          <div className="chips">
            {(Object.keys(CATEGORIES) as Category[]).map((c) => (
              <button type="button" key={c} className={`chip ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>{CATEGORIES[c].label}</button>
            ))}
          </div>
        </div>

        <div>
          <span className="name">Mood</span>
          <div className="chips">
            {MOODS.map((m) => (
              <button type="button" key={m} className={`chip ${mood === m ? 'on' : ''}`} onClick={() => setMood(mood === m ? undefined : m)}>{m}</button>
            ))}
          </div>
        </div>

        <div>
          <span className="name">Picture</span>
          {image && <img className="preview" src={image} alt="" />}
          <div className="chips">
            <label className="chip">
              {image ? 'Change photo' : 'Choose photo'}
              <input className="sr-only" type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
            </label>
            {canSearch(cat) && (
              <button type="button" className="chip" onClick={find}>
                {searching ? 'Looking…' : cat === 'watch' ? 'Find poster' : 'Find cover'}
              </button>
            )}
            {image && <button type="button" className="chip" onClick={() => setImage(undefined)}>Remove photo</button>}
          </div>
          {found && !found.length && <p className="meta">Nothing found. Try a shorter name.</p>}
          {found && found.length > 0 && (
            <div className="found">
              {found.map((f) => (
                <button type="button" key={f.image} onClick={() => { setImage(f.image); setTitle(f.title); setFound(null) }}>
                  <img src={f.image} alt={f.title} loading="lazy" />
                  <span className="meta">{f.detail}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {error && <p className="error">{error}</p>}
        <div className="actions">
          <button className="btn primary" type="submit">{item ? 'Save' : 'Add to my list'}</button>
          {item && <button type="button" className="btn" onClick={onDelete}>Remove</button>}
        </div>
      </form>
    </main>
  )
}
