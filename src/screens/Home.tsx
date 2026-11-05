import { useState } from 'react'
import { useItems } from '../data/ItemsContext'
import { ItemRow } from '../components'
import { Star, Sticker, Wave } from '../stickers'
import { CATEGORIES, statusOf, type Category } from '../types'
import { Surprise } from './Surprise'

export function Home() {
  const { items } = useItems()
  const [surprise, setSurprise] = useState(false)
  const doing = items.filter((i) => statusOf(i) === 'doing')
  const done = items.filter((i) => i.finishedAt)
    .sort((a, b) => (b.finishedAt ?? '').localeCompare(a.finishedAt ?? ''))

  return (
    <main className="screen">
      <header className="hero">
        <h1>My cozy fall</h1>
        <Wave />
        <span className="hero-flower"><Sticker name="flower" size={38} /></span>
        <span className="hero-star"><Star /></span>
      </header>

      <nav className="tiles" aria-label="Categories">
        {(Object.keys(CATEGORIES) as Category[]).map((c) => (
          <a key={c} className="tile" href={`#/list/${c}`} style={{ background: CATEGORIES[c].tint }}>
            <Sticker name={CATEGORIES[c].sticker} />
            <span>{CATEGORIES[c].label}</span>
          </a>
        ))}
      </nav>

      <a className="card sticker-card" href="#/stickers">
        <div>
          <div className="name">Sticker page</div>
          <div className="meta">{done.length} of {items.length} finished</div>
        </div>
        <div className="sticker-peek">
          {done.slice(0, 3).map((i) => <Sticker key={i.id} name={i.sticker} size={34} />)}
        </div>
      </a>

      <h2>In progress</h2>
      {doing.length
        ? doing.map((i) => <ItemRow key={i.id} item={i} />)
        : <p className="empty">{items.length ? 'Nothing started yet. Pick something lovely.' : 'Add your first cozy thing to get started.'}</p>}

      <div className="actions">
        <button className="btn primary" onClick={() => setSurprise(true)}>Surprise me</button>
        <a className="btn" href="#/add">Add something</a>
      </div>
      <a className="quiet-link" href="#/backup">Back up my list</a>

      {surprise && <Surprise onClose={() => setSurprise(false)} />}
    </main>
  )
}
