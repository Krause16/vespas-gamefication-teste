'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useGolpeTaAiStore } from '@/stores/golpeTaAiStore'
import { SmartphoneFrame } from './SmartphoneFrame'
import { MensagemCard } from './MensagemCard'
import { IndicadoresGrid } from './IndicadoresGrid'
import { BotoesClassificacao } from './BotoesClassificacao'
import { Debriefing } from './Debriefing'
import { TransicaoOnda } from './TransicaoOnda'
import { ResultadoFinal } from './ResultadoFinal'
import { VespaBackground } from '@/components/vespas/VespaBackground'

const NOMES_ONDAS = ['', 'ÓBVIOS', 'GOLPES BRASILEIROS', 'DIRECIONADOS', 'ATAQUES PÓS-IA']

function IntroJogo({ onIniciar }: { onIniciar: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onIniciar, 3200)
    return () => clearTimeout(timer)
  }, [onIniciar])

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center gap-6 px-6"
      style={{ background: '#1a1a1a' }}
    >
      <VespaBackground />
      <motion.div
        className="relative z-10 flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-5xl"
          aria-hidden="true"
        >
          🐝
        </motion.div>
        <p
          className="text-center text-xl font-bold tracking-[0.18em]"
          style={{ color: 'var(--vespa-esmeralda)', fontFamily: 'var(--font-body)' }}
        >
          OPERAÇÃO PHISHING
        </p>
        <p className="text-center text-sm" style={{ color: 'var(--vespa-nevoa)' }}>
          Identifique os golpes antes que te peguem
        </p>

        {/* Barra de progresso */}
        <div
          className="mt-4 h-1 w-48 overflow-hidden rounded-full"
          style={{ background: 'var(--color-border-subtle)' }}
          aria-hidden="true"
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--vespa-esmeralda)' }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 3, ease: 'linear' }}
          />
        </div>
      </motion.div>
    </div>
  )
}

export function GolpeTaAiGame() {
  const router = useRouter()
  const {
    estado,
    indicadores_selecionados,
    toggleIndicador,
    iniciarJogo,
    responderMensagem,
    proximaMensagem,
    proximaOnda,
    resetar,
  } = useGolpeTaAiStore()

  const mensagemAtual = estado.mensagens_da_onda[estado.mensagem_atual_idx]
  const ultimoResultado = estado.resultados[estado.resultados.length - 1]
  const ultimaResposta = estado.respostas[estado.respostas.length - 1]
  const mensagemDoDebriefing = ultimaResposta
    ? estado.mensagens_da_onda.find((m) => m.id === ultimaResposta.mensagem_id)
    : undefined

  if (estado.fase === 'intro') {
    return <IntroJogo onIniciar={iniciarJogo} />
  }

  if (estado.fase === 'transicao_onda') {
    const proximaOndaNum = (estado.onda_atual + 1) as 1 | 2 | 3 | 4
    return <TransicaoOnda proximaOnda={proximaOndaNum} onContinuar={proximaOnda} />
  }

  if (estado.fase === 'resultado_final') {
    return <ResultadoFinal estado={estado} onVoltar={resetar} />
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ background: 'var(--vespa-grafite)' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-4 py-3"
        style={{
          background: 'var(--color-bg-card)',
          borderBottom: '1px solid var(--color-border-subtle)',
        }}
      >
        <button
          onClick={() => { resetar(); router.push('/hub') }}
          aria-label="Voltar ao hub"
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-opacity hover:opacity-70"
          style={{ color: 'var(--vespa-nevoa)' }}
        >
          <ArrowLeft size={18} />
        </button>

        <p className="text-xs font-bold tracking-[0.15em]" style={{ color: 'var(--vespa-nevoa)' }}>
          O GOLPE TÁ AÍ
        </p>

        <div className="flex items-center gap-3">
          {/* Indicador de ondas */}
          <div className="flex gap-1" aria-label={`Onda ${estado.onda_atual} de 4`}>
            {([1, 2, 3, 4] as const).map((n) => (
              <div
                key={n}
                className="h-2 w-2 rounded-full"
                style={{
                  background: n <= estado.onda_atual
                    ? 'var(--vespa-esmeralda)'
                    : 'var(--color-border-subtle)',
                }}
              />
            ))}
          </div>
          <p className="text-xs font-bold" style={{ color: 'var(--vespa-esmeralda)' }}>
            {estado.pontuacao_total}
          </p>
        </div>
      </header>

      {/* Subtítulo da onda */}
      <div className="px-4 pt-3">
        <p className="text-[10px] font-bold tracking-[0.2em]" style={{ color: 'var(--color-text-secondary)' }}>
          ONDA {estado.onda_atual} — {NOMES_ONDAS[estado.onda_atual]}
        </p>
      </div>

      {/* Conteúdo principal */}
      <main className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 pb-6 pt-4">
        <AnimatePresence mode="wait">
          {mensagemAtual && (
            <motion.div
              key={mensagemAtual.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <SmartphoneFrame mensagem={mensagemAtual}>
                <MensagemCard mensagem={mensagemAtual} />
              </SmartphoneFrame>
            </motion.div>
          )}
        </AnimatePresence>

        <IndicadoresGrid
          selecionados={indicadores_selecionados}
          onToggle={toggleIndicador}
        />

        <BotoesClassificacao onClassificar={responderMensagem} />
      </main>

      {/* Debriefing overlay */}
      {estado.fase === 'debriefing' && mensagemDoDebriefing && ultimoResultado && (
        <Debriefing
          mensagem={mensagemDoDebriefing}
          resultado={ultimoResultado}
          onProxima={proximaMensagem}
        />
      )}
    </div>
  )
}
