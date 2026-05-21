export type ClassificacaoMensagem = 'confio' | 'suspeito' | 'bloqueio'

export type IndicadorFraude =
  | 'urgencia'
  | 'remetente_estranho'
  | 'link_suspeito'
  | 'erro_gramatical'
  | 'pedido_dado_sensivel'
  | 'contexto_inesperado'
  | 'pressao_financeira'
  | 'deepfake_audio'
  | 'dominio_falso'
  | 'numero_desconhecido'

export type CanalMensagem = 'whatsapp' | 'instagram' | 'email' | 'sms'

export type OndaMensagem = 1 | 2 | 3 | 4

export interface Mensagem {
  id: string
  onda: OndaMensagem
  canal: CanalMensagem
  remetente: {
    nome: string
    avatar?: string
    verificado: boolean
    contato_salvo: boolean
    numero_ou_email: string
  }
  conteudo: {
    texto: string
    link?: string
    link_real?: string
    audio?: boolean
    imagem?: boolean
  }
  metadados: {
    horario: string
    data?: string
  }
  gabarito: {
    classificacao_correta: ClassificacaoMensagem
    indicadores_validos: IndicadorFraude[]
    indicadores_obrigatorios: IndicadorFraude[]
    eh_fraude: boolean
    explicacao: string
  }
}

export interface RespostaJogador {
  mensagem_id: string
  classificacao: ClassificacaoMensagem
  indicadores_marcados: IndicadorFraude[]
  tempo_decisao_ms: number
}

export interface ResultadoMensagem {
  correta: boolean
  pontuacao: number
  indicadores_corretos: IndicadorFraude[]
  indicadores_perdidos: IndicadorFraude[]
  indicadores_erroneos: IndicadorFraude[]
}

export interface EstadoJogo {
  fase: 'intro' | 'jogando' | 'debriefing' | 'transicao_onda' | 'resultado_final'
  onda_atual: OndaMensagem
  mensagem_atual_idx: number
  mensagens_da_onda: Mensagem[]
  respostas: RespostaJogador[]
  resultados: ResultadoMensagem[]
  pontuacao_total: number
  tempo_inicio: number
}
