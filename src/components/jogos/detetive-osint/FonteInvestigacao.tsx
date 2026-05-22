'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Lock, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { type PistaOSINT } from '@/types/detetive-osint'

const ICONE_FONTE: Record<string, string> = {
  rede_social_publica: '📷',
  metadado_exif: '📍',
  padrao_postagem: '🎵',
  geotagging: '🗺️',
  conexao_social: '🔗',
  forum_publico: '💬',
  imagem_publicada: '🔍',
}

interface FonteInvestigacaoProps {
  pista: PistaOSINT
  descoberta: boolean
  bloqueada: boolean
  onDescobrir: () => void
}

export function FonteInvestigacao({
  pista,
  descoberta,
  bloqueada,
  onDescobrir,
}: FonteInvestigacaoProps) {
  const [expandida, setExpandida] = useState(false)

  function handleClick() {
    if (bloqueada) return
    if (!descoberta) {
      onDescobrir()
      setExpandida(true)
    } else {
      setExpandida((v) => !v)
    }
  }

  return (
    <div
      className="overflow-hidden rounded-xl transition-all"
      style={{
        background: descoberta
          ? 'rgba(57,255,20,0.05)'
          : 'var(--color-bg-elevated)',
        border: `1px solid ${
          descoberta
            ? 'rgba(57,255,20,0.3)'
            : bloqueada
              ? 'var(--color-border-subtle)'
              : 'var(--color-border-strong)'
        }`,
        opacity: bloqueada ? 0.5 : 1,
      }}
    >
      <button
        onClick={handleClick}
        disabled={bloqueada}
        className="flex w-full items-center gap-3 px-4 py-3 text-left disabled:cursor-not-allowed"
        aria-expanded={expandida}
      >
        <span className="text-xl" aria-hidden="true">
          {ICONE_FONTE[pista.fonte]}
        </span>

        <div className="flex-1">
          <p className="text-sm font-medium" style={{ color: 'var(--vespa-nevoa)' }}>
            {pista.dado_revelado.split('—')[0].split(',')[0].trim()}
          </p>
          {descoberta && (
            <p className="text-xs" style={{ color: 'var(--vespa-esmeralda)' }}>
              +{pista.pontos} pts — {pista.dado_revelado}
            </p>
          )}
          {bloqueada && (
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Requer pista anterior
            </p>
          )}
        </div>

        {bloqueada ? (
          <Lock size={14} style={{ color: 'var(--color-text-secondary)' }} />
        ) : descoberta ? (
          <div className="flex items-center gap-2">
            <CheckCircle size={14} style={{ color: 'var(--vespa-esmeralda)' }} />
            {expandida ? (
              <ChevronUp size={14} style={{ color: 'var(--color-text-secondary)' }} />
            ) : (
              <ChevronDown size={14} style={{ color: 'var(--color-text-secondary)' }} />
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <Search size={13} style={{ color: 'var(--vespa-azul-link)' }} />
            <span className="text-xs font-bold" style={{ color: 'var(--vespa-azul-link)' }}>
              INVESTIGAR
            </span>
          </div>
        )}
      </button>

      <AnimatePresence>
        {expandida && descoberta && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="border-t px-4 py-3"
              style={{ borderColor: 'rgba(57,255,20,0.2)' }}
            >
              <pre
                className="whitespace-pre-wrap font-mono text-xs leading-relaxed"
                style={{ color: 'var(--vespa-nevoa)' }}
              >
                {pista.conteudo}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
