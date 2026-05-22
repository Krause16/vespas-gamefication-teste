'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { type EstadoJogo } from '@/types/detetive-osint'
import { PISTAS } from '@/lib/jogos/detetive-osint/pistas'
import { AJUSTES } from '@/lib/jogos/detetive-osint/ajustes'
import { calcularScoreAposAjustes, calcularPontuacaoFinal } from '@/lib/jogos/detetive-osint/score'
import { useSessaoStore } from '@/stores/sessaoStore'
import { salvarSessao } from '@/lib/supabase/sessoes'
import { atualizarPontuacao } from '@/lib/supabase/jogadores'

const PONTOS_POR_PISTA: Record<string, number> = Object.fromEntries(
  PISTAS.map((p) => [p.id, p.pontos]),
)

interface ResultadoFinalProps {
  estado: EstadoJogo
  onVoltar: () => void
}

export function ResultadoFinal({ estado, onVoltar }: ResultadoFinalProps) {
  const router = useRouter()
  const { jogador_id, atualizarPontuacao: atualizarPontuacaoStore } = useSessaoStore()
  const [salvando, setSalvando] = useState(false)
  const [pontuacaoFinal, setPontuacaoFinal] = useState(0)

  const scoreAposAjustes = calcularScoreAposAjustes(
    estado.score_exposicao_aluno,
    estado.ajustes_aplicados,
  )

  const pctInvestigado = estado.score_exposicao_luna.total
  const pctExpostoRestante = scoreAposAjustes.total

  const ajustesNaoAplicados = AJUSTES.filter(
    (a) => !estado.ajustes_aplicados.includes(a.id),
  ).slice(0, 5)

  useEffect(() => {
    const duracaoSegundos = estado.tempo_inicio > 0
      ? Math.round((Date.now() - estado.tempo_inicio) / 1000)
      : 0

    async function salvar() {
      const pts = calcularPontuacaoFinal(
        estado.pistas_descobertas,
        PONTOS_POR_PISTA,
        estado.ajustes_aplicados,
        estado.tempo_inicio,
      )
      setPontuacaoFinal(pts)

      if (!jogador_id) return
      setSalvando(true)
      try {
        await salvarSessao({
          jogador_id,
          jogo_slug: 'detetive-osint',
          pontuacao: pts,
          duracao_segundos: duracaoSegundos,
          metadata: {
            pistas_descobertas: estado.pistas_descobertas.length,
            score_exposicao_luna_final: estado.score_exposicao_luna.total,
            score_exposicao_aluno_inicial: estado.score_exposicao_aluno.total,
            score_exposicao_aluno_final: scoreAposAjustes.total,
            ajustes_aplicados: estado.ajustes_aplicados.length,
          },
        })
        await atualizarPontuacao(jogador_id, pts)
        atualizarPontuacaoStore(pts)
      } catch {
        // Erro silencioso — o aluno ainda vê o resultado
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
      style={{ background: 'var(--vespa-grafite)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <p
          className="mb-6 text-center font-mono text-xs font-bold tracking-[0.3em]"
          style={{ color: 'var(--vespa-esmeralda)' }}
        >
          MISSÃO CONCLUÍDA
        </p>

        {/* Pontuação */}
        <div className="mb-6 flex justify-center">
          <div
            className="flex h-28 w-28 flex-col items-center justify-center"
            style={{
              clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
              background: 'var(--vespa-esmeralda)',
            }}
            aria-label={`Pontuação: ${pontuacaoFinal} pontos`}
          >
            <span className="text-xl font-bold" style={{ color: '#111' }}>
              {pontuacaoFinal}
            </span>
            <span className="text-[10px] font-bold" style={{ color: '#111' }}>
              pts
            </span>
          </div>
        </div>

        {/* Dois cards lado a lado */}
        <div className="mb-5 grid grid-cols-2 gap-3">
          <div
            className="rounded-xl p-4 text-center"
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <p
              className="mb-1 font-mono text-2xl font-bold"
              style={{ color: 'var(--vespa-cobre)' }}
            >
              {pctInvestigado}%
            </p>
            <p className="text-xs leading-tight" style={{ color: 'var(--color-text-secondary)' }}>
              alvo exposto como investigador
            </p>
          </div>

          <div
            className="rounded-xl p-4 text-center"
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <p
              className="mb-1 font-mono text-2xl font-bold"
              style={{
                color:
                  pctExpostoRestante < 30
                    ? 'var(--vespa-firewall)'
                    : pctExpostoRestante < 60
                      ? '#e6b800'
                      : 'var(--vespa-cobre)',
              }}
            >
              {pctExpostoRestante}%
            </p>
            <p className="text-xs leading-tight" style={{ color: 'var(--color-text-secondary)' }}>
              sua exposição restante
            </p>
          </div>
        </div>

        {/* Ações da vida real */}
        {ajustesNaoAplicados.length > 0 && (
          <div
            className="mb-5 rounded-xl p-4"
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <p
              className="mb-3 text-[10px] font-bold tracking-[0.2em]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              SUAS PRÓXIMAS AÇÕES NA VIDA REAL
            </p>
            <div className="flex flex-col gap-2">
              {ajustesNaoAplicados.map((a) => (
                <div key={a.id} className="flex items-start gap-2">
                  <span className="mt-0.5 flex-shrink-0 text-xs" style={{ color: 'var(--vespa-azul-link)' }}>
                    →
                  </span>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--vespa-nevoa)' }}>
                    {a.acao_real}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

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
