import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface SessaoState {
  codigo_sala: string
  apelido: string
  pontuacao_total: number
  sala_id: string
  jogador_id: string
}

interface SessaoActions {
  entrarNaSala: (
    codigo: string,
    apelido: string,
    sala_id: string,
    jogador_id: string
  ) => void
  atualizarPontuacao: (delta: number) => void
  sair: () => void
}

const ESTADO_INICIAL: SessaoState = {
  codigo_sala: '',
  apelido: '',
  pontuacao_total: 0,
  sala_id: '',
  jogador_id: '',
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

export const useSessaoStore = create<SessaoState & SessaoActions>()(
  persist(
    (set) => ({
      ...ESTADO_INICIAL,

      entrarNaSala: (
        codigo: string,
        apelido: string,
        sala_id: string,
        jogador_id: string
      ) => {
        set({ codigo_sala: codigo, apelido, pontuacao_total: 0, sala_id, jogador_id })
        // Cookie espelho para o proxy Next.js — sem Max-Age = sessão do browser
        if (typeof window !== 'undefined') {
          document.cookie = `vespas-sessao=${codigo}; path=/; SameSite=Strict`
        }
      },

      atualizarPontuacao: (delta: number) =>
        set((state) => ({ pontuacao_total: state.pontuacao_total + delta })),

      sair: () => {
        set(ESTADO_INICIAL)
        if (typeof window !== 'undefined') {
          document.cookie = 'vespas-sessao=; path=/; max-age=0; SameSite=Strict'
        }
      },
    }),
    {
      name: 'vespas-sessao',
      storage: createJSONStorage(() => ssrSafeSessionStorage),
    }
  )
)
