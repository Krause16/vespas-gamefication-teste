'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useTerminalCTFStore } from '@/stores/terminalCTFStore'
import { type Flag, type Dica } from '@/types/terminal-ctf'
import { FLAGS } from '@/lib/jogos/terminal-ctf/flags'
import { PainelMissao } from './PainelMissao'
import { DebriefingFlag } from './DebriefingFlag'
import { SistemaDicas } from './SistemaDicas'
import { ResultadoFinal } from './ResultadoFinal'

const TerminalWindow = dynamic(
  () => import('./TerminalWindow').then((m) => m.TerminalWindow),
  { ssr: false, loading: () => <div style={{ background: '#0a0a0a', height: '100%', width: '100%' }} /> },
)

const TEXTO_INTRO = `> CONEXÃO ESTABELECIDA...
> AUTENTICANDO AGENTE...
> ACESSO CONCEDIDO ✓

> Servidor comprometido às 03:47.
> Invasor deixou rastros. 7 flags para localizar.
> Use suas habilidades de terminal Linux.

> "Não é magia. É conhecimento."`

function TelaIntro({ onIniciar }: { onIniciar: () => void }) {
  const [texto, setTexto] = useState('')
  const [pronto, setPronto] = useState(false)

  useEffect(() => {
    let i = 0
    const intervalo = setInterval(() => {
      if (i >= TEXTO_INTRO.length) {
        clearInterval(intervalo)
        setPronto(true)
        return
      }
      const char = TEXTO_INTRO[i]
      i++
      setTexto((prev) => prev + char)
    }, 22)
    return () => clearInterval(intervalo)
  }, [])

  const progresso = (texto.length / TEXTO_INTRO.length) * 100

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-5"
      style={{ background: '#0a0a0a' }}
    >
      <div className="w-full max-w-lg">
        {/* Azonix title */}
        <h1
          className="mb-8 text-center font-display text-4xl tracking-[0.2em]"
          style={{ color: '#39ff14', textShadow: '0 0 24px rgba(57,255,20,0.5)' }}
        >
          TERMINAL CTF
        </h1>

        {/* Terminal frame */}
        <div
          style={{
            borderRadius: 12,
            border: '1px solid rgba(57,255,20,0.2)',
            overflow: 'hidden',
            boxShadow: '0 0 60px rgba(0,0,0,0.9)',
          }}
        >
          {/* Titlebar */}
          <div
            className="flex items-center px-3"
            style={{ height: 36, background: '#111', borderBottom: '1px solid rgba(57,255,20,0.08)' }}
          >
            <div className="flex gap-1.5">
              {(['#ff5f56', '#ffbd2e', '#27c93f'] as const).map((c) => (
                <div key={c} className="h-3 w-3 rounded-full" style={{ background: c }} />
              ))}
            </div>
            <span className="flex-1 text-center font-mono text-xs" style={{ color: '#444' }}>
              servidor_zero.sh
            </span>
            <div style={{ width: 54 }} />
          </div>

          {/* Content */}
          <div className="p-5" style={{ background: '#0d0d0d', minHeight: 220 }}>
            <div className="font-mono text-sm leading-7">
              {texto.split('\n').map((linha, i) => (
                <div
                  key={i}
                  style={{
                    color: linha.includes('CONCEDIDO') || linha.includes('✓') ? '#39ff14' : '#d9e2ec',
                    minHeight: '1.75rem',
                  }}
                >
                  {linha}
                </div>
              ))}
              {!pronto && (
                <span className="animate-pulse" style={{ color: '#39ff14' }}>
                  ▌
                </span>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: 2, background: '#111' }}>
            <div
              className="h-full transition-all duration-75"
              style={{
                width: `${progresso}%`,
                background: '#39ff14',
                boxShadow: '0 0 8px rgba(57,255,20,0.5)',
              }}
            />
          </div>
        </div>

        {pronto && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex justify-center"
          >
            <button
              onClick={onIniciar}
              className="rounded-xl px-8 py-3.5 font-bold tracking-[0.2em] transition-all hover:brightness-110"
              style={{
                background: '#39ff14',
                color: '#111',
                boxShadow: '0 0 24px rgba(57,255,20,0.45)',
              }}
            >
              INICIAR TERMINAL
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export function TerminalCTFGame() {
  const { estado, iniciarJogo, executarComandoTerminal, usarDica, concluir, resetar } =
    useTerminalCTFStore()
  const [painelMobileAberto, setPainelMobileAberto] = useState(false)
  const [flagDebriefing, setFlagDebriefing] = useState<Flag | null>(null)
  const [dicasAbertas, setDicasAbertas] = useState(false)

  const handleComando = useCallback(
    (input: string) => {
      const resultado = executarComandoTerminal(input)
      if (resultado.flag) {
        setFlagDebriefing(resultado.flag)
      }
      return resultado
    },
    [executarComandoTerminal],
  )

  useEffect(() => {
    if (
      estado.fase === 'jogando' &&
      estado.flags_encontradas.length >= FLAGS.length &&
      !flagDebriefing
    ) {
      const timer = setTimeout(() => concluir(), 1000)
      return () => clearTimeout(timer)
    }
  }, [estado.fase, estado.flags_encontradas.length, flagDebriefing, concluir])

  const handleUsarDica = useCallback(
    (flag_numero: number): { dica: Dica | null; semSaldo: boolean } => {
      return usarDica(flag_numero)
    },
    [usarDica],
  )

  if (estado.fase === 'intro') {
    return <TelaIntro onIniciar={iniciarJogo} />
  }

  if (estado.fase === 'resultado') {
    return <ResultadoFinal estado={estado} onVoltar={resetar} />
  }

  return (
    <div className="flex h-screen flex-col" style={{ background: '#0a0a0a' }}>
      {/* Header — 48px */}
      <header
        className="flex flex-shrink-0 items-center justify-between px-4"
        style={{
          height: 48,
          background: '#0d0d0d',
          borderBottom: '1px solid rgba(57,255,20,0.08)',
        }}
      >
        <span className="font-mono text-xs font-bold tracking-[0.2em]" style={{ color: '#39ff14' }}>
          TERMINAL CTF
        </span>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs" style={{ color: '#555' }}>
            {estado.flags_encontradas.length}/{FLAGS.length} flags
          </span>
          <span className="font-mono text-sm font-bold" style={{ color: '#39ff14' }}>
            {estado.pontuacao} pts
          </span>
          <button
            className="rounded-lg px-3 py-1.5 font-mono text-xs lg:hidden"
            style={{
              background: 'transparent',
              color: '#0d70ce',
              border: '1px solid rgba(13,112,206,0.35)',
            }}
            onClick={() => setPainelMobileAberto(true)}
          >
            MISSÃO
          </button>
          <button
            onClick={concluir}
            className="rounded-lg px-3 py-1.5 font-mono text-xs transition-all hover:brightness-110"
            style={{
              background: 'transparent',
              color: '#ad550a',
              border: '1px solid rgba(173,85,10,0.35)',
            }}
          >
            ENCERRAR
          </button>
        </div>
      </header>

      {/* Body: terminal + sidebar */}
      <div className="flex min-h-0 flex-1 lg:grid lg:grid-cols-[1fr_320px]">
        <div className="min-h-0 flex-1 overflow-hidden">
          <TerminalWindow
            filesystem={estado.filesystem}
            onComando={handleComando}
            onHint={() => setDicasAbertas(true)}
          />
        </div>

        <PainelMissao
          flags_encontradas={estado.flags_encontradas}
          dicas_usadas={estado.dicas_usadas}
          pontuacao={estado.pontuacao}
          onUsarDica={handleUsarDica}
          mobileAberto={painelMobileAberto}
          onFecharMobile={() => setPainelMobileAberto(false)}
        />
      </div>

      <AnimatePresence>
        {flagDebriefing && (
          <DebriefingFlag flag={flagDebriefing} onFechar={() => setFlagDebriefing(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {dicasAbertas && (
          <SistemaDicas
            dicas_usadas={estado.dicas_usadas}
            pontuacao={estado.pontuacao}
            onUsarDica={handleUsarDica}
            onFechar={() => setDicasAbertas(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
