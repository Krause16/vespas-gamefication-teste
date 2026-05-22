import { type PerfilAlunoFicticio, type ScoreExposicao } from '@/types/detetive-osint'
import { AJUSTES } from './ajustes'

export function calcularScoreExposicaoLuna(pistas_descobertas: string[]): ScoreExposicao {
  const categorias = { localizacao: 0, rotina: 0, conexoes: 0, emocional: 0 }

  for (const id of pistas_descobertas) {
    switch (id) {
      case 'p1_instagram':
        categorias.localizacao += 10
        categorias.emocional += 10
        break
      case 'p2_exif':
        categorias.localizacao += 25
        break
      case 'p3_tiktok':
        categorias.rotina += 20
        break
      case 'p4_discord':
        categorias.conexoes += 10
        categorias.emocional += 5
        break
      case 'p5_imagem_reversa':
        categorias.conexoes += 20
        break
    }
  }

  const total =
    categorias.localizacao +
    categorias.rotina +
    categorias.conexoes +
    categorias.emocional

  return { total, categorias }
}

export function calcularScoreExposicaoAluno(perfil: PerfilAlunoFicticio): ScoreExposicao {
  const localizacao = Math.min(
    25,
    (perfil.posta_localizacao ? 15 : 2) +
      (perfil.posta_fotos_escola ? 8 : 0) +
      (perfil.perfil_publico ? 5 : 0),
  )

  const rotina = Math.min(
    25,
    (perfil.posta_fotos_escola ? 15 : 2) +
      (perfil.rede_favorita === 'tiktok' ? 8 : 0) +
      (perfil.posta_localizacao ? 5 : 0),
  )

  const conexoes = Math.min(
    25,
    (perfil.melhor_amigo_online ? 15 : 2) +
      (perfil.rede_favorita === 'discord' ? 8 : 0) +
      (perfil.perfil_publico ? 5 : 0),
  )

  const emocional = Math.min(
    25,
    (perfil.perfil_publico ? 15 : 2) +
      (perfil.rede_favorita === 'instagram' ? 8 : 0) +
      (perfil.melhor_amigo_online ? 5 : 0),
  )

  const total = localizacao + rotina + conexoes + emocional
  return { total, categorias: { localizacao, rotina, conexoes, emocional } }
}

export function calcularScoreAposAjustes(
  scoreInicial: ScoreExposicao,
  ajustes_aplicados: string[],
): ScoreExposicao {
  const reducaoTotal = ajustes_aplicados.reduce((soma, id) => {
    const ajuste = AJUSTES.find((a) => a.id === id)
    return soma + (ajuste?.reducao_score ?? 0)
  }, 0)

  const novoTotal = Math.max(0, scoreInicial.total - reducaoTotal)
  const ratio = scoreInicial.total > 0 ? novoTotal / scoreInicial.total : 0

  return {
    total: novoTotal,
    categorias: {
      localizacao: Math.round(scoreInicial.categorias.localizacao * ratio),
      rotina: Math.round(scoreInicial.categorias.rotina * ratio),
      conexoes: Math.round(scoreInicial.categorias.conexoes * ratio),
      emocional: Math.round(scoreInicial.categorias.emocional * ratio),
    },
  }
}

export function calcularBonusVelocidade(duracaoMs: number): number {
  const minutos = duracaoMs / 60000
  if (minutos < 10) return 100
  if (minutos < 15) return 50
  if (minutos < 20) return 25
  return 0
}

export function calcularPontuacaoFinal(
  pistas_descobertas: string[],
  pontos_por_pista: Record<string, number>,
  ajustes_aplicados: string[],
  tempo_inicio: number,
): number {
  const pontosInvestigacao = pistas_descobertas.reduce(
    (soma, id) => soma + (pontos_por_pista[id] ?? 0),
    0,
  )
  const pontosDefesa = ajustes_aplicados.length * 50
  const bonusVelocidade = tempo_inicio > 0 ? calcularBonusVelocidade(Date.now() - tempo_inicio) : 0
  return pontosInvestigacao + pontosDefesa + bonusVelocidade
}
