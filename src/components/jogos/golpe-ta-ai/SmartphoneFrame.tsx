'use client'

import { type ReactNode } from 'react'
import { BadgeCheck } from 'lucide-react'
import { type CanalMensagem, type Mensagem } from '@/types/golpe-ta-ai'

const COR_HEADER: Record<CanalMensagem, React.CSSProperties> = {
  whatsapp: { background: '#075e54' },
  instagram: { background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 55%, #fcb045 100%)' },
  email: { background: 'var(--vespa-cripto)' },
  sms: { background: '#3a3a3a' },
}

const BG_CORPO: Record<CanalMensagem, string> = {
  whatsapp: '#0d1117',
  instagram: '#111',
  email: '#0d0d0d',
  sms: '#111',
}

interface SmartphoneFrameProps {
  mensagem: Mensagem
  children: ReactNode
}

export function SmartphoneFrame({ mensagem, children }: SmartphoneFrameProps) {
  const { remetente, canal } = mensagem

  return (
    <div
      className="relative mx-auto w-full max-w-[340px] overflow-hidden rounded-[28px]"
      style={{
        background: '#1a1a1a',
        border: '3px solid #3a3a3a',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      }}
    >
      {/* Notch */}
      <div className="absolute left-1/2 top-2 z-10 h-1.5 w-14 -translate-x-1/2 rounded-full bg-black" />

      {/* Header do canal */}
      <div
        className="flex items-center gap-3 px-4 pb-3 pt-7"
        style={COR_HEADER[canal]}
      >
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold text-white"
          style={{ background: 'rgba(255,255,255,0.2)' }}
          aria-hidden="true"
        >
          {remetente.avatar ?? remetente.nome[0].toUpperCase()}
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center gap-1">
            <span className="truncate text-sm font-semibold text-white">
              {remetente.nome}
            </span>
            {remetente.verificado && (
              <BadgeCheck
                size={14}
                className="shrink-0 text-white"
                aria-label="Conta verificada"
              />
            )}
          </div>
          <span className="truncate text-[11px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {remetente.contato_salvo ? remetente.numero_ou_email : remetente.numero_ou_email + ' · não salvo'}
          </span>
        </div>
      </div>

      {/* Corpo da mensagem */}
      <div
        className="min-h-[160px] px-3 py-4"
        style={{ background: BG_CORPO[canal] }}
      >
        {children}
      </div>
    </div>
  )
}
