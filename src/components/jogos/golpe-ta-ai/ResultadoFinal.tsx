'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { type EstadoJogo, type OndaMensagem } from '@/types/golpe-ta-ai'
import { useSessaoStore } from '@/stores/sessaoStore'
import { salvarSessao } from '@/lib/supabase/sessoes'
import { atualizarPontuacao } from '@/lib/supabase/jogadores'

const NOMES_ONDAS: Record<OndaMensagem, string> = {
  1: 'Óbvios',
  2: 'Golpes Brasileiros',
  3: 'Direcionados',
  4: 'Ataques Pós-IA',
}

function calcularPrecisaoOnda(estado: EstadoJogo, onda: OndaMensagem): number {
  const resultadosDaOnda = estado.resultados.filter((_, i) =>
    estado.respostas[i]?.mensagem_id.startsWith(`M${onda}-`)
  )
  if (resultadosDaOnda.length === 0) return 0
  const corretos = resultadosDaOnda.filter((r) => r.correta).length
  return Math.round((corretos / resultadosDaOnda.length) * 100)
}

interface ResultadoFinalProps {
  estado: EstadoJogo
  onVoltar: () => void
}

export function ResultadoFinal({ estado, onVoltar }: ResultadoFinalProps) {
  const router = useRouter()
  const { jogador_id, atualizarPontuacao: atualizarPontuacaoStore, concluirJogo } = useSessaoStore()
  const [salvando, setSalvando] = useState(false)

  const totalMensagens = estado.respostas.length
  const corretas = estado.resultados.filter((r) => r.correta).length
  const precisaoGeral = totalMensagens > 0 ? Math.round((corretas / totalMensagens) * 100) : 0

  const precisoesPorOnda: Record<OndaMensagem, number> = {
    1: calcularPrecisaoOnda(estado, 1),
    2: calcularPrecisaoOnda(estado, 2),
    3: calcularPrecisaoOnda(estado, 3),
    4: calcularPrecisaoOnda(estado, 4),
  }

  const melhorOnda = (Object.entries(precisoesPorOnda) as [string, number][]).reduce(
    (best, cur) => (cur[1] > best[1] ? cur : best),
    ['1', -1]
  )[0] as unknown as OndaMensagem

  const piorOnda = (Object.entries(precisoesPorOnda) as [string, number][]).reduce(
    (worst, cur) => (cur[1] < worst[1] ? cur : worst),
    ['1', 101]
  )[0] as unknown as OndaMensagem

  const fraudesDetectadas = estado.resultados.filter(
    (r, i) => r.correta && estado.respostas[i]?.classificacao !== 'confio'
  ).length

  useEffect(() => {
    // Date.now() permitido em useEffect (side effect explícito)
    const duracaoSegundos = Math.round((Date.now() - estado.tempo_inicio) / 1000)

    async function salvar() {
      if (!jogador_id) return
      setSalvando(true)
      try {
        await salvarSessao({
          jogador_id,
          jogo_slug: 'golpe-ta-ai',
          pontuacao: estado.pontuacao_total,
          duracao_segundos: duracaoSegundos,
          metadata: {
            precisao_onda_1: precisoesPorOnda[1],
            precisao_onda_2: precisoesPorOnda[2],
            precisao_onda_3: precisoesPorOnda[3],
            precisao_onda_4: precisoesPorOnda[4],
            indicadores_mais_perdidos: [],
          },
        })
        await atualizarPontuacao(jogador_id, estado.pontuacao_total)
        atualizarPontuacaoStore(estado.pontuacao_total)
        concluirJogo('golpe-ta-ai')
      } catch {
        // Erro silencioso — o aluno ainda vê o resultado
      } finally {
        setSalvando(false)
      }
    }
    void salvar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleVoltar() {
    onVoltar()
    router.push('/hub')
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 py-10"
      style={{ background: 'var(--vespa-grafite)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <p
          className="mb-6 text-center text-xs font-bold tracking-[0.3em]"
          style={{ color: 'var(--vespa-esmeralda)' }}
        >
          MISSÃO CONCLUÍDA
        </p>

        {/* Pontuação em hexágono */}
        <div className="mb-8 flex flex-col items-center">
          <div
            className="flex h-28 w-28 items-center justify-center"
            style={{
              clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
              background: 'var(--vespa-esmeralda)',
            }}
            aria-label={`Pontuação: ${estado.pontuacao_total} pontos`}
          >
            <span className="text-xl font-bold" style={{ color: '#111' }}>
              {estado.pontuacao_total}
            </span>
          </div>
          <p className="mt-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            pts
          </p>
        </div>

        {/* Estatísticas */}
        <div
          className="mb-6 rounded-xl p-5"
          style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)' }}
        >
          <Stat label="Precisão geral" valor={`${precisaoGeral}%`} />
          <Stat label="Melhor categoria" valor={NOMES_ONDAS[melhorOnda]} />
          <Stat label="Atenção necessária" valor={NOMES_ONDAS[piorOnda]} />
        </div>

        {/* Texto contextual */}
        <div
          className="mb-8 rounded-xl p-4 text-sm leading-relaxed"
          style={{
            background: 'rgba(57,255,20,0.05)',
            border: '1px solid rgba(57,255,20,0.15)',
            color: 'var(--vespa-nevoa)',
          }}
        >
          Das {totalMensagens} mensagens, você detectou corretamente{' '}
          <strong>{fraudesDetectadas}</strong> tentativas de fraude.{' '}
          {totalMensagens - corretas > 0 ? (
            <>
              <strong>{totalMensagens - corretas}</strong> te enganou
              {totalMensagens - corretas > 1 ? 'ram' : ''}. No mundo real, isso teria custado
              tempo, dados ou dinheiro.
            </>
          ) : (
            'Nenhuma te enganou. Excelente!'
          )}
        </div>

        <button
          onClick={handleVoltar}
          disabled={salvando}
          className="w-full rounded-lg py-3.5 text-sm font-bold tracking-[0.15em] transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ background: 'var(--vespa-azul-link)', color: 'var(--vespa-nevoa)' }}
        >
          VOLTAR AO HUB
        </button>
      </motion.div>
    </div>
  )
}

function Stat({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        {label}
      </span>
      <span className="text-sm font-semibold" style={{ color: 'var(--vespa-nevoa)' }}>
        {valor}
      </span>
    </div>
  )
}
