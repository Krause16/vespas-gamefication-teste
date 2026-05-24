import { create } from 'zustand'
import { type EstadoJogo } from '@/types/terminal-ctf'
import { criarFilesystemInicial } from '@/lib/jogos/terminal-ctf/filesystem'
import { executarComando } from '@/lib/jogos/terminal-ctf/comandos'
import { detectarFlag, calcularBonusVelocidade } from '@/lib/jogos/terminal-ctf/flags'
import { obterProximaDica } from '@/lib/jogos/terminal-ctf/dicas'

const ESTADO_INICIAL: EstadoJogo = {
  fase: 'intro',
  flags_encontradas: [],
  dicas_usadas: [],
  pontuacao: 0,
  tempo_inicio: 0,
  filesystem: criarFilesystemInicial(),
  comandos_executados: 0,
}

interface TerminalCTFStore {
  estado: EstadoJogo
  iniciarJogo: () => void
  executarComandoTerminal: (input: string) => {
    saida: string
    flag?: import('@/types/terminal-ctf').Flag
    novoFilesystem: import('@/types/terminal-ctf').EstadoFilesystem
  }
  usarDica: (flag_numero: number) => { dica: import('@/types/terminal-ctf').Dica | null; semSaldo: boolean }
  concluir: () => void
  resetar: () => void
}

export const useTerminalCTFStore = create<TerminalCTFStore>((set, get) => ({
  estado: ESTADO_INICIAL,

  iniciarJogo: () =>
    set((s) => ({
      estado: {
        ...s.estado,
        fase: 'jogando',
        tempo_inicio: Date.now(),
      },
    })),

  executarComandoTerminal: (input) => {
    const { estado } = get()
    const resultado = executarComando(input, estado.filesystem)
    const flag = detectarFlag(resultado.saida)

    set((s) => {
      const jaEncontrada = flag && s.estado.flags_encontradas.includes(flag.texto)
      const novasPontuacoes = flag && !jaEncontrada
        ? s.estado.pontuacao + flag.pontos
        : s.estado.pontuacao

      return {
        estado: {
          ...s.estado,
          filesystem: resultado.novo_estado,
          comandos_executados: s.estado.comandos_executados + 1,
          flags_encontradas:
            flag && !jaEncontrada
              ? [...s.estado.flags_encontradas, flag.texto]
              : s.estado.flags_encontradas,
          pontuacao: novasPontuacoes,
        },
      }
    })

    const flagNova = flag && !estado.flags_encontradas.includes(flag.texto) ? flag : undefined
    return { saida: resultado.saida, flag: flagNova, novoFilesystem: resultado.novo_estado }
  },

  usarDica: (flag_numero) => {
    const { estado } = get()
    const dica = obterProximaDica(flag_numero, estado.dicas_usadas)

    if (!dica) return { dica: null, semSaldo: false }
    if (estado.pontuacao < dica.custo_pontos) return { dica, semSaldo: true }

    set((s) => ({
      estado: {
        ...s.estado,
        pontuacao: s.estado.pontuacao - dica.custo_pontos,
        dicas_usadas: [...s.estado.dicas_usadas, { flag_numero, nivel: dica.nivel }],
      },
    }))

    return { dica, semSaldo: false }
  },

  concluir: () =>
    set((s) => {
      const bonus = calcularBonusVelocidade(Date.now() - s.estado.tempo_inicio)
      return {
        estado: {
          ...s.estado,
          fase: 'resultado',
          pontuacao: s.estado.pontuacao + bonus,
        },
      }
    }),

  resetar: () => set({ estado: { ...ESTADO_INICIAL, filesystem: criarFilesystemInicial() } }),
}))
