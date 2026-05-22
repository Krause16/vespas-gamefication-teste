'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { type RankingEquipe } from '@/types/gincana'

type JogadorRow = {
  apelido: string
  equipe: string | null
  pontuacao_total: number
}

function toRanking(rows: JogadorRow[]): RankingEquipe[] {
  return rows.map((j, i) => ({
    posicao: i + 1,
    apelido: j.apelido,
    equipe: j.equipe,
    pontuacao_total: j.pontuacao_total,
    jogos_concluidos: 0,
  }))
}

export function useRankingRealtime(sala_id: string): {
  ranking: RankingEquipe[]
  loading: boolean
} {
  const [ranking, setRanking] = useState<RankingEquipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sala_id) return

    const supabase = createClient()
    let active = true

    const query = () =>
      supabase
        .from('jogadores')
        .select('apelido, equipe, pontuacao_total')
        .eq('sala_id', sala_id)
        .order('pontuacao_total', { ascending: false })

    // Fetch inicial — setState dentro do .then() é callback, não síncrono no body
    query().then(({ data, error }) => {
      if (!active || error || !data) return
      setRanking(toRanking(data))
      setLoading(false)
    })

    const channel = supabase
      .channel(`ranking-${sala_id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jogadores',
          filter: `sala_id=eq.${sala_id}`,
        },
        () => {
          query().then(({ data, error }) => {
            if (!active || error || !data) return
            setRanking(toRanking(data))
          })
        }
      )
      .subscribe()

    // Polling a cada 5s como fallback
    const interval = setInterval(() => {
      query().then(({ data, error }) => {
        if (!active || error || !data) return
        setRanking(toRanking(data))
      })
    }, 5000)

    return () => {
      active = false
      void supabase.removeChannel(channel)
      clearInterval(interval)
    }
  }, [sala_id])

  return { ranking, loading }
}
