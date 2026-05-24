'use client'

import { motion, AnimatePresence } from 'motion/react'
import { X, CheckCircle2, AlertTriangle, ShieldOff } from 'lucide-react'
import { useGolpeTaAiStore } from '@/stores/golpeTaAiStore'
import { getMensagem } from '@/lib/jogos/golpe-ta-ai'
import { IndicadoresGrid } from './IndicadoresGrid'
import { LiquidButton } from '@/components/vespas/DesignSystem'
import { type ClassificacaoMensagem } from '@/types/golpe-ta-ai'

interface ClassificacaoOpcao {
  valor: ClassificacaoMensagem
  label: string
  Icon: React.ElementType
  cor: string
  glowColor: string
}

const OPCOES: ClassificacaoOpcao[] = [
  { valor: 'confio',   label: 'CONFIO',   Icon: CheckCircle2, cor: '#27746e', glowColor: 'rgba(39,116,110,0.4)' },
  { valor: 'suspeito', label: 'SUSPEITO', Icon: AlertTriangle, cor: '#c8a000', glowColor: 'rgba(200,160,0,0.4)' },
  { valor: 'bloqueio', label: 'BLOQUEIO', Icon: ShieldOff,    cor: '#ad550a', glowColor: 'rgba(173,85,10,0.4)' },
]

export function ClassificacaoSheet() {
  const {
    estado,
    indicadores_selecionados,
    classificacao_selecionada,
    toggleIndicador,
    selecionarClassificacao,
    confirmarClassificacao,
    fecharClassificacao,
  } = useGolpeTaAiStore()

  const aberta = estado.fase === 'classificando' && estado.mensagem_atual_id !== null
  const mensagem = estado.mensagem_atual_id ? getMensagem(estado.mensagem_atual_id) : undefined

  return (
    <AnimatePresence>
      {aberta && mensagem && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            onClick={fecharClassificacao}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[28px]"
            style={{
              background: 'rgba(10,10,10,0.98)',
              border: '1px solid rgba(57,255,20,0.1)',
              borderBottom: 'none',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              maxHeight: '90dvh',
              overflowY: 'auto',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Classificar mensagem"
          >
            <div className="px-5 pb-8 pt-3">
              {/* Handle */}
              <div className="mb-4 flex justify-center">
                <div className="h-1 w-12 rounded-full" style={{ background: 'rgba(217,226,236,0.2)' }} aria-hidden="true" />
              </div>

              {/* Message preview */}
              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="flex-1 overflow-hidden">
                  <p
                    className="mb-0.5 font-mono text-[9px] uppercase tracking-[0.3em]"
                    style={{ color: 'rgba(57,255,20,0.5)' }}
                  >
                    Análise de mensagem
                  </p>
                  <p className="font-mono text-sm font-bold" style={{ color: '#d9e2ec' }}>
                    {mensagem.remetente.nome}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed" style={{ color: 'rgba(217,226,236,0.5)' }}>
                    {mensagem.conteudo.assunto
                      ? mensagem.conteudo.assunto
                      : mensagem.conteudo.texto.length > 90
                        ? `${mensagem.conteudo.texto.slice(0, 90)}...`
                        : mensagem.conteudo.texto}
                  </p>
                </div>
                <button
                  onClick={fecharClassificacao}
                  aria-label="Fechar análise"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                  style={{ background: 'rgba(217,226,236,0.08)' }}
                >
                  <X size={14} style={{ color: 'rgba(217,226,236,0.5)' }} />
                </button>
              </div>

              {/* Indicators */}
              <div className="mb-5">
                <IndicadoresGrid selecionados={indicadores_selecionados} onToggle={toggleIndicador} />
              </div>

              {/* Classification selector */}
              <div className="mb-5">
                <p
                  className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.25em]"
                  style={{ color: 'rgba(217,226,236,0.35)' }}
                >
                  Sua classificação
                </p>
                <div className="flex gap-2.5" role="radiogroup" aria-label="Classificar mensagem">
                  {OPCOES.map(({ valor, label, Icon, cor, glowColor }) => {
                    const ativo = classificacao_selecionada === valor
                    return (
                      <motion.button
                        key={valor}
                        whileTap={{ scale: 0.93 }}
                        onClick={() => selecionarClassificacao(valor)}
                        role="radio"
                        aria-checked={ativo}
                        className="relative flex flex-1 flex-col items-center gap-1.5 overflow-hidden rounded-xl py-3 font-mono text-[10px] font-bold uppercase tracking-[0.15em]"
                        style={{
                          background: ativo ? `${cor}22` : 'rgba(13,13,13,0.6)',
                          border: `1px solid ${ativo ? cor : 'rgba(217,226,236,0.12)'}`,
                          boxShadow: ativo ? `0 0 16px ${glowColor}` : 'none',
                          transition: 'border-color 0.15s, box-shadow 0.15s, background 0.15s',
                        }}
                      >
                        <Icon
                          size={16}
                          style={{ color: ativo ? cor : 'rgba(217,226,236,0.3)' }}
                          aria-hidden="true"
                        />
                        <span style={{ color: ativo ? 'rgba(217,226,236,0.9)' : 'rgba(217,226,236,0.4)' }}>
                          {label}
                        </span>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Confirm */}
              <LiquidButton
                variant="primary"
                size="md"
                className="w-full"
                onClick={confirmarClassificacao}
                disabled={!classificacao_selecionada}
              >
                CONFIRMAR ANÁLISE
              </LiquidButton>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
