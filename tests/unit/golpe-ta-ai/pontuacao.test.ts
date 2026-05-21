import { describe, it, expect } from 'vitest'
import { calcularPontuacaoMensagem } from '../../../src/lib/jogos/golpe-ta-ai/pontuacao'
import { type Mensagem, type RespostaJogador } from '../../../src/types/golpe-ta-ai'

const mensagemFraude: Mensagem = {
  id: 'TEST-01',
  onda: 1,
  canal: 'email',
  remetente: {
    nome: 'Banco Falso',
    verificado: false,
    contato_salvo: false,
    numero_ou_email: 'falso@outlook.com',
  },
  conteudo: { texto: 'Sua conta foi bloqueada! Clique agora.' },
  metadados: { horario: '10:00' },
  gabarito: {
    classificacao_correta: 'bloqueio',
    indicadores_validos: ['urgencia', 'remetente_estranho', 'link_suspeito'],
    indicadores_obrigatorios: ['urgencia', 'remetente_estranho'],
    eh_fraude: true,
    explicacao: 'Mensagem de teste.',
  },
}

const mensagemLegitima: Mensagem = {
  id: 'TEST-02',
  onda: 1,
  canal: 'whatsapp',
  remetente: {
    nome: 'Escola',
    verificado: false,
    contato_salvo: true,
    numero_ou_email: '+55 41 99999-0001',
  },
  conteudo: { texto: 'Amanhã não haverá aula.' },
  metadados: { horario: '08:00' },
  gabarito: {
    classificacao_correta: 'confio',
    indicadores_validos: [],
    indicadores_obrigatorios: [],
    eh_fraude: false,
    explicacao: 'Mensagem legítima.',
  },
}

function makeResposta(overrides: Partial<RespostaJogador>): RespostaJogador {
  return {
    mensagem_id: 'TEST-01',
    classificacao: 'bloqueio',
    indicadores_marcados: [],
    tempo_decisao_ms: 5000,
    ...overrides,
  }
}

describe('calcularPontuacaoMensagem', () => {
  it('acerto com todos os indicadores obrigatórios e bônus', () => {
    const resposta = makeResposta({
      classificacao: 'bloqueio',
      indicadores_marcados: ['urgencia', 'remetente_estranho', 'link_suspeito'],
    })
    const resultado = calcularPontuacaoMensagem(mensagemFraude, resposta)

    expect(resultado.correta).toBe(true)
    // 40 base + 3*10 indicadores + 15 bônus todos obrigatórios = 85
    expect(resultado.pontuacao).toBe(85)
    expect(resultado.indicadores_corretos).toHaveLength(3)
    expect(resultado.indicadores_perdidos).toHaveLength(0)
    expect(resultado.indicadores_erroneos).toHaveLength(0)
  })

  it('acerto com indicadores obrigatórios mas sem bônus (faltou um válido)', () => {
    const resposta = makeResposta({
      classificacao: 'bloqueio',
      indicadores_marcados: ['urgencia', 'remetente_estranho'],
    })
    const resultado = calcularPontuacaoMensagem(mensagemFraude, resposta)

    expect(resultado.correta).toBe(true)
    // 40 base + 2*10 indicadores + 15 bônus = 75 (marcou todos obrigatórios)
    expect(resultado.pontuacao).toBe(75)
    expect(resultado.indicadores_perdidos).toHaveLength(0)
  })

  it('acerto sem nenhum indicador marcado', () => {
    const resposta = makeResposta({
      classificacao: 'bloqueio',
      indicadores_marcados: [],
    })
    const resultado = calcularPontuacaoMensagem(mensagemFraude, resposta)

    expect(resultado.correta).toBe(true)
    // 40 base + 0 indicadores, sem bônus = 40
    expect(resultado.pontuacao).toBe(40)
    expect(resultado.indicadores_perdidos).toContain('urgencia')
    expect(resultado.indicadores_perdidos).toContain('remetente_estranho')
  })

  it('penalidade por indicador errado', () => {
    const resposta = makeResposta({
      classificacao: 'bloqueio',
      // urgencia é válido, mas deepfake_audio não é
      indicadores_marcados: ['urgencia', 'deepfake_audio'],
    })
    const resultado = calcularPontuacaoMensagem(mensagemFraude, resposta)

    expect(resultado.correta).toBe(true)
    // 40 base + 1*10 correto + 1*(-5) errado = 45
    expect(resultado.pontuacao).toBe(45)
    expect(resultado.indicadores_erroneos).toContain('deepfake_audio')
  })

  it('erro de classificação retorna 0 pontos', () => {
    const resposta = makeResposta({
      classificacao: 'confio',
      indicadores_marcados: [],
    })
    const resultado = calcularPontuacaoMensagem(mensagemFraude, resposta)

    expect(resultado.correta).toBe(false)
    expect(resultado.pontuacao).toBe(0)
    expect(resultado.indicadores_perdidos).toContain('urgencia')
    expect(resultado.indicadores_perdidos).toContain('remetente_estranho')
  })

  it('mensagem legítima: acerto com 0 indicadores', () => {
    const resposta: RespostaJogador = {
      mensagem_id: 'TEST-02',
      classificacao: 'confio',
      indicadores_marcados: [],
      tempo_decisao_ms: 3000,
    }
    const resultado = calcularPontuacaoMensagem(mensagemLegitima, resposta)

    expect(resultado.correta).toBe(true)
    // 40 base + 0 indicadores + 15 bônus (todos obrigatórios = nenhum) = 55
    expect(resultado.pontuacao).toBe(55)
    expect(resultado.indicadores_perdidos).toHaveLength(0)
  })
})
