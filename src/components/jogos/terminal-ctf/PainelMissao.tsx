'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { FLAGS } from '@/lib/jogos/terminal-ctf/flags'
import { type Dica } from '@/types/terminal-ctf'
import { FlagItem } from './FlagItem'
import { SistemaDicas } from './SistemaDicas'

interface PainelMissaoProps {
  flags_encontradas: string[]
  dicas_usadas: Array<{ flag_numero: number; nivel: number }>
  pontuacao: number
  onUsarDica: (flag_numero: number) => { dica: Dica | null; semSaldo: boolean }
  mobileAberto: boolean
  onFecharMobile: () => void
}

const PAINEL_BG = 'rgba(17,17,17,0.97)'
const PAINEL_BORDER = 'rgba(57,255,20,0.08)'

export function PainelMissao({
  flags_encontradas,
  dicas_usadas,
  pontuacao,
  onUsarDica,
  mobileAberto,
  onFecharMobile,
}: PainelMissaoProps) {
  const [dicasAbertas, setDicasAbertas] = useState(false)

  const conteudo = (
    <div className="flex h-full flex-col p-5">
      {/* Header row */}
      <div className="mb-5 flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold tracking-[0.3em]" style={{ color: '#444' }}>
          MISSÃO ATIVA
        </span>
        <button className="lg:hidden" onClick={onFecharMobile} aria-label="Fechar painel">
          <X size={14} style={{ color: '#555' }} />
        </button>
      </div>

      {/* Score */}
      <div className="mb-5 text-center">
        <p
          className="font-mono font-bold"
          style={{
            fontSize: 48,
            lineHeight: 1,
            color: '#39ff14',
            textShadow: '0 0 20px rgba(57,255,20,0.35)',
          }}
        >
          {pontuacao}
        </p>
        <p className="mt-2 font-mono text-[10px] tracking-[0.3em]" style={{ color: '#444' }}>
          PONTOS
        </p>
      </div>

      {/* Divider */}
      <div className="mb-4" style={{ height: 1, background: PAINEL_BORDER }} />

      {/* Flags */}
      <div className="mb-2">
        <p className="mb-3 font-mono text-[10px] tracking-[0.2em]" style={{ color: '#444' }}>
          FLAGS {flags_encontradas.length}/7
        </p>
        <div>
          {FLAGS.map((flag) => (
            <FlagItem
              key={flag.numero}
              flag={flag}
              encontrada={flags_encontradas.includes(flag.texto)}
            />
          ))}
        </div>
      </div>

      <div className="flex-1" />

      {/* Dica button */}
      <button
        onClick={() => setDicasAbertas(true)}
        className="mt-5 w-full rounded-xl py-3 font-mono text-xs font-bold tracking-[0.15em] transition-all hover:brightness-125"
        style={{
          background: 'transparent',
          border: '1px solid rgba(13,112,206,0.35)',
          color: '#0d70ce',
        }}
      >
        SOLICITAR DICA −5pts
      </button>

      <AnimatePresence>
        {dicasAbertas && (
          <SistemaDicas
            dicas_usadas={dicas_usadas}
            pontuacao={pontuacao}
            onUsarDica={onUsarDica}
            onFechar={() => setDicasAbertas(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <>
      {/* Desktop: fixed sidebar */}
      <aside
        className="hidden h-full overflow-y-auto lg:flex lg:flex-col"
        style={{
          width: 320,
          background: PAINEL_BG,
          backdropFilter: 'blur(20px)',
          borderLeft: `1px solid ${PAINEL_BORDER}`,
        }}
      >
        {conteudo}
      </aside>

      {/* Mobile: bottom sheet */}
      <AnimatePresence>
        {mobileAberto && (
          <>
            <motion.div
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: 'rgba(0,0,0,0.7)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onFecharMobile}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[75vh] overflow-y-auto rounded-t-2xl lg:hidden"
              style={{ background: 'rgba(17,17,17,0.99)', borderTop: `1px solid ${PAINEL_BORDER}` }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.28 }}
            >
              {conteudo}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
