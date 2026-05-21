import { create } from 'zustand'
import {
  type ClassificacaoMensagem,
  type EstadoJogo,
  type IndicadorFraude,
  type OndaMensagem,
  type RespostaJogador,
} from '@/types/golpe-ta-ai'
import { getMensagensDaOnda } from '@/lib/jogos/golpe-ta-ai/mensagens'
import { calcularPontuacaoMensagem } from '@/lib/jogos/golpe-ta-ai/pontuacao'

const ESTADO_INICIAL: EstadoJogo = {
  fase: 'intro',
  onda_atual: 1,
  mensagem_atual_idx: 0,
  mensagens_da_onda: [],
  respostas: [],
  resultados: [],
  pontuacao_total: 0,
  tempo_inicio: 0,
}

interface GolpeTaAiStore {
  estado: EstadoJogo
  indicadores_selecionados: IndicadorFraude[]
  tempo_inicio_mensagem: number

  toggleIndicador: (indicador: IndicadorFraude) => void
  iniciarJogo: () => void
  responderMensagem: (classificacao: ClassificacaoMensagem) => void
  proximaMensagem: () => void
  proximaOnda: () => void
  resetar: () => void
}

export const useGolpeTaAiStore = create<GolpeTaAiStore>((set, get) => ({
  estado: ESTADO_INICIAL,
  indicadores_selecionados: [],
  tempo_inicio_mensagem: 0,

  toggleIndicador: (indicador) => {
    const atual = get().indicadores_selecionados
    const jaEstaMarcado = atual.includes(indicador)
    set({
      indicadores_selecionados: jaEstaMarcado
        ? atual.filter((i) => i !== indicador)
        : [...atual, indicador],
    })
  },

  iniciarJogo: () => {
    const mensagens = getMensagensDaOnda(1)
    set({
      estado: {
        ...ESTADO_INICIAL,
        fase: 'jogando',
        mensagens_da_onda: mensagens,
        tempo_inicio: Date.now(),
      },
      indicadores_selecionados: [],
      tempo_inicio_mensagem: Date.now(),
    })
  },

  responderMensagem: (classificacao) => {
    const { estado, indicadores_selecionados, tempo_inicio_mensagem } = get()
    const mensagemAtual = estado.mensagens_da_onda[estado.mensagem_atual_idx]

    const resposta: RespostaJogador = {
      mensagem_id: mensagemAtual.id,
      classificacao,
      indicadores_marcados: indicadores_selecionados,
      tempo_decisao_ms: Date.now() - tempo_inicio_mensagem,
    }

    const resultado = calcularPontuacaoMensagem(mensagemAtual, resposta)

    set({
      estado: {
        ...estado,
        fase: 'debriefing',
        respostas: [...estado.respostas, resposta],
        resultados: [...estado.resultados, resultado],
        pontuacao_total: estado.pontuacao_total + resultado.pontuacao,
      },
      indicadores_selecionados: [],
    })
  },

  proximaMensagem: () => {
    const { estado } = get()
    const nextIdx = estado.mensagem_atual_idx + 1

    if (nextIdx < estado.mensagens_da_onda.length) {
      set({
        estado: {
          ...estado,
          fase: 'jogando',
          mensagem_atual_idx: nextIdx,
        },
        tempo_inicio_mensagem: Date.now(),
      })
    } else if (estado.onda_atual < 4) {
      set({ estado: { ...estado, fase: 'transicao_onda' } })
    } else {
      set({ estado: { ...estado, fase: 'resultado_final' } })
    }
  },

  proximaOnda: () => {
    const { estado } = get()
    const nextOnda = (estado.onda_atual + 1) as OndaMensagem
    const mensagens = getMensagensDaOnda(nextOnda)
    set({
      estado: {
        ...estado,
        fase: 'jogando',
        onda_atual: nextOnda,
        mensagem_atual_idx: 0,
        mensagens_da_onda: mensagens,
      },
      indicadores_selecionados: [],
      tempo_inicio_mensagem: Date.now(),
    })
  },

  resetar: () => {
    set({
      estado: ESTADO_INICIAL,
      indicadores_selecionados: [],
      tempo_inicio_mensagem: 0,
    })
  },
}))
