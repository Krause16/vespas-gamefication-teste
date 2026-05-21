export function VespaBackground() {
  const patternId = 'vespa-hex-pattern'

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.05 }}
      >
        <defs>
          <pattern
            id={patternId}
            x="0"
            y="0"
            width="60"
            height="52"
            patternUnits="userSpaceOnUse"
          >
            {/* Hexágono regular: clip-path polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%) */}
            <polygon
              points="15,2 45,2 60,26 45,50 15,50 0,26"
              fill="none"
              stroke="var(--vespa-esmeralda)"
              strokeWidth="0.75"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  )
}
