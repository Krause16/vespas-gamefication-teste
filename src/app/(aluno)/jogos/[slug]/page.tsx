import Link from 'next/link'

interface JogoPageProps {
  params: Promise<{ slug: string }>
}

export default async function JogoPage({ params }: JogoPageProps) {
  const { slug } = await params

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-6 px-6"
      style={{ background: 'var(--color-bg)' }}
    >
      <p
        className="font-mono text-xs tracking-widest"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        MODO DE JOGO
      </p>

      <h1
        className="font-mono text-2xl font-bold tracking-widest"
        style={{ color: 'var(--vespa-esmeralda)' }}
      >
        {slug.toUpperCase().replace(/-/g, ' ')}
      </h1>

      <p
        className="text-center text-sm"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        Este jogo será implementado em um sprint futuro.
      </p>

      <Link
        href="/hub"
        className="rounded-lg px-6 py-3 text-sm font-bold tracking-wider transition-all duration-150 hover:brightness-110"
        style={{
          background: 'var(--color-bg-elevated)',
          color: 'var(--vespa-nevoa)',
          border: '1px solid var(--color-border-strong)',
        }}
      >
        ← Voltar ao Hub
      </Link>
    </div>
  )
}
