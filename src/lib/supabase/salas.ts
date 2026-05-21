import { type Sala } from './types'
import { createClient } from './client'

export async function buscarSalaPorCodigo(codigo: string): Promise<Sala | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('salas')
    .select('*')
    .eq('codigo', codigo)
    .eq('ativa', true)
    .single()

  if (error) {
    // PGRST116 = no rows found — sala não existe ou está inativa
    if (error.code === 'PGRST116') return null
    throw new Error(error.message)
  }
  return data
}
