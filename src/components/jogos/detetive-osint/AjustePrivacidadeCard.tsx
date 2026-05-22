'use client'

import { motion } from 'framer-motion'
import { Shield, ShieldCheck } from 'lucide-react'
import { type AjustePrivacidade } from '@/types/detetive-osint'

interface AjustePrivacidadeCardProps {
  ajuste: AjustePrivacidade
  aplicado: boolean
  onToggle: () => void
}

export function AjustePrivacidadeCard({ ajuste, aplicado, onToggle }: AjustePrivacidadeCardProps) {
  return (
    <motion.button
      layout
      onClick={onToggle}
      whileTap={{ scale: 0.98 }}
      className="w-full rounded-xl p-4 text-left transition-all duration-200"
      style={{
        background: aplicado ? 'rgba(57,255,20,0.06)' : 'var(--color-bg-elevated)',
        border: `1px solid ${aplicado ? 'rgba(57,255,20,0.35)' : 'var(--color-border-strong)'}`,
      }}
      aria-pressed={aplicado}
    >
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
          style={{
            background: aplicado ? 'rgba(57,255,20,0.15)' : 'var(--color-bg-card)',
          }}
        >
          {aplicado ? (
            <ShieldCheck size={15} style={{ color: 'var(--vespa-esmeralda)' }} />
          ) : (
            <Shield size={15} style={{ color: 'var(--color-text-secondary)' }} />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <p
              className="text-sm font-medium"
              style={{ color: aplicado ? 'var(--vespa-esmeralda)' : 'var(--vespa-nevoa)' }}
            >
              {ajuste.descricao}
            </p>
            <span
              className="flex-shrink-0 font-mono text-xs font-bold"
              style={{ color: aplicado ? 'var(--vespa-esmeralda)' : 'var(--vespa-cobre)' }}
            >
              -{ajuste.reducao_score}%
            </span>
          </div>

          {aplicado && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-1.5 text-xs leading-relaxed"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {ajuste.acao_real}
            </motion.p>
          )}
        </div>
      </div>
    </motion.button>
  )
}
