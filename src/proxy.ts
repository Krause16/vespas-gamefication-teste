import { NextRequest, NextResponse } from 'next/server'

// Rotas que exigem sessão ativa (cookie vespas-sessao definido por sessaoStore)
const ROTAS_PROTEGIDAS = ['/hub', '/jogos']

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl
  const requerSessao = ROTAS_PROTEGIDAS.some((rota) => pathname.startsWith(rota))

  if (requerSessao) {
    const sessao = request.cookies.get('vespas-sessao')
    if (!sessao?.value) {
      const destino = request.nextUrl.clone()
      destino.pathname = '/entrar'
      return NextResponse.redirect(destino)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/hub/:path*', '/jogos/:path*'],
}
