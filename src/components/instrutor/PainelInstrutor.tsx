'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Users, Zap, XCircle, RefreshCw } from 'lucide-react'
import { useRankingRealtime } from '@/hooks/useRankingRealtime'
import { enviarEvento, encerrarSala } from '@/lib/supabase/eventos'
import { type Sala } from '@/lib/supabase/types'
import { Logo } from '@/components/vespas/Logo'

const JOGOS = [
  { slug: 'golpe-ta-ai', nome: 'Jogo 1 — O Golpe Tá Aí', nivel: 1 },
  { slug: 'detetive-osint', nome: 'Jogo 2 — Detetive OSINT', nivel: 2 },
  { slug: 'terminal-ctf', nome: 'Jogo 3 — Terminal CTF', nivel: 3 },
] as const

interface PainelInstrutorProps {
  sala: Sala
}

export function PainelInstrutor({ sala }: PainelInstrutorProps) {
  const { ranking, loading } = useRankingRealtime(sala.id)
  const [salaAtiva, setSalaAtiva] = useState(sala.ativa)
  const [enviando, setEnviando] = useState(false)
  const [jogoAtivo, setJogoAtivo] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  async function handleIniciarJogo(slug: string) {
    if (!salaAtiva || enviando) return
    setEnviando(true)
    setErro(null)
    try {
      await enviarEvento(sala.id, 'iniciar_jogo', { jogo_slug: slug as string })
      setJogoAtivo(slug)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao iniciar jogo')
    } finally {
      setEnviando(false)
    }
  }

  async function handleEncerrar() {
    if (!salaAtiva) return
    setErro(null)
    try {
      await encerrarSala(sala.id)
      setSalaAtiva(false)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao encerrar sala')
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--vespa-grafite)' }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between border-b px-6 py-4 lg:px-10"
        style={{
          borderColor: 'var(--color-border-subtle)',
          background: 'var(--color-bg-card)',
        }}
      >
        <Logo size="sm" variant="text-only" />

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p
              className="text-[10px] font-bold tracking-[0.2em]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              CÓDIGO DA SALA
            </p>
            <p
              className="font-mono text-2xl font-bold tracking-[0.3em]"
              style={{ color: 'var(--vespa-esmeralda)' }}
            >
              {sala.codigo}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{
                background: salaAtiva ? '#39ff14' : '#ad550a',
                boxShadow: salaAtiva ? '0 0 8px rgba(57,255,20,0.6)' : 'none',
              }}
            />
            <span className="text-sm font-medium" style={{ color: 'var(--vespa-nevoa)' }}>
              {salaAtiva ? 'Ao vivo' : 'Encerrada'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Users size={15} style={{ color: 'var(--color-text-secondary)' }} />
            <span className="text-sm font-bold" style={{ color: 'var(--vespa-nevoa)' }}>
              {ranking.length}
            </span>
          </div>
        </div>
      </header>

      {/* Corpo principal — 2 colunas no desktop */}
      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_300px] lg:p-10">

        {/* ── Ranking ao vivo ─────────────────────────── */}
        <section
          className="rounded-2xl p-6"
          style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border-subtle)',
          }}
        >
          <div className="mb-5 flex items-center justify-between">
            <h2
              className="text-xs font-bold tracking-[0.2em]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              RANKING AO VIVO
            </h2>
            {loading && (
              <RefreshCw
                size={14}
                className="animate-spin"
                style={{ color: 'var(--color-text-secondary)' }}
                aria-label="Atualizando..."
              />
            )}
          </div>

          {!loading && ranking.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Aguardando jogadores entrarem na sala...
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    {['#', 'AGENTE', 'EQUIPE', 'PTS', 'JOGOS'].map((h) => (
                      <th
                        key={h}
                        className="pb-3 pr-6 text-xs font-bold tracking-wider"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {ranking.map((jogador, i) => (
                      <motion.tr
                        key={jogador.apelido}
                        layoutId={`row-${jogador.apelido}`}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.04 }}
                        style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
                      >
                        <td className="py-3 pr-6">
                          <span
                            className="text-base font-bold"
                            style={{
                              color:
                                i === 0
                                  ? 'var(--vespa-esmeralda)'
                                  : i === 1
                                    ? '#c0c0c0'
                                    : i === 2
                                      ? '#cd7f32'
                                      : 'var(--color-text-secondary)',
                            }}
                          >
                            {jogador.posicao}
                          </span>
                        </td>
                        <td className="py-3 pr-6">
                          <span className="text-sm font-medium" style={{ color: 'var(--vespa-nevoa)' }}>
                            {jogador.apelido}
                          </span>
                        </td>
                        <td className="py-3 pr-6">
                          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                            {jogador.equipe ?? '—'}
                          </span>
                        </td>
                        <td className="py-3 pr-6">
                          <span
                            className="font-mono text-sm font-bold"
                            style={{ color: 'var(--vespa-esmeralda)' }}
                          >
                            {jogador.pontuacao_total}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            {jogador.jogos_concluidos}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ── Controles ───────────────────────────────── */}
        <aside className="flex flex-col gap-4">
          {/* Iniciar jogo */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <h2
              className="mb-4 text-xs font-bold tracking-[0.2em]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              INICIAR JOGO
            </h2>
            <div className="flex flex-col gap-2">
              {JOGOS.map((jogo) => {
                const ativo = jogoAtivo === jogo.slug
                return (
                  <button
                    key={jogo.slug}
                    onClick={() => handleIniciarJogo(jogo.slug)}
                    disabled={enviando || !salaAtiva}
                    aria-pressed={ativo}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-150 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      background: ativo
                        ? 'rgba(57,255,20,0.12)'
                        : 'var(--color-bg-elevated)',
                      border: `1px solid ${ativo ? 'var(--vespa-esmeralda)' : 'var(--color-border-strong)'}`,
                      color: 'var(--vespa-nevoa)',
                    }}
                  >
                    <Zap
                      size={13}
                      style={{ color: ativo ? 'var(--vespa-esmeralda)' : 'var(--color-text-secondary)' }}
                    />
                    {jogo.nome}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Gerenciar sala */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <h2
              className="mb-4 text-xs font-bold tracking-[0.2em]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              GERENCIAR SALA
            </h2>
            <button
              onClick={handleEncerrar}
              disabled={!salaAtiva}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold tracking-wider transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ background: 'var(--vespa-cobre)', color: 'var(--vespa-nevoa)' }}
            >
              <XCircle size={14} />
              {salaAtiva ? 'ENCERRAR SALA' : 'SALA ENCERRADA'}
            </button>
          </div>

          {/* Erro */}
          {erro && (
            <p
              className="rounded-xl px-4 py-3 text-xs"
              style={{
                background: 'rgba(173,85,10,0.15)',
                border: '1px solid var(--vespa-cobre)',
                color: 'var(--vespa-cobre)',
              }}
              role="alert"
            >
              {erro}
            </p>
          )}
        </aside>
      </div>
    </div>
  )
}
