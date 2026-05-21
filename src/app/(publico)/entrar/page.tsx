'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Logo } from '@/components/vespas/Logo'
import { VespaBackground } from '@/components/vespas/VespaBackground'
import { useCodigoEntrada } from '@/hooks/useCodigoEntrada'

const SHAKE = {
  idle: { x: 0 },
  shake: {
    x: [0, -10, 10, -10, 10, -5, 5, 0],
    transition: { duration: 0.4 },
  },
}

export default function EntrarPage() {
  const {
    digitos,
    erro,
    carregando,
    completo,
    inputRefs,
    handleDigito,
    handleKeyDown,
    handlePaste,
    handleEntrar,
  } = useCodigoEntrada()

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6">
      <VespaBackground />

      <div className="relative z-10 flex w-full max-w-xs flex-col items-center gap-8">
        <Logo size="lg" variant="text-only" />

        <p
          className="text-center text-xs font-bold tracking-[0.2em]"
          style={{ color: 'var(--vespa-nevoa)' }}
        >
          INSIRA O CÓDIGO DA SALA
        </p>

        <motion.div
          variants={SHAKE}
          animate={erro ? 'shake' : 'idle'}
          className="flex flex-col items-center gap-3"
        >
          <div
            className="flex gap-2.5"
            role="group"
            aria-label="Código da sala — 6 dígitos"
          >
            {digitos.map((digito, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digito}
                onChange={(e) => handleDigito(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                aria-label={`Dígito ${i + 1} de 6`}
                className="h-14 w-10 rounded text-center font-mono text-xl font-bold transition-all duration-150 focus:outline-none"
                style={{
                  background: 'var(--color-bg-card)',
                  border: `1.5px solid ${
                    digito
                      ? 'var(--vespa-azul-link)'
                      : 'var(--color-border-strong)'
                  }`,
                  color: 'var(--vespa-nevoa)',
                  boxShadow: digito
                    ? '0 0 8px rgba(13,112,206,0.3)'
                    : undefined,
                }}
              />
            ))}
          </div>

          {erro && (
            <p
              className="text-center text-xs"
              style={{ color: 'var(--vespa-cobre)' }}
              role="alert"
              aria-live="assertive"
            >
              {erro}
            </p>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {completo && (
            <motion.button
              key="btn-entrar"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={handleEntrar}
              disabled={carregando}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm font-bold tracking-[0.15em] transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                background: 'var(--vespa-azul-link)',
                color: 'var(--vespa-nevoa)',
              }}
              aria-busy={carregando}
              aria-label="Entrar na sala"
            >
              {carregando ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                  verificando...
                </>
              ) : (
                'ENTRAR'
              )}
            </motion.button>
          )}
        </AnimatePresence>

        <Link
          href="/solo"
          className="text-sm transition-colors duration-150 hover:underline"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Jogar sozinho →
        </Link>
      </div>
    </main>
  )
}
