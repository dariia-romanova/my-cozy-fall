import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/quicksand/500.css'
import '@fontsource/quicksand/700.css'
import '@fontsource/fraunces/600.css'
import './styles.css'
import { App } from './App'
import { AuthGate } from './screens/SignIn'
import { ItemsProvider } from './data/ItemsContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthGate>
      <ItemsProvider>
        <App />
      </ItemsProvider>
    </AuthGate>
  </StrictMode>,
)

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
}
