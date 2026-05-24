'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { HexGrid } from '@/components/vespas/HexGrid'
import { GlassPanel, LiquidButton } from '@/components/vespas/DesignSystem'
import { useSessaoStore } from '@/stores/sessaoStore'
import { entrarAnonymously } from '@/lib/supabase/auth'

export default function SoloPage() {
  const router = useRouter()
  const { entrarSolo } = useSessaoStore()
  const [apelido, setApelido] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleComecar() {
    setCarregando(true)
    try {
      const user = await entrarAnonymously()
      const nomeEfetivo = apelido.trim() || 'Agente Anônimo'
      // Em modo solo não criamos registro em jogadores (sem sala_id)
      // Usamos o user.id do Supabase Auth como identificador local
      entrarSolo(nomeEfetivo, user.id)
      toast.success(`Bem-vindo, ${nomeEfetivo}! Modo solo ativo.`)
      router.push('/hub')
    } catch {
      toast.error('Falha ao conectar. Verifique sua internet e tente novamente.')
      setCarregando(false)
    }
  }

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center px-6"
      style={{ background: '#0a0a0a' }}
    >
      <HexGrid density="low" interactive={false} />

      <motion.div
        className="relative z-10 w-full max-w-sm"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
      >
        <GlassPanel className="p-7">
          {/* Eyebrow */}
          <p
            className="mb-5 text-center font-mono text-[10px] uppercase tracking-[0.3em]"
            style={{ color: 'rgba(57,255,20,0.6)' }}
          >
            [ MODO SOLO ]
          </p>

          {/* Title */}
          <p
            className="mb-2 text-center font-display text-3xl tracking-[0.12em]"
            style={{ color: '#d9e2ec' }}
          >
            TREINO LIVRE
          </p>
          <p
            className="mb-7 text-center text-xs leading-relaxed"
            style={{ color: 'rgba(217,226,236,0.4)' }}
          >
            Jogue sem gincana ativa. Seu progresso é salvo localmente.
          </p>

          {/* Apelido input */}
          <div className="mb-6">
            <label
              htmlFor="apelido"
              className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em]"
              style={{ color: 'rgba(217,226,236,0.4)' }}
            >
              Apelido (opcional)
            </label>
            <input
              id="apelido"
              type="text"
              value={apelido}
              onChange={(e) => setApelido(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !carregando && void handleComecar()}
              placeholder="Agente Anônimo"
              maxLength={30}
              disabled={carregando}
              className="w-full rounded-lg px-4 py-3 font-mono text-sm transition-all focus:outline-none disabled:opacity-50"
              style={{
                background: '#0d0d0d',
                border: '1.5px solid rgba(217,226,236,0.1)',
                color: '#d9e2ec',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(57,255,20,0.4)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(217,226,236,0.1)' }}
            />
          </div>

          <LiquidButton
            variant="primary"
            size="md"
            className="w-full"
            onClick={() => void handleComecar()}
            disabled={carregando}
          >
            {carregando ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                CONECTANDO...
              </span>
            ) : (
              'COMEÇAR SOZINHO'
            )}
          </LiquidButton>
        </GlassPanel>

        <Link
          href="/entrar"
          className="mt-5 block text-center text-sm transition-colors hover:underline"
          style={{ color: 'rgba(217,226,236,0.35)' }}
        >
          ← Tenho um código de sala
        </Link>
      </motion.div>
    </main>
  )
}
