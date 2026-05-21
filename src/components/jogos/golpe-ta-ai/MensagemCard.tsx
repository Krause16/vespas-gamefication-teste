'use client'

import { motion } from 'framer-motion'
import { Mic, Image as ImageIcon } from 'lucide-react'
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
          style={{ color: 'var(--vespa-azul-link)' }}
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
              style={{ color: 'var(--vespa-azul-link)' }}
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

export function MensagemCard({ mensagem }: MensagemCardProps) {
  const { conteudo, metadados } = mensagem

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex justify-end"
    >
      <div
        className="relative max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-3"
        style={{ background: '#dcf8c6', color: '#111' }}
      >
        {/* Imagem simulada */}
        {conteudo.imagem && (
          <div
            className="mb-2 flex h-20 items-center justify-center gap-2 rounded-lg text-xs"
            style={{ background: '#ccc', color: '#555' }}
            aria-label="Imagem anexada"
          >
            <ImageIcon size={16} />
            <span>imagem</span>
          </div>
        )}

        {/* Áudio */}
        {conteudo.audio ? (
          <div className="flex items-center gap-3 py-1" aria-label="Mensagem de áudio">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ background: 'rgba(7,94,84,0.15)' }}
            >
              <Mic size={16} style={{ color: '#075e54' }} />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <div className="h-1 w-full rounded-full" style={{ background: '#aaa' }} />
            </div>
            <span className="text-xs" style={{ color: '#555' }}>
              {conteudo.texto}
            </span>
          </div>
        ) : (
          <p className="text-sm leading-relaxed" style={{ wordBreak: 'break-word' }}>
            <TextoComLink texto={conteudo.texto} link={conteudo.link} />
          </p>
        )}

        <p className="mt-1 text-right text-[10px]" style={{ color: '#888' }}>
          {metadados.horario}
        </p>
      </div>
    </motion.div>
  )
}
