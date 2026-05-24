'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { type PerfilAlunoFicticio } from '@/types/detetive-osint'

interface TelaViradaProps {
  perfil: PerfilAlunoFicticio
  onConcluir: () => void
}

export function TelaVirada({ perfil, onConcluir }: TelaViradaProps) {
  const FRASES = [
    `Missão cumprida, ${perfil.apelido}.`,
    'Em poucos minutos, localizou a escola,',
    'o bairro, a rotina e as vulnerabilidades de Luna.',
    '',
    'Agora uma pergunta:',
  ]

  const [fraseIdx, setFraseIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [linhas, setLinhas] = useState<string[]>([])
  const [mostrarTitulo, setMostrarTitulo] = useState(false)
  const [mostrarBotao, setMostrarBotao] = useState(false)

  // Typing animation
  useEffect(() => {
    if (fraseIdx >= FRASES.length) return

    const frase = FRASES[fraseIdx]

    if (frase === '') {
      const t = setTimeout(() => {
        setLinhas((prev) => [...prev, ''])
        setFraseIdx((i) => i + 1)
        setCharIdx(0)
      }, 500)
      return () => clearTimeout(t)
    }

    if (charIdx < frase.length) {
      const t = setTimeout(() => setCharIdx((c) => c + 1), 30)
      return () => clearTimeout(t)
    }

    const t = setTimeout(() => {
      setLinhas((prev) => [...prev, frase])
      setFraseIdx((i) => i + 1)
      setCharIdx(0)
    }, 700)
    return () => clearTimeout(t)
    // FRASES is stable (derived from perfil which doesn't change)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fraseIdx, charIdx])

  // Show title after typing done
  useEffect(() => {
    if (fraseIdx < FRASES.length) return
    const t = setTimeout(() => setMostrarTitulo(true), 900)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fraseIdx])

  // Show CTA after title
  useEffect(() => {
    if (!mostrarTitulo) return
    const t = setTimeout(() => setMostrarBotao(true), 1400)
    return () => clearTimeout(t)
  }, [mostrarTitulo])

  const fraseAtual = fraseIdx < FRASES.length ? FRASES[fraseIdx] : ''
  const parcial = fraseAtual.slice(0, charIdx)

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 py-12"
      style={{ background: '#000000' }}
    >
      <div className="w-full max-w-lg">
        {/* Typed lines */}
        <div
          className="mb-10 flex flex-col gap-2 font-mono text-sm leading-relaxed"
          style={{ color: 'rgba(217,226,236,0.65)' }}
        >
          {linhas.map((linha, i) => (
            <p key={i} style={{ minHeight: '1.5rem' }}>
              {linha}
            </p>
          ))}
          {fraseIdx < FRASES.length && FRASES[fraseIdx] !== '' && (
            <p>
              {parcial}
              <motion.span
                style={{ color: '#39ff14' }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                ▌
              </motion.span>
            </p>
          )}
        </div>

        {/* The big reveal */}
        <AnimatePresence>
          {mostrarTitulo && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0, 0, 0.2, 1] }}
              className="mb-12 text-center"
            >
              <p
                className="font-display text-4xl leading-tight"
                style={{
                  color: '#39ff14',
                  letterSpacing: '-0.02em',
                  textShadow:
                    '0 0 30px rgba(57,255,20,0.8), 0 0 60px rgba(57,255,20,0.4), 0 0 100px rgba(57,255,20,0.2)',
                }}
              >
                E SE O ALVO
                <br />
                FOSSE VOCÊ?
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <AnimatePresence>
          {mostrarBotao && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
              onClick={onConcluir}
              className="w-full rounded-xl py-4 font-mono text-sm font-bold uppercase tracking-[0.25em] transition-all hover:brightness-110"
              style={{ background: '#39ff14', color: '#000000' }}
            >
              VER MEU RELATÓRIO COMPLETO →
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
