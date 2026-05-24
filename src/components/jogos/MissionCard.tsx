'use client'

import { motion } from 'motion/react'
import { Lock, CheckCircle, ChevronRight } from 'lucide-react'
import type { ConfigJogo } from '@/types/jogo'

const NIVEL_CONFIG: Record<number, { cor: string; glow: string }> = {
  1: { cor: '#27746e', glow: 'rgba(39,116,110,0.15)' },
  2: { cor: '#0d70ce', glow: 'rgba(13,112,206,0.15)' },
  3: { cor: '#39ff14', glow: 'rgba(57,255,20,0.15)' },
}

const DESCRICOES: Record<string, string> = {
  'golpe-ta-ai':    'Identifique golpes de phishing antes que te peguem',
  'detetive-osint': 'Rastreie rastros digitais e proteja sua privacidade',
  'terminal-ctf':   'Infiltre sistemas e capture as flags do inimigo',
}

const NUMS = ['01', '02', '03']

interface MissionCardProps {
  jogo: ConfigJogo
  index: number
  onClick: (slug: string) => void
}

function StatusDot({ disponivel, concluido }: { disponivel: boolean; concluido?: boolean }) {
  if (concluido) return (
    <div className="flex items-center gap-2">
      <CheckCircle size={10} style={{ color: '#0d70ce' }} aria-hidden="true" />
      <span className="font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: '#0d70ce' }}>MISSÃO CONCLUÍDA</span>
    </div>
  )
  if (!disponivel) return (
    <div className="flex items-center gap-2">
      <span className="inline-block h-2 w-2 rounded-full" style={{ background: 'rgba(217,226,236,0.2)' }} aria-hidden="true" />
      <span className="font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: 'rgba(217,226,236,0.3)' }}>AGUARDANDO LIBERAÇÃO</span>
    </div>
  )
  return (
    <div className="flex items-center gap-2">
      <motion.span
        className="inline-block h-2 w-2 rounded-full"
        style={{ background: '#39ff14', boxShadow: '0 0 6px rgba(57,255,20,0.7)' }}
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-hidden="true"
      />
      <span className="font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: '#39ff14' }}>OPERAÇÃO DISPONÍVEL</span>
    </div>
  )
}

export function MissionCard({ jogo, index, onClick }: MissionCardProps) {
  const cfg = NIVEL_CONFIG[jogo.nivel] ?? NIVEL_CONFIG[1]

  return (
    <motion.button
      onClick={() => jogo.disponivel && onClick(jogo.slug)}
      disabled={!jogo.disponivel}
      aria-label={jogo.nome}
      className="relative w-full overflow-hidden rounded-2xl text-left disabled:cursor-not-allowed"
      style={{
        background: 'rgba(13,13,13,0.9)',
        border: `1px solid ${jogo.disponivel ? 'rgba(57,255,20,0.1)' : 'rgba(217,226,236,0.05)'}`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)', opacity: 0 }}
      animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', opacity: 1 }}
      transition={{ duration: 0.55, delay: index * 0.15, ease: [0, 0, 0.2, 1] }}
      whileHover={jogo.disponivel ? {
        borderColor: 'rgba(57,255,20,0.22)',
        boxShadow: `0 0 0 1px rgba(57,255,20,0.08), 0 16px 40px rgba(0,0,0,0.5), 0 0 40px ${cfg.glow}`,
        y: -3,
      } : {}}
    >
      {/* Animated circuit top line */}
      <svg className="absolute inset-x-0 top-0 w-full" height="2" aria-hidden="true">
        <motion.line
          x1="0" y1="1" x2="100%" y2="1"
          stroke={cfg.cor}
          strokeWidth="1"
          strokeDasharray="4 8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: jogo.disponivel ? 0.4 : 0.1 }}
          transition={{ duration: 0.9, delay: index * 0.15 + 0.3 }}
        />
      </svg>

      {/* Watermark */}
      <span
        className="pointer-events-none absolute right-4 top-3 select-none font-display leading-none"
        style={{ fontSize: 80, color: 'rgba(217,226,236,0.03)' }}
        aria-hidden="true"
      >
        {NUMS[index] ?? '01'}
      </span>

      <div className="relative p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center"
              style={{
                clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                background: cfg.glow,
                border: `1px solid ${cfg.cor}40`,
              }}
              aria-hidden="true"
            >
              {!jogo.disponivel
                ? <Lock size={12} style={{ color: 'rgba(217,226,236,0.3)' }} />
                : <span className="font-display text-[10px]" style={{ color: cfg.cor }}>{NUMS[index]}</span>
              }
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em]" style={{ color: 'rgba(217,226,236,0.3)' }}>
              NÍVEL {jogo.nivel}
            </span>
          </div>
          {jogo.disponivel && (
            <ChevronRight size={14} style={{ color: 'rgba(217,226,236,0.2)' }} aria-hidden="true" />
          )}
        </div>

        <h3
          className="mb-1.5 font-bold"
          style={{ fontSize: 17, color: jogo.disponivel ? '#d9e2ec' : 'rgba(217,226,236,0.3)', letterSpacing: '-0.01em' }}
        >
          {jogo.nome}
        </h3>
        <p className="mb-5 text-xs leading-relaxed" style={{ color: 'rgba(217,226,236,0.38)' }}>
          {DESCRICOES[jogo.slug] ?? ''}
        </p>

        <StatusDot disponivel={jogo.disponivel} concluido={jogo.concluido} />
      </div>
    </motion.button>
  )
}
