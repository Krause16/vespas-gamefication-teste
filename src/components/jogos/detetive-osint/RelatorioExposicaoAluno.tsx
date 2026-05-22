'use client'

import { motion } from 'framer-motion'
import { type PerfilAlunoFicticio, type ScoreExposicao } from '@/types/detetive-osint'
import { BarraExposicao } from './BarraExposicao'

function corDoScore(total: number): string {
  if (total < 30) return 'var(--vespa-firewall)'
  if (total < 60) return '#e6b800'
  return 'var(--vespa-cobre)'
}

function labelDoScore(total: number): string {
  if (total < 30) return 'BAIXA EXPOSIÇÃO'
  if (total < 60) return 'EXPOSIÇÃO MODERADA'
  if (total < 80) return 'ALTA EXPOSIÇÃO'
  return 'EXPOSIÇÃO CRÍTICA'
}

interface RelatorioExposicaoAlunoProps {
  perfil: PerfilAlunoFicticio
  score: ScoreExposicao
  onAvancar: () => void
}

export function RelatorioExposicaoAluno({ perfil, score, onAvancar }: RelatorioExposicaoAlunoProps) {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-5 py-10"
      style={{ background: 'var(--vespa-grafite)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <p
          className="mb-2 text-center font-mono text-[10px] font-bold tracking-[0.3em]"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          ANÁLISE DE EXPOSIÇÃO DIGITAL
        </p>

        {/* Badge de nível */}
        <div className="mb-6 flex justify-center">
          <div
            className="rounded-full px-4 py-1.5 font-mono text-xs font-bold tracking-wider"
            style={{
              background: `${corDoScore(score.total)}22`,
              border: `1px solid ${corDoScore(score.total)}`,
              color: corDoScore(score.total),
            }}
          >
            {labelDoScore(score.total)}
          </div>
        </div>

        {/* Card principal */}
        <div
          className="mb-5 rounded-xl p-5"
          style={{
            background: 'var(--color-bg-card)',
            border: `1px solid ${corDoScore(score.total)}55`,
          }}
        >
          <p className="mb-1 text-sm font-bold" style={{ color: 'var(--vespa-nevoa)' }}>
            Agente {perfil.apelido}
          </p>
          <p className="mb-4 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {perfil.escola_ficticia} · {perfil.bairro_ficticio}
          </p>
          <BarraExposicao score={score} label="EXPOSIÇÃO POR CATEGORIA" />
        </div>

        {/* Inferências baseadas no perfil */}
        <div
          className="mb-6 rounded-xl p-4"
          style={{
            background: 'rgba(173,85,10,0.08)',
            border: '1px solid rgba(173,85,10,0.3)',
          }}
        >
          <p
            className="mb-2 text-[10px] font-bold tracking-wider"
            style={{ color: 'var(--vespa-cobre)' }}
          >
            O QUE UM INVASOR JÁ SABE
          </p>
          <ul className="flex flex-col gap-1.5">
            <Inferencia texto={`Estuda no ${perfil.escola_ficticia}`} />
            <Inferencia texto={`Mora no bairro ${perfil.bairro_ficticio}`} />
            {perfil.perfil_publico && (
              <Inferencia texto="Perfil público — fotos acessíveis a qualquer pessoa" perigo />
            )}
            {perfil.posta_localizacao && (
              <Inferencia texto="Localização em tempo real via geotagging" perigo />
            )}
            {perfil.posta_fotos_escola && (
              <Inferencia texto="Rotina escolar visível nas postagens" perigo />
            )}
            {perfil.melhor_amigo_online && (
              <Inferencia texto="Endereço conhecido por pelo menos 1 contato online" perigo />
            )}
            {!perfil.posta_localizacao && !perfil.perfil_publico && (
              <Inferencia texto="Boas práticas detectadas — risco reduzido" seguro />
            )}
          </ul>
        </div>

        <button
          onClick={onAvancar}
          className="w-full rounded-xl py-3.5 font-bold tracking-[0.2em] transition-all hover:brightness-110"
          style={{ background: 'var(--vespa-azul-link)', color: 'var(--vespa-nevoa)' }}
        >
          APRENDER A SE DEFENDER →
        </button>
      </motion.div>
    </div>
  )
}

function Inferencia({
  texto,
  perigo,
  seguro,
}: {
  texto: string
  perigo?: boolean
  seguro?: boolean
}) {
  const cor = perigo
    ? 'var(--vespa-cobre)'
    : seguro
      ? 'var(--vespa-firewall)'
      : 'var(--color-text-secondary)'
  return (
    <li className="flex items-start gap-2 text-xs" style={{ color: cor }}>
      <span className="mt-0.5 flex-shrink-0">{perigo ? '⚠' : seguro ? '✓' : '›'}</span>
      {texto}
    </li>
  )
}
