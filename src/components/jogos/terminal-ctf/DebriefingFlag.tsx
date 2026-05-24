'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { type Flag } from '@/types/terminal-ctf'

const EXPLICACOES: Record<number, string> = {
  1: 'cat lê arquivos de texto. É o primeiro comando que um analista usa — entender o contexto do ambiente.',
  2: 'cd navega entre diretórios. Notas deixadas por invasores são oportunidades de inteligência.',
  3: 'Arquivos iniciados com "." são ocultos por padrão no Linux. ls -a é obrigatório numa investigação.',
  4: '/etc/passwd lista todos os usuários. Entradas suspeitas (uid 1337, home em /tmp) indicam comprometimento.',
  5: 'Credenciais hardcoded em código-fonte são uma das vulnerabilidades mais comuns. grep -r varre diretórios inteiros.',
  6: 'Base64 não é criptografia — é codificação. Qualquer pessoa pode decodificar. Não confunda com proteção.',
  7: 'find é a ferramenta mais poderosa para localizar arquivos. Investigadores e invasores usam o mesmo comando.',
}

interface DebriefingFlagProps {
  flag: Flag | null
  onFechar: () => void
}

export function DebriefingFlag({ flag, onFechar }: DebriefingFlagProps) {
  useEffect(() => {
    if (!flag) return
    const timer = setTimeout(onFechar, 6000)
    return () => clearTimeout(timer)
  }, [flag, onFechar])

  return (
    <AnimatePresence>
      {flag && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-5"
          style={{ background: 'rgba(10,10,10,0.97)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onFechar}
        >
          <motion.div
            className="flex w-full max-w-sm flex-col items-center text-center"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: [0.7, 1.05, 1.0], opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-5 font-mono text-[10px] tracking-[0.4em]" style={{ color: '#444' }}>
              FLAG {flag.numero} ENCONTRADA
            </p>

            <p
              className="mb-4 break-all font-mono font-bold"
              style={{
                fontSize: 20,
                color: '#39ff14',
                textShadow: '0 0 24px rgba(57,255,20,0.9), 0 0 48px rgba(57,255,20,0.4)',
                letterSpacing: '0.05em',
              }}
            >
              {flag.texto}
            </p>

            <p
              className="mb-8 font-mono font-bold"
              style={{ fontSize: 32, color: '#d9e2ec', letterSpacing: '0.05em' }}
            >
              +{flag.pontos} PONTOS
            </p>

            <div
              className="mb-8 w-full rounded-xl p-4 text-left"
              style={{
                background: 'rgba(57,255,20,0.04)',
                border: '1px solid rgba(57,255,20,0.12)',
              }}
            >
              <p className="mb-2 font-mono text-[10px] tracking-[0.25em]" style={{ color: '#444' }}>
                TÉCNICA
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#d9e2ec' }}>
                {EXPLICACOES[flag.numero] ?? ''}
              </p>
            </div>

            <button
              onClick={onFechar}
              className="rounded-xl px-8 py-3 font-bold tracking-[0.2em] transition-all hover:brightness-110"
              style={{
                background: '#39ff14',
                color: '#111',
                boxShadow: '0 0 20px rgba(57,255,20,0.4)',
              }}
            >
              CONTINUAR
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
