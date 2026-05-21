import { Logo } from '@/components/vespas/Logo'
import { VespaBackground } from '@/components/vespas/VespaBackground'

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <VespaBackground />

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        <Logo size="lg" variant="text-only" />

        <p
          className="font-body text-lg"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Plataforma em construção
        </p>

        <span
          className="font-mono text-xs"
          style={{ color: 'var(--color-text-disabled)' }}
          aria-label="Versão do projeto"
        >
          v0.0.1 — Sprint 0
        </span>
      </div>
    </main>
  )
}
