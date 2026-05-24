import { describe, it, expect } from 'vitest'
import {
  criarFilesystemInicial,
  resolverPath,
  getItem,
  getDiretorioAtual,
  pathParaString,
  isArquivo,
  isDiretorio,
} from '@/lib/jogos/terminal-ctf/filesystem'

describe('criarFilesystemInicial', () => {
  it('começa em /home/agente', () => {
    const fs = criarFilesystemInicial()
    expect(fs.diretorio_atual).toEqual(['home', 'agente'])
  })

  it('README.txt existe em /home/agente', () => {
    const fs = criarFilesystemInicial()
    const item = getItem(fs, ['home', 'agente', 'README.txt'])
    expect(item).not.toBeNull()
    expect(isArquivo(item!)).toBe(true)
  })

  it('.invasor.log está oculto', () => {
    const fs = criarFilesystemInicial()
    const item = getItem(fs, ['tmp', 'logs', '.invasor.log'])
    expect(item).not.toBeNull()
    expect(isArquivo(item!)).toBe(true)
    expect((item as import('@/types/terminal-ctf').Arquivo).oculto).toBe(true)
  })

  it('/root tem permissão negada', () => {
    const fs = criarFilesystemInicial()
    const item = getItem(fs, ['root'])
    expect(item).not.toBeNull()
    expect(isDiretorio(item!)).toBe(true)
    expect((item as import('@/types/terminal-ctf').Diretorio).permissao).toBe('negado')
  })
})

describe('resolverPath', () => {
  const fs = criarFilesystemInicial()

  it('caminho absoluto', () => {
    expect(resolverPath(fs, '/tmp/logs')).toEqual(['tmp', 'logs'])
  })

  it('caminho relativo', () => {
    const fsLogs = { ...fs, diretorio_atual: ['tmp', 'logs'] }
    expect(resolverPath(fsLogs, '.invasor.log')).toEqual(['tmp', 'logs', '.invasor.log'])
  })

  it('cd ..' , () => {
    const fsLogs = { ...fs, diretorio_atual: ['tmp', 'logs'] }
    expect(resolverPath(fsLogs, '..')).toEqual(['tmp'])
  })

  it('~ resolve para /home/agente', () => {
    expect(resolverPath(fs, '~')).toEqual(['home', 'agente'])
  })

  it('raiz /', () => {
    expect(resolverPath(fs, '/')).toEqual([])
  })
})

describe('getItem', () => {
  const fs = criarFilesystemInicial()

  it('retorna null para path inexistente', () => {
    expect(getItem(fs, ['nao', 'existe'])).toBeNull()
  })

  it('retorna raiz com array vazio', () => {
    const item = getItem(fs, [])
    expect(item).not.toBeNull()
    expect(isDiretorio(item!)).toBe(true)
  })

  it('retorna arquivo profundo', () => {
    const item = getItem(fs, ['opt', 'segredo', 'nivel1', 'nivel2', 'nivel3', 'flag7.txt'])
    expect(item).not.toBeNull()
    expect(isArquivo(item!)).toBe(true)
  })
})

describe('getDiretorioAtual', () => {
  it('retorna diretório inicial', () => {
    const fs = criarFilesystemInicial()
    const dir = getDiretorioAtual(fs)
    expect(dir).not.toBeNull()
    expect(dir!.nome).toBe('agente')
  })
})

describe('pathParaString', () => {
  it('array vazio é /', () => {
    expect(pathParaString([])).toBe('/')
  })

  it('converte array em path', () => {
    expect(pathParaString(['tmp', 'logs'])).toBe('/tmp/logs')
  })
})
