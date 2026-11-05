import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_KEY as string | undefined

/** Empty when no keys are set, and the app then stays local to this browser. */
export const supabase = url && key ? createClient(url, key) : null
