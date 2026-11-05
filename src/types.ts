export type Category = 'watch' | 'read' | 'make'

export type StickerName =
  | 'tulip' | 'book' | 'popcorn' | 'scarf' | 'flower' | 'pumpkin' | 'mug' | 'leaf'

export interface Item {
  id: string
  title: string
  category: Category
  /** Compressed picture as a data URL, or a remote poster or cover URL. */
  image?: string
  /** Where an uploaded photo lives in online storage. */
  imagePath?: string
  mood?: string
  progress: number
  note: string
  sticker: StickerName
  createdAt: string
  startedAt?: string
  finishedAt?: string
}

export type Status = 'todo' | 'doing' | 'done'

export const statusOf = (item: Item): Status =>
  item.finishedAt ? 'done' : item.progress > 0 ? 'doing' : 'todo'

export const CATEGORIES: Record<Category, { label: string; noun: string; tint: string; sticker: StickerName }> = {
  watch: { label: 'Watch', noun: 'Movie', tint: 'var(--sky)', sticker: 'popcorn' },
  read: { label: 'Read', noun: 'Book', tint: 'var(--blush)', sticker: 'book' },
  make: { label: 'Make', noun: 'Craft', tint: 'var(--lime-light)', sticker: 'scarf' },
}

export const MOODS = ['Feel good', 'Need comfort', 'Rainy day', 'Guilty pleasure']
