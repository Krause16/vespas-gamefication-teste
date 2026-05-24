'use client'

import { Lock } from 'lucide-react'
import { type PistaOSINT } from '@/types/detetive-osint'

const FONTE_NOME: Record<string, string> = {
  rede_social_publica: 'Instagram',
  metadado_exif: 'EXIF Analyzer',
  padrao_postagem: 'TikTok',
  forum_publico: 'Discord',
  imagem_publicada: 'Busca Reversa',
}

const FONTE_COR: Record<string, string> = {
  rede_social_publica: '#a855f7',
  metadado_exif: '#0d70ce',
  padrao_postagem: '#cc3333',
  forum_publico: '#5865f2',
  imagem_publicada: '#27746e',
}

function StatusBadge({ descoberta, bloqueada }: { descoberta: boolean; bloqueada: boolean }) {
  if (bloqueada) {
    return <span className="font-mono text-[9px] uppercase tracking-[0.1em]" style={{ color: 'rgba(217,226,236,0.25)' }}>BLOQUEADO</span>
  }
  if (descoberta) {
    return <span className="font-mono text-[9px] uppercase tracking-[0.1em]" style={{ color: '#27746e' }}>EXTRAIDO</span>
  }
  return <span className="font-mono text-[9px] uppercase tracking-[0.1em]" style={{ color: 'rgba(217,226,236,0.3)' }}>NAO VISITADO</span>
}

interface FonteInvestigacaoProps {
  pista: PistaOSINT
  descoberta: boolean
  bloqueada: boolean
  ativa: boolean
  onSelecionar: () => void
}

export function FonteInvestigacao({ pista, descoberta, bloqueada, ativa, onSelecionar }: FonteInvestigacaoProps) {
  const cor = FONTE_COR[pista.fonte] ?? '#555'
  const nome = FONTE_NOME[pista.fonte] ?? pista.fonte

  return (
    <button
      onClick={onSelecionar}
      disabled={bloqueada}
      className="group flex w-full items-center gap-3 px-4 py-3 text-left transition-all disabled:cursor-not-allowed"
      aria-pressed={ativa}
      style={{
        background: ativa ? 'rgba(57,255,20,0.05)' : 'transparent',
        borderLeft: ativa ? '2px solid #39ff14' : '2px solid transparent',
        opacity: bloqueada ? 0.4 : 1,
      }}
    >
      {/* Color dot */}
      <div
        className="h-2 w-2 flex-shrink-0 rounded-full"
        style={{ background: bloqueada ? 'rgba(217,226,236,0.2)' : cor }}
        aria-hidden="true"
      />

      {/* Name */}
      <div className="min-w-0 flex-1">
        <p
          className="text-sm font-medium"
          style={{ color: ativa ? '#d9e2ec' : 'rgba(217,226,236,0.6)' }}
        >
          {nome}
        </p>
        <StatusBadge descoberta={descoberta} bloqueada={bloqueada} />
      </div>

      {/* Lock or check */}
      {bloqueada && (
        <Lock size={12} aria-hidden="true" style={{ color: 'rgba(217,226,236,0.2)', flexShrink: 0 }} />
      )}
      {descoberta && !bloqueada && (
        <span className="font-mono text-[10px]" style={{ color: '#27746e', flexShrink: 0 }}>
          ✓
        </span>
      )}
    </button>
  )
}
