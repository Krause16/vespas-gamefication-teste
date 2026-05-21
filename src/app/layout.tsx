import type { Metadata, Viewport } from 'next'
import { Montserrat, JetBrains_Mono } from 'next/font/google'
// TODO: adicionar public/fonts/Azonix.woff2 e descomentar para ativar a fonte display
// import localFont from 'next/font/local'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'VESPAS — Plataforma de Cibersegurança',
  description:
    'Plataforma gamificada de cibersegurança para oficinas em escolas — UTFPR Curitiba',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2e2e2e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${montserrat.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full antialiased">{children}</body>
    </html>
  )
}
