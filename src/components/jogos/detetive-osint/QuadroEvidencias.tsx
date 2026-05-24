'use client'

import { AnimatePresence, motion } from 'framer-motion'
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
  const pode_confirmar = score.total >= 80

  return (
    <div className="flex flex-col gap-5 overflow-y-auto px-4 py-5">
      {/* Gauge */}
      <div>
        <p
          className="mb-3 font-mono text-[9px] uppercase tracking-[0.25em]"
          style={{ color: 'rgba(217,226,236,0.35)' }}
        >
          NÍVEL DE AMEAÇA
        </p>
        <BarraExposicao score={score} />
      </div>

      <div className="h-px" style={{ background: 'rgba(217,226,236,0.06)' }} />

      {/* Evidence list */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p
            className="font-mono text-[9px] uppercase tracking-[0.25em]"
            style={{ color: 'rgba(217,226,236,0.35)' }}
          >
            EVIDÊNCIAS
          </p>
          <span
            className="font-mono text-[10px]"
            style={{ color: pistas_descobertas.length > 0 ? '#39ff14' : 'rgba(217,226,236,0.2)' }}
          >
            {pistas_descobertas.length}/{PISTAS.length}
          </span>
        </div>

        {pistas_descobertas.length === 0 ? (
          <p className="font-mono text-[10px]" style={{ color: 'rgba(217,226,236,0.2)' }}>
            Nenhuma evidência. Investigue as fontes.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {pistas_descobertas.map((id) => {
                const pista = PISTAS.find((p) => p.id === id)
                if (!pista) return null
                return (
                  <motion.div
                    key={id}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
                    className="rounded-lg p-3"
                    style={{
                      background: 'rgba(57,255,20,0.04)',
                      border: '1px solid rgba(57,255,20,0.1)',
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className="mt-0.5 flex-shrink-0 font-mono text-[10px]"
                        style={{ color: '#39ff14' }}
                      >
                        ✓
                      </span>
                      <p
                        className="font-mono text-[10px] leading-relaxed"
                        style={{ color: 'rgba(217,226,236,0.7)' }}
                      >
                        {pista.dado_revelado}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Confirm button */}
      <AnimatePresence>
        {pode_confirmar && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
          >
            <div
              className="mb-3 rounded-lg p-3"
              style={{
                background: 'rgba(204,51,51,0.06)',
                border: '1px solid rgba(204,51,51,0.2)',
              }}
            >
              <p
                className="font-mono text-[9px] uppercase tracking-[0.2em]"
                style={{ color: '#cc3333' }}
              >
                DADOS SUFICIENTES PARA LOCALIZAÇÃO
              </p>
              <p
                className="mt-1 font-mono text-[10px]"
                style={{ color: 'rgba(217,226,236,0.45)' }}
              >
                Luna está vulnerável. Missão pode ser concluída.
              </p>
            </div>
            <motion.button
              onClick={onConfirmarLocalizacao}
              className="w-full rounded-xl py-3 font-mono text-xs font-bold uppercase tracking-[0.25em] transition-all hover:brightness-110"
              style={{
                background: 'rgba(57,255,20,0.08)',
                border: '1px solid #39ff14',
                color: '#39ff14',
              }}
              animate={{
                boxShadow: [
                  '0 0 12px rgba(57,255,20,0.15)',
                  '0 0 28px rgba(57,255,20,0.4)',
                  '0 0 12px rgba(57,255,20,0.15)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              CONFIRMAR LOCALIZAÇÃO →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
