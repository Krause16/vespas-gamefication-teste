'use client'

import { useState } from 'react'
import { useDetetiveOsintStore } from '@/stores/detetiveOsintStore'
import { TelaIntro } from './TelaIntro'
import { FormularioPerfil } from './FormularioPerfil'
import { PainelInvestigacao } from './PainelInvestigacao'
import { TelaVirada } from './TelaVirada'
import { RelatorioExposicaoAluno } from './RelatorioExposicaoAluno'
import { PainelPrivacidade } from './PainelPrivacidade'
import { ResultadoFinal } from './ResultadoFinal'

export function DetetiveOsintGame() {
  const {
    estado,
    iniciar,
    salvarPerfil,
    descobrirPista,
    avancarParaAto2,
    avancarParaAto3,
    aplicarAjuste,
    removerAjuste,
    concluir,
    resetar,
  } = useDetetiveOsintStore()

  // Sub-fluxo local dentro de ato3_defesa
  const [ato3SubFase, setAto3SubFase] = useState<'relatorio' | 'defesa'>('relatorio')

  function handleAvancarParaAto3() {
    setAto3SubFase('relatorio')
    avancarParaAto3()
  }

  switch (estado.fase) {
    case 'intro':
      return <TelaIntro onConcluir={iniciar} />

    case 'perfil':
      return <FormularioPerfil onSalvar={salvarPerfil} />

    case 'ato1':
      return (
        <PainelInvestigacao
          pistas_descobertas={estado.pistas_descobertas}
          score={estado.score_exposicao_luna}
          onDescobrir={descobrirPista}
          onConcluir={avancarParaAto2}
        />
      )

    case 'ato2_revelacao':
      if (!estado.perfil_aluno) return null
      return (
        <TelaVirada
          perfil={estado.perfil_aluno}
          onConcluir={handleAvancarParaAto3}
        />
      )

    case 'ato3_defesa': {
      if (!estado.perfil_aluno) return null

      if (ato3SubFase === 'relatorio') {
        return (
          <RelatorioExposicaoAluno
            perfil={estado.perfil_aluno}
            score={estado.score_exposicao_aluno}
            onAvancar={() => setAto3SubFase('defesa')}
          />
        )
      }

      return (
        <PainelPrivacidade
          scoreInicial={estado.score_exposicao_aluno}
          ajustes_aplicados={estado.ajustes_aplicados}
          onAplicar={aplicarAjuste}
          onRemover={removerAjuste}
          onConcluir={() => concluir(0)}
        />
      )
    }

    case 'resultado':
      return <ResultadoFinal estado={estado} onVoltar={resetar} />

    default:
      return null
  }
}
