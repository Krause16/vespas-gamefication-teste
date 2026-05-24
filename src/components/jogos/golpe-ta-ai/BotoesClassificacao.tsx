'use client'

import { useRef, useCallback } from 'react'
import { motion, useMotionValue, useMotionTemplate } from 'motion/react'
import { CheckCircle2, AlertTriangle, ShieldOff } from 'lucide-react'
import { type ClassificacaoMensagem } from '@/types/golpe-ta-ai'

interface Opcao {
  valor: ClassificacaoMensagem
  label: string
  icon: React.ReactNode
  cor: string
  glow: string
}

const OPCOES: Opcao[] = [
  {
    valor: 'confio',
    label: 'CONFIO',
    icon: <CheckCircle2 size={16} />,
    cor: '#27746e',
    glow: 'rgba(39,116,110,0.35)',
  },
  {
    valor: 'suspeito',
    label: 'SUSPEITO',
    icon: <AlertTriangle size={16} />,
    cor: '#7a6000',
    glow: 'rgba(200,160,0,0.3)',
  },
  {
    valor: 'bloqueio',
    label: 'BLOQUEIO',
    icon: <ShieldOff size={16} />,
    cor: '#ad550a',
    glow: 'rgba(173,85,10,0.35)',
  },
]

interface BotoesClassificacaoProps {
  onClassificar: (classificacao: ClassificacaoMensagem) => void
  desabilitado?: boolean
}

function GlowButton({ opcao, onClassificar, desabilitado }: {
  opcao: Opcao
  onClassificar: (v: ClassificacaoMensagem) => void
  desabilitado: boolean
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const glow = useMotionTemplate`radial-gradient(circle 60px at ${mx}px ${my}px, ${opcao.glow}, transparent 70%)`

  const onMove = useCallback((e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set(e.clientX - r.left)
    my.set(e.clientY - r.top)
  }, [mx, my])

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -2 }}
      onClick={() => onClassificar(opcao.valor)}
      disabled={desabilitado}
      aria-label={opcao.label}
      className="relative flex flex-1 flex-col items-center gap-1.5 overflow-hidden rounded-xl py-3 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-white disabled:cursor-not-allowed disabled:opacity-40"
      style={{
        background: `${opcao.cor}22`,
        border: `1px solid ${opcao.cor}66`,
      }}
    >
      <motion.span
        className="pointer-events-none absolute inset-0"
        style={{ background: glow }}
        aria-hidden="true"
      />
      <span className="relative" style={{ color: opcao.cor === '#27746e' ? '#3fada7' : opcao.cor === '#ad550a' ? '#d97a35' : '#d4aa00' }} aria-hidden="true">
        {opcao.icon}
      </span>
      <span className="relative" style={{ color: 'rgba(217,226,236,0.8)' }}>
        {opcao.label}
      </span>
    </motion.button>
  )
}

export function BotoesClassificacao({ onClassificar, desabilitado = false }: BotoesClassificacaoProps) {
  return (
    <div className="flex gap-2.5" role="group" aria-label="Classificar mensagem">
      {OPCOES.map((opcao) => (
        <GlowButton
          key={opcao.valor}
          opcao={opcao}
          onClassificar={onClassificar}
          desabilitado={desabilitado}
        />
      ))}
    </div>
  )
}
