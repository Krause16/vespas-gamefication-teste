'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { ConfigJogo } from '@/types/jogo'
import { useSessaoStore } from '@/stores/sessaoStore'

interface UseHubJogosReturn {
  jogos: ConfigJogo[]
  apelido: string
  pontuacao_total: number
  handleJogoClick: (slug: string) => void
}

export function useHubJogos(): UseHubJogosReturn {
  const router = useRouter()
  const apelido = useSessaoStore((state) => state.apelido)
  const pontuacao_total = useSessaoStore((state) => state.pontuacao_total)
  const jogos_concluidos = useSessaoStore((state) => state.jogos_concluidos)
  const jogos: ConfigJogo[] = [
    {
      slug: 'golpe-ta-ai',
      nome: 'O GOLPE TÁ AÍ',
      nivel: 1,
      cor: 'var(--vespa-firewall)',
      disponivel: true,
      concluido: jogos_concluidos.includes('golpe-ta-ai'),
      icon: 'Shield',
    },
    {
      slug: 'detetive-osint',
      nome: 'DETETIVE OSINT',
      nivel: 2,
      cor: 'var(--vespa-cripto)',
      disponivel: true,
      concluido: jogos_concluidos.includes('detetive-osint'),
      icon: 'Search',
    },
    {
      slug: 'terminal-ctf',
      nome: 'TERMINAL CTF',
      nivel: 3,
      cor: 'var(--color-bg-elevated)',
      disponivel: true,
      concluido: jogos_concluidos.includes('terminal-ctf'),
      icon: 'Terminal',
    },
  ]

  function handleJogoClick(slug: string): void {
    const jogo = jogos.find((j) => j.slug === slug)
    if (!jogo || !jogo.disponivel) {
      toast('Complete o nível anterior primeiro', {
        description: `${jogo?.nome ?? slug} está bloqueado`,
        icon: '🔒',
      })
      return
    }
    router.push(`/jogos/${slug}`)
  }

  return { jogos, apelido, pontuacao_total, handleJogoClick }
}
