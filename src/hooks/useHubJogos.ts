'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { ConfigJogo } from '@/types/jogo'
import { useSessaoStore } from '@/stores/sessaoStore'

interface UseHubJogosReturn {
  jogos: ConfigJogo[]
  apelido: string
  pontuacao_total: number
  handleJogoClick: (jogo: ConfigJogo) => void
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
      icon: 'Shield',
    },
    {
      slug: 'detetive-osint',
      nome: 'DETETIVE OSINT',
      nivel: 2,
      cor: 'var(--vespa-cripto)',
      disponivel: jogos_concluidos.includes('golpe-ta-ai'),
      icon: 'Search',
    },
    {
      slug: 'terminal-ctf',
      nome: 'TERMINAL CTF',
      nivel: 3,
      cor: 'var(--color-bg-elevated)',
      disponivel: jogos_concluidos.includes('detetive-osint'),
      icon: 'Terminal',
    },
  ]

  function handleJogoClick(jogo: ConfigJogo): void {
    if (!jogo.disponivel) {
      toast('Complete o nível anterior primeiro', {
        description: `${jogo.nome} está bloqueado`,
        icon: '🔒',
      })
      return
    }
    router.push(`/jogos/${jogo.slug}`)
  }

  return { jogos, apelido, pontuacao_total, handleJogoClick }
}
