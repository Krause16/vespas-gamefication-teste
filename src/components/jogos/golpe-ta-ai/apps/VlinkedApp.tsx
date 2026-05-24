'use client'

import { motion } from 'motion/react'
import { ChevronLeft, Check, Briefcase } from 'lucide-react'
import { getMensagensPorApp } from '@/lib/jogos/golpe-ta-ai'

const MENSAGENS = getMensagensPorApp('vlinked')

interface VlinkedAppProps {
  mensagensCompletadas: string[]
  onAbrirMensagem: (id: string) => void
  onVoltar: () => void
}

export function VlinkedApp({ mensagensCompletadas, onAbrirMensagem, onVoltar }: VlinkedAppProps) {
  return (
    <div className="flex h-full flex-col" style={{ background: '#f3f2ef' }}>
      {/* Header — LinkedIn uses light theme */}
      <div style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <div className="flex items-center gap-3 px-3 py-3">
          <button onClick={onVoltar} aria-label="Voltar para o início" className="text-blue-600 hover:text-blue-700">
            <ChevronLeft size={22} />
          </button>
          <Briefcase size={18} style={{ color: '#0a66c2' }} aria-hidden="true" />
          <span className="flex-1 font-bold" style={{ color: '#0a66c2' }}>VLinked</span>
        </div>
        <div className="px-4 pb-2">
          <p className="text-xs font-semibold" style={{ color: '#666' }}>Mensagens</p>
        </div>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto" style={{ background: '#f3f2ef' }}>
        {MENSAGENS.map((mensagem, i) => {
          const feita = mensagensCompletadas.includes(mensagem.id)
          const cargo = mensagem.remetente.cargo
          const empresa = mensagem.remetente.empresa

          return (
            <motion.button
              key={mensagem.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.22 }}
              onClick={() => !feita && onAbrirMensagem(mensagem.id)}
              disabled={feita}
              className="flex w-full items-start gap-3 border-b bg-white px-4 py-3 text-left"
              style={{ borderColor: 'rgba(0,0,0,0.06)', opacity: feita ? 0.6 : 1 }}
              aria-label={`Mensagem de ${mensagem.remetente.nome}${feita ? ' — analisada' : ' — toque para analisar'}`}
            >
              {/* Avatar */}
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                style={{ background: feita ? '#6b8f71' : '#0a66c2' }}
                aria-hidden="true"
              >
                {feita ? <Check size={18} /> : mensagem.remetente.nome[0].toUpperCase()}
              </div>

              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="truncate text-sm font-semibold"
                    style={{ color: feita ? '#999' : '#000' }}
                  >
                    {mensagem.remetente.nome}
                  </span>
                  <span className="shrink-0 text-[10px]" style={{ color: '#999' }}>
                    {mensagem.metadados.horario}
                  </span>
                </div>
                {(cargo ?? empresa) && (
                  <p className="truncate text-xs" style={{ color: '#0a66c2', opacity: feita ? 0.5 : 1 }}>
                    {[cargo, empresa].filter(Boolean).join(' @ ')}
                  </p>
                )}
                <p className="truncate text-xs" style={{ color: feita ? '#bbb' : '#666' }}>
                  {mensagem.conteudo.texto.length > 55
                    ? `${mensagem.conteudo.texto.slice(0, 55)}...`
                    : mensagem.conteudo.texto}
                </p>
                {!feita && (
                  <div className="mt-1 flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full" style={{ background: '#0a66c2' }} aria-hidden="true" />
                    <span className="text-[10px] font-semibold" style={{ color: '#0a66c2' }}>Nova mensagem</span>
                  </div>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
