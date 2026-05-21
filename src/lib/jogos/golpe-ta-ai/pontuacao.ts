import { type Mensagem, type RespostaJogador, type ResultadoMensagem } from '@/types/golpe-ta-ai'

const PONTOS_BASE_CLASSIFICACAO = 40
const PONTOS_POR_INDICADOR = 10
const BONUS_TODOS_INDICADORES = 15
const PENALIDADE_INDICADOR_ERRADO = -5
const PENALIDADE_CLASSIFICACAO_ERRADA = -20

export function calcularPontuacaoMensagem(
  mensagem: Mensagem,
  resposta: RespostaJogador
): ResultadoMensagem {
  const classificacaoCorreta =
    resposta.classificacao === mensagem.gabarito.classificacao_correta

  if (!classificacaoCorreta) {
    return {
      correta: false,
      pontuacao: Math.max(0, PENALIDADE_CLASSIFICACAO_ERRADA),
      indicadores_corretos: [],
      indicadores_perdidos: mensagem.gabarito.indicadores_obrigatorios,
      indicadores_erroneos: resposta.indicadores_marcados,
    }
  }

  let pontuacao = PONTOS_BASE_CLASSIFICACAO

  const corretos = resposta.indicadores_marcados.filter((i) =>
    mensagem.gabarito.indicadores_validos.includes(i)
  )
  const erroneos = resposta.indicadores_marcados.filter(
    (i) => !mensagem.gabarito.indicadores_validos.includes(i)
  )
  const perdidos = mensagem.gabarito.indicadores_obrigatorios.filter(
    (i) => !resposta.indicadores_marcados.includes(i)
  )

  pontuacao += corretos.length * PONTOS_POR_INDICADOR
  pontuacao += erroneos.length * PENALIDADE_INDICADOR_ERRADO

  const marcouTodosObrigatorios = mensagem.gabarito.indicadores_obrigatorios.every(
    (i) => resposta.indicadores_marcados.includes(i)
  )
  if (marcouTodosObrigatorios) pontuacao += BONUS_TODOS_INDICADORES

  return {
    correta: true,
    pontuacao: Math.max(0, pontuacao),
    indicadores_corretos: corretos,
    indicadores_perdidos: perdidos,
    indicadores_erroneos: erroneos,
  }
}
