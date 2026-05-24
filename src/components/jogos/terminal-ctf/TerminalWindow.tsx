'use client'

import { useEffect, useRef, useCallback } from 'react'
import { type Flag, type EstadoFilesystem } from '@/types/terminal-ctf'
import { pathParaString } from '@/lib/jogos/terminal-ctf/filesystem'
import { completarTab } from '@/lib/jogos/terminal-ctf/tabCompletion'

const TERMINAL_THEME = {
  background: '#0a0a0a',
  foreground: '#d9e2ec',
  cursor: '#39ff14',
  cursorAccent: '#0a0a0a',
  selectionBackground: 'rgba(57,255,20,0.25)',
  black: '#2e2e2e',
  green: '#39ff14',
  yellow: '#ad550a',
  blue: '#0d70ce',
  red: '#cc3333',
  white: '#d9e2ec',
  brightBlack: '#555',
  brightGreen: '#39ff14',
  brightYellow: '#e6b800',
  brightBlue: '#3a9dff',
  brightRed: '#ff5555',
  brightWhite: '#ffffff',
  brightMagenta: '#ff79c6',
  magenta: '#ff79c6',
  brightCyan: '#8be9fd',
  cyan: '#8be9fd',
}

const MACWINDOW_DOTS = ['#ff5f56', '#ffbd2e', '#27c93f']

function buildPrompt(filesystem: EstadoFilesystem): string {
  const path = pathParaString(filesystem.diretorio_atual)
  const display = path === '/home/agente' ? '~' : path
  return `\x1b[1;32magente\x1b[0m\x1b[90m@vespas\x1b[0m\x1b[37m:\x1b[0m\x1b[1;34m${display}\x1b[0m\x1b[37m$ \x1b[0m`
}

interface TerminalWindowProps {
  filesystem: EstadoFilesystem
  onComando: (input: string) => { saida: string; flag?: Flag; novoFilesystem: EstadoFilesystem }
  onHint: () => void
}

export function TerminalWindow({ filesystem, onComando, onHint }: TerminalWindowProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const termRef = useRef<import('@xterm/xterm').Terminal | null>(null)
  const fitAddonRef = useRef<import('@xterm/addon-fit').FitAddon | null>(null)
  const inputBufferRef = useRef('')
  const historicoRef = useRef<string[]>([])
  const historicoIdxRef = useRef(-1)
  const filesystemRef = useRef(filesystem)
  const onComandoRef = useRef(onComando)
  const onHintRef = useRef(onHint)

  useEffect(() => { filesystemRef.current = filesystem }, [filesystem])
  useEffect(() => { onComandoRef.current = onComando }, [onComando])
  useEffect(() => { onHintRef.current = onHint }, [onHint])

  const escreverLinha = useCallback((texto: string) => {
    const term = termRef.current
    if (!term) return
    for (const linha of texto.split('\n')) {
      term.writeln(linha)
    }
  }, [])

  const mostrarPrompt = useCallback(() => {
    const term = termRef.current
    if (!term) return
    term.write(buildPrompt(filesystemRef.current))
    inputBufferRef.current = ''
  }, [])

  const processarComando = useCallback(
    (input: string) => {
      const term = termRef.current
      if (!term) return
      term.writeln('')

      const trimado = input.trim()
      if (!trimado) { mostrarPrompt(); return }

      historicoRef.current = [trimado, ...historicoRef.current.slice(0, 49)]
      historicoIdxRef.current = -1

      const resultado = onComandoRef.current(trimado)

      // Update ref immediately so prompt reflects new directory after cd
      filesystemRef.current = resultado.novoFilesystem

      if (resultado.saida === '__CLEAR__') {
        term.clear()
        mostrarPrompt()
        return
      }

      if (resultado.saida === '__HINT__') {
        onHintRef.current()
        mostrarPrompt()
        return
      }

      if (resultado.saida) {
        escreverLinha(resultado.saida)
      }

      mostrarPrompt()
    },
    [escreverLinha, mostrarPrompt],
  )

  useEffect(() => {
    if (!containerRef.current || termRef.current) return

    let term: import('@xterm/xterm').Terminal
    let fitAddon: import('@xterm/addon-fit').FitAddon

    async function init() {
      const { Terminal } = await import('@xterm/xterm')
      const { FitAddon } = await import('@xterm/addon-fit')
      await import('@xterm/xterm/css/xterm.css')

      term = new Terminal({
        theme: TERMINAL_THEME,
        fontFamily: '"JetBrains Mono", "Cascadia Code", monospace',
        fontSize: 14,
        lineHeight: 1.5,
        cursorBlink: true,
        cursorStyle: 'block',
        scrollback: 1000,
        convertEol: true,
      })

      fitAddon = new FitAddon()
      term.loadAddon(fitAddon)
      term.open(containerRef.current!)
      fitAddon.fit()

      termRef.current = term
      fitAddonRef.current = fitAddon

      term.writeln('\x1b[1;32m╔══════════════════════════════════════╗\x1b[0m')
      term.writeln('\x1b[1;32m║   OPERAÇÃO SERVIDOR ZERO — VESPAS    ║\x1b[0m')
      term.writeln('\x1b[1;32m╚══════════════════════════════════════╝\x1b[0m')
      term.writeln('')
      term.writeln('\x1b[90mDigite \x1b[0m\x1b[1mhelp\x1b[0m\x1b[90m para listar comandos. Digite \x1b[0m\x1b[1mhint\x1b[0m\x1b[90m para pedir uma dica.\x1b[0m')
      term.writeln('')
      term.write(buildPrompt(filesystemRef.current))

      // Tab completion — prevent browser focus-steal and handle inline
      term.attachCustomKeyEventHandler((ev: KeyboardEvent) => {
        if (ev.key === 'Tab' && ev.type === 'keydown') {
          ev.preventDefault()
          const buf = inputBufferRef.current
          const completions = completarTab(buf, filesystemRef.current)

          if (completions.length === 0) return false

          if (completions.length === 1) {
            term.write('\r\x1b[K')
            term.write(buildPrompt(filesystemRef.current))
            term.write(completions[0])
            inputBufferRef.current = completions[0]
          } else {
            const commonPfx = completions.reduce((acc, c) => {
              let i = 0
              while (i < acc.length && i < c.length && acc[i] === c[i]) i++
              return acc.slice(0, i)
            })
            term.writeln('')
            const parts = completions.map((c) => {
              const sp = c.lastIndexOf(' ')
              return sp >= 0 ? c.slice(sp + 1) : c
            })
            term.writeln('\x1b[90m' + parts.join('  ') + '\x1b[0m')
            term.write(buildPrompt(filesystemRef.current))
            const newBuf = commonPfx.length > buf.length ? commonPfx : buf
            term.write(newBuf)
            inputBufferRef.current = newBuf
          }

          return false
        }
        return true
      })

      term.onKey(({ key, domEvent: ev }) => {
        const buf = inputBufferRef.current

        if (ev.key === 'Enter') {
          processarComando(buf)
          return
        }

        if (ev.key === 'Backspace') {
          if (buf.length > 0) {
            inputBufferRef.current = buf.slice(0, -1)
            term.write('\b \b')
          }
          return
        }

        if (ev.key === 'ArrowUp') {
          const idx = historicoIdxRef.current + 1
          if (idx < historicoRef.current.length) {
            historicoIdxRef.current = idx
            const cmd = historicoRef.current[idx]
            term.write('\r\x1b[K')
            term.write(buildPrompt(filesystemRef.current))
            term.write(cmd)
            inputBufferRef.current = cmd
          }
          return
        }

        if (ev.key === 'ArrowDown') {
          const idx = historicoIdxRef.current - 1
          if (idx >= 0) {
            historicoIdxRef.current = idx
            const cmd = historicoRef.current[idx]
            term.write('\r\x1b[K')
            term.write(buildPrompt(filesystemRef.current))
            term.write(cmd)
            inputBufferRef.current = cmd
          } else {
            historicoIdxRef.current = -1
            term.write('\r\x1b[K')
            term.write(buildPrompt(filesystemRef.current))
            inputBufferRef.current = ''
          }
          return
        }

        if (ev.ctrlKey && ev.key === 'c') {
          term.writeln('^C')
          inputBufferRef.current = ''
          term.write(buildPrompt(filesystemRef.current))
          return
        }

        if (ev.ctrlKey || ev.altKey || key.length !== 1) return

        inputBufferRef.current += key
        term.write(key)
      })

      const ro = new ResizeObserver(() => fitAddon.fit())
      ro.observe(containerRef.current!)

      return () => {
        ro.disconnect()
        term.dispose()
        termRef.current = null
      }
    }

    const cleanup = init()
    return () => { cleanup.then((fn) => fn?.()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex h-full flex-col" style={{ background: '#0a0a0a', padding: '10px' }}>
      <div
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
        style={{
          borderRadius: 12,
          border: '1px solid rgba(57,255,20,0.15)',
          boxShadow: '0 0 40px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.02)',
        }}
      >
        {/* macOS-style titlebar */}
        <div
          className="flex flex-shrink-0 items-center px-3"
          style={{ height: 36, background: '#111', borderBottom: '1px solid rgba(57,255,20,0.08)' }}
        >
          <div className="flex gap-1.5">
            {MACWINDOW_DOTS.map((c) => (
              <div key={c} className="h-3 w-3 rounded-full" style={{ background: c }} />
            ))}
          </div>
          <span className="flex-1 text-center font-mono text-xs" style={{ color: '#444' }}>
            agente@vespas-server: ~
          </span>
          <div style={{ width: 54 }} />
        </div>

        {/* xterm.js container */}
        <div ref={containerRef} className="min-h-0 flex-1" style={{ background: '#0a0a0a' }} />
      </div>
    </div>
  )
}
