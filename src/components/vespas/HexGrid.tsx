'use client'

import { useId, useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useMotionTemplate } from 'motion/react'

interface HexGridProps {
  density?: 'low' | 'medium' | 'high'
  interactive?: boolean
  className?: string
  style?: React.CSSProperties
}

const DENSITY_R = { low: 32, medium: 22, high: 16 } as const

interface Pulse { id: number; x: string; y: string }

function hexPts(R: number): string {
  const H = R * Math.sqrt(3)
  return [
    `${R * 0.5},0`,
    `${R * 1.5},0`,
    `${R * 2},${H * 0.5}`,
    `${R * 1.5},${H}`,
    `${R * 0.5},${H}`,
    `0,${H * 0.5}`,
  ].join(' ')
}

export function HexGrid({
  density = 'medium',
  interactive = true,
  className = '',
  style,
}: HexGridProps) {
  const patternId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(-999)
  const mouseY = useMotionValue(-999)
  const [pulses, setPulses] = useState<Pulse[]>([])
  const nextId = useRef(0)

  const R = DENSITY_R[density]
  const W = R * 2
  const H = R * Math.sqrt(3)
  const pts = hexPts(R)

  const glowBg = useMotionTemplate`radial-gradient(circle 200px at ${mouseX}px ${mouseY}px, rgba(57,255,20,0.07), transparent 70%)`

  // Global mouse tracking so the grid responds even though it's pointer-events:none
  useEffect(() => {
    if (!interactive) return
    function onMove(e: MouseEvent) {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    }
    function onLeave() {
      mouseX.set(-999)
      mouseY.set(-999)
    }
    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [interactive, mouseX, mouseY])

  // Periodic pulse from random positions
  useEffect(() => {
    const iv = setInterval(() => {
      const id = nextId.current++
      setPulses((p) => [
        ...p.slice(-4),
        { id, x: `${15 + Math.random() * 70}%`, y: `${15 + Math.random() * 70}%` },
      ])
    }, 4000)
    return () => clearInterval(iv)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={style}
      aria-hidden="true"
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={patternId}
            x="0"
            y="0"
            width={W}
            height={H}
            patternUnits="userSpaceOnUse"
          >
            <polygon
              points={pts}
              fill="none"
              stroke="rgba(57,255,20,0.6)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <motion.rect
          width="100%"
          height="100%"
          fill={`url(#${patternId})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: density === 'high' ? 0.1 : 0.07 }}
          transition={{ duration: 3, ease: 'easeOut' }}
        />
      </svg>

      {/* Pulse rings */}
      {pulses.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.x,
            top: p.y,
            translateX: '-50%',
            translateY: '-50%',
            border: '1px solid rgba(57,255,20,0.2)',
          }}
          initial={{ width: 0, height: 0, opacity: 0.9 }}
          animate={{ width: 500, height: 500, opacity: 0 }}
          transition={{ duration: 2.8, ease: 'easeOut' }}
        />
      ))}

      {/* Mouse proximity glow */}
      {interactive && (
        <motion.div className="absolute inset-0" style={{ background: glowBg }} />
      )}
    </div>
  )
}
