'use client'

import { motion } from 'framer-motion'
import { type ScoreExposicao } from '@/types/detetive-osint'

const CATS: { key: keyof ScoreExposicao['categorias']; label: string }[] = [
  { key: 'localizacao', label: 'Localização' },
  { key: 'rotina', label: 'Rotina' },
  { key: 'conexoes', label: 'Conexões' },
  { key: 'emocional', label: 'Emocional' },
]

function gaugeColor(total: number): string {
  if (total < 30) return '#27746e'
  if (total < 60) return '#ad550a'
  return '#cc3333'
}

function gaugeLabel(total: number): string {
  if (total < 30) return 'BAIXO'
  if (total < 60) return 'MODERADO'
  if (total < 80) return 'ALTO'
  return 'CRÍTICO'
}

const R = 50
const CX = 60
const CY = 62
const TOTAL_ARC = Math.PI * R // semicircle arc length ≈ 157.08

interface BarraExposicaoProps {
  score: ScoreExposicao
  maxPorCategoria?: number
  label?: string
}

export function BarraExposicao({ score, maxPorCategoria = 25, label }: BarraExposicaoProps) {
  const filled = TOTAL_ARC * Math.min(100, score.total) / 100
  const cor = gaugeColor(score.total)

  return (
    <div className="flex flex-col gap-4">
      {label && (
        <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: 'rgba(217,226,236,0.4)' }}>
          {label}
        </p>
      )}

      {/* Semicircle gauge */}
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 120 70" className="w-full max-w-[180px]" aria-label={`Nível de exposição: ${score.total}%`}>
          {/* Track */}
          <path
            d={`M ${CX - R},${CY} A ${R},${R} 0 0,1 ${CX + R},${CY}`}
            fill="none"
            stroke="rgba(217,226,236,0.07)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Fill */}
          <motion.path
            d={`M ${CX - R},${CY} A ${R},${R} 0 0,1 ${CX + R},${CY}`}
            fill="none"
            stroke={cor}
            strokeWidth="8"
            strokeLinecap="round"
            style={{ strokeDasharray: TOTAL_ARC }}
            initial={{ strokeDashoffset: TOTAL_ARC }}
            animate={{ strokeDashoffset: TOTAL_ARC - filled }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
          {/* Center value */}
          <text x={CX} y={CY - 6} textAnchor="middle" fontFamily="var(--font-mono, monospace)" fontSize="18" fontWeight="bold" fill={cor}>
            {score.total}%
          </text>
          <text x={CX} y={CY + 8} textAnchor="middle" fontFamily="var(--font-mono, monospace)" fontSize="7" fill="rgba(217,226,236,0.4)" letterSpacing="2">
            {gaugeLabel(score.total)}
          </text>
        </svg>

        <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em]" style={{ color: 'rgba(217,226,236,0.35)' }}>
          NÍVEL DE EXPOSIÇÃO
        </p>
      </div>

      {/* Category bars */}
      <div className="flex flex-col gap-2">
        {CATS.map(({ key, label: catLabel }) => {
          const val = score.categorias[key]
          const pct = Math.min(100, (val / maxPorCategoria) * 100)
          const barColor = gaugeColor((val / maxPorCategoria) * 100)
          return (
            <div key={key} className="flex items-center gap-2">
              <span className="w-18 font-mono text-[10px]" style={{ color: 'rgba(217,226,236,0.4)', minWidth: 72 }}>
                {catLabel}
              </span>
              <div className="relative h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: 'rgba(217,226,236,0.05)' }}>
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  style={{ background: barColor }}
                />
              </div>
              <span className="font-mono text-[10px] tabular-nums" style={{ color: 'rgba(217,226,236,0.4)', minWidth: 20 }}>
                {val}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
