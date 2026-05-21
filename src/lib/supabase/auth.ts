import { type User } from '@supabase/supabase-js'
import { createClient } from './client'

export async function entrarAnonymously(): Promise<User> {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInAnonymously()
  if (error || !data.user) {
    throw new Error(error?.message ?? 'Falha ao iniciar sessão anônima')
  }
  return data.user
}

export async function getSession() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getSession()
  if (error) throw new Error(error.message)
  return data.session
}
