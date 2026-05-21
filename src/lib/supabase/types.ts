export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      salas: {
        Row: {
          id: string
          codigo: string
          ativa: boolean
          criada_em: string
        }
        Insert: {
          id?: string
          codigo: string
          ativa?: boolean
          criada_em?: string
        }
        Update: {
          id?: string
          codigo?: string
          ativa?: boolean
          criada_em?: string
        }
        Relationships: []
      }
      jogadores: {
        Row: {
          id: string
          sala_id: string
          apelido: string
          auth_user_id: string
          entrou_em: string
        }
        Insert: {
          id?: string
          sala_id: string
          apelido: string
          auth_user_id: string
          entrou_em?: string
        }
        Update: {
          id?: string
          sala_id?: string
          apelido?: string
          auth_user_id?: string
          entrou_em?: string
        }
        Relationships: [
          {
            foreignKeyName: 'jogadores_sala_id_fkey'
            columns: ['sala_id']
            isOneToOne: false
            referencedRelation: 'salas'
            referencedColumns: ['id']
          },
        ]
      }
      sessoes_jogos: {
        Row: {
          id: string
          jogador_id: string
          jogo_slug: string
          pontuacao: number
          iniciada_em: string
          concluida_em: string | null
        }
        Insert: {
          id?: string
          jogador_id: string
          jogo_slug: string
          pontuacao?: number
          iniciada_em?: string
          concluida_em?: string | null
        }
        Update: {
          id?: string
          jogador_id?: string
          jogo_slug?: string
          pontuacao?: number
          iniciada_em?: string
          concluida_em?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'sessoes_jogos_jogador_id_fkey'
            columns: ['jogador_id']
            isOneToOne: false
            referencedRelation: 'jogadores'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Sala = Database['public']['Tables']['salas']['Row']
export type Jogador = Database['public']['Tables']['jogadores']['Row']
export type JogadorInsert = Database['public']['Tables']['jogadores']['Insert']
export type SessaoJogo = Database['public']['Tables']['sessoes_jogos']['Row']
