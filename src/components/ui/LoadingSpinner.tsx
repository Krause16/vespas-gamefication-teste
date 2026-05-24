interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const SIZE_PX = { sm: 24, md: 40, lg: 56 } as const

export function LoadingSpinner({ size = 'md', label }: LoadingSpinnerProps) {
  const px = SIZE_PX[size]

  return (
    <div
      className="flex flex-col items-center gap-2"
      role="status"
      aria-label={label ?? 'Carregando'}
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-spin"
        aria-hidden="true"
      >
        {/* Static outer hexagon */}
        <polygon
          points="20,2 36,11 36,29 20,38 4,29 4,11"
          stroke="rgba(57,255,20,0.15)"
          strokeWidth="2"
          fill="none"
        />
        {/* Animated arc (top segment) */}
        <path
          d="M20,2 L36,11"
          stroke="#39ff14"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 4px rgba(57,255,20,0.8))' }}
        />
      </svg>

      {label && (
        <span
          className="font-mono text-[10px] uppercase tracking-[0.25em]"
          style={{ color: 'rgba(217,226,236,0.5)' }}
        >
          {label}
        </span>
      )}
    </div>
  )
}
