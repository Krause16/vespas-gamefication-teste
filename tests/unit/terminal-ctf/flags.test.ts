import { describe, it, expect } from 'vitest'
import { detectarFlag, FLAGS } from '@/lib/jogos/terminal-ctf/flags'

describe('detectarFlag', () => {
  it('retorna null se não há flag', () => {
    expect(detectarFlag('Bem-vindo ao servidor')).toBeNull()
  })

  it('detecta Flag 1', () => {
    const flag = detectarFlag('VESPAS{bem_vindo_ao_terminal}')
    expect(flag).not.toBeNull()
    expect(flag!.numero).toBe(1)
  })

  it('detecta flag em meio a texto', () => {
    const flag = detectarFlag('Parabéns! VESPAS{find_e_a_arma_do_investigador} encontrada.')
    expect(flag).not.toBeNull()
    expect(flag!.numero).toBe(7)
  })

  it('detecta todas as 7 flags', () => {
    for (const f of FLAGS) {
      const resultado = detectarFlag(f.texto)
      expect(resultado).not.toBeNull()
      expect(resultado!.numero).toBe(f.numero)
    }
  })

  it('não detecta padrão VESPAS inválido', () => {
    expect(detectarFlag('VESPAS{flag_inexistente}')).toBeNull()
  })
})
