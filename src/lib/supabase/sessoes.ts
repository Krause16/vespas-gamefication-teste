import { type Json } from './types'
import { createClient } from './client'

interface SalvarSessaoInput {
  jogador_id: string
  jogo_slug: string
  pontuacao: number
  duracao_segundos: number
  metadata: Record<string, Json>
}

export async function salvarSessao(dados: SalvarSessaoInput): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('sessoes_jogos').insert({
    jogador_id: dados.jogador_id,
    jogo_slug: dados.jogo_slug,
    pontuacao: dados.pontuacao,
    duracao_segundos: dados.duracao_segundos,
    metadata: dados.metadata,
    concluida_em: new Date().toISOString(),
  })

  if (error) throw new Error(error.message)
}
