'use client'

import { motion } from 'motion/react'
import { ChevronLeft, BadgeCheck, Check } from 'lucide-react'
import { getMensagensPorApp } from '@/lib/jogos/golpe-ta-ai'

const MENSAGENS = getMensagensPorApp('vespasgram')

interface VespasgramAppProps {
  mensagensCompletadas: string[]
  onAbrirMensagem: (id: string) => void
  onVoltar: () => void
}

export function VespasgramApp({ mensagensCompletadas, onAbrirMensagem, onVoltar }: VespasgramAppProps) {
  return (
    <div className="flex h-full flex-col" style={{ background: '#111' }}>
      {/* Header */}
      <div
        style={{ background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 55%, #fcb045 100%)' }}
      >
        <div className="flex items-center gap-3 px-3 py-3">
          <button onClick={onVoltar} aria-label="Voltar para o início" className="text-white/80 hover:text-white">
            <ChevronLeft size={22} />
          </button>
          <span className="flex-1 font-bold italic text-white">Vespasgram</span>
        </div>
        <div className="px-4 pb-2">
          <p className="text-xs font-semibold text-white/80">Mensagens diretas</p>
        </div>
      </div>

      {/* DM list */}
      <div className="flex-1 overflow-y-auto">
        {MENSAGENS.map((mensagem, i) => {
          const feita = mensagensCompletadas.includes(mensagem.id)
          const handle = mensagem.remetente.numero_ou_email
          const seguidores = mensagem.remetente.followers

          return (
            <motion.button
              key={mensagem.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.22 }}
              onClick={() => !feita && onAbrirMensagem(mensagem.id)}
              disabled={feita}
              className="flex w-full items-center gap-3 border-b px-4 py-3 text-left"
              style={{ borderColor: 'rgba(255,255,255,0.06)', opacity: feita ? 0.55 : 1 }}
              aria-label={`${mensagem.remetente.nome}${feita ? ' — analisada' : ' — toque para analisar'}`}
            >
              {/* Avatar */}
              <div
                className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                style={{ background: feita ? 'rgba(253,29,29,0.3)' : 'rgba(131,58,180,0.4)', border: '2px solid rgba(253,29,29,0.5)' }}
                aria-hidden="true"
              >
                {feita ? <Check size={18} /> : mensagem.remetente.nome[0].toUpperCase()}
              </div>

              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 overflow-hidden">
                    <span className="truncate text-sm font-semibold" style={{ color: feita ? 'rgba(217,226,236,0.4)' : '#d9e2ec' }}>
                      {mensagem.remetente.nome}
                    </span>
                    {mensagem.remetente.verificado && (
                      <BadgeCheck size={12} style={{ color: '#c8a2ca' }} aria-label="Verificado" />
                    )}
                  </div>
                  <span className="shrink-0 text-[10px]" style={{ color: 'rgba(217,226,236,0.3)' }}>
                    {mensagem.metadados.horario}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs" style={{ color: 'rgba(217,226,236,0.4)' }}>
                    {handle}{seguidores !== undefined ? ` · ${seguidores} seguidores` : ''}
                  </p>
                  {!feita && (
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: '#fd1d1d' }}
                      aria-hidden="true"
                    />
                  )}
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
