'use client'

import { type ReactNode } from 'react'
import { Wifi, Battery } from 'lucide-react'

interface SmartphoneFrameProps {
  children: ReactNode
  className?: string
}

export function SmartphoneFrame({ children, className = '' }: SmartphoneFrameProps) {
  return (
    <div
      className={`relative flex w-full max-w-[390px] flex-col overflow-hidden ${className}`}
      style={{
        borderRadius: 40,
        border: '8px solid #1e1e1e',
        background: '#0a0a0a',
        boxShadow: '0 24px 60px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.04)',
        height: '100%',
      }}
    >
      {/* Notch */}
      <div
        className="relative flex shrink-0 items-center justify-center"
        style={{ height: 28, background: '#0a0a0a' }}
      >
        <div
          style={{ width: 80, height: 20, borderRadius: '0 0 14px 14px', background: '#1e1e1e' }}
          aria-hidden="true"
        />
      </div>

      {/* Status bar */}
      <div
        className="flex shrink-0 items-center justify-between px-5 pb-1"
        style={{ background: '#0a0a0a' }}
        aria-hidden="true"
      >
        <span className="font-mono text-[10px] font-semibold text-white opacity-80">9:41</span>
        <div className="flex items-center gap-1">
          <Wifi size={10} className="text-white opacity-80" />
          <Battery size={10} className="text-white opacity-80" />
        </div>
      </div>

      {/* App content */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  )
}
