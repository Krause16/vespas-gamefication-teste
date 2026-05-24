import { describe, it, expect } from 'vitest'
import { executarComando } from '@/lib/jogos/terminal-ctf/comandos'
import { criarFilesystemInicial } from '@/lib/jogos/terminal-ctf/filesystem'
import { type EstadoFilesystem } from '@/types/terminal-ctf'

function fs(): EstadoFilesystem {
  return criarFilesystemInicial()
}

describe('pwd', () => {
  it('mostra diretório inicial', () => {
    const r = executarComando('pwd', fs())
    expect(r.saida).toBe('/home/agente')
  })
})

describe('whoami', () => {
  it('retorna agente', () => {
    expect(executarComando('whoami', fs()).saida).toBe('agente')
  })
})

describe('ls', () => {
  it('lista arquivos visíveis', () => {
    const r = executarComando('ls', fs())
    expect(r.saida).toContain('README.txt')
    expect(r.saida).not.toContain('.invasor.log')
  })

  it('ls -a mostra arquivos ocultos', () => {
    const estado = { ...fs(), diretorio_atual: ['tmp', 'logs'] }
    const r = executarComando('ls -a', estado)
    expect(r.saida).toContain('.invasor.log')
  })

  it('ls -la formato longo', () => {
    const r = executarComando('ls -la', fs())
    expect(r.saida).toContain('rw')
  })

  it('ls path absoluto', () => {
    const r = executarComando('ls /tmp', fs())
    expect(r.saida).toContain('logs')
    expect(r.saida).toContain('notas')
  })

  it('erro em path inexistente', () => {
    const r = executarComando('ls /naoexiste', fs())
    expect(r.saida).toContain('No such file or directory')
  })
})

describe('cd', () => {
  it('cd /tmp muda para /tmp', () => {
    const r = executarComando('cd /tmp', fs())
    expect(r.novo_estado.diretorio_atual).toEqual(['tmp'])
  })

  it('cd .. sobe um nível', () => {
    const estado = { ...fs(), diretorio_atual: ['tmp', 'logs'] }
    const r = executarComando('cd ..', estado)
    expect(r.novo_estado.diretorio_atual).toEqual(['tmp'])
  })

  it('cd ~ volta para home', () => {
    const estado = { ...fs(), diretorio_atual: ['tmp'] }
    const r = executarComando('cd ~', estado)
    expect(r.novo_estado.diretorio_atual).toEqual(['home', 'agente'])
  })

  it('erro em diretório inexistente', () => {
    const r = executarComando('cd /naoexiste', fs())
    expect(r.saida).toContain('No such file or directory')
    expect(r.novo_estado.diretorio_atual).toEqual(['home', 'agente'])
  })

  it('erro em arquivo', () => {
    const r = executarComando('cd README.txt', fs())
    expect(r.saida).toContain('Not a directory')
  })

  it('permission denied em /root', () => {
    const r = executarComando('cd /root', fs())
    expect(r.saida).toContain('Permission denied')
  })
})

describe('cat', () => {
  it('lê conteúdo de arquivo', () => {
    const r = executarComando('cat README.txt', fs())
    expect(r.saida).toContain('Bem-vindo, Agente')
  })

  it('erro em diretório', () => {
    const r = executarComando('cat /tmp', fs())
    expect(r.saida).toContain('Is a directory')
  })

  it('erro em arquivo inexistente', () => {
    const r = executarComando('cat naoexiste.txt', fs())
    expect(r.saida).toContain('No such file or directory')
  })

  it('lê arquivo com path absoluto', () => {
    const r = executarComando('cat /etc/passwd', fs())
    expect(r.saida).toContain('root:x:0:0')
  })
})

describe('grep', () => {
  it('encontra padrão em arquivo', () => {
    const r = executarComando('grep VESPAS /etc/passwd', fs())
    expect(r.saida).toContain('VESPAS{usuarios_do_sistema_contam_historias}')
  })

  it('retorna vazio se não encontra', () => {
    const r = executarComando('grep NAOEXISTE /etc/passwd', fs())
    expect(r.saida).toBe('')
  })

  it('grep -r busca recursivamente', () => {
    const r = executarComando('grep -r VESPAS /var/www', fs())
    expect(r.saida).toContain('VESPAS{credenciais_no_codigo_sao_crime}')
    expect(r.saida).toContain('config.php')
  })

  it('erro em arquivo inexistente', () => {
    const r = executarComando('grep padrão /naoexiste', fs())
    expect(r.saida).toContain('No such file or directory')
  })
})

describe('find', () => {
  it('encontra arquivo profundo', () => {
    const r = executarComando('find /opt -name flag7.txt', fs())
    expect(r.saida).toContain('flag7.txt')
  })

  it('retorna vazio se não encontra', () => {
    const r = executarComando('find /opt -name naoexiste.txt', fs())
    expect(r.saida).toBe('')
  })

  it('erro sem -name', () => {
    const r = executarComando('find /opt', fs())
    expect(r.saida).toContain('uso:')
  })
})

describe('base64', () => {
  it('decodifica arquivo base64', () => {
    const r = executarComando('base64 -d /var/www/html/uploads/backup.b64', fs())
    expect(r.saida).toContain('VESPAS{base64_nao_e_criptografia}')
  })

  it('pipe cat | base64 -d', () => {
    const r = executarComando('cat /var/www/html/uploads/backup.b64 | base64 -d', fs())
    expect(r.saida).toContain('VESPAS{base64_nao_e_criptografia}')
  })

  it('erro em arquivo inexistente', () => {
    const r = executarComando('base64 -d /naoexiste.b64', fs())
    expect(r.saida).toContain('No such file or directory')
  })
})

describe('&&', () => {
  it('cd && cat funciona em sequência', () => {
    const r = executarComando('cd /tmp/notas && cat plano.txt', fs())
    expect(r.saida).toContain('VESPAS{navegacao_e_poder}')
    expect(r.novo_estado.diretorio_atual).toEqual(['tmp', 'notas'])
  })
})

describe('comando não suportado', () => {
  it('retorna command not found', () => {
    const r = executarComando('sudo apt-get install nmap', fs())
    expect(r.saida).toContain('command not found')
  })
})

describe('echo', () => {
  it('repete o texto', () => {
    const r = executarComando('echo hello world', fs())
    expect(r.saida).toBe('hello world')
  })
})

describe('help', () => {
  it('lista comandos', () => {
    const r = executarComando('help', fs())
    expect(r.saida).toContain('ls')
    expect(r.saida).toContain('grep')
    expect(r.saida).toContain('find')
  })
})

describe('clear e hint', () => {
  it('clear retorna __CLEAR__', () => {
    expect(executarComando('clear', fs()).saida).toBe('__CLEAR__')
  })

  it('hint retorna __HINT__', () => {
    expect(executarComando('hint', fs()).saida).toBe('__HINT__')
  })
})
