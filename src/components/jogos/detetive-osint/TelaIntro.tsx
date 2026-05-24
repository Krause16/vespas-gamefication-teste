'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const LINHAS_TERMINAL = [
  '> CONEXÃO ESTABELECIDA...',
  '> AUTENTICANDO AGENTE...',
  '> ACESSO CONCEDIDO',
  '',
  '> OPERAÇÃO: RASTRO DIGITAL',
  '> CLASSIFICAÇÃO: CONFIDENCIAL',
  '',
  '> BRIEFING:',
  '> Alvo: @luna_estudante — Estudante, 16 anos, Curitiba',
  '> Objetivo: localizar e mapear exposição digital',
  '> Ferramentas: OSINT públicas',
  '> Tempo estimado: 8-15 minutos',
  '',
  '> Lembre-se: tudo que você está prestes a',
  '> fazer... alguém poderia fazer com você.',
]

interface TelaIntroProps {
  onConcluir: () => void
}

export function TelaIntro({ onConcluir }: TelaIntroProps) {
  const [linhasVisiveis, setLinhasVisiveis] = useState<string[]>([])
  const [concluido, setConcluido] = useState(false)

  useEffect(() => {
    let i = 0
    const intervalo = setInterval(() => {
      if (i >= LINHAS_TERMINAL.length) {
        clearInterval(intervalo)
        setConcluido(true)
        return
      }
      const linhaAtual = LINHAS_TERMINAL[i]
      i++
      setLinhasVisiveis((prev) => [...prev, linhaAtual])
    }, 180)

    return () => clearInterval(intervalo)
  }, [])

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 py-10"
      style={{ background: '#111' }}
    >
      <div className="w-full max-w-lg">
        {/* Terminal header */}
        <div
          className="mb-0 flex items-center gap-2 rounded-t-xl px-4 py-2"
          style={{ background: '#1a1a1a', border: '1px solid #333', borderBottom: 'none' }}
        >
          <div className="h-3 w-3 rounded-full" style={{ background: '#ff5f56' }} />
          <div className="h-3 w-3 rounded-full" style={{ background: '#ffbd2e' }} />
          <div className="h-3 w-3 rounded-full" style={{ background: '#27c93f' }} />
          <span className="ml-2 text-xs" style={{ color: '#555' }}>
            terminal — operação_rastro_digital.sh
          </span>
        </div>

        {/* Terminal body */}
        <div
          className="min-h-64 rounded-b-xl p-5"
          style={{ background: '#1a1a1a', border: '1px solid #333' }}
        >
          <div className="flex flex-col gap-0.5 font-mono text-sm leading-relaxed">
            {linhasVisiveis.map((linha, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
                style={{
                  color: linha.startsWith('> ACESSO') ? '#39ff14' : linha === '' ? undefined : '#ccc',
                  minHeight: '1.25rem',
                }}
              >
                {linha}
              </motion.p>
            ))}
            {!concluido && (
              <span className="animate-pulse" style={{ color: '#39ff14' }}>
                ▌
              </span>
            )}
          </div>
        </div>

        {/* CTA */}
        {concluido && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6 flex justify-center"
          >
            <button
              onClick={onConcluir}
              className="rounded-xl px-8 py-3.5 font-bold tracking-[0.2em] transition-all hover:brightness-110"
              style={{
                background: 'var(--vespa-esmeralda)',
                color: '#111',
                boxShadow: '0 0 20px rgba(57,255,20,0.4)',
              }}
            >
              ACEITAR MISSÃO
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
