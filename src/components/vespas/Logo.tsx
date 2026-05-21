interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'full' | 'icon-only' | 'text-only'
  color?: string
}

const sizeMap = {
  sm: { text: '1.25rem', iconSize: 24 },
  md: { text: '1.75rem', iconSize: 32 },
  lg: { text: '2.5rem',  iconSize: 48 },
}

export function Logo({
  size = 'md',
  variant = 'text-only',
  color = 'var(--vespa-nevoa)',
}: LogoProps) {
  const { text, iconSize } = sizeMap[size]

  const wordmark = (
    <span
      style={{
        fontFamily: 'var(--font-display, "Montserrat", sans-serif)',
        fontWeight: 900,
        fontSize: text,
        color,
        letterSpacing: '0.15em',
        lineHeight: 1,
      }}
      aria-label="VESPAS"
    >
      VESPAS
    </span>
  )

  const icon = (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      {/* Hexágono estrutural — elemento de marca VESPAS */}
      <polygon
        points="24,2 44,13.5 44,34.5 24,46 4,34.5 4,13.5"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
      />
      <text
        x="24"
        y="29"
        textAnchor="middle"
        style={{
          fontFamily: 'var(--font-display, "Montserrat", sans-serif)',
          fontWeight: 900,
          fontSize: '14px',
          fill: color,
          letterSpacing: '0.05em',
        }}
      >
        V
      </text>
    </svg>
  )

  if (variant === 'icon-only') return icon
  if (variant === 'text-only') return wordmark

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
      role="img"
      aria-label="VESPAS"
    >
      {icon}
      {wordmark}
    </div>
  )
}
