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

export async function atualizarPontuacao(
  jogador_id: string,
  delta: number
): Promise<void> {
  const supabase = createClient()
  // Incremento atômico via RPC SECURITY DEFINER
  const { error } = await supabase.rpc('incrementar_pontuacao', {
    p_jogador_id: jogador_id,
    p_delta: delta,
  })
  if (error) throw new Error(error.message)
}
