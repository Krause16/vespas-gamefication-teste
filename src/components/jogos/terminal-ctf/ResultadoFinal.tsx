'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { type EstadoJogo } from '@/types/terminal-ctf'
import { FLAGS } from '@/lib/jogos/terminal-ctf/flags'
import { useSessaoStore } from '@/stores/sessaoStore'
import { salvarSessao } from '@/lib/supabase/sessoes'
import { atualizarPontuacao } from '@/lib/supabase/jogadores'

function textoMotivacional(flags: number): string {
  if (flags === 7) return 'Impressionante. Você encontrou todas as 7 flags. Carreira em segurança? Considere.'
  if (flags >= 5) return 'Excelente trabalho. Você domina as técnicas fundamentais de investigação.'
  if (flags >= 3) return 'Bom começo. Com prática, você vai mais longe.'
  return 'Continue explorando. Cada comando aprendido é uma ferramenta a mais.'
}

interface ResultadoFinalProps {
  estado: EstadoJogo
  onVoltar: () => void
}

export function ResultadoFinal({ estado, onVoltar }: ResultadoFinalProps) {
  const router = useRouter()
  const { jogador_id, atualizarPontuacao: atualizarStore, concluirJogo } = useSessaoStore()
  const [salvando, setSalvando] = useState(false)

  const flagsEncontradas = FLAGS.filter((f) => estado.flags_encontradas.includes(f.texto))
  const pontosPorFlags = flagsEncontradas.reduce((s, f) => s + f.pontos, 0)
  const custosDicas = estado.dicas_usadas.reduce((s, d) => {
    const custo = d.nivel === 1 ? 5 : d.nivel === 2 ? 12 : 25
    return s + custo
  }, 0)
  // bonus já foi somado pelo store em concluir(); inferido da pontuação final
  const bonus = estado.pontuacao - pontosPorFlags + custosDicas

  useEffect(() => {
    const duracaoSegundos = estado.tempo_inicio > 0
      ? Math.round((Date.now() - estado.tempo_inicio) / 1000)
      : 0

    async function salvar() {
      concluirJogo('terminal-ctf')

      if (!jogador_id) return
      setSalvando(true)
      try {
        await salvarSessao({
          jogador_id,
          jogo_slug: 'terminal-ctf',
          pontuacao: estado.pontuacao,
          duracao_segundos: duracaoSegundos,
          metadata: {
            flags_encontradas: estado.flags_encontradas.length,
            comandos_executados_count: estado.comandos_executados,
            dicas_usadas_count: estado.dicas_usadas.length,
            tempo_por_flag: duracaoSegundos > 0 && estado.flags_encontradas.length > 0
              ? Math.round(duracaoSegundos / estado.flags_encontradas.length)
              : 0,
          },
        })
        await atualizarPontuacao(jogador_id, estado.pontuacao)
        atualizarStore(estado.pontuacao)
      } catch {
        // silencioso
      } finally {
        setSalvando(false)
      }
    }
    void salvar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleVoltar() {
    onVoltar()
    router.push('/hub')
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-5 py-10"
      style={{ background: '#0d0d0d' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <p
          className="mb-6 text-center font-mono text-xs font-bold tracking-[0.3em]"
          style={{ color: 'var(--vespa-esmeralda)' }}
        >
          OPERAÇÃO CONCLUÍDA
        </p>

        {/* Score hexágono */}
        <div className="mb-6 flex justify-center">
          <div
            className="flex h-28 w-28 flex-col items-center justify-center"
            style={{
              clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
              background: 'var(--vespa-esmeralda)',
            }}
          >
            <span className="text-xl font-bold" style={{ color: '#111' }}>
              {estado.pontuacao}
            </span>
            <span className="text-[10px] font-bold" style={{ color: '#111' }}>
              pts
            </span>
          </div>
        </div>

        {/* Flags encontradas */}
        <div
          className="mb-4 rounded-xl p-4"
          style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)' }}
        >
          <p className="mb-3 text-[10px] font-bold tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>
            FLAGS ENCONTRADAS — {flagsEncontradas.length}/7
          </p>
          <div className="flex flex-wrap gap-1.5">
            {FLAGS.map((f) => (
              <span
                key={f.numero}
                className="rounded px-2 py-1 font-mono text-xs font-bold"
                style={{
                  background: estado.flags_encontradas.includes(f.texto)
                    ? 'rgba(57,255,20,0.12)'
                    : 'var(--color-bg-elevated)',
                  color: estado.flags_encontradas.includes(f.texto)
                    ? 'var(--vespa-esmeralda)'
                    : 'var(--color-text-secondary)',
                  border: `1px solid ${estado.flags_encontradas.includes(f.texto) ? 'rgba(57,255,20,0.3)' : 'var(--color-border-strong)'}`,
                }}
              >
                F{f.numero}
              </span>
            ))}
          </div>
        </div>

        {/* Breakdown */}
        <div
          className="mb-4 rounded-xl p-4"
          style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)' }}
        >
          <p className="mb-3 text-[10px] font-bold tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>
            PONTUAÇÃO
          </p>
          <div className="flex flex-col gap-2">
            <Linha label="Pontos por flags" valor={`+${pontosPorFlags}`} cor="var(--vespa-esmeralda)" />
            <Linha label="Bônus velocidade" valor={`+${bonus}`} cor="var(--vespa-azul-link)" />
            {custosDicas > 0 && (
              <Linha label={`Dicas usadas (${estado.dicas_usadas.length}x)`} valor={`-${custosDicas}`} cor="var(--vespa-cobre)" />
            )}
            <Linha label="Comandos executados" valor={String(estado.comandos_executados)} />
          </div>
        </div>

        {/* Texto motivacional */}
        <div
          className="mb-6 rounded-xl p-4"
          style={{
            background: 'rgba(57,255,20,0.04)',
            border: '1px solid rgba(57,255,20,0.12)',
          }}
        >
          <p className="text-sm leading-relaxed" style={{ color: 'var(--vespa-nevoa)' }}>
            {textoMotivacional(flagsEncontradas.length)}
          </p>
        </div>

        <button
          onClick={handleVoltar}
          disabled={salvando}
          className="w-full rounded-xl py-3.5 text-sm font-bold tracking-[0.15em] transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ background: 'var(--vespa-azul-link)', color: 'var(--vespa-nevoa)' }}
        >
          VOLTAR AO HUB
        </button>
      </motion.div>
    </div>
  )
}

function Linha({ label, valor, cor }: { label: string; valor: string; cor?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        {label}
      </span>
      <span className="font-mono text-sm font-bold" style={{ color: cor ?? 'var(--vespa-nevoa)' }}>
        {valor}
      </span>
    </div>
  )
}
