import { type EstadoFilesystem, type ResultadoComando } from '@/types/terminal-ctf'
import {
  resolverPath,
  getItem,
  pathParaString,
  isArquivo,
  isDiretorio,
  findArquivo,
  grepRecursivo,
} from './filesystem'

function resultado(saida: string, estado: EstadoFilesystem, flag?: string): ResultadoComando {
  return { saida, novo_estado: estado, flag_encontrada: flag }
}

function formatarPermissao(item: { permissao?: string; executavel?: boolean }): string {
  const base = 'permissao' in item && item.permissao === 'negado' ? '----------' : 'rw-r--r--'
  if ('executavel' in item && item.executavel) return 'rwxr-xr-x'
  return base
}

function listarDiretorio(
  dir: import('@/types/terminal-ctf').Diretorio,
  mostrarOcultos: boolean,
  formatoLongo: boolean,
): string {
  const filhos = dir.filhos.filter((f) => mostrarOcultos || !f.oculto)

  if (filhos.length === 0 && !mostrarOcultos) return ''

  if (!formatoLongo) {
    const entradas = mostrarOcultos ? ['.', '..', ...filhos.map((f) => f.nome)] : filhos.map((f) => f.nome)
    return entradas.join('  ')
  }

  const linhas: string[] = []
  if (mostrarOcultos) {
    linhas.push('drwxr-xr-x  .', 'drwxr-xr-x  ..')
  }
  for (const filho of filhos) {
    const tipo = isDiretorio(filho) ? 'd' : '-'
    const perm = isDiretorio(filho) ? 'rwxr-xr-x' : formatarPermissao(filho as import('@/types/terminal-ctf').Arquivo)
    linhas.push(`${tipo}${perm}  ${filho.nome}`)
  }
  return linhas.join('\n')
}

function executarPipe(partes: string[], estado: EstadoFilesystem): ResultadoComando | null {
  if (partes.length !== 2) return null
  const esquerda = partes[0].trim().split(/\s+/)
  const direita = partes[1].trim().split(/\s+/)

  if (esquerda[0] === 'cat' && direita[0] === 'base64' && direita[1] === '-d') {
    const catResult = executarComandoSimples('cat', esquerda.slice(1), estado)
    if (catResult.saida.startsWith('cat:') || catResult.saida.startsWith('bash:')) {
      return catResult
    }
    try {
      const decoded = atob(catResult.saida.trim())
      return resultado(decoded, estado)
    } catch {
      return resultado('base64: entrada inválida', estado)
    }
  }

  return null
}

function executarComandoSimples(
  cmd: string,
  args: string[],
  estado: EstadoFilesystem,
): ResultadoComando {
  switch (cmd) {
    case 'pwd': {
      return resultado(pathParaString(estado.diretorio_atual), estado)
    }

    case 'whoami': {
      return resultado('agente', estado)
    }

    case 'echo': {
      return resultado(args.join(' '), estado)
    }

    case 'clear': {
      return resultado('__CLEAR__', estado)
    }

    case 'hint': {
      return resultado('__HINT__', estado)
    }

    case 'help': {
      return resultado(
        `Comandos disponíveis:
  ls [-a] [-l] [path]     Lista arquivos e diretórios
  cd [path]               Muda de diretório (~ = home)
  cat [arquivo]           Exibe conteúdo de um arquivo
  pwd                     Mostra o diretório atual
  grep [padrão] [arquivo] Busca padrão em arquivo
  grep -r [padrão] [dir]  Busca recursiva em diretório
  find [dir] -name [nome] Busca arquivo por nome
  echo [texto]            Repete o texto
  base64 -d [arquivo]     Decodifica base64
  clear                   Limpa o terminal
  hint                    Sistema de dicas
  whoami                  Mostra o usuário atual`,
        estado,
      )
    }

    case 'ls': {
      let mostrarOcultos = false
      let formatoLongo = false
      let targetPath: string | null = null

      for (const arg of args) {
        if (arg === '-a') mostrarOcultos = true
        else if (arg === '-l') formatoLongo = true
        else if (arg === '-la' || arg === '-al') { mostrarOcultos = true; formatoLongo = true }
        else if (!arg.startsWith('-')) targetPath = arg
      }

      const segmentos = targetPath
        ? resolverPath(estado, targetPath)
        : estado.diretorio_atual

      const item = segmentos.length === 0 ? estado.raiz : getItem(estado, segmentos)

      if (!item) return resultado(`ls: ${targetPath}: No such file or directory`, estado)
      if (isArquivo(item)) return resultado(item.nome, estado)
      if (isDiretorio(item) && item.permissao === 'negado') {
        return resultado(`ls: ${targetPath ?? '.'}: Permission denied`, estado)
      }

      const saida = listarDiretorio(item, mostrarOcultos, formatoLongo)
      return resultado(saida, estado)
    }

    case 'cd': {
      const destino = args[0] ?? '~'

      if (destino === '~' || destino === '/home/agente') {
        return resultado('', { ...estado, diretorio_atual: ['home', 'agente'] })
      }

      const novosSegmentos = resolverPath(estado, destino)
      const item = novosSegmentos.length === 0 ? estado.raiz : getItem(estado, novosSegmentos)

      if (!item) return resultado(`bash: cd: ${destino}: No such file or directory`, estado)
      if (isArquivo(item)) return resultado(`bash: cd: ${destino}: Not a directory`, estado)
      if (isDiretorio(item) && item.permissao === 'negado') {
        return resultado(`bash: cd: ${destino}: Permission denied`, estado)
      }

      return resultado('', { ...estado, diretorio_atual: novosSegmentos })
    }

    case 'cat': {
      if (args.length === 0) return resultado('cat: missing operand', estado)

      const segmentos = resolverPath(estado, args[0])
      const item = getItem(estado, segmentos)

      if (!item) return resultado(`cat: ${args[0]}: No such file or directory`, estado)
      if (isDiretorio(item)) return resultado(`cat: ${args[0]}: Is a directory`, estado)
      if (item.permissao === 'negado') return resultado(`cat: ${args[0]}: Permission denied`, estado)

      return resultado(item.conteudo, estado)
    }

    case 'grep': {
      let recursivo = false
      const restArgs = [...args]

      if (restArgs[0] === '-r') {
        recursivo = true
        restArgs.shift()
      }

      const padrao = restArgs[0]
      const alvo = restArgs[1]

      if (!padrao) return resultado('grep: uso: grep [-r] padrão arquivo', estado)

      if (recursivo) {
        const segmentos = alvo ? resolverPath(estado, alvo) : estado.diretorio_atual
        const item = segmentos.length === 0 ? estado.raiz : getItem(estado, segmentos)

        if (!item) return resultado(`grep: ${alvo}: No such file or directory`, estado)
        if (isArquivo(item)) {
          const linhas = item.conteudo.split('\n').filter((l) => l.toLowerCase().includes(padrao.toLowerCase()))
          return resultado(linhas.join('\n'), estado)
        }

        const matches = grepRecursivo(item, pathParaString(segmentos), padrao)
        if (matches.length === 0) return resultado('', estado)
        return resultado(matches.map((m) => `${m.arquivo}:${m.linha}`).join('\n'), estado)
      }

      if (!alvo) return resultado('grep: uso: grep padrão arquivo', estado)

      const segmentos = resolverPath(estado, alvo)
      const item = getItem(estado, segmentos)

      if (!item) return resultado(`grep: ${alvo}: No such file or directory`, estado)
      if (isDiretorio(item)) return resultado(`grep: ${alvo}: Is a directory`, estado)
      if (item.permissao === 'negado') return resultado(`grep: ${alvo}: Permission denied`, estado)

      const linhas = item.conteudo.split('\n').filter((l) => l.toLowerCase().includes(padrao.toLowerCase()))
      return resultado(linhas.join('\n'), estado)
    }

    case 'find': {
      const dirArg = args[0] ?? '.'
      const nomeIdx = args.indexOf('-name')
      const nomeArg = nomeIdx >= 0 ? args[nomeIdx + 1] : undefined

      if (!nomeArg) return resultado('find: uso: find [dir] -name [nome]', estado)

      const encontrados = findArquivo(estado, dirArg, nomeArg.replace(/"/g, '').replace(/'/g, ''))
      return resultado(encontrados.join('\n'), estado)
    }

    case 'base64': {
      if (args[0] !== '-d') return resultado('base64: uso: base64 -d [arquivo]', estado)
      if (!args[1]) return resultado('base64: missing operand', estado)

      const segmentos = resolverPath(estado, args[1])
      const item = getItem(estado, segmentos)

      if (!item) return resultado(`base64: ${args[1]}: No such file or directory`, estado)
      if (isDiretorio(item)) return resultado(`base64: ${args[1]}: Is a directory`, estado)

      try {
        const decoded = atob(item.conteudo.trim())
        return resultado(decoded, estado)
      } catch {
        return resultado('base64: entrada inválida', estado)
      }
    }

    default: {
      return resultado(`bash: ${cmd}: command not found (este ambiente é restrito)`, estado)
    }
  }
}

export function executarComando(input: string, estado: EstadoFilesystem): ResultadoComando {
  const inputTrimado = input.trim()
  if (!inputTrimado) return resultado('', estado)

  // Suporte a pipe simples
  if (inputTrimado.includes('|')) {
    const partes = inputTrimado.split('|')
    const pipeResult = executarPipe(partes, estado)
    if (pipeResult) return pipeResult
  }

  // Suporte a && (executa segundo comando apenas se o primeiro não der erro)
  if (inputTrimado.includes('&&')) {
    const partes = inputTrimado.split('&&').map((p) => p.trim())
    let estadoAtual = estado
    const saidas: string[] = []
    for (const parte of partes) {
      const tokens = tokenizar(parte)
      if (tokens.length === 0) continue
      const res = executarComandoSimples(tokens[0], tokens.slice(1), estadoAtual)
      if (res.saida && res.saida !== '__CLEAR__' && res.saida !== '__HINT__') {
        saidas.push(res.saida)
      }
      estadoAtual = res.novo_estado
      if (res.flag_encontrada) return { saida: saidas.join('\n'), novo_estado: estadoAtual, flag_encontrada: res.flag_encontrada }
      // Se for erro de bash, para
      if (res.saida.startsWith('bash:') || res.saida.includes('No such file') || res.saida.includes('Permission denied')) {
        return { saida: res.saida, novo_estado: estadoAtual }
      }
    }
    return resultado(saidas.filter(Boolean).join('\n'), estadoAtual)
  }

  const tokens = tokenizar(inputTrimado)
  if (tokens.length === 0) return resultado('', estado)

  return executarComandoSimples(tokens[0], tokens.slice(1), estado)
}

function tokenizar(input: string): string[] {
  const tokens: string[] = []
  let atual = ''
  let emAspas = false
  let charAspas = ''

  for (const ch of input) {
    if (emAspas) {
      if (ch === charAspas) {
        emAspas = false
        tokens.push(atual)
        atual = ''
      } else {
        atual += ch
      }
    } else if (ch === '"' || ch === "'") {
      emAspas = true
      charAspas = ch
    } else if (ch === ' ') {
      if (atual) { tokens.push(atual); atual = '' }
    } else {
      atual += ch
    }
  }

  if (atual) tokens.push(atual)
  return tokens
}
