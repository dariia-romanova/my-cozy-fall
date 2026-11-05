import type { ReactNode } from 'react'
import type { StickerName } from './types'

const edge = { stroke: '#fff', strokeWidth: 5, paintOrder: 'stroke', strokeLinejoin: 'round' } as const

const art: Record<StickerName, ReactNode> = {
  tulip: (
    <>
      <path d="M30 34V54M30 48q-12 0-14-10M30 50q12 0 14-10" fill="none" stroke="#D1D161" strokeWidth="4" strokeLinecap="round" />
      <path d="M16 12l7 7 7-11 7 11 7-7c2 16-4 24-14 24s-16-8-14-24z" fill="#FF7D59" {...edge} />
    </>
  ),
  book: (
    <g transform="rotate(-5 30 30)">
      <rect x="12" y="8" width="36" height="44" rx="5" fill="#FFDE94" {...edge} />
      <path d="M30 26C20 20 20 14 25 13c3 0 5 2 5 4 0-2 3-4 6-4 4 1 4 7-6 13z" fill="#FF7D59" />
      <path d="M20 35h20M20 42h13" stroke="#2C2C34" strokeWidth="2.6" strokeLinecap="round" />
    </g>
  ),
  popcorn: (
    <>
      <path d="M17 26c-6-8 4-14 8-9 2-8 14-7 14 1 7-3 11 6 4 9z" fill="#FFFAED" {...edge} />
      <path d="M15 26h30l-4 28H19z" fill="#99B0ED" {...edge} />
      <path d="M25 27l2 26M35 27l-2 26" stroke="#fff" strokeWidth="3.4" />
    </>
  ),
  scarf: (
    <>
      <path d="M31 26l13-2 4 26-13 2z" fill="#FFBDE8" {...edge} />
      <path d="M34 36l12-2M35 43l12-2" stroke="#FF7D59" strokeWidth="3" strokeLinecap="round" />
      <path d="M37 52l.6 5M41 51l.6 5M45 50l.6 5" stroke="#FF7D59" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M12 10c9-6 27-6 36 0 4 4 4 13 0 17-9 6-27 6-36 0-4-4-4-13 0-17z" fill="#FFBDE8" {...edge} />
      <ellipse cx="30" cy="15" rx="13" ry="4.5" fill="#FF7D59" opacity=".35" />
    </>
  ),
  flower: (
    <>
      <g fill="#FAAB94">
        <circle cx="30" cy="14" r="11" /><circle cx="46" cy="26" r="11" /><circle cx="40" cy="45" r="11" />
        <circle cx="20" cy="45" r="11" /><circle cx="14" cy="26" r="11" />
      </g>
      <circle cx="30" cy="31" r="9" fill="#FFDE94" />
    </>
  ),
  pumpkin: (
    <>
      <path d="M30 16c0-5 2-8 7-10" fill="none" stroke="#D1D161" strokeWidth="5" strokeLinecap="round" />
      <g fill="#FF7D59" {...edge}>
        <ellipse cx="17" cy="35" rx="12" ry="18" /><ellipse cx="43" cy="35" rx="12" ry="18" />
      </g>
      <ellipse cx="30" cy="35" rx="13" ry="20" fill="#FAAB94" />
    </>
  ),
  mug: (
    <>
      <path d="M44 26h4c8 0 8 16-2 16h-4" fill="none" stroke="#99B0ED" strokeWidth="5" />
      <path d="M12 20h34v24c0 6-4 10-10 10H22c-6 0-10-4-10-10z" fill="#99B0ED" {...edge} />
      <path d="M29 42c-9-6-9-12-5-13 3 0 5 2 5 3 0-1 2-3 5-3 4 1 4 7-5 13z" fill="#FFBDE8" />
      <path d="M23 13q3-3 0-7M33 13q3-3 0-7" fill="none" stroke="#FAAB94" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  leaf: (
    <>
      <path d="M12 48C8 24 26 8 50 10c2 24-14 42-38 38z" fill="#D1D161" {...edge} />
      <path d="M8 54L38 22M22 38V26M30 30h11" fill="none" stroke="#FFFAED" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
}

export const STICKERS = Object.keys(art) as StickerName[]

export function Sticker({ name, size = 42 }: { name: StickerName; size?: number }) {
  return <svg viewBox="0 0 60 60" width={size} height={size} aria-hidden="true">{art[name]}</svg>
}

export function Star({ size = 16, color = 'var(--peri)' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
      <path d="M20 4c2 7 4 10 16 11-8 6-9 9-6 20-7-6-12-6-21 0 4-10 3-14-5-19 10-2 14-4 16-12z" fill={color} />
    </svg>
  )
}

export function Wave({ width = 76, color = 'var(--lime)' }: { width?: number; color?: string }) {
  return (
    <svg viewBox="0 0 60 16" width={width} height={width * 0.27} aria-hidden="true" className="wave">
      <path d="M3 9q7-10 13 0t13 0 13 0 13 0" fill="none" stroke={color} strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  )
}
