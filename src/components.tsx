import type { CSSProperties, ReactNode } from 'react'
import { CATEGORIES, type Item } from './types'
import { Sticker, Star } from './stickers'

export function Cover({ item, size = 52 }: { item: Item; size?: number }) {
  const style: CSSProperties = { width: size, height: size, background: CATEGORIES[item.category].tint }
  return (
    <div className="cover" style={style}>
      {item.image
        ? <img src={item.image} alt="" />
        : <Sticker name={CATEGORIES[item.category].sticker} size={size * 0.8} />}
    </div>
  )
}

export function Bar({ value }: { value: number }) {
  return <div className="bar"><div style={{ width: `${value}%` }} /></div>
}

export function ItemRow({ item }: { item: Item }) {
  return (
    <a className="row" href={`#/item/${item.id}`}>
      <Cover item={item} />
      <div className="row-body">
        <div className="row-top">
          <span className="name">{item.title}</span>
          <span className="pct">{item.finishedAt ? 'Finished' : `${item.progress}%`}</span>
        </div>
        <Bar value={item.progress} />
      </div>
    </a>
  )
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <a className="back" href={href}>
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path d="M19 12H5M11 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </a>
  )
}

export function TapedPhoto({ item, children }: { item: Item; children?: ReactNode }) {
  return (
    <div className="taped">
      <span className="tape" />
      <div className="taped-pic" style={{ background: CATEGORIES[item.category].tint }}>
        {item.image
          ? <img src={item.image} alt={item.title} />
          : <Sticker name={CATEGORIES[item.category].sticker} size={96} />}
      </div>
      {children}
      <span className="taped-flower"><Sticker name="flower" size={40} /></span>
      <span className="taped-star"><Star size={22} /></span>
    </div>
  )
}
