import { useState } from 'react'
import { useItems } from '../data/ItemsContext'
import { BackLink, ItemRow } from '../components'
import { Wave } from '../stickers'
import { CATEGORIES, statusOf, type Category, type Status } from '../types'

const FILTERS: { key: Status | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'todo', label: 'To do' },
  { key: 'doing', label: 'In progress' },
  { key: 'done', label: 'Finished' },
]

export function List({ category }: { category: Category }) {
  const { items } = useItems()
  const [filter, setFilter] = useState<Status | 'all'>('all')
  const mine = items.filter((i) => i.category === category)
  const shown = filter === 'all' ? mine : mine.filter((i) => statusOf(i) === filter)

  return (
    <main className="screen">
      <BackLink href="#/" label="Home" />
      <header className="hero">
        <h1>{CATEGORIES[category].label}</h1>
        <Wave />
      </header>
      <div className="chips">
        {FILTERS.map((f) => (
          <button key={f.key} className={`chip ${filter === f.key ? 'on' : ''}`} onClick={() => setFilter(f.key)}>{f.label}</button>
        ))}
      </div>
      <div className="grid">
        {shown.map((i) => <ItemRow key={i.id} item={i} />)}
      </div>
      {!shown.length && <p className="empty">Nothing here yet.</p>}
      <div className="actions">
        <a className="btn primary" href={`#/add/${category}`}>Add to {CATEGORIES[category].label.toLowerCase()}</a>
      </div>
    </main>
  )
}
