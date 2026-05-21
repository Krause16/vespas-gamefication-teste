import { type ReactNode } from 'react'

interface HexagonoProps {
  size: number
  fill?: string
  children?: ReactNode
  className?: string
}

export function Hexagono({ size, fill = 'transparent', children, className }: HexagonoProps) {
  const height = Math.round(size * 0.866)

  return (
    <div
      className={className}
      style={{
        width: size,
        height,
        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
        background: fill,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  )
}
