'use client'

import { motion } from 'motion/react'
import { Mic, Image as ImageIcon, Check } from 'lucide-react'
import { type Mensagem } from '@/types/golpe-ta-ai'

interface MensagemCardProps {
  mensagem: Mensagem
}

function TextoComLink({ texto, link }: { texto: string; link?: string }) {
  if (!link) return <>{texto}</>

  const partes = texto.split(link)
  if (partes.length === 1) {
    return (
      <>
        {texto}{' '}
        <span
          className="cursor-default underline"
          style={{ color: '#0d70ce' }}
          role="link"
          aria-label={`Link: ${link}`}
        >
          {link}
        </span>
      </>
    )
  }

  return (
    <>
      {partes.map((parte, i) => (
        <span key={i}>
          {parte}
          {i < partes.length - 1 && (
            <span
              className="cursor-default underline"
              style={{ color: '#0d70ce' }}
              role="link"
              aria-label={`Link: ${link}`}
            >
              {link}
            </span>
          )}
        </span>
      ))}
    </>
  )
}

const WAVEFORM_BARS = [3, 5, 8, 6, 9, 7, 4, 8, 6, 5, 7, 9, 4, 6, 8, 5, 7, 4, 6, 9]

export function MensagemCard({ mensagem }: MensagemCardProps) {
  const { conteudo, metadados } = mensagem

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="flex justify-end"
    >
      <div
        className="relative max-w-[85%] rounded-2xl rounded-tr-sm px-3.5 py-2.5"
        style={{
          background: '#dcf8c6',
          color: '#111',
          boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
        }}
      >
        {/* Tail */}
        <div
          className="absolute right-[-6px] top-0"
          style={{
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: '0 0 8px 8px',
            borderColor: 'transparent transparent transparent #dcf8c6',
          }}
          aria-hidden="true"
        />

        {/* Image placeholder */}
        {conteudo.imagem && (
          <div
            className="mb-2 flex h-24 items-center justify-center gap-2 rounded-lg text-xs"
            style={{ background: '#b2d8b0', color: '#555' }}
            aria-label="Imagem anexada"
          >
            <ImageIcon size={18} style={{ color: '#666' }} />
            <span style={{ color: '#555' }}>imagem</span>
          </div>
        )}

        {/* Audio player */}
        {conteudo.audio ? (
          <div className="flex items-center gap-2 py-0.5" aria-label="Mensagem de áudio">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{ background: 'rgba(7,94,84,0.18)' }}
            >
              <Mic size={14} style={{ color: '#075e54' }} />
            </div>
            {/* Simulated waveform */}
            <div className="flex flex-1 items-center gap-px" aria-hidden="true">
              {WAVEFORM_BARS.map((h, i) => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 2,
                    height: h,
                    background: '#075e54',
                    opacity: 0.6,
                  }}
                />
              ))}
            </div>
            <span className="text-[10px]" style={{ color: '#555' }}>
              {conteudo.texto}
            </span>
          </div>
        ) : (
          <p className="text-sm leading-relaxed" style={{ wordBreak: 'break-word' }}>
            <TextoComLink texto={conteudo.texto} link={conteudo.link} />
          </p>
        )}

        {/* Footer: time + checks */}
        <div className="mt-0.5 flex items-center justify-end gap-0.5">
          <span className="text-[10px]" style={{ color: '#777' }}>
            {metadados.horario}
          </span>
          <Check size={12} style={{ color: '#53bdeb' }} aria-hidden="true" />
          <Check size={12} style={{ color: '#53bdeb', marginLeft: -6 }} aria-hidden="true" />
        </div>
      </div>
    </motion.div>
  )
}
