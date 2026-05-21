'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlowCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
}

export function GlowCard({
  children,
  className,
  glowColor = 'var(--vespa-esmeralda)',
}: GlowCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-xl border p-5 transition-shadow duration-300',
        className,
      )}
      style={{
        background: 'var(--color-bg-card)',
        borderColor: 'var(--color-border-subtle)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
        '--glow-color': glowColor,
      } as React.CSSProperties}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.boxShadow = `0 0 0 1px var(--glow-color), 0 0 16px ${glowColor}40, 0 2px 12px rgba(0,0,0,0.4)`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.4)'
      }}
    >
      {children}
    </div>
  )
}
