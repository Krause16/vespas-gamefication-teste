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

export type AppSlug = 'vespas-msg' | 'vespasgram' | 'vmail' | 'vlinked' | 'vcord'

// Kept for backward compatibility (TransicaoOnda and tests)
export type OndaMensagem = 1 | 2 | 3 | 4
export type CanalMensagem = 'whatsapp' | 'instagram' | 'email' | 'sms'

export interface Mensagem {
  id: string
  app: AppSlug
  remetente: {
    nome: string
    avatar?: string
    verificado: boolean
    contato_salvo: boolean
    numero_ou_email: string
    // App-specific metadata
    cargo?: string          // vlinked: job title
    empresa?: string        // vlinked: company
    discriminator?: string  // vcord: e.g. "#0001"
    cargo_servidor?: string // vcord: server role
    followers?: number      // vespasgram
  }
  conteudo: {
    texto: string
    assunto?: string    // vmail: email subject
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
  fase: 'intro' | 'smartphone' | 'em_app' | 'classificando' | 'debriefing' | 'resultado_final'
  app_atual: AppSlug | null
  mensagem_atual_id: string | null
  mensagens_completadas: string[]
  meta_completar: number   // 10
  total_mensagens: number  // 15
  respostas: RespostaJogador[]
  resultados: ResultadoMensagem[]
  pontuacao_total: number
  tempo_inicio: number
}
