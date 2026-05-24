'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FLAGS } from '@/lib/jogos/terminal-ctf/flags'
import { obterProximaDica } from '@/lib/jogos/terminal-ctf/dicas'
import { type Dica } from '@/types/terminal-ctf'

interface SistemaDicasProps {
  dicas_usadas: Array<{ flag_numero: number; nivel: number }>
  pontuacao: number
  onUsarDica: (flag_numero: number) => { dica: Dica | null; semSaldo: boolean }
  onFechar: () => void
}

export function SistemaDicas({ dicas_usadas, pontuacao, onUsarDica, onFechar }: SistemaDicasProps) {
  const [flagSelecionada, setFlagSelecionada] = useState<number | null>(null)
  const [dicaExibida, setDicaExibida] = useState<Dica | null>(null)
  const [mensagem, setMensagem] = useState<string | null>(null)

  function handleConfirmar() {
    if (flagSelecionada === null) return
    const resultado = onUsarDica(flagSelecionada)
    if (resultado.semSaldo) {
      setMensagem('Pontuação insuficiente para esta dica.')
      return
    }
    if (!resultado.dica) {
      setMensagem('Todas as dicas desta flag já foram usadas.')
      return
    }
    setDicaExibida(resultado.dica)
    setMensagem(null)
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onFechar}
    >
      <motion.div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)' }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="font-mono text-xs font-bold tracking-[0.2em]" style={{ color: 'var(--vespa-azul-link)' }}>
            SISTEMA DE DICAS
          </p>
          <span className="font-mono text-xs" style={{ color: 'var(--vespa-esmeralda)' }}>
            {pontuacao} pts disponíveis
          </span>
        </div>

        {!dicaExibida ? (
          <>
            <p className="mb-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Qual flag você está tentando resolver?
            </p>
            <div className="mb-4 grid grid-cols-4 gap-2">
              {FLAGS.map((f) => {
                const proxima = obterProximaDica(f.numero, dicas_usadas)
                const esgotada = !proxima
                return (
                  <button
                    key={f.numero}
                    onClick={() => { setFlagSelecionada(f.numero); setMensagem(null) }}
                    disabled={esgotada}
                    className="rounded-lg py-2 text-sm font-bold transition-all disabled:opacity-40"
                    style={{
                      background: flagSelecionada === f.numero
                        ? 'rgba(57,255,20,0.15)'
                        : 'var(--color-bg-elevated)',
                      border: `1px solid ${flagSelecionada === f.numero ? 'var(--vespa-esmeralda)' : 'var(--color-border-strong)'}`,
                      color: flagSelecionada === f.numero ? 'var(--vespa-esmeralda)' : 'var(--vespa-nevoa)',
                    }}
                  >
                    {f.numero}
                  </button>
                )
              })}
            </div>

            {flagSelecionada !== null && (() => {
              const proxima = obterProximaDica(flagSelecionada, dicas_usadas)
              return proxima ? (
                <div
                  className="mb-4 rounded-xl p-3"
                  style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-strong)' }}
                >
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    Próxima dica (nível {proxima.nivel}):
                    <span className="ml-2 font-bold" style={{ color: 'var(--vespa-cobre)' }}>
                      -{proxima.custo_pontos} pts
                    </span>
                  </p>
                </div>
              ) : (
                <p className="mb-4 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  Todas as dicas desta flag foram usadas.
                </p>
              )
            })()}

            {mensagem && (
              <p className="mb-3 text-xs" style={{ color: 'var(--vespa-cobre)' }}>
                {mensagem}
              </p>
            )}

            <div className="flex gap-2">
              <button
                onClick={onFechar}
                className="flex-1 rounded-xl py-2.5 text-sm font-bold transition-opacity hover:opacity-80"
                style={{ background: 'var(--color-bg-elevated)', color: 'var(--vespa-nevoa)', border: '1px solid var(--color-border-strong)' }}
              >
                CANCELAR
              </button>
              <button
                onClick={handleConfirmar}
                disabled={flagSelecionada === null}
                className="flex-1 rounded-xl py-2.5 text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{ background: 'var(--vespa-azul-link)', color: 'var(--vespa-nevoa)' }}
              >
                VER DICA
              </button>
            </div>
          </>
        ) : (
          <>
            <div
              className="mb-5 rounded-xl p-4"
              style={{ background: 'rgba(13,112,206,0.08)', border: '1px solid rgba(13,112,206,0.3)' }}
            >
              <p className="mb-1 text-[10px] font-bold tracking-wider" style={{ color: 'var(--vespa-azul-link)' }}>
                DICA — FLAG {flagSelecionada} — NÍVEL {dicaExibida.nivel}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--vespa-nevoa)' }}>
                {dicaExibida.texto}
              </p>
            </div>
            <button
              onClick={onFechar}
              className="w-full rounded-xl py-3 text-sm font-bold tracking-wider transition-opacity hover:opacity-90"
              style={{ background: 'var(--vespa-esmeralda)', color: '#111' }}
            >
              CONTINUAR
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
