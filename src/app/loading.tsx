export default function Loading() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-6"
      style={{ background: '#0a0a0a' }}
      role="status"
      aria-label="Carregando"
    >
      {/* Hexagonal pulse */}
      <div className="relative flex items-center justify-center">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="animate-pulse"
        >
          <polygon
            points="32,4 58,18 58,46 32,60 6,46 6,18"
            stroke="#39ff14"
            strokeWidth="2"
            fill="none"
            style={{ filter: 'drop-shadow(0 0 8px rgba(57,255,20,0.6))' }}
          />
          <polygon
            points="32,14 50,24 50,44 32,54 14,44 14,24"
            stroke="rgba(57,255,20,0.3)"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>

      <p
        className="font-mono text-[11px] uppercase tracking-[0.35em]"
        style={{ color: 'rgba(57,255,20,0.6)' }}
      >
        CARREGANDO...
      </p>
    </div>
  )
}
