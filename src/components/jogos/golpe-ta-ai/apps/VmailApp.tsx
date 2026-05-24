'use client'

import { motion } from 'motion/react'
import { ChevronLeft, Check, Star, Inbox } from 'lucide-react'
import { getMensagensPorApp } from '@/lib/jogos/golpe-ta-ai'

const MENSAGENS = getMensagensPorApp('vmail')

interface VmailAppProps {
  mensagensCompletadas: string[]
  onAbrirMensagem: (id: string) => void
  onVoltar: () => void
}

export function VmailApp({ mensagensCompletadas, onAbrirMensagem, onVoltar }: VmailAppProps) {
  return (
    <div className="flex h-full flex-col" style={{ background: '#111' }}>
      {/* Header */}
      <div style={{ background: '#1a1a1a', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3 px-3 py-3">
          <button onClick={onVoltar} aria-label="Voltar para o início" className="text-white/60 hover:text-white">
            <ChevronLeft size={22} />
          </button>
          <div className="flex flex-1 items-center gap-2">
            <span className="font-bold" style={{ color: '#ea4335', fontSize: 18 }}>V</span>
            <span className="font-bold text-white">Mail</span>
          </div>
          <Inbox size={18} className="text-white/50" aria-hidden="true" />
        </div>
        <div className="px-4 pb-2">
          <p className="text-xs font-semibold" style={{ color: 'rgba(217,226,236,0.5)' }}>
            Caixa de entrada · {MENSAGENS.length - mensagensCompletadas.filter(id => MENSAGENS.some(m => m.id === id)).length} não lidos
          </p>
        </div>
      </div>

      {/* Email list */}
      <div className="flex-1 overflow-y-auto">
        {MENSAGENS.map((mensagem, i) => {
          const feita = mensagensCompletadas.includes(mensagem.id)
          const assunto = mensagem.conteudo.assunto ?? '(sem assunto)'

          return (
            <motion.button
              key={mensagem.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.22 }}
              onClick={() => !feita && onAbrirMensagem(mensagem.id)}
              disabled={feita}
              className="flex w-full items-start gap-3 border-b px-4 py-3 text-left"
              style={{
                borderColor: 'rgba(255,255,255,0.06)',
                background: feita ? 'transparent' : 'rgba(255,255,255,0.02)',
                opacity: feita ? 0.55 : 1,
              }}
              aria-label={`E-mail de ${mensagem.remetente.nome}: ${assunto}${feita ? ' — analisado' : ''}`}
            >
              {/* Avatar */}
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: feita ? 'rgba(234,67,53,0.25)' : '#ea4335' }}
                aria-hidden="true"
              >
                {feita ? <Check size={16} /> : mensagem.remetente.nome[0].toUpperCase()}
              </div>

              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="truncate text-sm"
                    style={{ color: feita ? 'rgba(217,226,236,0.4)' : '#d9e2ec', fontWeight: feita ? 400 : 600 }}
                  >
                    {mensagem.remetente.nome}
                  </span>
                  <span className="shrink-0 text-[10px]" style={{ color: 'rgba(217,226,236,0.35)' }}>
                    {mensagem.metadados.horario}
                  </span>
                </div>
                <p
                  className="truncate text-xs"
                  style={{ color: feita ? 'rgba(217,226,236,0.35)' : 'rgba(217,226,236,0.85)', fontWeight: feita ? 400 : 500 }}
                >
                  {assunto}
                </p>
                <p className="truncate text-xs" style={{ color: 'rgba(217,226,236,0.38)' }}>
                  {mensagem.conteudo.texto.length > 50
                    ? `${mensagem.conteudo.texto.slice(0, 50)}...`
                    : mensagem.conteudo.texto}
                </p>
              </div>

              <Star size={14} className="shrink-0" style={{ color: 'rgba(217,226,236,0.2)' }} aria-hidden="true" />
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
