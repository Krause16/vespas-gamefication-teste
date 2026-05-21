'use client'

import { motion } from 'framer-motion'
import { Lock, Search, Shield, Terminal } from 'lucide-react'
import type { ConfigJogo } from '@/types/jogo'
import { Hexagono } from '@/components/vespas/Hexagono'

interface HexagonoJogoProps {
  jogo: ConfigJogo
  index: number
  onClick: (jogo: ConfigJogo) => void
}

const ICONES = { Shield, Search, Terminal } as const
type IconeKey = keyof typeof ICONES

const NIVEL_COR: Record<number, string> = {
  1: 'var(--vespa-circuito)',
  2: 'var(--vespa-azul-link)',
  3: 'var(--vespa-cobre)',
}

export function HexagonoJogo({ jogo, index, onClick }: HexagonoJogoProps) {
  const Icone = (ICONES[jogo.icon as IconeKey] ?? Shield)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: jogo.disponivel ? 1 : 0.5, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={
        jogo.disponivel
          ? {
              scale: 1.05,
              filter: 'drop-shadow(0 0 18px rgba(57,255,20,0.45))',
            }
          : {}
      }
      whileTap={jogo.disponivel ? { scale: 0.97 } : {}}
      role="button"
      tabIndex={0}
      aria-label={`${jogo.nome}, nível ${jogo.nivel}${!jogo.disponivel ? ', bloqueado' : ''}`}
      aria-disabled={!jogo.disponivel}
      onClick={() => onClick(jogo)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick(jogo)
      }}
      style={{ cursor: jogo.disponivel ? 'pointer' : 'not-allowed' }}
      className="select-none"
    >
      <Hexagono size={176} fill={jogo.cor}>
        <div className="flex flex-col items-center justify-center gap-1.5">
          {jogo.disponivel ? (
            <Icone
              size={26}
              aria-hidden="true"
              style={{ color: 'var(--vespa-nevoa)' }}
            />
          ) : (
            <Lock
              size={22}
              aria-hidden="true"
              style={{ color: 'var(--vespa-nevoa)', opacity: 0.7 }}
            />
          )}

          <span
            className="text-center font-bold leading-tight"
            style={{
              color: 'var(--vespa-nevoa)',
              fontSize: '0.6rem',
              letterSpacing: '0.06em',
              maxWidth: '72px',
            }}
          >
            {jogo.nome}
          </span>

          <span
            className="rounded-full px-2 py-0.5 font-bold"
            style={{
              background: NIVEL_COR[jogo.nivel],
              color: 'var(--vespa-nevoa)',
              fontSize: '0.5rem',
              letterSpacing: '0.1em',
            }}
          >
            NV {jogo.nivel}
          </span>
        </div>
      </Hexagono>
    </motion.div>
  )
}
