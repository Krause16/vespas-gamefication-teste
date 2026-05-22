import { create } from 'zustand'
import { type EstadoJogo, type PerfilAlunoFicticio } from '@/types/detetive-osint'
import {
  calcularScoreExposicaoLuna,
  calcularScoreExposicaoAluno,
} from '@/lib/jogos/detetive-osint/score'

const SCORE_ZERO = {
  total: 0,
  categorias: { localizacao: 0, rotina: 0, conexoes: 0, emocional: 0 },
}

const ESTADO_INICIAL: EstadoJogo = {
  fase: 'intro',
  perfil_aluno: null,
  pistas_descobertas: [],
  score_exposicao_luna: SCORE_ZERO,
  score_exposicao_aluno: SCORE_ZERO,
  ajustes_aplicados: [],
  pontuacao: 0,
  tempo_inicio: 0,
}

interface DetetiveOsintStore {
  estado: EstadoJogo
  iniciar: () => void
  salvarPerfil: (perfil: PerfilAlunoFicticio) => void
  descobrirPista: (pistaId: string) => void
  avancarParaAto2: () => void
  avancarParaAto3: () => void
  aplicarAjuste: (ajusteId: string) => void
  removerAjuste: (ajusteId: string) => void
  concluir: (pontuacao: number) => void
  resetar: () => void
}

export const useDetetiveOsintStore = create<DetetiveOsintStore>((set) => ({
  estado: ESTADO_INICIAL,

  iniciar: () =>
    set((s) => ({
      estado: { ...s.estado, fase: 'perfil' },
    })),

  salvarPerfil: (perfil) =>
    set((s) => ({
      estado: {
        ...s.estado,
        fase: 'ato1',
        perfil_aluno: perfil,
        tempo_inicio: Date.now(),
        score_exposicao_aluno: calcularScoreExposicaoAluno(perfil),
      },
    })),

  descobrirPista: (pistaId) =>
    set((s) => {
      if (s.estado.pistas_descobertas.includes(pistaId)) return s
      const novasPistas = [...s.estado.pistas_descobertas, pistaId]
      return {
        estado: {
          ...s.estado,
          pistas_descobertas: novasPistas,
          score_exposicao_luna: calcularScoreExposicaoLuna(novasPistas),
        },
      }
    }),

  avancarParaAto2: () =>
    set((s) => ({ estado: { ...s.estado, fase: 'ato2_revelacao' } })),

  avancarParaAto3: () =>
    set((s) => ({ estado: { ...s.estado, fase: 'ato3_defesa' } })),

  aplicarAjuste: (ajusteId) =>
    set((s) => {
      if (s.estado.ajustes_aplicados.includes(ajusteId)) return s
      return {
        estado: {
          ...s.estado,
          ajustes_aplicados: [...s.estado.ajustes_aplicados, ajusteId],
        },
      }
    }),

  removerAjuste: (ajusteId) =>
    set((s) => ({
      estado: {
        ...s.estado,
        ajustes_aplicados: s.estado.ajustes_aplicados.filter((id) => id !== ajusteId),
      },
    })),

  concluir: (pontuacao) =>
    set((s) => ({ estado: { ...s.estado, fase: 'resultado', pontuacao } })),

  resetar: () => set({ estado: ESTADO_INICIAL }),
}))
