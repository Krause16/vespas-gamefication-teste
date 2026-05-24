'use client'

import { motion } from 'framer-motion'
import { type PerfilAlunoFicticio, type ScoreExposicao } from '@/types/detetive-osint'
import { BarraExposicao } from './BarraExposicao'
import { HexagonBackground } from '@/components/vespas/HexagonBackground'

interface RelatorioExposicaoAlunoProps {
  perfil: PerfilAlunoFicticio
  score: ScoreExposicao
  onAvancar: () => void
}

interface InferenciaItem {
  texto: string
  tipo: 'perigo' | 'seguro' | 'neutro'
}

function construirInferencias(perfil: PerfilAlunoFicticio): InferenciaItem[] {
  const items: InferenciaItem[] = [
    { texto: `Estuda no ${perfil.escola_ficticia}`, tipo: 'neutro' },
    { texto: `Mora no bairro ${perfil.bairro_ficticio}`, tipo: 'neutro' },
  ]
  if (perfil.perfil_publico)
    items.push({ texto: 'Perfil público — fotos acessíveis a qualquer pessoa', tipo: 'perigo' })
  if (perfil.posta_localizacao)
    items.push({ texto: 'Localização em tempo real via geotagging ativo', tipo: 'perigo' })
  if (perfil.posta_fotos_escola)
    items.push({ texto: 'Rotina escolar visível nas postagens', tipo: 'perigo' })
  if (perfil.melhor_amigo_online)
    items.push({ texto: 'Endereço conhecido por contato online', tipo: 'perigo' })
  if (!perfil.posta_localizacao && !perfil.perfil_publico)
    items.push({ texto: 'Boas práticas detectadas — risco reduzido', tipo: 'seguro' })
  return items
}

const COR_TIPO = { perigo: '#ad550a', seguro: '#27746e', neutro: 'rgba(217,226,236,0.45)' }
const ICONE_TIPO = { perigo: '!', seguro: '✓', neutro: '›' }

const BG_TIPO = {
  perigo: 'rgba(173,85,10,0.06)',
  seguro: 'rgba(39,116,110,0.06)',
  neutro: 'rgba(217,226,236,0.025)',
}
const BORDER_TIPO = {
  perigo: 'rgba(173,85,10,0.2)',
  seguro: 'rgba(39,116,110,0.18)',
  neutro: 'rgba(217,226,236,0.06)',
}

function scoreCor(total: number): string {
  if (total < 30) return '#27746e'
  if (total < 60) return '#ad550a'
  return '#cc3333'
}

function scoreLabel(total: number): string {
  if (total < 30) return 'BAIXA EXPOSIÇÃO'
  if (total < 60) return 'EXPOSIÇÃO MODERADA'
  if (total < 80) return 'ALTA EXPOSIÇÃO'
  return 'EXPOSIÇÃO CRÍTICA'
}

export function RelatorioExposicaoAluno({
  perfil,
  score,
  onAvancar,
}: RelatorioExposicaoAlunoProps) {
  const inferencias = construirInferencias(perfil)
  const cor = scoreCor(score.total)

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center px-5 py-10"
      style={{ background: '#0a0a0a' }}
    >
      <HexagonBackground opacity={0.15} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
        className="relative z-10 w-full max-w-sm"
      >
        <p
          className="mb-3 text-center font-mono text-[10px] uppercase tracking-[0.3em]"
          style={{ color: 'rgba(217,226,236,0.35)' }}
        >
          ANÁLISE DE EXPOSIÇÃO DIGITAL
        </p>

        {/* Level badge */}
        <div className="mb-5 flex justify-center">
          <div
            className="rounded-full px-4 py-1.5 font-mono text-xs font-bold tracking-wider"
            style={{
              background: `${cor}22`,
              border: `1px solid ${cor}`,
              color: cor,
            }}
          >
            {scoreLabel(score.total)}
          </div>
        </div>

        {/* Gauge card */}
        <div
          className="mb-5 rounded-2xl p-5"
          style={{
            background: 'rgba(13,13,13,0.95)',
            border: `1px solid ${cor}33`,
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
          }}
        >
          <p className="mb-0.5 text-sm font-bold" style={{ color: '#d9e2ec' }}>
            Agente {perfil.apelido}
          </p>
          <p className="mb-4 font-mono text-xs" style={{ color: 'rgba(217,226,236,0.4)' }}>
            {perfil.escola_ficticia} · {perfil.bairro_ficticio}
          </p>
          <BarraExposicao score={score} label="EXPOSIÇÃO POR CATEGORIA" />
        </div>

        {/* Inference cards (staggered) */}
        <p
          className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em]"
          style={{ color: 'rgba(217,226,236,0.3)' }}
        >
          O QUE UM INVASOR JÁ SABE
        </p>
        <div className="mb-6 flex flex-col gap-2">
          {inferencias.map((item, i) => (
            <motion.div
              key={i}
              initial={{ x: 16, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.35, delay: i * 0.15, ease: [0, 0, 0.2, 1] }}
              className="flex items-start gap-3 rounded-xl p-3"
              style={{
                background: BG_TIPO[item.tipo],
                border: `1px solid ${BORDER_TIPO[item.tipo]}`,
              }}
            >
              <span
                className="mt-0.5 flex-shrink-0 font-mono text-xs font-bold"
                style={{ color: COR_TIPO[item.tipo] }}
              >
                {ICONE_TIPO[item.tipo]}
              </span>
              <p
                className="font-mono text-xs leading-relaxed"
                style={{
                  color: item.tipo === 'neutro' ? 'rgba(217,226,236,0.6)' : '#d9e2ec',
                }}
              >
                {item.texto}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: inferencias.length * 0.15 + 0.25, duration: 0.4 }}
          onClick={onAvancar}
          className="w-full rounded-[10px] py-3.5 font-bold uppercase tracking-[0.25em] transition-all hover:brightness-110"
          style={{ background: '#0d70ce', color: '#d9e2ec', fontSize: 13 }}
        >
          APRENDER A SE DEFENDER →
        </motion.button>
      </motion.div>
    </div>
  )
}
