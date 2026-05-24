import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface SessaoState {
  codigo_sala: string
  apelido: string
  pontuacao_total: number
  sala_id: string
  jogador_id: string
  jogos_concluidos: string[]
  modo_solo: boolean
}

interface SessaoActions {
  entrarNaSala: (
    codigo: string,
    apelido: string,
    sala_id: string,
    jogador_id: string
  ) => void
  entrarSolo: (apelido: string, jogador_id: string) => void
  atualizarPontuacao: (delta: number) => void
  concluirJogo: (slug: string) => void
  sair: () => void
}

const ESTADO_INICIAL: SessaoState = {
  codigo_sala: '',
  apelido: '',
  pontuacao_total: 0,
  sala_id: '',
  jogador_id: '',
  jogos_concluidos: [],
  modo_solo: false,
}

// SSR-safe: sessionStorage não existe no Node.js
const ssrSafeSessionStorage =
  typeof window !== 'undefined'
    ? sessionStorage
    : {
        getItem: () => null,
        setItem: () => undefined,
        removeItem: () => undefined,
      }

function setCookie(value: string) {
  if (typeof window !== 'undefined') {
    document.cookie = `vespas-sessao=${value}; path=/; SameSite=Strict`
  }
}

function clearCookie() {
  if (typeof window !== 'undefined') {
    document.cookie = 'vespas-sessao=; path=/; max-age=0; SameSite=Strict'
  }
}

export const useSessaoStore = create<SessaoState & SessaoActions>()(
  persist(
    (set) => ({
      ...ESTADO_INICIAL,

      entrarNaSala: (codigo, apelido, sala_id, jogador_id) => {
        set({ codigo_sala: codigo, apelido, pontuacao_total: 0, sala_id, jogador_id, modo_solo: false })
        setCookie(codigo)
      },

      entrarSolo: (apelido, jogador_id) => {
        set({ codigo_sala: '', apelido, pontuacao_total: 0, sala_id: '', jogador_id, modo_solo: true, jogos_concluidos: [] })
        setCookie('SOLO')
      },

      atualizarPontuacao: (delta: number) =>
        set((state) => ({ pontuacao_total: state.pontuacao_total + delta })),

      concluirJogo: (slug: string) =>
        set((state) => ({
          jogos_concluidos: state.jogos_concluidos.includes(slug)
            ? state.jogos_concluidos
            : [...state.jogos_concluidos, slug],
        })),

      sair: () => {
        set(ESTADO_INICIAL)
        clearCookie()
      },
    }),
    {
      name: 'vespas-sessao',
      storage: createJSONStorage(() => ssrSafeSessionStorage),
    }
  )
)
