import { useMemo, useState } from 'react'
import { useItems } from '../data/ItemsContext'
import { Cover } from '../components'
import { MOODS, type Item } from '../types'

const pick = (list: Item[]) => list[Math.floor(Math.random() * list.length)]

export function Surprise({ onClose }: { onClose(): void }) {
  const { items } = useItems()
  const open = useMemo(() => items.filter((i) => !i.finishedAt), [items])
  const [mood, setMood] = useState<string | null>(null)
  const [choice, setChoice] = useState<Item | undefined>(() => pick(open))

  const choose = (next: string | null) => {
    setMood(next)
    setChoice(pick(next ? open.filter((i) => i.mood === next) : open))
  }

  return (
    <div className="sheet-wrap" onClick={onClose}>
      <section className="sheet" role="dialog" aria-label="Surprise me" onClick={(e) => e.stopPropagation()}>
        <div className="chips">
          {MOODS.map((m) => (
            <button key={m} className={`chip ${mood === m ? 'on' : ''}`} onClick={() => choose(mood === m ? null : m)}>{m}</button>
          ))}
        </div>
        {choice ? (
          <a className="pick" href={`#/item/${choice.id}`}>
            <Cover item={choice} size={88} />
            <div className="title">{choice.title}</div>
          </a>
        ) : (
          <p className="empty">{open.length ? 'Nothing with this mood yet.' : 'Add something to your list first.'}</p>
        )}
        <div className="actions">
          {open.length > 1 && <button className="btn primary" onClick={() => choose(mood)}>Another one</button>}
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </section>
    </div>
  )
}
