'use client'

import { WifiOff } from 'lucide-react'
import { LiquidButton } from '@/components/vespas/DesignSystem'

interface ErroConexaoProps {
  onRetry?: () => void
  mensagem?: string
}

export function ErroConexao({
  onRetry,
  mensagem = 'Falha na conexão. Verifique sua internet.',
}: ErroConexaoProps) {
  return (
    <div
      className="flex flex-col items-center gap-4 rounded-[20px] p-6 text-center"
      style={{
        background: 'rgba(13,13,13,0.85)',
        border: '1px solid rgba(173,85,10,0.25)',
        backdropFilter: 'blur(40px)',
      }}
      role="alert"
      aria-live="assertive"
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full"
        style={{ background: 'rgba(173,85,10,0.15)', border: '1px solid rgba(173,85,10,0.3)' }}
        aria-hidden="true"
      >
        <WifiOff size={22} style={{ color: '#ad550a' }} />
      </div>

      <p className="text-sm leading-relaxed" style={{ color: 'rgba(217,226,236,0.7)' }}>
        {mensagem}
      </p>

      {onRetry && (
        <LiquidButton variant="outline" size="sm" onClick={onRetry}>
          Tentar novamente
        </LiquidButton>
      )}
    </div>
  )
}
