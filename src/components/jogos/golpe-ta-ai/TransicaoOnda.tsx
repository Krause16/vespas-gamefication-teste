'use client'

import { useEffect } from 'react'
import { motion } from 'motion/react'
import { HexGrid } from '@/components/vespas/HexGrid'
import { type OndaMensagem } from '@/types/golpe-ta-ai'

const NOMES_ONDAS: Record<OndaMensagem, string> = {
  1: 'ÓBVIOS',
  2: 'GOLPES BRASILEIROS',
  3: 'DIRECIONADOS',
  4: 'ATAQUES PÓS-IA',
}

const NUMS = ['01', '02', '03', '04']

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
      className="relative flex min-h-screen flex-col items-center justify-center gap-10 overflow-hidden"
      style={{ background: '#000000' }}
    >
      <HexGrid density="low" interactive={false} />

      {/* Azonix watermark */}
      <span
        className="pointer-events-none absolute select-none font-display leading-none"
        style={{
          fontSize: 200,
          color: 'rgba(57,255,20,0.03)',
          letterSpacing: '-0.04em',
          userSelect: 'none',
        }}
        aria-hidden="true"
      >
        {NUMS[(proximaOnda - 1) % NUMS.length]}
      </span>

      {/* Pulsing hexagons */}
      <div className="relative z-10 flex gap-5" aria-hidden="true">
        {([0, 1, 2] as const).map((i) => (
          <motion.div
            key={i}
            animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 1.4, delay: i * 0.25, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 32,
              height: 32,
              clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
              background: '#39ff14',
              boxShadow: '0 0 16px rgba(57,255,20,0.6)',
            }}
          />
        ))}
      </div>

      {/* Text */}
      <div className="relative z-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-1 font-mono text-[10px] uppercase tracking-[0.35em]"
          style={{ color: 'rgba(217,226,236,0.35)' }}
        >
          PRÓXIMA FASE
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.28 }}
          className="font-display text-3xl"
          style={{ color: '#39ff14', letterSpacing: '-0.02em', textShadow: '0 0 24px rgba(57,255,20,0.5)' }}
        >
          ONDA {proximaOnda}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-1 font-mono text-sm tracking-[0.2em]"
          style={{ color: 'rgba(217,226,236,0.6)' }}
        >
          {NOMES_ONDAS[proximaOnda]}
        </motion.p>
      </div>

      {/* Progress bar */}
      <div
        className="relative z-10 h-px w-48 overflow-hidden"
        style={{ background: 'rgba(57,255,20,0.1)' }}
        aria-hidden="true"
      >
        <motion.div
          className="h-full"
          style={{ background: '#39ff14' }}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.5, ease: 'linear' }}
        />
      </div>
    </div>
  )
}
