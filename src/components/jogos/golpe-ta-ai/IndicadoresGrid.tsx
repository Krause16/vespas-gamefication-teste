'use client'

import { motion } from 'framer-motion'
import { type IndicadorFraude } from '@/types/golpe-ta-ai'

const INDICADORES: { id: IndicadorFraude; label: string }[] = [
  { id: 'urgencia', label: 'Urgência artificial' },
  { id: 'remetente_estranho', label: 'Remetente estranho' },
  { id: 'link_suspeito', label: 'Link suspeito' },
  { id: 'erro_gramatical', label: 'Erro gramatical' },
  { id: 'pedido_dado_sensivel', label: 'Pede dado sensível' },
  { id: 'contexto_inesperado', label: 'Contexto inesperado' },
  { id: 'pressao_financeira', label: 'Pressão financeira' },
  { id: 'deepfake_audio', label: 'Possível deepfake' },
  { id: 'dominio_falso', label: 'Domínio falso' },
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
        className="mb-2 text-[10px] font-bold tracking-[0.15em]"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        MARQUE OS INDICADORES
      </p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Indicadores de fraude">
        {INDICADORES.map(({ id, label }) => {
          const selecionado = selecionados.includes(id)
          return (
            <motion.button
              key={id}
              whileTap={{ scale: 0.92 }}
              onClick={() => onToggle(id)}
              aria-pressed={selecionado}
              className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-150"
              style={{
                border: `1.5px solid ${selecionado ? 'var(--vespa-esmeralda)' : 'var(--color-border-subtle)'}`,
                background: selecionado ? 'rgba(57,255,20,0.1)' : 'transparent',
                color: selecionado ? 'var(--vespa-esmeralda)' : 'var(--vespa-nevoa)',
              }}
            >
              {label}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
