'use client'

import { motion, AnimatePresence } from 'motion/react'
import { Check } from 'lucide-react'
import { type IndicadorFraude } from '@/types/golpe-ta-ai'

const INDICADORES: { id: IndicadorFraude; label: string }[] = [
  { id: 'urgencia',            label: 'Urgência artificial' },
  { id: 'remetente_estranho',  label: 'Remetente estranho' },
  { id: 'link_suspeito',       label: 'Link suspeito' },
  { id: 'erro_gramatical',     label: 'Erro gramatical' },
  { id: 'pedido_dado_sensivel',label: 'Pede dado sensível' },
  { id: 'contexto_inesperado', label: 'Contexto inesperado' },
  { id: 'pressao_financeira',  label: 'Pressão financeira' },
  { id: 'deepfake_audio',      label: 'Possível deepfake' },
  { id: 'dominio_falso',       label: 'Domínio falso' },
  { id: 'numero_desconhecido', label: 'Número desconhecido' },
]

interface IndicadoresGridProps {
  selecionados: IndicadorFraude[]
  onToggle: (indicador: IndicadorFraude) => void
}

export function IndicadoresGrid({ selecionados, onToggle }: IndicadoresGridProps) {
  return (
    <div>
      <p
        className="mb-3 font-mono text-[9px] uppercase tracking-[0.25em]"
        style={{ color: 'rgba(217,226,236,0.35)' }}
      >
        Marque os indicadores de fraude
      </p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Indicadores de fraude">
        {INDICADORES.map(({ id, label }) => {
          const sel = selecionados.includes(id)
          return (
            <motion.button
              key={id}
              whileTap={{ scale: 0.92 }}
              onClick={() => onToggle(id)}
              aria-pressed={sel}
              className="relative flex items-center gap-1.5 overflow-hidden rounded-lg px-3 py-1.5 text-xs font-medium"
              style={{
                border: `1px solid ${sel ? '#39ff14' : 'rgba(217,226,236,0.12)'}`,
                background: sel ? 'rgba(57,255,20,0.08)' : 'rgba(13,13,13,0.6)',
                color: sel ? '#39ff14' : 'rgba(217,226,236,0.5)',
                boxShadow: sel ? '0 0 12px rgba(57,255,20,0.15)' : 'none',
                transition: 'border-color 0.15s, color 0.15s, background 0.15s, box-shadow 0.15s',
              }}
            >
              <AnimatePresence>
                {sel && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="flex shrink-0 items-center"
                    aria-hidden="true"
                  >
                    <Check size={10} />
                  </motion.span>
                )}
              </AnimatePresence>
              {label}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
