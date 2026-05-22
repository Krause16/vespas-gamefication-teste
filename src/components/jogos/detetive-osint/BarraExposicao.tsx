'use client'

import { motion } from 'framer-motion'
import { type ScoreExposicao } from '@/types/detetive-osint'

const CATEGORIAS: { key: keyof ScoreExposicao['categorias']; label: string; emoji: string }[] = [
  { key: 'localizacao', label: 'Localização', emoji: '🏠' },
  { key: 'rotina', label: 'Rotina', emoji: '⏰' },
  { key: 'conexoes', label: 'Conexões', emoji: '👥' },
  { key: 'emocional', label: 'Emocional', emoji: '💭' },
]

function corDoBarra(valor: number, max: number): string {
  const pct = max > 0 ? valor / max : 0
  if (pct < 0.3) return 'var(--vespa-firewall)'
  if (pct < 0.6) return '#e6b800'
  return 'var(--vespa-cobre)'
}

interface BarraExposicaoProps {
  score: ScoreExposicao
  maxPorCategoria?: number
  label?: string
}

export function BarraExposicao({ score, maxPorCategoria = 25, label }: BarraExposicaoProps) {
  return (
    <div className="flex flex-col gap-3">
      {label && (
        <p className="text-[10px] font-bold tracking-[0.2em]" style={{ color: 'var(--color-text-secondary)' }}>
          {label}
        </p>
      )}

      {/* Barra total */}
      <div className="flex items-center gap-3">
        <span className="w-12 text-right font-mono text-sm font-bold" style={{ color: 'var(--vespa-esmeralda)' }}>
          {score.total}%
        </span>
        <div
          className="relative h-3 flex-1 overflow-hidden rounded-full"
          style={{ background: 'var(--color-bg-elevated)' }}
        >
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, score.total)}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              background:
                score.total < 30
                  ? 'var(--vespa-firewall)'
                  : score.total < 60
                    ? '#e6b800'
                    : 'var(--vespa-cobre)',
              boxShadow: score.total >= 80 ? '0 0 8px rgba(173,85,10,0.6)' : 'none',
            }}
          />
        </div>
      </div>

      {/* Barras por categoria */}
      <div className="flex flex-col gap-1.5">
        {CATEGORIAS.map(({ key, label: catLabel, emoji }) => {
          const valor = score.categorias[key]
          return (
            <div key={key} className="flex items-center gap-2">
              <span className="text-xs" aria-hidden="true">
                {emoji}
              </span>
              <span
                className="w-20 text-xs"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {catLabel}
              </span>
              <div
                className="relative h-1.5 flex-1 overflow-hidden rounded-full"
                style={{ background: 'var(--color-bg-elevated)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (valor / maxPorCategoria) * 100)}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  style={{ background: corDoBarra(valor, maxPorCategoria) }}
                />
              </div>
              <span
                className="w-6 text-right font-mono text-xs"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {valor}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
