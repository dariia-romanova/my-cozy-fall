import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../data/supabase'
import { Sticker, Wave } from '../stickers'

export function AuthGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null | undefined>(supabase ? undefined : null)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => data.subscription.unsubscribe()
  }, [])

  if (!supabase) return children
  if (session === undefined) return null
  return session ? children : <SignIn />
}

function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) return setError('Enter your email and password.')
    setBusy(true)
    const { error: failed } = await supabase!.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)
    if (failed) setError("That didn't work. Check your email and password.")
  }

  return (
    <main className="screen">
      <header className="hero">
        <h1>My cozy fall</h1>
        <Wave />
        <span className="hero-flower"><Sticker name="flower" size={38} /></span>
      </header>
      <form className="form" onSubmit={submit}>
        <label>
          <span className="name">Email</span>
          <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          <span className="name">Password</span>
          <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <p className="error">{error}</p>}
        <div className="actions">
          <button className="btn primary" type="submit">{busy ? 'Signing in…' : 'Sign in'}</button>
        </div>
      </form>
    </main>
  )
}
