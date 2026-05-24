'use client'

import { useState } from 'react'
import { type ScoreExposicao } from '@/types/detetive-osint'
import { PISTAS } from '@/lib/jogos/detetive-osint/pistas'
import { FonteInvestigacao } from './FonteInvestigacao'
import { ConteudoFonte } from './ConteudoFonte'
import { QuadroEvidencias } from './QuadroEvidencias'

interface PainelInvestigacaoProps {
  pistas_descobertas: string[]
  score: ScoreExposicao
  onDescobrir: (id: string) => void
  onConcluir: () => void
}

type Aba = 'fontes' | 'intel' | 'evidencias'

function SidebarFontes({
  pistas_descobertas,
  fonteSelecionada,
  onSelecionar,
}: {
  pistas_descobertas: string[]
  fonteSelecionada: string | null
  onSelecionar: (id: string) => void
}) {
  return (
    <div>
      <p
        className="px-4 py-3 font-mono text-[9px] uppercase tracking-[0.3em]"
        style={{ color: 'rgba(217,226,236,0.3)' }}
      >
        FONTES DE INTEL
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
            ativa={fonteSelecionada === pista.id}
            onSelecionar={() => { if (!bloqueada) onSelecionar(pista.id) }}
          />
        )
      })}
    </div>
  )
}

export function PainelInvestigacao({
  pistas_descobertas,
  score,
  onDescobrir,
  onConcluir,
}: PainelInvestigacaoProps) {
  const [fonteSelecionada, setFonteSelecionada] = useState<string | null>(null)
  const [abaMobile, setAbaMobile] = useState<Aba>('fontes')

  const pistaSelecionada = PISTAS.find((p) => p.id === fonteSelecionada) ?? null

  function selecionar(id: string) {
    setFonteSelecionada(id)
    setAbaMobile('intel')
  }

  function handleExtrair(id: string) {
    if (!pistas_descobertas.includes(id)) onDescobrir(id)
  }

  const SIDEBAR_HEADER = (
    <div className="border-b px-4 py-4" style={{ borderColor: 'rgba(57,255,20,0.1)' }}>
      <p
        className="font-mono text-[9px] uppercase tracking-[0.35em]"
        style={{ color: 'rgba(57,255,20,0.5)' }}
      >
        OP. RASTRO DIGITAL
      </p>
      <p className="mt-1 text-sm font-bold" style={{ color: '#d9e2ec' }}>
        @luna_estudante
      </p>
    </div>
  )

  return (
    <>
      {/* ── Desktop: 3-column grid ── */}
      <div
        className="hidden h-screen lg:grid"
        style={{ gridTemplateColumns: '300px 1fr 280px', background: '#0a0a0a' }}
      >
        {/* Left: source list */}
        <div
          className="flex flex-col overflow-y-auto border-r"
          style={{ borderColor: 'rgba(217,226,236,0.07)', background: 'rgba(17,17,17,0.97)' }}
        >
          {SIDEBAR_HEADER}
          <SidebarFontes
            pistas_descobertas={pistas_descobertas}
            fonteSelecionada={fonteSelecionada}
            onSelecionar={selecionar}
          />
        </div>

        {/* Center: source content */}
        <div
          className="flex h-full flex-col overflow-y-auto"
          style={{ background: '#0a0a0a' }}
        >
          {pistaSelecionada ? (
            <div key={fonteSelecionada} className="flex h-full flex-col">
              <div
                className="border-b px-5 py-3"
                style={{ borderColor: 'rgba(217,226,236,0.07)' }}
              >
                <p
                  className="font-mono text-[9px] uppercase tracking-[0.3em]"
                  style={{ color: 'rgba(217,226,236,0.3)' }}
                >
                  ANALISANDO
                </p>
                <p
                  className="mt-0.5 font-mono text-xs font-bold"
                  style={{ color: '#d9e2ec' }}
                >
                  {pistaSelecionada.fonte.replace(/_/g, ' ').toUpperCase()}
                </p>
              </div>
              <div className="flex-1">
                <ConteudoFonte
                  pista={pistaSelecionada}
                  descoberta={pistas_descobertas.includes(pistaSelecionada.id)}
                  onExtrair={() => handleExtrair(pistaSelecionada.id)}
                />
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: 'rgba(217,226,236,0.15)' }}
                >
                  SELECIONE UMA FONTE
                </p>
                <p
                  className="mt-2 font-mono text-[9px]"
                  style={{ color: 'rgba(217,226,236,0.07)' }}
                >
                  Clique em uma fonte à esquerda
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right: evidence board */}
        <div
          className="flex flex-col overflow-y-auto border-l"
          style={{ borderColor: 'rgba(217,226,236,0.07)', background: 'rgba(17,17,17,0.97)' }}
        >
          <div
            className="border-b px-4 py-4"
            style={{ borderColor: 'rgba(217,226,236,0.07)' }}
          >
            <p
              className="font-mono text-[9px] uppercase tracking-[0.35em]"
              style={{ color: 'rgba(217,226,236,0.3)' }}
            >
              QUADRO DE EVIDÊNCIAS
            </p>
          </div>
          <QuadroEvidencias
            pistas_descobertas={pistas_descobertas}
            score={score}
            onConfirmarLocalizacao={onConcluir}
          />
        </div>
      </div>

      {/* ── Mobile: single column + bottom tabs ── */}
      <div
        className="flex h-screen flex-col lg:hidden"
        style={{ background: '#0a0a0a' }}
      >
        <div
          className="flex-shrink-0 border-b px-4 py-3"
          style={{ borderColor: 'rgba(57,255,20,0.1)', background: 'rgba(17,17,17,0.97)' }}
        >
          <p
            className="font-mono text-[9px] uppercase tracking-[0.35em]"
            style={{ color: 'rgba(57,255,20,0.5)' }}
          >
            OP. RASTRO DIGITAL
          </p>
          <p className="mt-0.5 font-mono text-xs font-bold" style={{ color: '#d9e2ec' }}>
            @luna_estudante
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {abaMobile === 'fontes' && (
            <SidebarFontes
              pistas_descobertas={pistas_descobertas}
              fonteSelecionada={fonteSelecionada}
              onSelecionar={selecionar}
            />
          )}
          {abaMobile === 'intel' && (
            pistaSelecionada ? (
              <div key={fonteSelecionada}>
                <ConteudoFonte
                  pista={pistaSelecionada}
                  descoberta={pistas_descobertas.includes(pistaSelecionada.id)}
                  onExtrair={() => handleExtrair(pistaSelecionada.id)}
                />
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center">
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: 'rgba(217,226,236,0.15)' }}
                >
                  SELECIONE UMA FONTE
                </p>
              </div>
            )
          )}
          {abaMobile === 'evidencias' && (
            <QuadroEvidencias
              pistas_descobertas={pistas_descobertas}
              score={score}
              onConfirmarLocalizacao={onConcluir}
            />
          )}
        </div>

        {/* Bottom tab bar */}
        <div
          className="flex-shrink-0 border-t"
          style={{ borderColor: 'rgba(217,226,236,0.07)', background: 'rgba(17,17,17,0.97)' }}
        >
          <div className="flex">
            {(['fontes', 'intel', 'evidencias'] as Aba[]).map((id) => {
              const label = id === 'fontes' ? 'FONTES' : id === 'intel' ? 'INTEL' : 'EVIDÊNCIAS'
              const ativo = abaMobile === id
              return (
                <button
                  key={id}
                  onClick={() => setAbaMobile(id)}
                  className="relative flex flex-1 flex-col items-center py-3 transition-colors"
                  style={{
                    color: ativo ? '#39ff14' : 'rgba(217,226,236,0.35)',
                    borderTop: ativo ? '1px solid #39ff14' : '1px solid transparent',
                  }}
                >
                  <span className="font-mono text-[9px] uppercase tracking-[0.15em]">{label}</span>
                  {id === 'evidencias' && pistas_descobertas.length > 0 && (
                    <span
                      className="absolute right-3 top-2 rounded-full px-1.5 py-px font-mono text-[8px] font-bold"
                      style={{ background: '#39ff14', color: '#0a0a0a' }}
                    >
                      {pistas_descobertas.length}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
