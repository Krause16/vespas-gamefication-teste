import { type Json } from './types'
import { createClient } from './client'

export async function enviarEvento(
  sala_id: string,
  tipo: string,
  payload: Record<string, Json>
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('eventos_sala')
    .insert({ sala_id, tipo, payload })
  if (error) throw new Error(error.message)
}

export async function encerrarSala(sala_id: string): Promise<void> {
  const supabase = createClient()

  const { error: updateError } = await supabase
    .from('salas')
    .update({ ativa: false })
    .eq('id', sala_id)
  if (updateError) throw new Error(updateError.message)

  const { error: eventoError } = await supabase
    .from('eventos_sala')
    .insert({ sala_id, tipo: 'encerrar_sala', payload: {} })
  if (eventoError) throw new Error(eventoError.message)
}
