'use client'

import { motion } from 'framer-motion'
import { type ClassificacaoMensagem } from '@/types/golpe-ta-ai'

interface Opcao {
  valor: ClassificacaoMensagem
  label: string
  cor: string
}

const OPCOES: Opcao[] = [
  { valor: 'confio', label: 'CONFIO', cor: 'var(--vespa-firewall)' },
  { valor: 'suspeito', label: 'SUSPEITO', cor: '#6b5b00' },
  { valor: 'bloqueio', label: 'BLOQUEIO', cor: 'var(--vespa-cobre)' },
]

interface BotoesClassificacaoProps {
  onClassificar: (classificacao: ClassificacaoMensagem) => void
  desabilitado?: boolean
}

export function BotoesClassificacao({
  onClassificar,
  desabilitado = false,
}: BotoesClassificacaoProps) {
  return (
    <div className="flex gap-2" role="group" aria-label="Classificar mensagem">
      {OPCOES.map(({ valor, label, cor }) => (
        <motion.button
          key={valor}
          whileTap={{ scale: 0.95 }}
          onClick={() => onClassificar(valor)}
          disabled={desabilitado}
          aria-label={label}
          className="flex-1 rounded-lg py-3 text-xs font-bold tracking-[0.12em] text-white transition-opacity duration-150 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ background: cor }}
        >
          {label}
        </motion.button>
      ))}
    </div>
  )
}
