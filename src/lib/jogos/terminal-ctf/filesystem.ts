import { type Arquivo, type Diretorio, type EstadoFilesystem } from '@/types/terminal-ctf'

function arquivo(
  nome: string,
  conteudo: string,
  opts: { oculto?: boolean; executavel?: boolean; permissao?: 'leitura' | 'negado' } = {},
): Arquivo {
  return {
    nome,
    conteudo,
    oculto: opts.oculto ?? nome.startsWith('.'),
    executavel: opts.executavel ?? false,
    permissao: opts.permissao ?? 'leitura',
  }
}

function dir(nome: string, filhos: (Arquivo | Diretorio)[], opts: { permissao?: 'leitura' | 'negado' } = {}): Diretorio {
  return { nome, oculto: nome.startsWith('.'), filhos, permissao: opts.permissao }
}

export function criarFilesystemInicial(): EstadoFilesystem {
  const raiz: Diretorio = dir('/', [
    dir('home', [
      dir('agente', [
        arquivo(
          'README.txt',
          `Bem-vindo, Agente.
Este servidor foi comprometido às 03:47 de hoje.
O invasor deixou rastros. Encontre as 7 flags.
Cada flag tem o formato: VESPAS{texto_aqui}

Comece pelo básico. Você sabe o que fazer.
VESPAS{bem_vindo_ao_terminal}`,
        ),
        arquivo(
          'missao.txt',
          `MISSÃO CLASSIFICADA — OPERAÇÃO SERVIDOR ZERO
Status: COMPROMETIDO
Objetivo: Localizar evidências deixadas pelo invasor
Prazo: Antes do backup ser sobrescrito
Dica: explore os diretórios do servidor — comece por /tmp`,
        ),
      ]),
    ]),
    dir('var', [
      dir('www', [
        dir('html', [
          arquivo(
            'index.html',
            `<!DOCTYPE html>
<html>
<head><title>Escola Online</title></head>
<body><h1>Sistema de Gestão Escolar</h1></body>
</html>`,
          ),
          arquivo(
            'config.php',
            `<?php
// NUNCA commitar credenciais — VESPAS{credenciais_no_codigo_sao_crime}
$db_host = "localhost";
$db_user = "webadmin";
$db_pass = "Tr0ub4dor&3";
$db_name = "escola_db";
?>`,
          ),
          dir('uploads', [
            arquivo(
              'backup.b64',
              'VkVTUEFTe2Jhc2U2NF9uYW9fZV9jcmlwdG9ncmFmaWF9',
            ),
          ]),
        ]),
      ]),
    ]),
    dir('tmp', [
      dir('logs', [
        arquivo('acesso.log', `[03:40:01] GET /index.html 200
[03:41:15] GET /login.php 200
[03:45:33] POST /login.php 302
[03:46:02] GET /admin/ 403`),
        arquivo('erro.log', `[03:47:01] PHP Fatal error: Uncaught Error in config.php
[03:47:10] Warning: file_get_contents(): failed to open stream
[03:47:44] PHP Parse error: syntax error in webshell.php`),
        arquivo(
          '.invasor.log',
          `[03:47:12] Login bem-sucedido: admin/admin123
[03:47:45] Upload: webshell.php
[03:48:01] Execução remota ativada
[03:48:33] VESPAS{arquivos_ocultos_escondem_segredos}`,
          { oculto: true },
        ),
      ]),
      dir('notas', [
        arquivo(
          'plano.txt',
          `o ataque foi em 3 etapas
primeiro consegui acesso via ssh com senha fraca
depois fiz upload do webshell
a flag ta nos logs mas eles nao vao achar facil
VESPAS{navegacao_e_poder}`,
        ),
      ]),
    ]),
    dir('etc', [
      arquivo(
        'passwd',
        `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
agente:x:1000:1000:Agente VESPAS:/home/agente:/bin/bash
invasor:x:1337:1337:VESPAS{usuarios_do_sistema_contam_historias}:/tmp:/bin/sh`,
      ),
    ]),
    dir('opt', [
      dir('segredo', [
        dir('nivel1', [
          dir('nivel2', [
            dir('nivel3', [
              arquivo(
                'flag7.txt',
                `Parabéns. Você chegou ao fim.
VESPAS{find_e_a_arma_do_investigador}`,
              ),
            ]),
          ]),
        ]),
      ]),
    ]),
    dir('root', [], { permissao: 'negado' }),
  ])

  return {
    raiz,
    diretorio_atual: ['home', 'agente'],
  }
}

export function isArquivo(item: Arquivo | Diretorio): item is Arquivo {
  return 'conteudo' in item
}

export function isDiretorio(item: Arquivo | Diretorio): item is Diretorio {
  return 'filhos' in item
}

function segmentosValidos(partes: string[]): string[] {
  return partes.filter((p) => p.length > 0)
}

export function resolverPath(estado: EstadoFilesystem, path: string): string[] {
  if (path === '~' || path === '/home/agente') return ['home', 'agente']

  if (path.startsWith('/')) {
    return segmentosValidos(path.split('/'))
  }

  const base = [...estado.diretorio_atual]
  const partes = path.split('/')

  for (const parte of partes) {
    if (parte === '' || parte === '.') continue
    if (parte === '..') {
      if (base.length > 0) base.pop()
    } else {
      base.push(parte)
    }
  }

  return base
}

export function getItem(
  estado: EstadoFilesystem,
  segmentos: string[],
): Arquivo | Diretorio | null {
  let atual: Arquivo | Diretorio = estado.raiz

  for (const seg of segmentos) {
    if (!isDiretorio(atual)) return null
    const filho: Arquivo | Diretorio | undefined = atual.filhos.find((f) => f.nome === seg)
    if (!filho) return null
    atual = filho
  }

  return atual
}

export function getDiretorioAtual(estado: EstadoFilesystem): Diretorio | null {
  if (estado.diretorio_atual.length === 0) return estado.raiz
  const item = getItem(estado, estado.diretorio_atual)
  if (!item || !isDiretorio(item)) return null
  return item
}

export function pathParaString(segmentos: string[]): string {
  if (segmentos.length === 0) return '/'
  return '/' + segmentos.join('/')
}

function listarRecursivo(dir: Diretorio, pathBase: string, padrao: string): string[] {
  const resultados: string[] = []
  for (const filho of dir.filhos) {
    const filhoPath = pathBase + '/' + filho.nome
    if (filho.nome.includes(padrao) || padrao === '*') {
      resultados.push(filhoPath)
    }
    if (isDiretorio(filho)) {
      resultados.push(...listarRecursivo(filho, filhoPath, padrao))
    }
  }
  return resultados
}

export function findArquivo(estado: EstadoFilesystem, dirPath: string, nome: string): string[] {
  const segmentos = resolverPath(estado, dirPath)
  const item = getItem(estado, segmentos)
  if (!item || !isDiretorio(item)) return []
  return listarRecursivo(item, pathParaString(segmentos), nome.replace(/\*/g, ''))
}

function grepNoConteudo(conteudo: string, padrao: string): string[] {
  const linhas = conteudo.split('\n')
  return linhas.filter((l) => l.toLowerCase().includes(padrao.toLowerCase()))
}

export function grepRecursivo(
  dir: Diretorio,
  pathBase: string,
  padrao: string,
): Array<{ arquivo: string; linha: string }> {
  const resultados: Array<{ arquivo: string; linha: string }> = []
  for (const filho of dir.filhos) {
    const filhoPath = pathBase + '/' + filho.nome
    if (isArquivo(filho) && filho.permissao !== 'negado') {
      const linhas = grepNoConteudo(filho.conteudo, padrao)
      for (const linha of linhas) {
        resultados.push({ arquivo: filhoPath, linha })
      }
    } else if (isDiretorio(filho) && filho.permissao !== 'negado') {
      resultados.push(...grepRecursivo(filho, filhoPath, padrao))
    }
  }
  return resultados
}
