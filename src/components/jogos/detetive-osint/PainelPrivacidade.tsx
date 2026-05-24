'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence, useSpring, useTransform } from 'motion/react'
import { HexGrid } from '@/components/vespas/HexGrid'
import { SectionEyebrow, LiquidButton } from '@/components/vespas/DesignSystem'
import { type ScoreExposicao } from '@/types/detetive-osint'
import { AJUSTES } from '@/lib/jogos/detetive-osint/ajustes'
import { calcularScoreAposAjustes } from '@/lib/jogos/detetive-osint/score'
import { AjustePrivacidadeCard } from './AjustePrivacidadeCard'

const MINIMO_AJUSTES = 3
const GAUGE_R = 72
const GAUGE_C = 2 * Math.PI * GAUGE_R

function gaugeColor(pct: number): string {
  if (pct < 30) return '#39ff14'
  if (pct < 60) return '#e6b800'
  return '#ad550a'
}

interface GaugeProps { pct: number }

function ExposureGauge({ pct }: GaugeProps) {
  const spring = useSpring(pct, { stiffness: 60, damping: 16 })
  const offset = useTransform(spring, (v) => GAUGE_C * (1 - (100 - v) / 100))
  const color = gaugeColor(pct)

  useEffect(() => { spring.set(pct) }, [spring, pct])

  return (
    <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
      <svg width={200} height={200} viewBox="0 0 200 200" aria-hidden="true">
        {/* Track */}
        <circle
          cx={100} cy={100} r={GAUGE_R}
          fill="none"
          stroke="rgba(217,226,236,0.06)"
          strokeWidth={14}
        />
        {/* Progress arc */}
        <motion.circle
          cx={100} cy={100} r={GAUGE_R}
          fill="none"
          stroke={color}
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={GAUGE_C}
          style={{ strokeDashoffset: offset, rotate: -90, transformOrigin: '100px 100px' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span
          className="font-display text-4xl font-bold leading-none"
          style={{ color }}
        >
          {Math.round(pct)}
        </motion.span>
        <span className="font-mono text-[9px] uppercase tracking-[0.25em]" style={{ color: 'rgba(217,226,236,0.35)' }}>
          % exposto
        </span>
      </div>
    </div>
  )
}

interface PainelPrivacidadeProps {
  scoreInicial: ScoreExposicao
  ajustes_aplicados: string[]
  onAplicar: (id: string) => void
  onRemover: (id: string) => void
  onConcluir: () => void
}

export function PainelPrivacidade({
  scoreInicial,
  ajustes_aplicados,
  onAplicar,
  onRemover,
  onConcluir,
}: PainelPrivacidadeProps) {
  const scoreAtual = calcularScoreAposAjustes(scoreInicial, ajustes_aplicados)
  const prontoPara = ajustes_aplicados.length >= MINIMO_AJUSTES
  const faltam = Math.max(0, MINIMO_AJUSTES - ajustes_aplicados.length)

  return (
    <div className="relative flex min-h-screen flex-col" style={{ background: '#0a0a0a' }}>
      <HexGrid density="low" interactive={false} className="fixed" />

      {/* Header */}
      <header
        className="relative z-10 border-b px-5 py-4"
        style={{
          borderColor: 'rgba(57,255,20,0.08)',
          background: 'rgba(8,8,8,0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: 'rgba(0,112,206,0.8)' }}>
          OPERAÇÃO RASTRO DIGITAL — ATO 3
        </p>
        <p className="mt-0.5 text-sm font-semibold" style={{ color: '#d9e2ec' }}>
          Configure suas defesas
        </p>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto px-5 py-8 lg:grid lg:grid-cols-[1fr_300px] lg:gap-8 lg:px-8">
        {/* Left: adjustments */}
        <div className="flex flex-col gap-4">
          <div className="mb-2">
            <SectionEyebrow index="03" title="PROTOCOLO" accent="DE DEFESA" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {AJUSTES.map((ajuste) => (
              <AjustePrivacidadeCard
                key={ajuste.id}
                ajuste={ajuste}
                aplicado={ajustes_aplicados.includes(ajuste.id)}
                onToggle={() =>
                  ajustes_aplicados.includes(ajuste.id)
                    ? onRemover(ajuste.id)
                    : onAplicar(ajuste.id)
                }
              />
            ))}
          </div>
        </div>

        {/* Right: gauge + progress + button */}
        <div className="mt-8 flex flex-col items-center gap-6 lg:mt-0">
          <div
            className="flex w-full flex-col items-center gap-4 rounded-2xl p-5"
            style={{
              background: 'rgba(13,13,13,0.8)',
              border: '1px solid rgba(57,255,20,0.08)',
            }}
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.25em]" style={{ color: 'rgba(217,226,236,0.3)' }}>
              SUA EXPOSIÇÃO ATUAL
            </p>
            <ExposureGauge pct={scoreAtual.total} />

            <div className="flex w-full items-center justify-between rounded-lg px-4 py-2" style={{ background: 'rgba(57,255,20,0.05)' }}>
              <span className="font-mono text-xs" style={{ color: 'rgba(217,226,236,0.4)' }}>
                Ajustes aplicados
              </span>
              <span className="font-mono text-sm font-bold" style={{ color: '#39ff14' }}>
                {ajustes_aplicados.length}/{AJUSTES.length}
              </span>
            </div>

            {!prontoPara && (
              <p className="text-center text-xs" style={{ color: 'rgba(217,226,236,0.35)' }}>
                Aplique mais {faltam} ajuste{faltam > 1 ? 's' : ''} para continuar
              </p>
            )}
          </div>

          <AnimatePresence>
            {prontoPara && (
              <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.3 }}
              >
                <LiquidButton variant="primary" size="md" className="w-full" onClick={onConcluir}>
                  Ver resultado final
                </LiquidButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
