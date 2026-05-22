'use client'

import { motion } from 'framer-motion'
import { type ScoreExposicao } from '@/types/detetive-osint'
import { AJUSTES } from '@/lib/jogos/detetive-osint/ajustes'
import { calcularScoreAposAjustes } from '@/lib/jogos/detetive-osint/score'
import { BarraExposicao } from './BarraExposicao'
import { AjustePrivacidadeCard } from './AjustePrivacidadeCard'

const MINIMO_AJUSTES = 3

interface PainelPrivacidadeProps {
  scoreInicial: ScoreExposicao
  ajustes_aplicados: string[]
  onAplicar: (id: string) => void
  onRemover: (id: string) => void
  onConcluir: () => void
}

export function PainelPrivacidade({
  scoreInicial,
  ajustes_aplicados,
  onAplicar,
  onRemover,
  onConcluir,
}: PainelPrivacidadeProps) {
  const scoreAtual = calcularScoreAposAjustes(scoreInicial, ajustes_aplicados)
  const prontoPara = ajustes_aplicados.length >= MINIMO_AJUSTES
  const faltam = Math.max(0, MINIMO_AJUSTES - ajustes_aplicados.length)

  return (
    <div className="flex min-h-screen flex-col" style={{ background: 'var(--vespa-grafite)' }}>
      {/* Header fixo */}
      <header
        className="border-b px-5 py-4"
        style={{
          borderColor: 'var(--color-border-subtle)',
          background: 'var(--color-bg-card)',
        }}
      >
        <p
          className="font-mono text-[10px] font-bold tracking-[0.3em]"
          style={{ color: 'var(--vespa-azul-link)' }}
        >
          OPERAÇÃO RASTRO DIGITAL — ATO 3
        </p>
        <p className="mt-0.5 text-sm font-bold" style={{ color: 'var(--vespa-nevoa)' }}>
          Configure suas defesas
        </p>
      </header>

      <div className="flex-1 overflow-y-auto p-5 lg:grid lg:grid-cols-[1fr_320px] lg:gap-6 lg:p-8">
        {/* Ajustes */}
        <div className="flex flex-col gap-3">
          <p
            className="text-[10px] font-bold tracking-[0.2em]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            AJUSTES DE PRIVACIDADE
          </p>
          {AJUSTES.map((ajuste) => (
            <AjustePrivacidadeCard
              key={ajuste.id}
              ajuste={ajuste}
              aplicado={ajustes_aplicados.includes(ajuste.id)}
              onToggle={() =>
                ajustes_aplicados.includes(ajuste.id)
                  ? onRemover(ajuste.id)
                  : onAplicar(ajuste.id)
              }
            />
          ))}
        </div>

        {/* Painel de score */}
        <div className="mt-6 flex flex-col gap-4 lg:mt-0">
          {/* Score atual */}
          <div
            className="rounded-xl p-5"
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <p
              className="mb-3 text-[10px] font-bold tracking-[0.2em]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              SUA EXPOSIÇÃO
            </p>
            <motion.div key={scoreAtual.total} layout>
              <BarraExposicao score={scoreAtual} />
            </motion.div>
          </div>

          {/* Progresso */}
          <div
            className="rounded-xl p-4"
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                Ajustes aplicados
              </span>
              <span className="font-mono text-sm font-bold" style={{ color: 'var(--vespa-esmeralda)' }}>
                {ajustes_aplicados.length}/{AJUSTES.length}
              </span>
            </div>
            {!prontoPara && (
              <p className="mt-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                Aplique mais {faltam} ajuste{faltam > 1 ? 's' : ''} para continuar
              </p>
            )}
          </div>

          {/* Botão concluir */}
          <button
            onClick={onConcluir}
            disabled={!prontoPara}
            className="w-full rounded-xl py-3.5 font-bold tracking-[0.2em] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              background: prontoPara ? 'var(--vespa-esmeralda)' : 'var(--color-bg-elevated)',
              color: prontoPara ? '#111' : 'var(--color-text-secondary)',
            }}
          >
            {prontoPara ? 'VER RESULTADO FINAL →' : `FALTAM ${faltam} AJUSTES`}
          </button>
        </div>
      </div>
    </div>
  )
}
