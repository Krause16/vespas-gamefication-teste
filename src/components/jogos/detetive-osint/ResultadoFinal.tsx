'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useSpring, useMotionValueEvent } from 'motion/react'
import { ChevronRight } from 'lucide-react'
import { GlassPanel, LiquidButton } from '@/components/vespas/DesignSystem'
import { type EstadoJogo } from '@/types/detetive-osint'
import { AJUSTES } from '@/lib/jogos/detetive-osint/ajustes'
import { PISTAS } from '@/lib/jogos/detetive-osint/pistas'
import { calcularScoreAposAjustes, calcularPontuacaoFinal } from '@/lib/jogos/detetive-osint/score'
import { useSessaoStore } from '@/stores/sessaoStore'
import { salvarSessao } from '@/lib/supabase/sessoes'
import { atualizarPontuacao } from '@/lib/supabase/jogadores'

const PONTOS_POR_PISTA: Record<string, number> = Object.fromEntries(
  PISTAS.map((p) => [p.id, p.pontos]),
)

function ScoreCard({
  titulo,
  valor,
  subtitulo,
  cor,
  delay,
}: {
  titulo: string
  valor: number
  subtitulo: string
  cor: string
  delay: number
}) {
  const spring = useSpring(0, { stiffness: 60, damping: 15 })
  const [val, setVal] = useState(0)
  useMotionValueEvent(spring, 'change', (v) => setVal(Math.round(v)))

  useEffect(() => {
    const t = setTimeout(() => spring.set(valor), delay)
    return () => clearTimeout(t)
  }, [spring, valor, delay])

  return (
    <GlassPanel className="flex flex-col items-center gap-1 p-5 text-center">
      <p className="font-mono text-[9px] uppercase tracking-[0.25em]" style={{ color: 'rgba(217,226,236,0.35)' }}>
        {titulo}
      </p>
      <motion.span className="font-display text-4xl font-bold" style={{ color: cor }}>
        {val}%
      </motion.span>
      <p className="text-xs leading-snug" style={{ color: 'rgba(217,226,236,0.45)' }}>
        {subtitulo}
      </p>
    </GlassPanel>
  )
}

interface ResultadoFinalProps {
  estado: EstadoJogo
  onVoltar: () => void
}

export function ResultadoFinal({ estado, onVoltar }: ResultadoFinalProps) {
  const router = useRouter()
  const { jogador_id, atualizarPontuacao: atualizarPontuacaoStore, concluirJogo } = useSessaoStore()
  const [pontuacaoFinal, setPontuacaoFinal] = useState(0)

  const scoreAposAjustes = calcularScoreAposAjustes(
    estado.score_exposicao_aluno,
    estado.ajustes_aplicados,
  )
  const pctInvestigado = estado.score_exposicao_luna.total
  const pctExpostoRestante = scoreAposAjustes.total

  const exposureColor = pctExpostoRestante < 30 ? '#39ff14' : pctExpostoRestante < 60 ? '#e6b800' : '#ad550a'

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
        concluirJogo('detetive-osint')
      } catch {
        // Erro silencioso — o aluno ainda vê o resultado
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
      style={{ background: '#0a0a0a' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex w-full max-w-sm flex-col gap-5"
      >
        {/* Title */}
        <div className="text-center">
          <p className="font-mono text-[9px] uppercase tracking-[0.35em]" style={{ color: 'rgba(57,255,20,0.5)' }}>
            MISSÃO CONCLUÍDA
          </p>
          <p className="mt-1 font-display text-2xl" style={{ color: '#d9e2ec', letterSpacing: '-0.02em' }}>
            DETETIVE OSINT
          </p>
          <p className="mt-1 font-mono text-sm font-bold" style={{ color: '#39ff14' }}>
            {pontuacaoFinal} pts
          </p>
        </div>

        {/* Two score panels side-by-side */}
        <div className="grid grid-cols-2 gap-3">
          <ScoreCard
            titulo="Alvo investigado"
            valor={pctInvestigado}
            subtitulo="exposto como investigador"
            cor="#ad550a"
            delay={300}
          />
          <ScoreCard
            titulo="Sua exposição"
            valor={pctExpostoRestante}
            subtitulo="exposição restante"
            cor={exposureColor}
            delay={600}
          />
        </div>

        {/* Actions section */}
        {ajustesNaoAplicados.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassPanel className="p-5">
              <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.25em]" style={{ color: 'rgba(217,226,236,0.35)' }}>
                AÇÕES PARA HOJE
              </p>
              <div className="flex flex-col gap-2.5">
                {ajustesNaoAplicados.map((a, i) => (
                  <motion.div
                    key={a.id}
                    className="flex items-start gap-2"
                    initial={{ x: -12, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 + i * 0.08 }}
                  >
                    <ChevronRight
                      size={12}
                      style={{ color: '#0d70ce', marginTop: 3, flexShrink: 0 }}
                      aria-hidden="true"
                    />
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(217,226,236,0.6)' }}>
                      {a.acao_real}
                    </p>
                  </motion.div>
                ))}
              </div>
            </GlassPanel>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <LiquidButton variant="primary" size="md" className="w-full" onClick={handleVoltar}>
            Voltar ao hub
          </LiquidButton>
        </motion.div>
      </motion.div>
    </div>
  )
}
