'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HexagonBackground } from '@/components/vespas/HexagonBackground'
import { type PerfilAlunoFicticio } from '@/types/detetive-osint'

const ESCOLAS = ['Estadual Centro', 'IFPR', 'Colégio Estadual do Paraná', 'Colégio Militar', 'CEFET']
const BAIRROS = ['Centro', 'Batel', 'Água Verde', 'Portão', 'Boa Vista', 'Cajuru', 'Xaxim', 'Sítio Cercado']

interface FormularioPerfilProps {
  onSalvar: (perfil: PerfilAlunoFicticio) => void
}

const INPUT_STYLE = {
  background: '#0d0d0d',
  border: '1px solid rgba(217,226,236,0.1)',
  borderRadius: 8,
  color: '#d9e2ec',
  fontFamily: 'var(--font-mono)',
  fontSize: 14,
  padding: '12px 16px',
  width: '100%',
  outline: 'none',
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="font-mono text-[10px] uppercase tracking-[0.2em]"
        style={{ color: 'rgba(57,255,20,0.6)' }}
      >
        &gt; {label}
      </label>
      {children}
    </div>
  )
}

function ToggleSimNao({ valor, onChange }: { valor: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div className="flex gap-2">
      {[true, false].map((v) => {
        const label = v ? 'SIM' : 'NÃO'
        const ativo = valor === v
        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange(v)}
            className="flex-1 rounded-lg py-2 font-mono text-xs font-bold uppercase tracking-[0.15em] transition-all"
            style={{
              background: ativo
                ? v ? 'rgba(57,255,20,0.1)' : 'rgba(204,51,51,0.1)'
                : 'transparent',
              border: ativo
                ? v ? '1px solid rgba(57,255,20,0.4)' : '1px solid rgba(204,51,51,0.4)'
                : '1px solid rgba(217,226,236,0.12)',
              color: ativo
                ? v ? '#39ff14' : '#cc3333'
                : 'rgba(217,226,236,0.35)',
            }}
            aria-pressed={ativo}
          >
            [ {label} ]
          </button>
        )
      })}
    </div>
  )
}

function OpcaoTag({ label, selecionado, onClick }: { label: string; selecionado: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg py-2 font-mono text-xs uppercase tracking-[0.1em] transition-all"
      style={{
        background: selecionado ? 'rgba(57,255,20,0.1)' : 'transparent',
        border: selecionado ? '1px solid rgba(57,255,20,0.4)' : '1px solid rgba(217,226,236,0.12)',
        color: selecionado ? '#39ff14' : 'rgba(217,226,236,0.35)',
      }}
      aria-pressed={selecionado}
    >
      {label}
    </button>
  )
}

export function FormularioPerfil({ onSalvar }: FormularioPerfilProps) {
  const [apelido, setApelido] = useState('')
  const [escola, setEscola] = useState('')
  const [bairro, setBairro] = useState('')
  const [rede, setRede] = useState<PerfilAlunoFicticio['rede_favorita']>('instagram')
  const [postasLocalizacao, setPostasLocalizacao] = useState<boolean | null>(null)
  const [postasEscola, setPostasEscola] = useState<boolean | null>(null)
  const [perfilPublico, setPerfilPublico] = useState<boolean | null>(null)
  const [amigoOnline, setAmigoOnline] = useState<boolean | null>(null)

  const pronto =
    apelido.trim().length > 0 &&
    escola.length > 0 &&
    bairro.length > 0 &&
    postasLocalizacao !== null &&
    postasEscola !== null &&
    perfilPublico !== null &&
    amigoOnline !== null

  function handleSubmit() {
    if (!pronto) return
    onSalvar({ apelido: apelido.trim(), escola_ficticia: escola, bairro_ficticio: bairro, rede_favorita: rede, posta_localizacao: postasLocalizacao!, posta_fotos_escola: postasEscola!, perfil_publico: perfilPublico!, melhor_amigo_online: amigoOnline! })
  }

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center px-5 py-10"
      style={{ background: '#0a0a0a' }}
    >
      <HexagonBackground opacity={0.3} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
        className="relative z-10 w-full max-w-[560px]"
      >
        <div
          className="rounded-2xl p-7"
          style={{
            background: 'rgba(13,13,13,0.95)',
            border: '1px solid rgba(57,255,20,0.2)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            boxShadow: '0 0 0 1px rgba(57,255,20,0.06), 0 40px 80px rgba(0,0,0,0.8)',
          }}
        >
          {/* Header */}
          <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: 'rgba(57,255,20,0.6)' }}>
            [ PROTOCOLO DE IDENTIFICAÇÃO ]
          </p>
          <h1 className="mb-1 text-center font-display text-3xl" style={{ color: '#d9e2ec' }}>
            CRIAÇÃO DE AGENTE
          </h1>
          <p className="mb-6 text-center text-sm" style={{ color: 'rgba(217,226,236,0.45)' }}>
            Configure seu perfil operacional antes de iniciar a missão
          </p>
          <div className="mb-6 h-px" style={{ background: 'rgba(57,255,20,0.1)' }} />

          {/* Fields */}
          <div className="flex flex-col gap-5">
            <Campo label="CODINOME DO AGENTE">
              <input
                type="text"
                value={apelido}
                onChange={(e) => setApelido(e.target.value)}
                placeholder="Ex: Agente Fênix"
                maxLength={30}
                style={{ ...INPUT_STYLE }}
                className="focus:border-[rgba(57,255,20,0.4)] focus:shadow-[0_0_0_3px_rgba(57,255,20,0.08)]"
              />
            </Campo>

            <Campo label="ESCOLA DO PERSONAGEM">
              <select
                value={escola}
                onChange={(e) => setEscola(e.target.value)}
                style={{ ...INPUT_STYLE, color: escola ? '#d9e2ec' : 'rgba(217,226,236,0.25)' }}
              >
                <option value="">Selecione...</option>
                {ESCOLAS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </Campo>

            <Campo label="BAIRRO DO PERSONAGEM">
              <select
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                style={{ ...INPUT_STYLE, color: bairro ? '#d9e2ec' : 'rgba(217,226,236,0.25)' }}
              >
                <option value="">Selecione...</option>
                {BAIRROS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </Campo>

            <Campo label="REDE SOCIAL PRIMÁRIA">
              <div className="grid grid-cols-4 gap-2">
                {(['instagram', 'tiktok', 'twitter', 'discord'] as const).map((r) => (
                  <OpcaoTag key={r} label={r} selecionado={rede === r} onClick={() => setRede(r)} />
                ))}
              </div>
            </Campo>

            <Campo label="POSTA COM GEOLOCALIZAÇÃO ATIVA?">
              <ToggleSimNao valor={postasLocalizacao} onChange={setPostasLocalizacao} />
            </Campo>

            <Campo label="POSTA FOTOS DA ESCOLA?">
              <ToggleSimNao valor={postasEscola} onChange={setPostasEscola} />
            </Campo>

            <Campo label="PERFIL PÚBLICO?">
              <ToggleSimNao valor={perfilPublico} onChange={setPerfilPublico} />
            </Campo>

            <Campo label="AMIGO ONLINE SABE ONDE MORA?">
              <ToggleSimNao valor={amigoOnline} onChange={setAmigoOnline} />
            </Campo>

            <AnimatePresence>
              {pronto && (
                <motion.button
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleSubmit}
                  className="mt-2 w-full rounded-[10px] py-4 font-bold uppercase tracking-[0.25em] transition-all hover:brightness-110"
                  style={{ background: '#39ff14', color: '#0a0a0a', fontSize: 13 }}
                >
                  INICIAR MISSÃO
                </motion.button>
              )}
            </AnimatePresence>

            {!pronto && (
              <button
                disabled
                className="mt-2 w-full rounded-[10px] py-4 font-bold uppercase tracking-[0.25em]"
                style={{ background: '#39ff14', color: '#0a0a0a', fontSize: 13, opacity: 0.3 }}
              >
                INICIAR MISSÃO
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
