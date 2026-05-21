'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { type OndaMensagem } from '@/types/golpe-ta-ai'

const NOMES_ONDAS: Record<OndaMensagem, string> = {
  1: 'ÓBVIOS',
  2: 'GOLPES BRASILEIROS',
  3: 'DIRECIONADOS',
  4: 'ATAQUES PÓS-IA',
}

interface TransicaoOndaProps {
  proximaOnda: OndaMensagem
  onContinuar: () => void
}

export function TransicaoOnda({ proximaOnda, onContinuar }: TransicaoOndaProps) {
  useEffect(() => {
    const timer = setTimeout(onContinuar, 2500)
    return () => clearTimeout(timer)
  }, [onContinuar])

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-8"
      style={{ background: 'var(--vespa-grafite)' }}
    >
      {/* Hexágonos pulsando */}
      <div className="flex gap-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
            className="h-8 w-8"
            style={{
              background: 'var(--vespa-esmeralda)',
              clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
            }}
            aria-hidden="true"
          />
        ))}
      </div>

      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-xs font-bold tracking-[0.25em]"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          PRÓXIMA FASE
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="text-2xl font-bold tracking-[0.12em]"
          style={{ color: 'var(--vespa-esmeralda)', fontFamily: 'var(--font-body)' }}
        >
          ONDA {proximaOnda}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="text-base font-semibold tracking-widest"
          style={{ color: 'var(--vespa-nevoa)' }}
        >
          {NOMES_ONDAS[proximaOnda]}
        </motion.p>
      </div>
    </div>
  )
}
