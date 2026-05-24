'use client'

import { motion } from 'motion/react'
import { ChevronLeft, Check, Hash } from 'lucide-react'
import { getMensagensPorApp } from '@/lib/jogos/golpe-ta-ai'

const MENSAGENS = getMensagensPorApp('vcord')

interface VcordAppProps {
  mensagensCompletadas: string[]
  onAbrirMensagem: (id: string) => void
  onVoltar: () => void
}

export function VcordApp({ mensagensCompletadas, onAbrirMensagem, onVoltar }: VcordAppProps) {
  return (
    <div className="flex h-full" style={{ background: '#313338' }}>
      {/* Sidebar */}
      <div
        className="flex w-16 shrink-0 flex-col items-center gap-3 py-3"
        style={{ background: '#1e1f22' }}
        aria-label="Servidores"
      >
        <button onClick={onVoltar} aria-label="Voltar para o início">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-[16px] transition-all hover:rounded-[12px]"
            style={{ background: '#5865f2' }}
          >
            <ChevronLeft size={20} className="text-white" />
          </div>
        </button>
        <div className="h-px w-8" style={{ background: 'rgba(255,255,255,0.1)' }} aria-hidden="true" />
        <div
          className="flex h-12 w-12 items-center justify-center rounded-[16px]"
          style={{ background: '#23a559' }}
          aria-hidden="true"
        >
          <Hash size={20} className="text-white" />
        </div>
      </div>

      {/* DM list */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div
          className="shrink-0 px-3 py-3"
          style={{ background: '#2b2d31', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(217,226,236,0.4)' }}>
            Mensagens Diretas
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {MENSAGENS.map((mensagem, i) => {
            const feita = mensagensCompletadas.includes(mensagem.id)
            const discriminator = mensagem.remetente.discriminator ?? ''
            const cargo = mensagem.remetente.cargo_servidor

            return (
              <motion.button
                key={mensagem.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.22 }}
                onClick={() => !feita && onAbrirMensagem(mensagem.id)}
                disabled={feita}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left"
                style={{ opacity: feita ? 0.55 : 1, margin: '2px 4px', width: 'calc(100% - 8px)' }}
                aria-label={`${mensagem.remetente.nome}${discriminator}${feita ? ' — analisada' : ' — toque para analisar'}`}
              >
                {/* Avatar */}
                <div
                  className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: feita ? '#444' : '#5865f2' }}
                  aria-hidden="true"
                >
                  {feita ? <Check size={16} /> : mensagem.remetente.nome[0].toUpperCase()}
                  {!feita && (
                    <div
                      className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2"
                      style={{ background: '#23a559', borderColor: '#2b2d31' }}
                      aria-hidden="true"
                    />
                  )}
                </div>

                <div className="flex flex-1 flex-col overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="truncate text-sm font-semibold"
                      style={{ color: feita ? 'rgba(217,226,236,0.4)' : '#d9e2ec' }}
                    >
                      {mensagem.remetente.nome}
                    </span>
                    {cargo && (
                      <span
                        className="shrink-0 rounded px-1 py-0.5 text-[9px] font-bold uppercase"
                        style={{ background: cargo === 'BOT' ? 'rgba(88,101,242,0.3)' : 'rgba(35,165,89,0.25)', color: cargo === 'BOT' ? '#7289da' : '#23a559' }}
                        aria-label={`Cargo: ${cargo}`}
                      >
                        {cargo}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs" style={{ color: 'rgba(217,226,236,0.4)' }}>
                    {mensagem.conteudo.texto.length > 45
                      ? `${mensagem.conteudo.texto.slice(0, 45)}...`
                      : mensagem.conteudo.texto}
                  </p>
                </div>

                {!feita && (
                  <div
                    className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
                    style={{ background: '#ed4245' }}
                    aria-hidden="true"
                  >
                    1
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
