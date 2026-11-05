import { useEffect, useState, type CSSProperties } from 'react'
import { useItems } from '../data/ItemsContext'
import { BackLink, TapedPhoto } from '../components'
import { Sticker } from '../stickers'
import { CATEGORIES, type Item } from '../types'

const today = () => new Date().toISOString()
const prettyDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })

export function ItemPage({ item }: { item: Item }) {
  const { save } = useItems()
  const [progress, setProgress] = useState(item.progress)
  const [note, setNote] = useState(item.note)
  const [celebrate, setCelebrate] = useState(false)
  const cat = CATEGORIES[item.category]

  useEffect(() => setProgress(item.progress), [item.progress])

  useEffect(() => {
    if (note === item.note) return
    const timer = setTimeout(() => save({ ...item, note }), 400)
    return () => clearTimeout(timer)
  }, [note, item, save])

  const commit = (value: number) => {
    if (value === item.progress) return
    if (value === 100) return finish()
    save({
      ...item,
      progress: value,
      finishedAt: undefined,
      startedAt: value > 0 ? item.startedAt ?? today() : item.startedAt,
    })
  }

  const finish = () => {
    setProgress(100)
    save({ ...item, progress: 100, finishedAt: today(), startedAt: item.startedAt ?? today(), note })
    setCelebrate(true)
  }

  const meta = item.finishedAt
    ? `${cat.noun} · finished ${prettyDate(item.finishedAt)}`
    : item.startedAt ? `${cat.noun} · started ${prettyDate(item.startedAt)}` : cat.noun

  return (
    <main className="screen">
      <BackLink href={`#/list/${item.category}`} label={cat.label} />
      <TapedPhoto item={item} />
      <h1 className="item-title">{item.title}</h1>
      <div className="meta">{meta}{item.mood ? ` · ${item.mood}` : ''}</div>

      <section className="card">
        <div className="row-top">
          <label className="name" htmlFor="progress">Progress</label>
          <span className="pct">{progress}%</span>
        </div>
        <input
          id="progress" type="range" min="0" max="100" step="5" value={progress}
          style={{ '--pct': `${progress}%` } as CSSProperties}
          onChange={(e) => setProgress(Number(e.target.value))}
          onPointerUp={(e) => commit(Number(e.currentTarget.value))}
          onTouchEnd={(e) => commit(Number(e.currentTarget.value))}
          onKeyUp={(e) => commit(Number(e.currentTarget.value))}
        />
      </section>

      <label className="note">
        <span className="sr-only">Your note</span>
        <textarea
          rows={2} placeholder="So soft, perfect for movie nights" value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={() => note !== item.note && save({ ...item, note })}
        />
      </label>

      <div className="actions">
        {!item.finishedAt && <button className="btn primary" onClick={finish}>Mark as finished</button>}
        <a className="btn" href={`#/edit/${item.id}`}>Edit</a>
      </div>

      {celebrate && (
        <div className="celebrate" onClick={() => setCelebrate(false)}>
          {Array.from({ length: 14 }, (_, i) => (
            <span key={i} className="fall" style={{ left: `${(i * 7.3) % 100}%`, animationDelay: `${(i % 5) * 0.12}s` }}>
              <Sticker name="leaf" size={22} />
            </span>
          ))}
          <div className="celebrate-card" role="status">
            <div className="pop"><Sticker name={item.sticker} size={120} /></div>
            <h2 className="title">New sticker</h2>
            <p className="meta">{item.title} is finished</p>
            <a className="btn primary" href="#/stickers">See my stickers</a>
          </div>
        </div>
      )}
    </main>
  )
}
