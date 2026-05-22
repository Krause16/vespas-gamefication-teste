'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { type ScoreExposicao } from '@/types/detetive-osint'
import { PISTAS } from '@/lib/jogos/detetive-osint/pistas'
import { BarraExposicao } from './BarraExposicao'

interface QuadroEvidenciasProps {
  pistas_descobertas: string[]
  score: ScoreExposicao
  onConfirmarLocalizacao: () => void
}

export function QuadroEvidencias({
  pistas_descobertas,
  score,
  onConfirmarLocalizacao,
}: QuadroEvidenciasProps) {
  const localizacaoConfirmada = score.total >= 80

  return (
    <div className="flex flex-col gap-5">
      {/* Score de exposição */}
      <div
        className="rounded-xl p-4"
        style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)' }}
      >
        <p
          className="mb-3 text-[10px] font-bold tracking-[0.2em]"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          EXPOSIÇÃO DE @LUNA_ESTUDANTE
        </p>
        <BarraExposicao score={score} />
      </div>

      {/* Localização confirmada */}
      <AnimatePresence>
        {localizacaoConfirmada && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl p-4"
            style={{
              background: 'rgba(173,85,10,0.12)',
              border: '1px solid var(--vespa-cobre)',
            }}
          >
            <p
              className="mb-1 text-xs font-bold tracking-wider"
              style={{ color: 'var(--vespa-cobre)' }}
            >
              ⚠ LOCALIZAÇÃO CONFIRMADA
            </p>
            <p className="mb-3 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Dados suficientes coletados. Luna está vulnerável.
            </p>
            <button
              onClick={onConfirmarLocalizacao}
              className="w-full rounded-lg py-2.5 text-sm font-bold tracking-wider transition-opacity hover:opacity-80"
              style={{ background: 'var(--vespa-cobre)', color: 'var(--vespa-nevoa)' }}
            >
              CONCLUIR INVESTIGAÇÃO →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pistas descobertas */}
      <div
        className="rounded-xl p-4"
        style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)' }}
      >
        <p
          className="mb-3 text-[10px] font-bold tracking-[0.2em]"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          EVIDÊNCIAS COLETADAS ({pistas_descobertas.length}/{PISTAS.length})
        </p>

        {pistas_descobertas.length === 0 ? (
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            Nenhuma evidência ainda. Investigue as fontes.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            <AnimatePresence>
              {pistas_descobertas.map((id) => {
                const pista = PISTAS.find((p) => p.id === id)
                if (!pista) return null
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle
                      size={13}
                      className="mt-0.5 flex-shrink-0"
                      style={{ color: 'var(--vespa-esmeralda)' }}
                    />
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--vespa-nevoa)' }}>
                      {pista.dado_revelado}
                    </p>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
