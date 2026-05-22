'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { type PerfilAlunoFicticio } from '@/types/detetive-osint'

const ESCOLAS = ['Estadual Centro', 'IFPR', 'Colégio Estadual do Paraná', 'Colégio Militar', 'CEFET']
const BAIRROS = ['Centro', 'Batel', 'Água Verde', 'Portão', 'Boa Vista', 'Cajuru', 'Xaxim', 'Sítio Cercado']

interface FormularioPerfilProps {
  onSalvar: (perfil: PerfilAlunoFicticio) => void
}

export function FormularioPerfil({ onSalvar }: FormularioPerfilProps) {
  const [apelido, setApelido] = useState('')
  const [escola, setEscola] = useState('')
  const [bairro, setBairro] = useState('')
  const [rede, setRede] = useState<PerfilAlunoFicticio['rede_favorita']>('instagram')
  const [postasEscola, setPostasEscola] = useState<boolean | null>(null)
  const [postasLocalizacao, setPostasLocalizacao] = useState<boolean | null>(null)
  const [perfilPublico, setPerfilPublico] = useState<boolean | null>(null)
  const [amigoOnline, setAmigoOnline] = useState<boolean | null>(null)

  const pronto =
    apelido.trim().length > 0 &&
    escola.length > 0 &&
    bairro.length > 0 &&
    postasEscola !== null &&
    postasLocalizacao !== null &&
    perfilPublico !== null &&
    amigoOnline !== null

  function handleSubmit() {
    if (!pronto) return
    onSalvar({
      apelido: apelido.trim(),
      escola_ficticia: escola,
      bairro_ficticio: bairro,
      rede_favorita: rede,
      posta_fotos_escola: postasEscola!,
      posta_localizacao: postasLocalizacao!,
      perfil_publico: perfilPublico!,
      melhor_amigo_online: amigoOnline!,
    })
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-5 py-10"
      style={{ background: 'var(--vespa-grafite)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Cabeçalho da ficha */}
        <div
          className="mb-6 rounded-xl p-4 text-center"
          style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--vespa-esmeralda)',
          }}
        >
          <p
            className="font-mono text-[10px] font-bold tracking-[0.3em]"
            style={{ color: 'var(--vespa-esmeralda)' }}
          >
            FICHA DE AGENTE ENCOBERTO
          </p>
          <p className="mt-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            Crie seu personagem para a missão
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Codinome */}
          <Campo label="CODINOME DO AGENTE">
            <input
              type="text"
              value={apelido}
              onChange={(e) => setApelido(e.target.value)}
              placeholder="Ex: Agente Fênix, Sombra..."
              maxLength={30}
              className="w-full rounded-lg px-4 py-3 font-mono text-sm outline-none transition-all"
              style={{
                background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-strong)',
                color: 'var(--vespa-nevoa)',
              }}
            />
          </Campo>

          {/* Escola */}
          <Campo label="ESCOLA DO PERSONAGEM">
            <select
              value={escola}
              onChange={(e) => setEscola(e.target.value)}
              className="w-full rounded-lg px-4 py-3 text-sm outline-none"
              style={{
                background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-strong)',
                color: escola ? 'var(--vespa-nevoa)' : 'var(--color-text-secondary)',
              }}
            >
              <option value="">Selecione...</option>
              {ESCOLAS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </Campo>

          {/* Bairro */}
          <Campo label="BAIRRO DO PERSONAGEM">
            <select
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              className="w-full rounded-lg px-4 py-3 text-sm outline-none"
              style={{
                background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-strong)',
                color: bairro ? 'var(--vespa-nevoa)' : 'var(--color-text-secondary)',
              }}
            >
              <option value="">Selecione...</option>
              {BAIRROS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </Campo>

          {/* Rede favorita */}
          <Campo label="REDE SOCIAL PRIMÁRIA DO PERSONAGEM">
            <div className="grid grid-cols-2 gap-2">
              {(['instagram', 'tiktok', 'twitter', 'discord'] as const).map((r) => (
                <OpcaoTag
                  key={r}
                  label={r.charAt(0).toUpperCase() + r.slice(1)}
                  selecionado={rede === r}
                  onClick={() => setRede(r)}
                />
              ))}
            </div>
          </Campo>

          {/* Perguntas sim/não */}
          <Campo label="SEU PERSONAGEM POSTA FOTOS COM LOCALIZAÇÃO ATIVA?">
            <OpcaoSimNao valor={postasLocalizacao} onChange={setPostasLocalizacao} />
          </Campo>

          <Campo label="SEU PERSONAGEM POSTA FOTOS DA ESCOLA?">
            <OpcaoSimNao valor={postasEscola} onChange={setPostasEscola} />
          </Campo>

          <Campo label="PERFIL DO PERSONAGEM É PÚBLICO?">
            <OpcaoSimNao valor={perfilPublico} onChange={setPerfilPublico} />
          </Campo>

          <Campo label="TEM UM AMIGO ONLINE QUE SABE ONDE MORA?">
            <OpcaoSimNao valor={amigoOnline} onChange={setAmigoOnline} />
          </Campo>

          <button
            onClick={handleSubmit}
            disabled={!pronto}
            className="mt-2 w-full rounded-xl py-3.5 font-bold tracking-[0.2em] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              background: 'var(--vespa-esmeralda)',
              color: '#111',
            }}
          >
            INICIAR MISSÃO
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[10px] font-bold tracking-[0.15em]"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

function OpcaoTag({
  label,
  selecionado,
  onClick,
}: {
  label: string
  selecionado: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg py-2 text-sm font-medium transition-all"
      style={{
        background: selecionado ? 'rgba(57,255,20,0.12)' : 'var(--color-bg-elevated)',
        border: `1px solid ${selecionado ? 'var(--vespa-esmeralda)' : 'var(--color-border-strong)'}`,
        color: selecionado ? 'var(--vespa-esmeralda)' : 'var(--vespa-nevoa)',
      }}
      aria-pressed={selecionado}
    >
      {label}
    </button>
  )
}

function OpcaoSimNao({
  valor,
  onChange,
}: {
  valor: boolean | null
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex gap-2">
      <OpcaoTag label="Sim" selecionado={valor === true} onClick={() => onChange(true)} />
      <OpcaoTag label="Não" selecionado={valor === false} onClick={() => onChange(false)} />
    </div>
  )
}
