'use client'

import { motion, AnimatePresence } from 'motion/react'
import { MessageCircle, Camera, Mail, Briefcase, Headphones } from 'lucide-react'
import { type AppSlug } from '@/types/golpe-ta-ai'
import { getMensagensPorApp } from '@/lib/jogos/golpe-ta-ai'
import { LiquidButton } from '@/components/vespas/DesignSystem'

interface AppConfig {
  slug: AppSlug
  nome: string
  Icon: React.ElementType
  bg: string
}

const APPS: AppConfig[] = [
  { slug: 'vespas-msg', nome: 'VespasMsg',  Icon: MessageCircle, bg: '#25d366' },
  { slug: 'vespasgram', nome: 'Vespasgram', Icon: Camera,        bg: '#833ab4' },
  { slug: 'vmail',      nome: 'VMail',      Icon: Mail,          bg: '#ea4335' },
  { slug: 'vlinked',    nome: 'VLinked',    Icon: Briefcase,     bg: '#0a66c2' },
  { slug: 'vcord',      nome: 'VCord',      Icon: Headphones,    bg: '#5865f2' },
]

interface HomeScreenProps {
  mensagensCompletadas: string[]
  metaCompletar: number
  totalMensagens: number
  onAbrirApp: (slug: AppSlug) => void
  onVerResultado: () => void
}

export function HomeScreen({
  mensagensCompletadas,
  metaCompletar,
  totalMensagens,
  onAbrirApp,
  onVerResultado,
}: HomeScreenProps) {
  const completadas = mensagensCompletadas.length
  const metaAtingida = completadas >= metaCompletar
  const todasFeitas = completadas >= totalMensagens

  function getUnread(slug: AppSlug): number {
    const total = getMensagensPorApp(slug).length
    const feitas = getMensagensPorApp(slug).filter((m) => mensagensCompletadas.includes(m.id)).length
    return total - feitas
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden" style={{ background: '#111' }}>
      {/* Wallpaper glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 110%, rgba(57,255,20,0.07), transparent)' }}
        aria-hidden="true"
      />

      {/* Progress pill */}
      <div className="relative z-10 flex justify-center pt-5">
        <div
          className="flex items-center gap-2 rounded-full px-4 py-1.5"
          style={{
            background: 'rgba(10,10,10,0.85)',
            border: `1px solid ${metaAtingida ? 'rgba(57,255,20,0.4)' : 'rgba(57,255,20,0.15)'}`,
            backdropFilter: 'blur(12px)',
          }}
        >
          <motion.div
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: metaAtingida ? '#39ff14' : 'rgba(57,255,20,0.4)' }}
            animate={metaAtingida ? { opacity: [1, 0.4, 1], scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
            aria-hidden="true"
          />
          <span
            className="font-mono text-[11px] tracking-[0.15em]"
            style={{ color: metaAtingida ? '#39ff14' : 'rgba(217,226,236,0.6)' }}
          >
            {todasFeitas ? 'ANÁLISE COMPLETA' : metaAtingida ? 'MISSÃO COMPLETA' : `${completadas}/${metaCompletar} ANALISADAS`}
          </span>
        </div>
      </div>

      {/* App grid */}
      <div className="relative z-10 flex flex-1 flex-col justify-center px-8 py-4">
        <div className="grid grid-cols-3 gap-x-6 gap-y-7 justify-items-center">
          {APPS.slice(0, 3).map((app, i) => (
            <AppIcon
              key={app.slug}
              app={app}
              unread={getUnread(app.slug)}
              onPress={() => onAbrirApp(app.slug)}
              delay={i * 0.08}
            />
          ))}
          {/* Center the last 2 */}
          <div />
          {APPS.slice(3).map((app, i) => (
            <AppIcon
              key={app.slug}
              app={app}
              unread={getUnread(app.slug)}
              onPress={() => onAbrirApp(app.slug)}
              delay={(i + 3) * 0.08}
            />
          ))}
        </div>
      </div>

      {/* Floating result button */}
      <AnimatePresence>
        {metaAtingida && (
          <motion.div
            className="relative z-10 px-6 pb-4"
            initial={{ y: 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 48, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <LiquidButton variant="primary" size="md" className="w-full" onClick={onVerResultado}>
              VER RESULTADO
            </LiquidButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dock */}
      <div
        className="relative z-10 mx-4 mb-4 flex shrink-0 justify-around rounded-[20px] px-4 py-3"
        style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(16px)' }}
        aria-hidden="true"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-12 w-12 rounded-[14px]"
            style={{ background: 'rgba(255,255,255,0.07)' }}
          />
        ))}
      </div>
    </div>
  )
}

interface AppIconProps {
  app: AppConfig
  unread: number
  onPress: () => void
  delay?: number
}

function AppIcon({ app, unread, onPress, delay = 0 }: AppIconProps) {
  const { Icon } = app
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28, delay }}
      whileTap={{ scale: 0.9 }}
      onClick={onPress}
      className="relative flex flex-col items-center gap-2"
      aria-label={`Abrir ${app.nome}${unread > 0 ? `, ${unread} não analisadas` : ''}`}
    >
      <div
        className="relative flex h-16 w-16 items-center justify-center rounded-[18px]"
        style={{ background: app.bg, boxShadow: '0 4px 16px rgba(0,0,0,0.5)' }}
      >
        <Icon size={28} className="text-white" aria-hidden="true" />
        {unread > 0 && (
          <div
            className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1"
            style={{ background: '#ff3b30', boxShadow: '0 0 8px rgba(255,59,48,0.5)' }}
            aria-hidden="true"
          >
            <span className="font-mono text-[10px] font-bold text-white">{unread}</span>
          </div>
        )}
      </div>
      <span className="text-center font-mono text-[10px]" style={{ color: 'rgba(217,226,236,0.8)' }}>
        {app.nome}
      </span>
    </motion.button>
  )
}
