'use client'

import { motion } from 'motion/react'
import { ChevronLeft, Search, MoreVertical, BadgeCheck, Check } from 'lucide-react'
import { getMensagensPorApp } from '@/lib/jogos/golpe-ta-ai'

const MENSAGENS = getMensagensPorApp('vespas-msg')

interface VespasMsgAppProps {
  mensagensCompletadas: string[]
  onAbrirMensagem: (id: string) => void
  onVoltar: () => void
}

export function VespasMsgApp({ mensagensCompletadas, onAbrirMensagem, onVoltar }: VespasMsgAppProps) {
  return (
    <div className="flex h-full flex-col" style={{ background: '#0d1117' }}>
      {/* App header */}
      <div style={{ background: '#075e54' }}>
        <div className="flex items-center gap-3 px-3 py-3">
          <button onClick={onVoltar} aria-label="Voltar para o início" className="text-white/80 hover:text-white">
            <ChevronLeft size={22} />
          </button>
          <span className="flex-1 font-bold text-white">VespasMsg</span>
          <Search size={18} className="text-white/70" aria-hidden="true" />
          <MoreVertical size={18} className="text-white/70" aria-hidden="true" />
        </div>
        <div className="flex border-t border-white/10">
          <div className="flex-1 border-b-2 border-white py-2 text-center text-xs font-bold text-white">Todas</div>
          <div className="flex-1 py-2 text-center text-xs text-white/50">Não lidas</div>
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {MENSAGENS.map((mensagem, i) => {
          const feita = mensagensCompletadas.includes(mensagem.id)
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
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                style={{ background: feita ? '#2a6b37' : 'rgba(255,255,255,0.14)' }}
                aria-hidden="true"
              >
                {feita
                  ? <Check size={18} />
                  : (mensagem.remetente.avatar && !mensagem.remetente.avatar.match(/[\p{Emoji}]/u)
                      ? mensagem.remetente.avatar
                      : mensagem.remetente.nome[0].toUpperCase())}
              </div>

              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 overflow-hidden">
                    <span
                      className="truncate text-sm font-semibold"
                      style={{ color: feita ? 'rgba(217,226,236,0.45)' : '#d9e2ec' }}
                    >
                      {mensagem.remetente.nome}
                    </span>
                    {mensagem.remetente.verificado && (
                      <BadgeCheck size={12} style={{ color: '#53bdeb' }} aria-label="Verificado" />
                    )}
                  </div>
                  <span
                    className="shrink-0 text-[10px]"
                    style={{ color: feita ? 'rgba(217,226,236,0.3)' : '#39ff14' }}
                  >
                    {mensagem.metadados.horario}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs" style={{ color: 'rgba(217,226,236,0.4)' }}>
                    {mensagem.conteudo.texto.length > 48
                      ? `${mensagem.conteudo.texto.slice(0, 48)}...`
                      : mensagem.conteudo.texto}
                  </p>
                  {!feita && (
                    <div
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-black"
                      style={{ background: '#39ff14' }}
                      aria-hidden="true"
                    >
                      1
                    </div>
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
