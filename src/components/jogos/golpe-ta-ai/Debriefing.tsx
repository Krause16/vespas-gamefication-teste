'use client'

import { motion } from 'motion/react'
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import { GlassPanel, LiquidButton } from '@/components/vespas/DesignSystem'
import { type Mensagem, type ResultadoMensagem, type IndicadorFraude } from '@/types/golpe-ta-ai'

const LABEL_INDICADOR: Record<IndicadorFraude, string> = {
  urgencia:             'Urgência artificial',
  remetente_estranho:   'Remetente estranho',
  link_suspeito:        'Link suspeito',
  erro_gramatical:      'Erro gramatical',
  pedido_dado_sensivel: 'Pede dado sensível',
  contexto_inesperado:  'Contexto inesperado',
  pressao_financeira:   'Pressão financeira',
  deepfake_audio:       'Possível deepfake',
  dominio_falso:        'Domínio falso',
  numero_desconhecido:  'Número desconhecido',
}

interface IndicadorRowProps {
  ind: IndicadorFraude
  tipo: 'correto' | 'perdido' | 'erroneo'
  index: number
}

function IndicadorRow({ ind, tipo, index }: IndicadorRowProps) {
  const config = {
    correto:  { icon: <CheckCircle2 size={13} />, color: '#39ff14', label: LABEL_INDICADOR[ind] },
    perdido:  { icon: <XCircle size={13} />,      color: 'rgba(217,226,236,0.4)', label: `${LABEL_INDICADOR[ind]} (não marcou)` },
    erroneo:  { icon: <AlertTriangle size={13} />, color: '#ad550a', label: `${LABEL_INDICADOR[ind]} (marcou errado)` },
  }[tipo]

  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ x: -12, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.06, duration: 0.25 }}
    >
      <span style={{ color: config.color }} aria-hidden="true">{config.icon}</span>
      <span className="text-xs" style={{ color: config.color }}>{config.label}</span>
    </motion.div>
  )
}

interface DebriefingProps {
  mensagem: Mensagem
  resultado: ResultadoMensagem
  onProxima: () => void
  labelBotao?: string
}

export function Debriefing({ mensagem, resultado, onProxima, labelBotao = 'Próxima mensagem' }: DebriefingProps) {
  const todosIndicadores = [
    ...resultado.indicadores_corretos.map((ind) => ({ ind, tipo: 'correto' as const })),
    ...resultado.indicadores_perdidos.map((ind) => ({ ind, tipo: 'perdido' as const })),
    ...resultado.indicadores_erroneos.map((ind) => ({ ind, tipo: 'erroneo' as const })),
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-6"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
    >
      <motion.div
        className="w-full max-w-md"
        initial={{ y: 40, scale: 0.94 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      >
        <GlassPanel className="p-6">
          {/* Result header */}
          <div className="mb-4 flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              style={{
                background: resultado.correta ? 'rgba(57,255,20,0.1)' : 'rgba(173,85,10,0.1)',
                border: `1px solid ${resultado.correta ? 'rgba(57,255,20,0.3)' : 'rgba(173,85,10,0.3)'}`,
              }}
              aria-hidden="true"
            >
              {resultado.correta
                ? <CheckCircle2 size={18} style={{ color: '#39ff14' }} />
                : <XCircle size={18} style={{ color: '#ad550a' }} />
              }
            </div>
            <div>
              <p
                className="font-mono text-[11px] font-bold uppercase tracking-[0.2em]"
                style={{ color: resultado.correta ? '#39ff14' : '#ad550a' }}
              >
                {resultado.correta ? 'CORRETO' : 'ERRADO'}
              </p>
              <p className="font-mono text-xl font-bold" style={{ color: '#d9e2ec' }}>
                +{resultado.pontuacao} pts
              </p>
            </div>
          </div>

          {/* Explanation */}
          <p className="mb-4 text-sm leading-relaxed" style={{ color: 'rgba(217,226,236,0.7)' }}>
            {mensagem.gabarito.explicacao}
          </p>

          {/* Indicators */}
          {todosIndicadores.length > 0 && (
            <div className="mb-5">
              <p className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.25em]" style={{ color: 'rgba(217,226,236,0.3)' }}>
                Indicadores
              </p>
              <div className="flex flex-col gap-2">
                {todosIndicadores.map(({ ind, tipo }, i) => (
                  <IndicadorRow key={ind} ind={ind} tipo={tipo} index={i} />
                ))}
              </div>
            </div>
          )}

          <LiquidButton variant="primary" size="md" className="w-full" onClick={onProxima}>
            {labelBotao}
          </LiquidButton>
        </GlassPanel>
      </motion.div>
    </motion.div>
  )
}
