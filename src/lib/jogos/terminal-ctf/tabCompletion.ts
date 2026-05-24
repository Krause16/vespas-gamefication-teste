import { type EstadoFilesystem } from '@/types/terminal-ctf'
import { resolverPath, getItem, isDiretorio } from './filesystem'

const COMANDOS = [
  'ls', 'cd', 'cat', 'pwd', 'grep', 'find',
  'echo', 'base64', 'clear', 'help', 'hint', 'whoami',
]

function completarCaminho(parcial: string, estadoFS: EstadoFilesystem): string[] {
  const lastSlash = parcial.lastIndexOf('/')
  const dirParte = lastSlash >= 0 ? parcial.slice(0, lastSlash + 1) : ''
  const nomePrefixo = lastSlash >= 0 ? parcial.slice(lastSlash + 1) : parcial

  const targetDir = dirParte || '.'
  const segmentos = resolverPath(estadoFS, targetDir)
  const item = segmentos.length === 0 ? estadoFS.raiz : getItem(estadoFS, segmentos)

  if (!item || !isDiretorio(item)) return []

  const mostrarOcultos = nomePrefixo.startsWith('.')

  return item.filhos
    .filter((f) => (mostrarOcultos || !f.oculto) && f.nome.startsWith(nomePrefixo))
    .map((f) => dirParte + f.nome + (isDiretorio(f) ? '/' : ''))
}

export function completarTab(input: string, estadoFS: EstadoFilesystem): string[] {
  if (!input) return COMANDOS

  const partes = input.split(' ')
  const primeiraWord = partes[0]

  // Completando o nome do comando
  if (partes.length === 1) {
    return COMANDOS.filter((c) => c.startsWith(primeiraWord))
  }

  // Completando um argumento (path)
  const argAtual = partes[partes.length - 1]
  const completions = completarCaminho(argAtual, estadoFS)
  const prefixo = partes.slice(0, -1).join(' ') + ' '
  return completions.map((c) => prefixo + c)
}
