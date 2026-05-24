import Link from 'next/link'
import { HexGrid } from '@/components/vespas/HexGrid'
import { LiquidButton } from '@/components/vespas/DesignSystem'

export default function NotFound() {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center gap-6 px-6"
      style={{ background: '#0a0a0a' }}
    >
      <HexGrid density="low" interactive={false} />

      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <p
          className="font-mono text-[9px] uppercase tracking-[0.35em]"
          style={{ color: 'rgba(57,255,20,0.5)' }}
        >
          ERRO
        </p>

        <h1
          className="font-display text-4xl tracking-[-0.02em]"
          style={{ color: '#39ff14', textShadow: '0 0 30px rgba(57,255,20,0.4)' }}
          aria-label="Página não encontrada"
        >
          404
        </h1>

        <p
          className="font-mono text-sm tracking-widest"
          style={{ color: '#d9e2ec' }}
        >
          PÁGINA NÃO ENCONTRADA
        </p>

        <p
          className="max-w-xs text-sm leading-relaxed"
          style={{ color: 'rgba(217,226,236,0.4)' }}
        >
          Esta rota não existe no servidor.
        </p>

        <div className="mt-4">
          <Link href="/entrar">
            <LiquidButton variant="outline" size="md">
              ← Voltar ao início
            </LiquidButton>
          </Link>
        </div>
      </div>
    </div>
  )
}
