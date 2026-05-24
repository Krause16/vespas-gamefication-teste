'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import { useGolpeTaAiStore } from '@/stores/golpeTaAiStore'
import { getMensagem } from '@/lib/jogos/golpe-ta-ai'
import { HexGrid } from '@/components/vespas/HexGrid'
import { TypewriterText } from '@/components/vespas/DesignSystem'
import { SmartphoneFrame } from './SmartphoneFrame'
import { Debriefing } from './Debriefing'
import { ClassificacaoSheet } from './ClassificacaoSheet'
import { ResultadoFinal } from './ResultadoFinal'
import { HomeScreen } from './apps/HomeScreen'
import { VespasMsgApp } from './apps/VespasMsgApp'
import { VespasgramApp } from './apps/VespasgramApp'
import { VmailApp } from './apps/VmailApp'
import { VlinkedApp } from './apps/VlinkedApp'
import { VcordApp } from './apps/VcordApp'
import { type AppSlug } from '@/types/golpe-ta-ai'

const BOOT_LINES = [
  'INICIALIZANDO SISTEMAS...',
  'CARREGANDO BANCO DE GOLPES...',
  'CALIBRANDO DETECÇÃO DE PHISHING...',
  'OPERAÇÃO PHISHING ATIVA',
]

function IntroJogo({ onIniciar }: { onIniciar: () => void }) {
  const [lineIndex, setLineIndex] = useState(0)

  useEffect(() => {
    if (lineIndex >= BOOT_LINES.length) {
      const t = setTimeout(onIniciar, 600)
      return () => clearTimeout(t)
    }
  }, [lineIndex, onIniciar])

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-6"
      style={{ background: '#000000' }}
    >
      <HexGrid density="low" interactive={false} />
      <div className="relative z-10 flex w-full max-w-xs flex-col gap-3">
        {BOOT_LINES.slice(0, lineIndex + 1).map((line, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="font-mono text-[11px]" style={{ color: 'rgba(57,255,20,0.5)' }} aria-hidden="true">›</span>
            {i < lineIndex ? (
              <span className="font-mono text-sm" style={{ color: 'rgba(217,226,236,0.6)' }}>{line}</span>
            ) : (
              <TypewriterText
                text={line}
                speed={28}
                color={i === BOOT_LINES.length - 1 ? '#39ff14' : 'rgba(217,226,236,0.7)'}
                onComplete={() => setLineIndex((prev) => prev + 1)}
                className="text-sm"
              />
            )}
          </div>
        ))}
      </div>
      <div
        className="relative z-10 h-px w-48 overflow-hidden"
        style={{ background: 'rgba(57,255,20,0.1)' }}
        aria-hidden="true"
      >
        <motion.div
          className="h-full"
          style={{ background: '#39ff14' }}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 4.5, ease: 'linear' }}
        />
      </div>
    </div>
  )
}

interface AppComponentProps {
  mensagensCompletadas: string[]
  onAbrirMensagem: (id: string) => void
  onVoltar: () => void
}

const APP_MAP: Record<AppSlug, React.ComponentType<AppComponentProps>> = {
  'vespas-msg': VespasMsgApp,
  'vespasgram':  VespasgramApp,
  'vmail':       VmailApp,
  'vlinked':     VlinkedApp,
  'vcord':       VcordApp,
}

export function GolpeTaAiGame() {
  const router = useRouter()
  const {
    estado,
    iniciarJogo,
    abrirApp,
    fecharApp,
    abrirMensagem,
    fecharDebriefing,
    verResultado,
    resetar,
  } = useGolpeTaAiStore()

  const prevScoreRef = useRef(estado.pontuacao_total)
  const [scoreDelta, setScoreDelta] = useState<number | null>(null)

  useEffect(() => {
    const delta = estado.pontuacao_total - prevScoreRef.current
    if (delta !== 0) {
      prevScoreRef.current = estado.pontuacao_total
      setScoreDelta(delta)
      const t = setTimeout(() => setScoreDelta(null), 1200)
      return () => clearTimeout(t)
    }
  }, [estado.pontuacao_total])

  if (estado.fase === 'intro') {
    return <IntroJogo onIniciar={iniciarJogo} />
  }

  if (estado.fase === 'resultado_final') {
    return <ResultadoFinal estado={estado} onVoltar={() => { resetar(); router.push('/hub') }} />
  }

  const ultimaResposta = estado.respostas[estado.respostas.length - 1]
  const mensagemDebriefing = ultimaResposta ? getMensagem(ultimaResposta.mensagem_id) : undefined
  const ultimoResultado = estado.resultados[estado.resultados.length - 1]

  const showPhone = ['smartphone', 'em_app', 'classificando', 'debriefing'].includes(estado.fase)
  const AppComponent = estado.app_atual ? APP_MAP[estado.app_atual] : null

  return (
    <div className="flex h-dvh flex-col" style={{ background: '#0a0a0a' }}>
      {/* Header */}
      <header
        className="z-30 flex shrink-0 items-center justify-between px-4 py-3"
        style={{
          background: 'rgba(8,8,8,0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(57,255,20,0.07)',
          height: 56,
        }}
      >
        <button
          onClick={() => { resetar(); router.push('/hub') }}
          aria-label="Voltar ao hub"
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ color: 'rgba(217,226,236,0.5)' }}
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-1.5">
            <motion.span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: '#39ff14', boxShadow: '0 0 6px rgba(57,255,20,0.8)' }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              aria-hidden="true"
            />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: 'rgba(217,226,236,0.5)' }}>
              OPERAÇÃO PHISHING
            </p>
          </div>
          <p className="font-mono text-[8px] uppercase tracking-[0.15em]" style={{ color: 'rgba(217,226,236,0.25)' }}>
            {estado.mensagens_completadas.length}/{estado.meta_completar} ANALISADAS
          </p>
        </div>

        {/* Score */}
        <div className="relative">
          <p className="font-mono text-sm font-bold" style={{ color: '#39ff14' }}>
            {estado.pontuacao_total}
          </p>
          <AnimatePresence>
            {scoreDelta !== null && (
              <motion.span
                className="pointer-events-none absolute left-full ml-1 whitespace-nowrap font-mono text-[11px] font-bold"
                style={{ color: '#39ff14', top: 0 }}
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: -18, opacity: 0 }}
                exit={{}}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                aria-hidden="true"
              >
                +{scoreDelta}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Phone area */}
      {showPhone && (
        <main className="flex flex-1 justify-center overflow-hidden p-3">
          <SmartphoneFrame>
            <AnimatePresence mode="wait">
              {estado.fase === 'smartphone' && (
                <motion.div
                  key="home"
                  className="h-full"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  <HomeScreen
                    mensagensCompletadas={estado.mensagens_completadas}
                    metaCompletar={estado.meta_completar}
                    totalMensagens={estado.total_mensagens}
                    onAbrirApp={abrirApp}
                    onVerResultado={verResultado}
                  />
                </motion.div>
              )}

              {(['em_app', 'classificando', 'debriefing'] as const).some((f) => f === estado.fase) &&
                AppComponent && (
                  <motion.div
                    key={estado.app_atual ?? 'app'}
                    className="h-full"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.22 }}
                  >
                    <AppComponent
                      mensagensCompletadas={estado.mensagens_completadas}
                      onAbrirMensagem={abrirMensagem}
                      onVoltar={fecharApp}
                    />
                  </motion.div>
                )}
            </AnimatePresence>
          </SmartphoneFrame>
        </main>
      )}

      {/* Classification sheet (fixed overlay) */}
      <ClassificacaoSheet />

      {/* Debriefing overlay */}
      {estado.fase === 'debriefing' && mensagemDebriefing && ultimoResultado && (
        <Debriefing
          mensagem={mensagemDebriefing}
          resultado={ultimoResultado}
          onProxima={fecharDebriefing}
          labelBotao="Continuar explorando"
        />
      )}
    </div>
  )
}
