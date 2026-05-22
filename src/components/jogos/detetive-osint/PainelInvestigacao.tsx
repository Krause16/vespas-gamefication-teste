'use client'

import { useState } from 'react'
import { type ScoreExposicao } from '@/types/detetive-osint'
import { PISTAS } from '@/lib/jogos/detetive-osint/pistas'
import { FonteInvestigacao } from './FonteInvestigacao'
import { QuadroEvidencias } from './QuadroEvidencias'

interface PainelInvestigacaoProps {
  pistas_descobertas: string[]
  score: ScoreExposicao
  onDescobrir: (id: string) => void
  onConcluir: () => void
}

type Aba = 'fontes' | 'quadro'

export function PainelInvestigacao({
  pistas_descobertas,
  score,
  onDescobrir,
  onConcluir,
}: PainelInvestigacaoProps) {
  const [abaAtiva, setAbaAtiva] = useState<Aba>('fontes')

  return (
    <div className="flex min-h-screen flex-col" style={{ background: 'var(--vespa-grafite)' }}>
      {/* Header */}
      <header
        className="border-b px-5 py-4"
        style={{
          borderColor: 'var(--color-border-subtle)',
          background: 'var(--color-bg-card)',
        }}
      >
        <p
          className="font-mono text-[10px] font-bold tracking-[0.3em]"
          style={{ color: 'var(--vespa-cobre)' }}
        >
          OPERAÇÃO RASTRO DIGITAL — ATO 1
        </p>
        <p className="mt-0.5 text-sm font-bold" style={{ color: 'var(--vespa-nevoa)' }}>
          Investigando @luna_estudante
        </p>
      </header>

      {/* Abas (mobile) */}
      <div
        className="flex border-b lg:hidden"
        style={{ borderColor: 'var(--color-border-subtle)', background: 'var(--color-bg-card)' }}
      >
        {([['fontes', 'Fontes'], ['quadro', 'Quadro']] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setAbaAtiva(id)}
            className="flex-1 py-3 text-sm font-bold transition-colors"
            style={{
              color: abaAtiva === id ? 'var(--vespa-esmeralda)' : 'var(--color-text-secondary)',
              borderBottom: abaAtiva === id ? '2px solid var(--vespa-esmeralda)' : '2px solid transparent',
            }}
          >
            {label}
            {id === 'quadro' && pistas_descobertas.length > 0 && (
              <span
                className="ml-1.5 rounded-full px-1.5 py-0.5 text-[10px]"
                style={{ background: 'var(--vespa-esmeralda)', color: '#111' }}
              >
                {pistas_descobertas.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-5 lg:grid lg:grid-cols-[1fr_340px] lg:gap-6 lg:p-8">
        {/* Painel esquerdo — fontes */}
        <div className={abaAtiva === 'fontes' ? 'flex flex-col gap-3' : 'hidden lg:flex lg:flex-col lg:gap-3'}>
          <p
            className="text-[10px] font-bold tracking-[0.2em]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            FONTES DISPONÍVEIS
          </p>
          {PISTAS.map((pista) => {
            const bloqueada = pista.requer_pista
              ? !pistas_descobertas.includes(pista.requer_pista)
              : false
            return (
              <FonteInvestigacao
                key={pista.id}
                pista={pista}
                descoberta={pistas_descobertas.includes(pista.id)}
                bloqueada={bloqueada}
                onDescobrir={() => onDescobrir(pista.id)}
              />
            )
          })}
        </div>

        {/* Painel direito — quadro de evidências */}
        <div className={abaAtiva === 'quadro' ? 'flex flex-col gap-3' : 'hidden lg:flex lg:flex-col lg:gap-3'}>
          <QuadroEvidencias
            pistas_descobertas={pistas_descobertas}
            score={score}
            onConfirmarLocalizacao={onConcluir}
          />
        </div>
      </div>
    </div>
  )
}
