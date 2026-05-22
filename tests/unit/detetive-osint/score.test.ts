import { describe, it, expect } from 'vitest'
import {
  calcularScoreExposicaoLuna,
  calcularScoreExposicaoAluno,
  calcularScoreAposAjustes,
  calcularBonusVelocidade,
} from '@/lib/jogos/detetive-osint/score'
import { type PerfilAlunoFicticio } from '@/types/detetive-osint'

describe('calcularScoreExposicaoLuna', () => {
  it('score zero sem pistas', () => {
    const score = calcularScoreExposicaoLuna([])
    expect(score.total).toBe(0)
    expect(score.categorias.localizacao).toBe(0)
  })

  it('p1_instagram contribui localizacao e emocional', () => {
    const score = calcularScoreExposicaoLuna(['p1_instagram'])
    expect(score.categorias.localizacao).toBe(10)
    expect(score.categorias.emocional).toBe(10)
    expect(score.total).toBe(20)
  })

  it('p2_exif contribui apenas localizacao', () => {
    const score = calcularScoreExposicaoLuna(['p2_exif'])
    expect(score.categorias.localizacao).toBe(25)
    expect(score.total).toBe(25)
  })

  it('p3_tiktok contribui apenas rotina', () => {
    const score = calcularScoreExposicaoLuna(['p3_tiktok'])
    expect(score.categorias.rotina).toBe(20)
    expect(score.total).toBe(20)
  })

  it('todas as pistas atingem 100', () => {
    const score = calcularScoreExposicaoLuna([
      'p1_instagram',
      'p2_exif',
      'p3_tiktok',
      'p4_discord',
      'p5_imagem_reversa',
    ])
    expect(score.total).toBe(100)
  })

  it('combinação mínima para threshold >= 80', () => {
    // p1+p2+p3+p4 = 20+25+20+15 = 80
    const score = calcularScoreExposicaoLuna(['p1_instagram', 'p2_exif', 'p3_tiktok', 'p4_discord'])
    expect(score.total).toBeGreaterThanOrEqual(80)
  })
})

describe('calcularScoreExposicaoAluno', () => {
  const perfilMaximo: PerfilAlunoFicticio = {
    apelido: 'Agente X',
    escola_ficticia: 'IFPR',
    bairro_ficticio: 'Centro',
    rede_favorita: 'instagram',
    posta_fotos_escola: true,
    posta_localizacao: true,
    perfil_publico: true,
    melhor_amigo_online: true,
  }

  const perfilMinimo: PerfilAlunoFicticio = {
    apelido: 'Agente Y',
    escola_ficticia: 'IFPR',
    bairro_ficticio: 'Centro',
    rede_favorita: 'twitter',
    posta_fotos_escola: false,
    posta_localizacao: false,
    perfil_publico: false,
    melhor_amigo_online: false,
  }

  it('perfil máximo tem score alto', () => {
    const score = calcularScoreExposicaoAluno(perfilMaximo)
    expect(score.total).toBeGreaterThan(60)
    expect(score.total).toBeLessThanOrEqual(100)
  })

  it('perfil mínimo tem score baixo', () => {
    const score = calcularScoreExposicaoAluno(perfilMinimo)
    expect(score.total).toBeLessThan(20)
  })

  it('categorias somam ao total', () => {
    const score = calcularScoreExposicaoAluno(perfilMaximo)
    const soma =
      score.categorias.localizacao +
      score.categorias.rotina +
      score.categorias.conexoes +
      score.categorias.emocional
    expect(score.total).toBe(soma)
  })

  it('posta_localizacao aumenta categoria localizacao', () => {
    const sem = calcularScoreExposicaoAluno({ ...perfilMinimo, posta_localizacao: false })
    const com = calcularScoreExposicaoAluno({ ...perfilMinimo, posta_localizacao: true })
    expect(com.categorias.localizacao).toBeGreaterThan(sem.categorias.localizacao)
  })
})

describe('calcularScoreAposAjustes', () => {
  const scoreBase = {
    total: 80,
    categorias: { localizacao: 30, rotina: 20, conexoes: 20, emocional: 10 },
  }

  it('sem ajustes mantém score original', () => {
    const resultado = calcularScoreAposAjustes(scoreBase, [])
    expect(resultado.total).toBe(80)
  })

  it('perfil_privado reduz 20 pontos', () => {
    const resultado = calcularScoreAposAjustes(scoreBase, ['perfil_privado'])
    expect(resultado.total).toBe(60)
  })

  it('múltiplos ajustes acumulam redução', () => {
    const resultado = calcularScoreAposAjustes(scoreBase, ['perfil_privado', 'remover_geolocalizacao'])
    expect(resultado.total).toBe(35) // 80 - 20 - 25
  })

  it('não desce abaixo de zero', () => {
    const resultado = calcularScoreAposAjustes(scoreBase, [
      'perfil_privado',
      'remover_geolocalizacao',
      'separar_contas',
      'restringir_stories',
      'remover_escola_bio',
      'revisar_seguidores',
      'exif_fotos',
      'verificar_apps',
    ])
    expect(resultado.total).toBeGreaterThanOrEqual(0)
  })
})

describe('calcularBonusVelocidade', () => {
  it('antes de 10 minutos retorna 100', () => {
    expect(calcularBonusVelocidade(9 * 60 * 1000)).toBe(100)
  })

  it('entre 10 e 15 minutos retorna 50', () => {
    expect(calcularBonusVelocidade(12 * 60 * 1000)).toBe(50)
  })

  it('entre 15 e 20 minutos retorna 25', () => {
    expect(calcularBonusVelocidade(17 * 60 * 1000)).toBe(25)
  })

  it('acima de 20 minutos retorna 0', () => {
    expect(calcularBonusVelocidade(25 * 60 * 1000)).toBe(0)
  })
})
