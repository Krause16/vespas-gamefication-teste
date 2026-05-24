'use client'

import dynamic from 'next/dynamic'
import Loading from '@/app/loading'

const GolpeTaAiGame = dynamic(
  () => import('./golpe-ta-ai/GolpeTaAiGame').then((m) => ({ default: m.GolpeTaAiGame })),
  { ssr: false, loading: () => <Loading /> }
)

const DetetiveOsintGame = dynamic(
  () => import('./detetive-osint/DetetiveOsintGame').then((m) => ({ default: m.DetetiveOsintGame })),
  { ssr: false, loading: () => <Loading /> }
)

const TerminalCTFGame = dynamic(
  () => import('./terminal-ctf/TerminalCTFGame').then((m) => ({ default: m.TerminalCTFGame })),
  { ssr: false, loading: () => <Loading /> }
)

interface JogoLoaderProps {
  slug: string
}

export function JogoLoader({ slug }: JogoLoaderProps) {
  if (slug === 'golpe-ta-ai') return <GolpeTaAiGame />
  if (slug === 'detetive-osint') return <DetetiveOsintGame />
  if (slug === 'terminal-ctf') return <TerminalCTFGame />
  return null
}
