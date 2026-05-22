export type FonteOSINT =
  | 'rede_social_publica'
  | 'metadado_exif'
  | 'padrao_postagem'
  | 'geotagging'
  | 'conexao_social'
  | 'forum_publico'
  | 'imagem_publicada'

export interface PistaOSINT {
  id: string
  fonte: FonteOSINT
  conteudo: string
  dado_revelado: string
  pontos: number
  requer_pista?: string
}

export interface AlvoFicticio {
  nome: string
  username: string
  escola: string
  bairro: string
  rotina: string
  vulnerabilidades: string[]
  pistas: PistaOSINT[]
}

export interface PerfilAlunoFicticio {
  apelido: string
  escola_ficticia: string
  bairro_ficticio: string
  rede_favorita: 'instagram' | 'tiktok' | 'twitter' | 'discord'
  posta_fotos_escola: boolean
  posta_localizacao: boolean
  perfil_publico: boolean
  melhor_amigo_online: boolean
}

export interface ScoreExposicao {
  total: number
  categorias: {
    localizacao: number
    rotina: number
    conexoes: number
    emocional: number
  }
}

export interface AjustePrivacidade {
  id: string
  descricao: string
  reducao_score: number
  acao_real: string
}

export interface EstadoJogo {
  fase: 'intro' | 'perfil' | 'ato1' | 'ato2_revelacao' | 'ato3_defesa' | 'resultado'
  perfil_aluno: PerfilAlunoFicticio | null
  pistas_descobertas: string[]
  score_exposicao_luna: ScoreExposicao
  score_exposicao_aluno: ScoreExposicao
  ajustes_aplicados: string[]
  pontuacao: number
  tempo_inicio: number
}
