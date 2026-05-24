'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useSpring, useMotionValueEvent } from 'motion/react'
import { HexGrid } from '@/components/vespas/HexGrid'
import { TypewriterText, StatBadge, LiquidButton } from '@/components/vespas/DesignSystem'
import { type AppSlug, type EstadoJogo } from '@/types/golpe-ta-ai'
import { useSessaoStore } from '@/stores/sessaoStore'
import { salvarSessao } from '@/lib/supabase/sessoes'
import { atualizarPontuacao } from '@/lib/supabase/jogadores'

const NOMES_APPS: Record<AppSlug, string> = {
  'vespas-msg': 'VespasMsg',
  'vespasgram':  'Vespasgram',
  'vmail':       'VMail',
  'vlinked':     'VLinked',
  'vcord':       'VCord',
}

const APP_PREFIXO: Record<AppSlug, string> = {
  'vespas-msg': 'VM-',
  'vespasgram':  'VG-',
  'vmail':       'VE-',
  'vlinked':     'VL-',
  'vcord':       'VD-',
}

function calcularPrecisaoApp(estado: EstadoJogo, app: AppSlug): number {
  const prefixo = APP_PREFIXO[app]
  const resultadosDaApp = estado.resultados.filter((_, i) =>
    estado.respostas[i]?.mensagem_id.startsWith(prefixo)
  )
  if (resultadosDaApp.length === 0) return 0
  const corretos = resultadosDaApp.filter((r) => r.correta).length
  return Math.round((corretos / resultadosDaApp.length) * 100)
}

interface ResultadoFinalProps {
  estado: EstadoJogo
  onVoltar: () => void
}

export function ResultadoFinal({ estado, onVoltar }: ResultadoFinalProps) {
  const router = useRouter()
  const { jogador_id, atualizarPontuacao: atualizarPontuacaoStore, concluirJogo } = useSessaoStore()
  const [titleDone, setTitleDone] = useState(false)

  const totalMensagens = estado.respostas.length
  const corretas = estado.resultados.filter((r) => r.correta).length
  const precisaoGeral = totalMensagens > 0 ? Math.round((corretas / totalMensagens) * 100) : 0
  const fraudesDetectadas = estado.resultados.filter(
    (r, i) => r.correta && estado.respostas[i]?.classificacao !== 'confio'
  ).length

  const APPS: AppSlug[] = ['vespas-msg', 'vespasgram', 'vmail', 'vlinked', 'vcord']
  const precisoesPorApp = Object.fromEntries(
    APPS.map((app) => [app, calcularPrecisaoApp(estado, app)])
  ) as Record<AppSlug, number>

  const melhorApp = APPS.reduce<AppSlug>(
    (best, app) => precisoesPorApp[app] > precisoesPorApp[best] ? app : best,
    'vespas-msg'
  )

  const scoreSpring = useSpring(0, { stiffness: 60, damping: 15 })
  const [scoreDisplay, setScoreDisplay] = useState(0)
  useMotionValueEvent(scoreSpring, 'change', (v) => setScoreDisplay(Math.round(v)))

  useEffect(() => {
    if (titleDone) {
      const t = setTimeout(() => scoreSpring.set(estado.pontuacao_total), 300)
      return () => clearTimeout(t)
    }
  }, [titleDone, scoreSpring, estado.pontuacao_total])

  useEffect(() => {
    const duracaoSegundos = Math.round((Date.now() - estado.tempo_inicio) / 1000)
    async function salvar() {
      if (!jogador_id) return
      try {
        await salvarSessao({
          jogador_id,
          jogo_slug: 'golpe-ta-ai',
          pontuacao: estado.pontuacao_total,
          duracao_segundos: duracaoSegundos,
          metadata: {
            precisao_vespas_msg: precisoesPorApp['vespas-msg'],
            precisao_vespasgram: precisoesPorApp['vespasgram'],
            precisao_vmail:      precisoesPorApp['vmail'],
            precisao_vlinked:    precisoesPorApp['vlinked'],
            precisao_vcord:      precisoesPorApp['vcord'],
            indicadores_mais_perdidos: [],
          },
        })
        await atualizarPontuacao(jogador_id, estado.pontuacao_total)
        atualizarPontuacaoStore(estado.pontuacao_total)
        concluirJogo('golpe-ta-ai')
      } catch {
        // Erro silencioso — o aluno ainda vê o resultado
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
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-10"
      style={{ background: '#000000' }}
    >
      <HexGrid density="low" interactive={false} />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-8">
        {/* Title */}
        <div className="text-center">
          <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.35em]" style={{ color: 'rgba(57,255,20,0.5)' }}>
            MISSÃO
          </p>
          <TypewriterText
            text="OPERAÇÃO CONCLUÍDA"
            speed={50}
            color="#39ff14"
            onComplete={() => setTitleDone(true)}
            className="font-display text-2xl tracking-[-0.02em]"
          />
        </div>

        {/* Score */}
        {titleDone && (
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div
              className="flex h-28 w-28 items-center justify-center"
              style={{
                clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                background: '#39ff14',
                boxShadow: '0 0 40px rgba(57,255,20,0.4)',
              }}
              aria-label={`Pontuação: ${estado.pontuacao_total} pontos`}
            >
              <motion.span className="font-display text-2xl font-bold" style={{ color: '#0a0a0a' }}>
                {scoreDisplay}
              </motion.span>
            </div>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: 'rgba(217,226,236,0.4)' }}>
              pontos
            </p>
          </motion.div>
        )}

        {/* Stats 2×2 */}
        {titleDone && (
          <motion.div
            className="grid w-full grid-cols-2 gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatBadge value={`${precisaoGeral}%`} label="PRECISÃO GERAL" />
            <StatBadge value={fraudesDetectadas} label="FRAUDES DETECTADAS" />
            <StatBadge value={`${corretas}/${totalMensagens}`} label="ACERTOS" />
            <StatBadge value={NOMES_APPS[melhorApp]} label="MELHOR APP" />
          </motion.div>
        )}

        {/* Impact paragraph */}
        {titleDone && (
          <motion.p
            className="text-center text-sm leading-relaxed"
            style={{ color: 'rgba(217,226,236,0.55)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Das {totalMensagens} mensagens analisadas, você detectou corretamente{' '}
            <span style={{ color: '#d9e2ec', fontWeight: 600 }}>{fraudesDetectadas}</span>{' '}
            tentativas de fraude.{' '}
            {totalMensagens - corretas > 0 ? (
              <>
                <span style={{ color: '#d9e2ec', fontWeight: 600 }}>{totalMensagens - corretas}</span>{' '}
                te enganou{totalMensagens - corretas > 1 ? 'ram' : ''}.
              </>
            ) : (
              'Nenhuma te enganou.'
            )}
          </motion.p>
        )}

        {/* CTA */}
        {titleDone && (
          <motion.div
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <LiquidButton variant="primary" size="md" className="w-full" onClick={handleVoltar}>
              Voltar ao hub
            </LiquidButton>
          </motion.div>
        )}
      </div>
    </div>
  )
}
