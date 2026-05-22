'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { type PerfilAlunoFicticio } from '@/types/detetive-osint'

const FRASES_REVELACAO = [
  'Você foi eficiente, Agente.',
  'Em poucos minutos, localizou a escola, o bairro,',
  'a rotina e as vulnerabilidades de Luna.',
  '',
  'Agora uma pergunta:',
]

interface TelaViradaProps {
  perfil: PerfilAlunoFicticio
  onConcluir: () => void
}

export function TelaVirada({ perfil, onConcluir }: TelaViradaProps) {
  const [etapa, setEtapa] = useState<'revelacao' | 'pergunta' | 'pronto'>('revelacao')
  const [fraseIndex, setFraseIndex] = useState(0)

  useEffect(() => {
    if (etapa !== 'revelacao') return

    if (fraseIndex < FRASES_REVELACAO.length) {
      const delay = FRASES_REVELACAO[fraseIndex] === '' ? 400 : 1200
      const timer = setTimeout(() => {
        setFraseIndex((i) => i + 1)
      }, delay)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => setEtapa('pergunta'), 800)
      return () => clearTimeout(timer)
    }
  }, [etapa, fraseIndex])

  useEffect(() => {
    if (etapa !== 'pergunta') return
    const timer = setTimeout(() => setEtapa('pronto'), 2500)
    return () => clearTimeout(timer)
  }, [etapa])

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 py-10"
      style={{ background: '#0a0a0a' }}
    >
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {etapa === 'revelacao' && (
            <motion.div
              key="revelacao"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3 font-mono text-base leading-relaxed"
              style={{ color: '#ccc' }}
            >
              {FRASES_REVELACAO.slice(0, fraseIndex).map((frase, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ minHeight: '1.5rem' }}
                >
                  {frase}
                </motion.p>
              ))}
            </motion.div>
          )}

          {etapa === 'pergunta' && (
            <motion.div
              key="pergunta"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <p
                className="font-mono text-2xl font-bold leading-tight"
                style={{ color: 'var(--vespa-cobre)' }}
              >
                E se o alvo
                <br />
                fosse você?
              </p>
            </motion.div>
          )}

          {etapa === 'pronto' && (
            <motion.div
              key="pronto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-6"
            >
              <div
                className="rounded-xl p-5"
                style={{
                  background: 'rgba(173,85,10,0.1)',
                  border: '1px solid var(--vespa-cobre)',
                }}
              >
                <p
                  className="mb-3 font-mono text-xs font-bold tracking-widest"
                  style={{ color: 'var(--vespa-cobre)' }}
                >
                  ⚠ RELATÓRIO GERADO — {perfil.apelido.toUpperCase()}
                </p>
                <div className="flex flex-col gap-2 font-mono text-sm" style={{ color: '#ccc' }}>
                  <p>
                    › Estuda no {perfil.escola_ficticia}, bairro {perfil.bairro_ficticio}
                  </p>
                  {perfil.perfil_publico && (
                    <p>› Perfil público — qualquer pessoa vê suas fotos</p>
                  )}
                  {perfil.posta_localizacao && (
                    <p>
                      › Posta com geolocalização ativa — localizável em{' '}
                      <span style={{ color: 'var(--vespa-cobre)' }}>3 cliques</span>
                    </p>
                  )}
                  {perfil.posta_fotos_escola && (
                    <p>› Fotos da escola revelam rotina e instituição</p>
                  )}
                  {perfil.melhor_amigo_online && (
                    <p>› Um amigo online sabe onde você mora</p>
                  )}
                  {!perfil.posta_localizacao && !perfil.perfil_publico && (
                    <p style={{ color: 'var(--vespa-firewall)' }}>
                      › Boas práticas detectadas — exposição reduzida
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={onConcluir}
                className="w-full rounded-xl py-3.5 font-bold tracking-[0.2em] transition-all hover:brightness-110"
                style={{
                  background: 'var(--vespa-azul-link)',
                  color: 'var(--vespa-nevoa)',
                }}
              >
                VER MEU RELATÓRIO COMPLETO →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
