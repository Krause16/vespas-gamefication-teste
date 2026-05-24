import { create } from 'zustand'
import {
  type AppSlug,
  type ClassificacaoMensagem,
  type EstadoJogo,
  type IndicadorFraude,
  type RespostaJogador,
} from '@/types/golpe-ta-ai'
import { getMensagem } from '@/lib/jogos/golpe-ta-ai/mensagens'
import { calcularPontuacaoMensagem } from '@/lib/jogos/golpe-ta-ai/pontuacao'

const BONUS_ANALISE_COMPLETA = 200

const ESTADO_INICIAL: EstadoJogo = {
  fase: 'intro',
  app_atual: null,
  mensagem_atual_id: null,
  mensagens_completadas: [],
  meta_completar: 10,
  total_mensagens: 15,
  respostas: [],
  resultados: [],
  pontuacao_total: 0,
  tempo_inicio: 0,
}

interface GolpeTaAiStore {
  estado: EstadoJogo
  indicadores_selecionados: IndicadorFraude[]
  classificacao_selecionada: ClassificacaoMensagem | null
  tempo_inicio_mensagem: number

  iniciarJogo: () => void
  abrirApp: (app: AppSlug) => void
  fecharApp: () => void
  abrirMensagem: (id: string) => void
  fecharClassificacao: () => void
  toggleIndicador: (indicador: IndicadorFraude) => void
  selecionarClassificacao: (c: ClassificacaoMensagem) => void
  confirmarClassificacao: () => void
  fecharDebriefing: () => void
  verResultado: () => void
  resetar: () => void
}

export const useGolpeTaAiStore = create<GolpeTaAiStore>((set, get) => ({
  estado: ESTADO_INICIAL,
  indicadores_selecionados: [],
  classificacao_selecionada: 'suspeito',
  tempo_inicio_mensagem: 0,

  iniciarJogo: () => {
    set({
      estado: { ...ESTADO_INICIAL, fase: 'smartphone', tempo_inicio: Date.now() },
      indicadores_selecionados: [],
      classificacao_selecionada: 'suspeito',
      tempo_inicio_mensagem: 0,
    })
  },

  abrirApp: (app) => {
    set((s) => ({ estado: { ...s.estado, fase: 'em_app', app_atual: app } }))
  },

  fecharApp: () => {
    set((s) => ({ estado: { ...s.estado, fase: 'smartphone', app_atual: null } }))
  },

  abrirMensagem: (id) => {
    set((s) => ({
      estado: { ...s.estado, fase: 'classificando', mensagem_atual_id: id },
      indicadores_selecionados: [],
      classificacao_selecionada: 'suspeito',
      tempo_inicio_mensagem: Date.now(),
    }))
  },

  fecharClassificacao: () => {
    set((s) => ({ estado: { ...s.estado, fase: 'em_app', mensagem_atual_id: null } }))
  },

  toggleIndicador: (indicador) => {
    const atual = get().indicadores_selecionados
    set({
      indicadores_selecionados: atual.includes(indicador)
        ? atual.filter((i) => i !== indicador)
        : [...atual, indicador],
    })
  },

  selecionarClassificacao: (c) => {
    set({ classificacao_selecionada: c })
  },

  confirmarClassificacao: () => {
    const { estado, indicadores_selecionados, classificacao_selecionada, tempo_inicio_mensagem } = get()
    if (!estado.mensagem_atual_id || !classificacao_selecionada) return

    const mensagem = getMensagem(estado.mensagem_atual_id)
    if (!mensagem) return

    const resposta: RespostaJogador = {
      mensagem_id: estado.mensagem_atual_id,
      classificacao: classificacao_selecionada,
      indicadores_marcados: indicadores_selecionados,
      tempo_decisao_ms: Date.now() - tempo_inicio_mensagem,
    }

    const resultado = calcularPontuacaoMensagem(mensagem, resposta)
    const novasCompletadas = [...estado.mensagens_completadas, estado.mensagem_atual_id]

    const bonusAnalise = novasCompletadas.length === estado.total_mensagens ? BONUS_ANALISE_COMPLETA : 0

    set({
      estado: {
        ...estado,
        fase: 'debriefing',
        mensagens_completadas: novasCompletadas,
        respostas: [...estado.respostas, resposta],
        resultados: [...estado.resultados, resultado],
        pontuacao_total: estado.pontuacao_total + resultado.pontuacao + bonusAnalise,
      },
      indicadores_selecionados: [],
    })
  },

  fecharDebriefing: () => {
    set((s) => ({ estado: { ...s.estado, fase: 'em_app', mensagem_atual_id: null } }))
  },

  verResultado: () => {
    set((s) => ({ estado: { ...s.estado, fase: 'resultado_final' } }))
  },

  resetar: () => {
    set({
      estado: ESTADO_INICIAL,
      indicadores_selecionados: [],
      classificacao_selecionada: 'suspeito',
      tempo_inicio_mensagem: 0,
    })
  },
}))
