export interface RankingEquipe {
  posicao: number
  apelido: string
  equipe: string | null
  pontuacao_total: number
  jogos_concluidos: number
}

export type TipoEvento = 'iniciar_jogo' | 'encerrar_sala' | 'mensagem'

export interface EventoGlobal {
  id: string
  tipo: TipoEvento
  payload: string
  criado_em: string
}

export interface EstadoSala {
  codigo: string
  ativa: boolean
  jogadores_count: number
  ranking: RankingEquipe[]
}
