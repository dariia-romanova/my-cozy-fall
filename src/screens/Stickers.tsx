import { useItems } from '../data/ItemsContext'
import { BackLink } from '../components'
import { Sticker, Wave } from '../stickers'

export function Stickers() {
  const { items } = useItems()
  const done = items.filter((i) => i.finishedAt)
    .sort((a, b) => (a.finishedAt ?? '').localeCompare(b.finishedAt ?? ''))
  const open = items.length - done.length

  return (
    <main className="screen">
      <BackLink href="#/" label="Home" />
      <header className="hero">
        <h1>Sticker page</h1>
        <Wave />
      </header>
      <p className="meta">{done.length} of {items.length} finished</p>
      <div className="sticker-grid">
        {done.map((i) => (
          <a key={i.id} href={`#/item/${i.id}`} className="sticker-cell">
            <Sticker name={i.sticker} size={64} />
            <span className="meta">{i.title}</span>
          </a>
        ))}
        {Array.from({ length: open }, (_, n) => <div key={n} className="sticker-slot" />)}
      </div>
      {!items.length && <p className="empty">Finish something to earn your first sticker.</p>}
    </main>
  )
}
