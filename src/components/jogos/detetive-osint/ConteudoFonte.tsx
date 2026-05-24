'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { type PistaOSINT } from '@/types/detetive-osint'

interface ConteudoFonteProps {
  pista: PistaOSINT
  descoberta: boolean
  onExtrair: () => void
}

interface SimuladorProps {
  descoberta: boolean
  onExtrair: () => void
}

function BotaoExtrair({ onClick, ja }: { onClick: () => void; ja: boolean }) {
  if (ja) return (
    <div className="mt-4 flex items-center gap-2 font-mono text-xs" style={{ color: '#27746e' }}>
      <span>✓</span> PISTA EXTRAÍDA
    </div>
  )
  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="mt-4 rounded-lg px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em] transition-all hover:brightness-110"
      style={{ background: 'rgba(57,255,20,0.1)', border: '1px solid rgba(57,255,20,0.35)', color: '#39ff14' }}
    >
      EXTRAIR PISTA →
    </motion.button>
  )
}

function SimuladorInstagram({ descoberta, onExtrair }: SimuladorProps) {
  const [fotoExpandida, setFotoExpandida] = useState(false)

  return (
    <div className="flex flex-col items-center">
      {/* App header */}
      <div className="mb-4 flex w-full max-w-xs items-center justify-between rounded-t-2xl px-4 py-3" style={{ background: '#1a1a2e', border: '1px solid rgba(168,85,247,0.2)', borderBottom: 'none' }}>
        <span className="font-bold italic" style={{ color: '#a855f7', fontSize: 18 }}>Instagram</span>
        <span className="font-mono text-[10px]" style={{ color: 'rgba(217,226,236,0.4)' }}>@luna_estudante</span>
      </div>

      <div className="w-full max-w-xs rounded-b-2xl" style={{ background: '#111', border: '1px solid rgba(168,85,247,0.2)' }}>
        {/* Profile */}
        <div className="flex items-center gap-3 p-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full" style={{ background: 'rgba(168,85,247,0.2)', border: '2px solid #a855f7' }}>
            <span className="font-bold text-lg" style={{ color: '#a855f7' }}>L</span>
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: '#d9e2ec' }}>luna_estudante</p>
            <p className="text-xs" style={{ color: 'rgba(217,226,236,0.5)' }}>16 anos | Curitiba | amo fotografia</p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-px p-1">
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              className="relative aspect-square"
              style={{ background: 'rgba(217,226,236,0.05)' }}
            >
              {i === 2 && (
                <button
                  onClick={() => setFotoExpandida(true)}
                  className="absolute inset-0 flex items-center justify-center transition-opacity hover:opacity-80"
                  style={{ background: 'rgba(217,226,236,0.06)' }}
                  aria-label="Ver foto com localização"
                >
                  <span className="text-xl">📍</span>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Expanded metadata */}
        <AnimatePresence>
          {fotoExpandida && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="overflow-hidden"
            >
              <div className="border-t p-4" style={{ borderColor: 'rgba(168,85,247,0.2)' }}>
                <p className="mb-2 font-mono text-[9px] uppercase tracking-wider" style={{ color: '#a855f7' }}>METADADOS DA FOTO</p>
                <div className="font-mono text-xs space-y-1" style={{ color: '#d9e2ec' }}>
                  <p>Local: <span style={{ color: '#39ff14' }}>Shopping Mueller</span></p>
                  <p>Escola: <span style={{ color: '#ad550a' }}>uniforme identificado</span></p>
                  <p>Perfil: <span style={{ color: '#cc3333' }}>PÚBLICO</span></p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {fotoExpandida && <BotaoExtrair onClick={onExtrair} ja={descoberta} />}
    </div>
  )
}

function SimuladorExif({ descoberta, onExtrair }: SimuladorProps) {
  const [estado, setEstado] = useState<'idle' | 'scanning' | 'done'>('idle')
  const [progresso, setProgresso] = useState(0)

  function analisar() {
    setEstado('scanning')
    let p = 0
    const iv = setInterval(() => {
      p += Math.random() * 15
      if (p >= 100) { p = 100; clearInterval(iv); setTimeout(() => setEstado('done'), 300) }
      setProgresso(Math.min(100, p))
    }, 80)
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-xl" style={{ background: '#0d0d0d', border: '1px solid rgba(13,112,206,0.25)' }}>
        <div className="border-b px-4 py-3" style={{ borderColor: 'rgba(13,112,206,0.15)' }}>
          <p className="font-mono text-xs font-bold" style={{ color: '#0d70ce' }}>ANALISADOR DE METADADOS EXIF v2.1</p>
        </div>

        <div className="p-4">
          {estado === 'idle' && (
            <div className="flex flex-col items-center gap-4">
              <div className="flex w-full items-center justify-center rounded-lg py-8" style={{ border: '2px dashed rgba(13,112,206,0.3)' }}>
                <div className="text-center">
                  <p className="font-mono text-xs" style={{ color: 'rgba(217,226,236,0.4)' }}>foto_perfil_luna.jpg</p>
                  <p className="mt-1 font-mono text-[10px]" style={{ color: 'rgba(217,226,236,0.25)' }}>iPhone 13 · 2.4MB</p>
                </div>
              </div>
              <button onClick={analisar} className="w-full rounded-lg py-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em] transition-all hover:brightness-110" style={{ background: 'rgba(13,112,206,0.15)', border: '1px solid rgba(13,112,206,0.4)', color: '#0d70ce' }}>
                ANALISAR IMAGEM
              </button>
            </div>
          )}

          {estado === 'scanning' && (
            <div className="flex flex-col gap-2">
              <p className="font-mono text-xs" style={{ color: 'rgba(217,226,236,0.6)' }}>Extraindo metadados...</p>
              <div className="h-1.5 overflow-hidden rounded-full" style={{ background: 'rgba(217,226,236,0.05)' }}>
                <motion.div className="h-full rounded-full" style={{ background: '#39ff14', width: `${progresso}%` }} />
              </div>
            </div>
          )}

          {estado === 'done' && (
            <div className="flex flex-col gap-3">
              <div className="overflow-hidden rounded-lg font-mono text-xs" style={{ border: '1px solid rgba(13,112,206,0.2)' }}>
                {[['MAKE', 'Apple Inc.'], ['MODEL', 'iPhone 13'], ['DATE_TIME', '2025:03:15 14:32:07'], ['GPS_LAT', '-25.4297° S'], ['GPS_LON', '-49.2711° O'], ['GPS_ALT', '924m']].map(([k, v]) => {
                  const isGps = k.startsWith('GPS')
                  return (
                    <div key={k} className="flex gap-0 border-b last:border-0" style={{ borderColor: 'rgba(13,112,206,0.1)' }}>
                      <span className="w-28 flex-shrink-0 bg-[rgba(13,112,206,0.06)] px-3 py-2 text-[10px]" style={{ color: 'rgba(217,226,236,0.5)' }}>{k}</span>
                      <span className="px-3 py-2 text-[10px]" style={{ color: isGps ? '#cc3333' : '#d9e2ec' }}>{v}</span>
                    </div>
                  )
                })}
              </div>
              <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'rgba(204,51,51,0.08)', border: '1px solid rgba(204,51,51,0.3)' }}>
                <span style={{ color: '#cc3333', fontSize: 12 }}>⚠</span>
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider" style={{ color: '#cc3333' }}>COORDENADAS GPS DETECTADAS — BAIRRO BATEL</p>
              </div>
              <BotaoExtrair onClick={onExtrair} ja={descoberta} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SimuladorTikTok({ descoberta, onExtrair }: SimuladorProps) {
  const [videoAberto, setVideoAberto] = useState<number | null>(null)
  const videos = [
    { titulo: 'minha rotina diaria', views: '2.3k', conteudo: 'acordo 6h • colégio às 7h • volto 12h30 • ginástica terça e quinta às 18h' },
    { titulo: 'fazendo dever', views: '891', conteudo: null },
  ]

  return (
    <div className="w-full max-w-xs">
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(204,51,51,0.2)' }}>
        <div className="flex items-center gap-2 px-4 py-3" style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(204,51,51,0.15)' }}>
          <span className="font-bold" style={{ color: '#cc3333', fontSize: 14 }}>TikTok</span>
          <span className="font-mono text-[10px]" style={{ color: 'rgba(217,226,236,0.4)' }}>@luna.fotos</span>
        </div>
        <div style={{ background: '#111' }}>
          {videos.map((v, i) => (
            <div key={i}>
              <button
                onClick={() => setVideoAberto(videoAberto === i ? null : i)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-opacity hover:opacity-80"
                style={{ borderBottom: '1px solid rgba(217,226,236,0.06)' }}
              >
                <div className="flex h-14 w-10 flex-shrink-0 items-center justify-center rounded" style={{ background: 'rgba(204,51,51,0.15)' }}>
                  <span className="text-xs" style={{ color: '#cc3333' }}>▶</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm" style={{ color: '#d9e2ec' }}>{v.titulo}</p>
                  <p className="font-mono text-[10px]" style={{ color: 'rgba(217,226,236,0.4)' }}>{v.views} views</p>
                </div>
              </button>
              <AnimatePresence>
                {videoAberto === i && v.conteudo && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <div className="px-4 py-3" style={{ background: 'rgba(204,51,51,0.06)' }}>
                      <p className="mb-1 font-mono text-[9px] uppercase tracking-wider" style={{ color: '#cc3333' }}>ROTINA IDENTIFICADA</p>
                      <p className="font-mono text-xs leading-relaxed" style={{ color: '#d9e2ec' }}>{v.conteudo}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
      {videoAberto === 0 && <BotaoExtrair onClick={onExtrair} ja={descoberta} />}
    </div>
  )
}

function SimuladorDiscord({ descoberta, onExtrair }: SimuladorProps) {
  const msgs = [
    { user: 'luna_estudante', text: 'alguém vai à Feira do Largo no domingo?', destaque: false },
    { user: 'luna_estudante', text: 'to com nota baixa em mat, to em pânico', destaque: true },
    { user: 'luna_estudante', text: 'minha mãe não deixa eu ir sozinha pra foto-rua', destaque: true },
  ]

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(88,101,242,0.25)' }}>
        <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: '#1e1f2e', borderBottom: '1px solid rgba(88,101,242,0.15)' }}>
          <span className="font-bold" style={{ color: '#5865f2', fontSize: 14 }}>Discord</span>
          <span className="font-mono text-[10px]" style={{ color: 'rgba(217,226,236,0.4)' }}>#fotografia-curitiba</span>
        </div>
        <div className="flex flex-col gap-1 p-3" style={{ background: '#1a1b26' }}>
          {msgs.map((m, i) => (
            <div key={i} className="rounded px-3 py-2" style={{ background: m.destaque ? 'rgba(88,101,242,0.08)' : 'transparent', borderLeft: m.destaque ? '2px solid rgba(173,85,10,0.6)' : '2px solid transparent' }}>
              <span className="mr-2 font-mono text-[10px] font-bold" style={{ color: '#5865f2' }}>{m.user}</span>
              <span className="text-xs" style={{ color: m.destaque ? '#d9e2ec' : 'rgba(217,226,236,0.6)', textDecoration: m.destaque ? 'underline rgba(173,85,10,0.5)' : 'none' }}>{m.text}</span>
            </div>
          ))}
        </div>
      </div>
      <BotaoExtrair onClick={onExtrair} ja={descoberta} />
    </div>
  )
}

function SimuladorBuscaReversa({ descoberta, onExtrair }: SimuladorProps) {
  const [estado, setEstado] = useState<'idle' | 'searching' | 'done'>('idle')

  function buscar() {
    setEstado('searching')
    setTimeout(() => setEstado('done'), 1800)
  }

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-xl" style={{ background: '#0d0d0d', border: '1px solid rgba(39,116,110,0.25)' }}>
        <div className="border-b px-4 py-3" style={{ borderColor: 'rgba(39,116,110,0.15)' }}>
          <p className="font-mono text-xs font-bold" style={{ color: '#27746e' }}>BUSCA POR IMAGEM</p>
        </div>
        <div className="flex flex-col items-center gap-4 p-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full" style={{ background: 'rgba(39,116,110,0.12)', border: '2px solid rgba(39,116,110,0.3)' }}>
            <span className="font-bold text-2xl" style={{ color: '#27746e' }}>L</span>
          </div>
          <p className="font-mono text-[10px]" style={{ color: 'rgba(217,226,236,0.4)' }}>foto_perfil_luna.jpg</p>

          {estado === 'idle' && (
            <button onClick={buscar} className="w-full rounded-lg py-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em] transition-all hover:brightness-110" style={{ background: 'rgba(39,116,110,0.15)', border: '1px solid rgba(39,116,110,0.4)', color: '#27746e' }}>
              BUSCAR
            </button>
          )}

          {estado === 'searching' && (
            <div className="flex w-full flex-col gap-2">
              <p className="text-center font-mono text-xs" style={{ color: 'rgba(217,226,236,0.5)' }}>Processando...</p>
              <motion.div className="h-1 rounded-full" style={{ background: '#27746e' }} initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.6 }} />
            </div>
          )}

          {estado === 'done' && (
            <div className="w-full rounded-lg p-3" style={{ background: 'rgba(39,116,110,0.06)', border: '1px solid rgba(39,116,110,0.25)' }}>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-wider" style={{ color: '#27746e' }}>CORRESPONDÊNCIA ENCONTRADA</p>
              <p className="text-sm font-bold" style={{ color: '#d9e2ec' }}>Luna Ferreira Santos</p>
              <p className="font-mono text-[10px]" style={{ color: 'rgba(217,226,236,0.5)' }}>2º ano A — projeto de fotografia</p>
            </div>
          )}
        </div>
      </div>
      {estado === 'done' && <BotaoExtrair onClick={onExtrair} ja={descoberta} />}
    </div>
  )
}

export function ConteudoFonte({ pista, descoberta, onExtrair }: ConteudoFonteProps) {
  const sp: SimuladorProps = { descoberta, onExtrair }
  const sim = {
    rede_social_publica: <SimuladorInstagram {...sp} />,
    metadado_exif: <SimuladorExif {...sp} />,
    padrao_postagem: <SimuladorTikTok {...sp} />,
    forum_publico: <SimuladorDiscord {...sp} />,
    imagem_publicada: <SimuladorBuscaReversa {...sp} />,
  }

  return (
    <div className="flex h-full flex-col items-center justify-center p-6">
      {sim[pista.fonte as keyof typeof sim] ?? (
        <p className="font-mono text-xs" style={{ color: 'rgba(217,226,236,0.3)' }}>Fonte desconhecida</p>
      )}
    </div>
  )
}
