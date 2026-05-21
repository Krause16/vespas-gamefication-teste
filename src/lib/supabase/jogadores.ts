import { type Jogador, type JogadorInsert } from './types'
import { createClient } from './client'

export async function criarJogador(dados: JogadorInsert): Promise<Jogador> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('jogadores')
    .insert(dados)
    .select()
    .single()

  if (error || !data) {
    throw new Error(error?.message ?? 'Falha ao criar jogador')
  }
  return data
}
