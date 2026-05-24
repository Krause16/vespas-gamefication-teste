'use client'

import { useRef, useCallback } from 'react'
import { motion, useMotionValue, useMotionTemplate } from 'motion/react'
import { useEffect, useState } from 'react'

// ─── Shared color tokens ───────────────────────────────────────────────────────
export const C = {
  emerald:     '#39ff14',
  neblina:     '#d9e2ec',
  bg:          '#0a0a0a',
  danger:      '#cc3333',
  firewall:    '#27746e',
  azulLink:    '#0d70ce',
  cobre:       '#ad550a',
  glass:       'rgba(13,13,13,0.85)',
  glassBorder: 'rgba(57,255,20,0.1)',
} as const

// ─── LiquidButton ─────────────────────────────────────────────────────────────
type BtnVariant = 'primary' | 'outline' | 'danger' | 'ghost'
type BtnSize   = 'sm' | 'md' | 'lg'

const VARIANT_STYLE: Record<BtnVariant, React.CSSProperties> = {
  primary: { background: C.emerald, color: '#0a0a0a' },
  outline: { background: 'transparent', color: C.emerald, border: `1px solid ${C.emerald}` },
  danger:  { background: 'transparent', color: C.danger,  border: `1px solid ${C.danger}` },
  ghost:   { background: 'transparent', color: 'rgba(217,226,236,0.5)', border: 'none' },
}

const SIZE_CLASS: Record<BtnSize, string> = {
  sm:  'px-4 py-2 text-xs',
  md:  'px-6 py-3 text-sm',
  lg:  'px-8 py-4 text-base',
}

interface LiquidButtonProps {
  variant?: BtnVariant
  size?: BtnSize
  children: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
  style?: React.CSSProperties
  'aria-label'?: string
  'aria-pressed'?: boolean | 'mixed'
}

export function LiquidButton({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled,
  type = 'button',
  className = '',
  style,
  'aria-label': ariaLabel,
  'aria-pressed': ariaPressed,
}: LiquidButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const glowColor = variant === 'danger' ? 'rgba(204,51,51,0.3)' : 'rgba(57,255,20,0.3)'
  const glow = useMotionTemplate`radial-gradient(circle 80px at ${mx}px ${my}px, ${glowColor}, transparent 70%)`

  const onMove = useCallback((e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set(e.clientX - r.left)
    my.set(e.clientY - r.top)
  }, [mx, my])

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      onMouseMove={onMove}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`relative overflow-hidden rounded-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${SIZE_CLASS[size]} ${className}`}
      style={{ ...VARIANT_STYLE[variant], ...style }}
    >
      <motion.span
        className="pointer-events-none absolute inset-0"
        style={{ background: glow }}
        aria-hidden="true"
      />
      <span className="relative">{children}</span>
    </motion.button>
  )
}

// ─── SectionEyebrow ───────────────────────────────────────────────────────────
interface SectionEyebrowProps {
  index: string
  title: string
  accent?: string
  className?: string
}

export function SectionEyebrow({ index, title, accent, className = '' }: SectionEyebrowProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-3">
        <span className="font-display text-[11px] tracking-[0.4em]" style={{ color: 'rgba(57,255,20,0.6)' }}>
          {index}
        </span>
        <svg width="48" height="8" viewBox="0 0 48 8" fill="none" aria-hidden="true">
          <path d="M0 4 L6 0 L12 4 L18 0 L24 4 L30 0 L36 4 L42 0 L48 4" stroke="rgba(57,255,20,0.3)" strokeWidth="1" fill="none" />
        </svg>
      </div>
      <div className="flex items-baseline gap-3">
        <motion.h2
          className="font-display"
          style={{ fontSize: 40, color: C.neblina, letterSpacing: '-0.03em', lineHeight: 1 }}
          initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
          animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
          transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
        >
          {title}
        </motion.h2>
        {accent && (
          <span className="font-mono text-xs tracking-[0.25em]" style={{ color: 'rgba(57,255,20,0.55)' }}>
            {accent}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── GlassPanel ───────────────────────────────────────────────────────────────
interface GlassPanelProps {
  children: React.ReactNode
  className?: string
  glowOnHover?: boolean
  style?: React.CSSProperties
}

export function GlassPanel({ children, className = '', glowOnHover = false, style }: GlassPanelProps) {
  return (
    <motion.div
      className={`rounded-[20px] ${className}`}
      whileHover={glowOnHover ? { boxShadow: '0 0 0 1px rgba(57,255,20,0.18), 0 24px 48px rgba(0,0,0,0.7), 0 0 40px rgba(57,255,20,0.06)' } : undefined}
      style={{
        background: C.glass,
        border: `1px solid ${C.glassBorder}`,
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        boxShadow: '0 0 0 1px rgba(57,255,20,0.04), 0 24px 48px rgba(0,0,0,0.7)',
        ...style,
      }}
    >
      {children}
    </motion.div>
  )
}

// ─── StatBadge ────────────────────────────────────────────────────────────────
interface StatBadgeProps {
  value: string | number
  label: string
  className?: string
}

export function StatBadge({ value, label, className = '' }: StatBadgeProps) {
  return (
    <div
      className={`flex flex-col items-center gap-1 rounded-xl px-4 py-3 ${className}`}
      style={{ background: 'rgba(57,255,20,0.06)', border: '1px solid rgba(57,255,20,0.15)' }}
    >
      <span className="font-mono font-bold tabular-nums" style={{ fontSize: 24, color: C.neblina, lineHeight: 1 }}>
        {value}
      </span>
      <span className="font-mono text-[9px] uppercase tracking-[0.25em]" style={{ color: 'rgba(217,226,236,0.4)' }}>
        {label}
      </span>
    </div>
  )
}

// ─── TypewriterText ───────────────────────────────────────────────────────────
interface TypewriterTextProps {
  text: string
  speed?: number
  color?: string
  onComplete?: () => void
  className?: string
}

export function TypewriterText({
  text,
  speed = 30,
  color = 'rgba(217,226,236,0.7)',
  onComplete,
  className = '',
}: TypewriterTextProps) {
  const [{ activeText, done }, setState] = useState({ activeText: '', done: false })
  const onCompleteRef = useRef(onComplete)
  useEffect(() => { onCompleteRef.current = onComplete }, [onComplete])

  useEffect(() => {
    let i = 0
    const iv = setInterval(() => {
      i++
      const slice = text.slice(0, i)
      const isDone = i >= text.length
      setState({ activeText: slice, done: isDone })
      if (isDone) {
        clearInterval(iv)
        onCompleteRef.current?.()
      }
    }, speed)
    return () => {
      clearInterval(iv)
      setState({ activeText: '', done: false })
    }
  }, [text, speed])

  return (
    <span className={`font-mono ${className}`} style={{ color }}>
      {activeText}
      {!done && (
        <motion.span
          style={{ color: C.emerald }}
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.7, repeat: Infinity }}
        >
          ▌
        </motion.span>
      )}
    </span>
  )
}
