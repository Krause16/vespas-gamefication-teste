'use client'

import { Logo } from '@/components/vespas/Logo'
import { VespaBackground } from '@/components/vespas/VespaBackground'
import { HexagonoJogo } from '@/components/jogos/HexagonoJogo'
import { useHubJogos } from '@/hooks/useHubJogos'

export default function HubPage() {
  const { jogos, apelido, pontuacao_total, handleJogoClick } = useHubJogos()

  return (
    <div
      className="relative flex min-h-screen flex-col"
      style={{ background: 'var(--color-bg)' }}
    >
      <VespaBackground />

      <header
        className="sticky top-0 z-20 flex items-center justify-between px-5 py-3"
        style={{
          background: 'rgba(46,46,46,0.88)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <Logo size="sm" variant="text-only" />

        <span
          className="font-mono text-xs font-bold"
          style={{ color: 'var(--color-text-secondary)' }}
          aria-label={`Jogador: ${apelido || 'Agente #1337'}`}
          suppressHydrationWarning
        >
          {apelido || 'Agente #1337'}
        </span>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center px-5 py-8">
        <h1
          className="mb-8 text-center text-xs font-bold tracking-[0.2em]"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          MISSÕES DISPONÍVEIS
        </h1>

        <div
          className="flex flex-col items-center gap-5"
          role="list"
          aria-label="Lista de jogos disponíveis"
        >
          {jogos.map((jogo, index) => (
            <div key={jogo.slug} role="listitem">
              <HexagonoJogo
                jogo={jogo}
                index={index}
                onClick={handleJogoClick}
              />
            </div>
          ))}
        </div>
      </main>

      <footer
        className="relative z-10 flex items-center justify-center px-5 py-4"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <span
          className="font-mono text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
          aria-label={`Pontuação total: ${pontuacao_total} pontos`}
          suppressHydrationWarning
        >
          {pontuacao_total} pts
        </span>
      </footer>
    </div>
  )
}
