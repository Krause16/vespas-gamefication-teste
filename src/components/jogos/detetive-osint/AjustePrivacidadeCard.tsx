'use client'

import { motion, AnimatePresence } from 'motion/react'
import { Shield, ShieldCheck, ChevronDown } from 'lucide-react'
import { GlassPanel, LiquidButton } from '@/components/vespas/DesignSystem'
import { type AjustePrivacidade } from '@/types/detetive-osint'

interface AjustePrivacidadeCardProps {
  ajuste: AjustePrivacidade
  aplicado: boolean
  onToggle: () => void
}

export function AjustePrivacidadeCard({ ajuste, aplicado, onToggle }: AjustePrivacidadeCardProps) {
  return (
    <motion.div
      layout
      animate={aplicado ? {
        boxShadow: ['0 0 0px rgba(57,255,20,0)', '0 0 16px rgba(57,255,20,0.18)', '0 0 8px rgba(57,255,20,0.10)'],
      } : { boxShadow: '0 0 0px rgba(57,255,20,0)' }}
      transition={{ duration: 0.5 }}
    >
      <GlassPanel
        style={{
          border: aplicado ? '1px solid rgba(57,255,20,0.3)' : '1px solid rgba(217,226,236,0.07)',
          background: aplicado ? 'rgba(57,255,20,0.06)' : 'rgba(13,13,13,0.7)',
        }}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div
              className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
              style={{
                background: aplicado ? 'rgba(57,255,20,0.12)' : 'rgba(217,226,236,0.05)',
                border: `1px solid ${aplicado ? 'rgba(57,255,20,0.3)' : 'rgba(217,226,236,0.1)'}`,
              }}
              aria-hidden="true"
            >
              {aplicado
                ? <ShieldCheck size={15} style={{ color: '#39ff14' }} />
                : <Shield size={15} style={{ color: 'rgba(217,226,236,0.35)' }} />
              }
            </div>

            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between gap-2">
                <p
                  className="text-sm font-medium leading-snug"
                  style={{ color: aplicado ? '#d9e2ec' : 'rgba(217,226,236,0.55)' }}
                >
                  {ajuste.descricao}
                </p>
                <span
                  className="shrink-0 font-mono text-xs font-bold"
                  style={{ color: aplicado ? '#39ff14' : '#ad550a' }}
                >
                  -{ajuste.reducao_score}%
                </span>
              </div>

              <AnimatePresence>
                {aplicado && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-start gap-1.5 pt-2">
                      <ChevronDown size={11} style={{ color: 'rgba(57,255,20,0.6)', marginTop: 2, flexShrink: 0 }} aria-hidden="true" />
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(217,226,236,0.5)' }}>
                        {ajuste.acao_real}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <LiquidButton
              variant={aplicado ? 'ghost' : 'outline'}
              size="sm"
              onClick={onToggle}
              aria-pressed={aplicado}
            >
              {aplicado ? 'Remover' : 'Aplicar'}
            </LiquidButton>
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  )
}
