import { useItems } from './data/ItemsContext'
import { useRoute } from './router'
import { Backup } from './screens/Backup'
import { EditItem } from './screens/EditItem'
import { Home } from './screens/Home'
import { ItemPage } from './screens/ItemPage'
import { List } from './screens/List'
import { Stickers } from './screens/Stickers'
import { CATEGORIES, type Category } from './types'

const isCategory = (v?: string): v is Category => !!v && v in CATEGORIES

export function App() {
  const { items, ready, error } = useItems()
  const [page, param] = useRoute()
  if (!ready) return null

  const item = items.find((i) => i.id === param)
  let screen = <Home />
  if (page === 'list' && isCategory(param)) screen = <List key={param} category={param} />
  if (page === 'item' && item) screen = <ItemPage key={item.id} item={item} />
  if (page === 'edit' && item) screen = <EditItem key={item.id} item={item} />
  if (page === 'add') screen = <EditItem key={param ?? 'new'} category={isCategory(param) ? param : undefined} />
  if (page === 'stickers') screen = <Stickers />
  if (page === 'backup') screen = <Backup />

  return (
    <>
      {error && <p className="error banner" role="alert">{error}</p>}
      {screen}
    </>
  )
}
