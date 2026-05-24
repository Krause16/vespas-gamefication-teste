'use client'

import { useId } from 'react'
import { motion } from 'framer-motion'

interface HexagonBackgroundProps {
  opacity?: number
}

export function HexagonBackground({ opacity = 1 }: HexagonBackgroundProps) {
  const uid = useId().replace(/:/g, '')
  const patternId = `hex-bg-${uid}`

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
      style={{ opacity }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ clipPath: 'circle(0% at 50% 44%)' }}
        animate={{ clipPath: 'circle(200% at 50% 44%)' }}
        transition={{ duration: 1.6, ease: [0, 0, 0.2, 1], delay: 0.15 }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.3 }}>
          <defs>
            <pattern
              id={patternId}
              x="0"
              y="0"
              width="36"
              height="31.2"
              patternUnits="userSpaceOnUse"
            >
              <polygon
                points="9,0.5 27,0.5 36,15.6 27,30.7 9,30.7 0,15.6"
                fill="none"
                stroke="#39ff14"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      </motion.div>

      {/* Depth fade — hexes dim at edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 100% 75% at 50% 50%, transparent 30%, rgba(10,10,10,0.9) 100%)',
        }}
      />

      {/* Accent glows */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(circle at 50% 40%, rgba(57,255,20,0.06), transparent 55%)',
            'radial-gradient(circle at 20% 80%, rgba(13,112,206,0.08), transparent 35%)',
          ].join(', '),
        }}
      />
    </div>
  )
}
