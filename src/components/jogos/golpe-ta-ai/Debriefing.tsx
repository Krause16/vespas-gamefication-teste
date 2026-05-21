'use client'

import { motion } from 'framer-motion'
import { type Mensagem, type ResultadoMensagem, type IndicadorFraude } from '@/types/golpe-ta-ai'

const LABEL_INDICADOR: Record<IndicadorFraude, string> = {
  urgencia: 'Urgência artificial',
  remetente_estranho: 'Remetente estranho',
  link_suspeito: 'Link suspeito',
  erro_gramatical: 'Erro gramatical',
  pedido_dado_sensivel: 'Pede dado sensível',
  contexto_inesperado: 'Contexto inesperado',
  pressao_financeira: 'Pressão financeira',
  deepfake_audio: 'Possível deepfake',
  dominio_falso: 'Domínio falso',
  numero_desconhecido: 'Número desconhecido',
}

interface DebriefingProps {
  mensagem: Mensagem
  resultado: ResultadoMensagem
  onProxima: () => void
}

export function Debriefing({ mensagem, resultado, onProxima }: DebriefingProps) {
  const todosIndicadores = [
    ...new Set([
      ...resultado.indicadores_corretos,
      ...resultado.indicadores_perdidos,
      ...resultado.indicadores_erroneos,
    ]),
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-6 pt-20"
      style={{ background: 'rgba(0,0,0,0.75)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6"
        style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)' }}
      >
        {/* Resultado principal */}
        <div className="mb-4 flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">
            {resultado.correta ? '✅' : '❌'}
          </span>
          <div>
            <p
              className="text-sm font-bold"
              style={{ color: resultado.correta ? 'var(--vespa-esmeralda)' : 'var(--vespa-cobre)' }}
            >
              {resultado.correta ? 'CORRETO!' : 'ERRADO'}
            </p>
            <p className="text-lg font-bold" style={{ color: 'var(--vespa-nevoa)' }}>
              +{resultado.pontuacao} pts
            </p>
          </div>
        </div>

        {/* Explicação */}
        <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--vespa-nevoa)' }}>
          {mensagem.gabarito.explicacao}
        </p>

        {/* Indicadores */}
        {todosIndicadores.length > 0 && (
          <div className="mb-5">
            <p className="mb-2 text-[11px] font-bold tracking-widest" style={{ color: 'var(--color-text-secondary)' }}>
              INDICADORES
            </p>
            <div className="flex flex-col gap-1.5">
              {resultado.indicadores_corretos.map((ind) => (
                <span key={ind} className="text-xs" style={{ color: 'var(--vespa-esmeralda)' }}>
                  ✅ {LABEL_INDICADOR[ind]}
                </span>
              ))}
              {resultado.indicadores_perdidos.map((ind) => (
                <span key={ind} className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  ❌ {LABEL_INDICADOR[ind]} (não marcou)
                </span>
              ))}
              {resultado.indicadores_erroneos.map((ind) => (
                <span key={ind} className="text-xs" style={{ color: 'var(--vespa-cobre)' }}>
                  ⚠️ {LABEL_INDICADOR[ind]} (marcou errado)
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onProxima}
          className="w-full rounded-lg py-3 text-sm font-bold tracking-[0.12em] transition-opacity hover:opacity-90"
          style={{ background: 'var(--vespa-azul-link)', color: 'var(--vespa-nevoa)' }}
        >
          PRÓXIMA MENSAGEM →
        </button>
      </div>
    </motion.div>
  )
}
