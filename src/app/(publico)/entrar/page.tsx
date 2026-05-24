'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { HexagonBackground } from '@/components/vespas/HexagonBackground'
import { useCodigoEntrada } from '@/hooks/useCodigoEntrada'

const BOOT_LINES = ['> AUTENTICAÇÃO OPERACIONAL...', '> AGUARDANDO CREDENCIAIS_']

function BootSequence({ onDone }: { onDone: () => void }) {
  const [charIdx, setCharIdx] = useState(0)
  const [lineIdx, setLineIdx] = useState(0)

  useEffect(() => {
    if (lineIdx >= BOOT_LINES.length) {
      const t = setTimeout(onDone, 400)
      return () => clearTimeout(t)
    }
    const line = BOOT_LINES[lineIdx]
    if (charIdx < line.length) {
      const t = setTimeout(() => setCharIdx((c) => c + 1), 28)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => { setLineIdx((i) => i + 1); setCharIdx(0) }, 320)
    return () => clearTimeout(t)
  }, [lineIdx, charIdx, onDone])

  const partial = BOOT_LINES[lineIdx]?.slice(0, charIdx) ?? ''
  const linhas = BOOT_LINES.slice(0, lineIdx).concat(partial ? [partial] : [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-2 font-mono text-sm"
      style={{ color: 'rgba(217,226,236,0.7)' }}
    >
      {linhas.map((l, i) => (
        <p key={i}>{l}</p>
      ))}
      <span className="animate-pulse" style={{ color: '#39ff14' }}>▌</span>
    </motion.div>
  )
}

const SHAKE = {
  idle: { x: 0 },
  shake: { x: [0, -10, 10, -10, 10, -5, 5, 0], transition: { duration: 0.4 } },
}

export default function EntrarPage() {
  const { digitos, erro, carregando, completo, inputRefs, handleDigito, handleKeyDown, handlePaste, handleEntrar } =
    useCodigoEntrada()
  const [bootDone, setBootDone] = useState(false)

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center px-6"
      style={{ background: '#0a0a0a' }}
    >
      <HexagonBackground opacity={0.4} />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center">
        <AnimatePresence mode="wait">
          {!bootDone ? (
            <motion.div key="boot" className="w-full" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <BootSequence onDone={() => setBootDone(true)} />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              className="w-full"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
            >
              {/* Frame */}
              <div
                className="rounded-2xl p-7"
                style={{
                  background: 'rgba(13,13,13,0.95)',
                  border: '1px solid rgba(57,255,20,0.2)',
                  backdropFilter: 'blur(40px)',
                  WebkitBackdropFilter: 'blur(40px)',
                  boxShadow: '0 0 0 1px rgba(57,255,20,0.06), 0 40px 80px rgba(0,0,0,0.8), 0 0 60px rgba(57,255,20,0.04)',
                }}
              >
                {/* Eyebrow */}
                <p
                  className="mb-5 text-center font-mono text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: 'rgba(57,255,20,0.6)' }}
                >
                  [ AUTENTICAÇÃO OPERACIONAL ]
                </p>

                {/* Logo */}
                <p
                  className="mb-1 text-center font-display text-3xl tracking-[0.15em]"
                  style={{ color: '#d9e2ec' }}
                >
                  VESPAS
                </p>
                <p
                  className="mb-6 text-center text-xs"
                  style={{ color: 'rgba(217,226,236,0.4)' }}
                >
                  Insira o código da sala
                </p>

                {/* Inputs */}
                <motion.div
                  variants={SHAKE}
                  animate={erro ? 'shake' : 'idle'}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="flex gap-2" role="group" aria-label="Código da sala — 6 dígitos">
                    {digitos.map((digito, i) => (
                      <input
                        key={i}
                        ref={(el) => { inputRefs.current[i] = el }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digito}
                        onChange={(e) => handleDigito(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onPaste={handlePaste}
                        aria-label={`Dígito ${i + 1} de 6`}
                        className="h-14 w-10 rounded-lg text-center font-mono text-xl font-bold transition-all duration-150 focus:outline-none"
                        style={{
                          background: '#0d0d0d',
                          border: `1.5px solid ${digito ? 'rgba(57,255,20,0.4)' : 'rgba(217,226,236,0.1)'}`,
                          color: '#d9e2ec',
                          boxShadow: digito ? '0 0 0 3px rgba(57,255,20,0.08)' : undefined,
                        }}
                      />
                    ))}
                  </div>

                  {erro && (
                    <p className="text-center text-xs" style={{ color: '#ad550a' }} role="alert" aria-live="assertive">
                      {erro}
                    </p>
                  )}
                </motion.div>

                {/* Submit */}
                <AnimatePresence mode="wait">
                  {completo && (
                    <motion.button
                      key="btn-entrar"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      onClick={handleEntrar}
                      disabled={carregando}
                      className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[10px] font-bold uppercase tracking-[0.25em] transition-all disabled:cursor-not-allowed disabled:opacity-30"
                      style={{
                        background: '#39ff14',
                        color: '#0a0a0a',
                        fontSize: 13,
                        boxShadow: carregando ? 'none' : '0 0 30px rgba(57,255,20,0.35)',
                      }}
                      aria-busy={carregando}
                    >
                      {carregando ? (
                        <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                      ) : (
                        'ENTRAR'
                      )}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/solo"
                className="mt-5 block text-center text-sm transition-colors hover:underline"
                style={{ color: 'rgba(217,226,236,0.35)' }}
              >
                Jogar sozinho →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
