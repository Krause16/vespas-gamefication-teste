export type ComandoSuportado =
  | 'ls'
  | 'cd'
  | 'cat'
  | 'pwd'
  | 'grep'
  | 'find'
  | 'echo'
  | 'base64'
  | 'clear'
  | 'help'
  | 'hint'
  | 'whoami'

export interface Arquivo {
  nome: string
  conteudo: string
  oculto: boolean
  executavel: boolean
  permissao: 'leitura' | 'negado'
}

export interface Diretorio {
  nome: string
  oculto: boolean
  filhos: (Arquivo | Diretorio)[]
  permissao?: 'leitura' | 'negado'
}

export interface EstadoFilesystem {
  raiz: Diretorio
  diretorio_atual: string[]
}

export interface ResultadoComando {
  saida: string
  novo_estado: EstadoFilesystem
  flag_encontrada?: string
}

export interface Flag {
  numero: number
  texto: string
  tecnica: string
  arquivo: string
  pontos: number
}

export interface Dica {
  flag_numero: number
  nivel: 1 | 2 | 3
  texto: string
  custo_pontos: number
}

export interface EstadoJogo {
  fase: 'intro' | 'jogando' | 'resultado'
  flags_encontradas: string[]
  dicas_usadas: Array<{ flag_numero: number; nivel: number }>
  pontuacao: number
  tempo_inicio: number
  filesystem: EstadoFilesystem
  comandos_executados: number
}
