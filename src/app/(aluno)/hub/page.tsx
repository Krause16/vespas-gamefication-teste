'use client'

import { motion } from 'motion/react'
import { HexGrid } from '@/components/vespas/HexGrid'
import { SectionEyebrow, StatBadge } from '@/components/vespas/DesignSystem'
import { MissionCard } from '@/components/jogos/MissionCard'
import { useHubJogos } from '@/hooks/useHubJogos'
import { useSessaoStore } from '@/stores/sessaoStore'
import { useLenis } from '@/hooks/useLenis'

export default function HubPage() {
  useLenis()
  const { jogos, apelido, pontuacao_total, handleJogoClick } = useHubJogos()
  const codigo_sala = useSessaoStore((s) => s.codigo_sala)
  const modo_solo = useSessaoStore((s) => s.modo_solo)
  const jogos_concluidos = useSessaoStore((s) => s.jogos_concluidos)

  return (
    <div className="relative flex min-h-screen flex-col" style={{ background: '#0a0a0a' }}>
      {/* Background layers */}
      <HexGrid density="medium" interactive={true} className="fixed" />
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(57,255,20,0.04), transparent 70%), radial-gradient(ellipse 40% 60% at 80% 100%, rgba(39,116,110,0.05), transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* ─── Header ──────────────────────────────────────── */}
      <header
        className="sticky top-0 z-20 flex flex-shrink-0 items-center justify-between px-6"
        style={{
          height: 64,
          background: 'rgba(10,10,10,0.88)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(57,255,20,0.08)',
        }}
      >
        <span
          className="font-display text-lg tracking-[0.15em]"
          style={{ color: '#d9e2ec', textShadow: '0 0 20px rgba(57,255,20,0.25)' }}
          aria-label="VESPAS"
        >
          VESPAS
        </span>

        <div className="flex items-center gap-3" suppressHydrationWarning>
          <div
            style={{
              width: 32,
              height: 28,
              clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
              background: 'rgba(57,255,20,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-hidden="true"
          >
            <span className="font-mono text-[9px] font-bold" style={{ color: '#39ff14' }}>
              {(apelido || 'AG')[0].toUpperCase()}
            </span>
          </div>

          <span className="font-mono text-[13px]" style={{ color: '#d9e2ec' }}>
            {apelido || 'Agente'}
          </span>

          {codigo_sala && !modo_solo && (
            <motion.span
              className="flex items-center gap-1.5"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: '#39ff14', boxShadow: '0 0 6px rgba(57,255,20,0.8)' }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                aria-hidden="true"
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: '#39ff14' }}>
                AO VIVO
              </span>
            </motion.span>
          )}

          {modo_solo && (
            <span
              className="rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em]"
              style={{
                background: 'rgba(13,112,206,0.3)',
                border: '1px solid rgba(13,112,206,0.5)',
                color: '#0d70ce',
              }}
              aria-label="Modo solo ativo"
            >
              SOLO
            </span>
          )}
        </div>
      </header>

      {/* ─── Main ────────────────────────────────────────── */}
      <main className="relative z-10 flex flex-1 flex-col items-center px-5 py-12">
        <div className="w-full max-w-4xl">
          {/* Section eyebrow */}
          <div className="mb-10">
            <SectionEyebrow index="01" title="MISSÕES" accent="ATIVAS" />
          </div>

          {/* Mission cards */}
          <div className="relative" role="list" aria-label="Missões disponíveis">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {jogos.map((jogo, index) => (
                <div key={jogo.slug} role="listitem">
                  <MissionCard jogo={jogo} index={index} onClick={handleJogoClick} />
                </div>
              ))}
            </div>

            {/* Desktop connector particles */}
            <div
              className="pointer-events-none absolute inset-0 hidden items-center lg:flex"
              aria-hidden="true"
            >
              {/* Particle sliding from card 1 → card 2 */}
              <motion.div
                className="absolute h-1.5 w-1.5 rounded-full"
                style={{
                  top: '50%',
                  translateY: '-50%',
                  background: '#39ff14',
                  boxShadow: '0 0 8px rgba(57,255,20,0.9)',
                }}
                animate={{ left: ['30%', '38%'], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: 0.8, ease: 'linear' }}
              />
              {/* Particle sliding from card 2 → card 3 */}
              <motion.div
                className="absolute h-1.5 w-1.5 rounded-full"
                style={{
                  top: '50%',
                  translateY: '-50%',
                  background: '#39ff14',
                  boxShadow: '0 0 8px rgba(57,255,20,0.9)',
                }}
                animate={{ left: ['64%', '72%'], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: 1.6, ease: 'linear' }}
              />
            </div>
          </div>
        </div>
      </main>

      {/* ─── Footer ──────────────────────────────────────── */}
      <footer
        className="relative z-10 px-5 pb-8 pt-0"
        suppressHydrationWarning
      >
        {/* Zigzag divider */}
        <svg width="100%" height="8" className="mb-5 opacity-25" aria-hidden="true">
          <path
            d="M0 4 L12 0 L24 8 L36 0 L48 8 L60 0 L72 8 L84 0 L96 8 L108 0 L120 8 L132 0 L144 8 L156 0 L168 8 L180 0 L192 8 L204 0 L216 8 L228 0 L240 8"
            stroke="rgba(57,255,20,0.5)"
            strokeWidth="1"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <StatBadge value={pontuacao_total} label="PONTUAÇÃO TOTAL" />
          <StatBadge value={jogos_concluidos.length} label="MISSÕES CONCLUÍDAS" />
          {codigo_sala && <StatBadge value={codigo_sala} label="SALA ATIVA" />}
        </div>
      </footer>
    </div>
  )
}
