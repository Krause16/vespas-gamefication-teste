import { type Flag } from '@/types/terminal-ctf'

export const PONTOS_POR_FLAG = [80, 80, 100, 120, 140, 160, 200] as const

export const FLAGS: Flag[] = [
  {
    numero: 1,
    texto: 'VESPAS{bem_vindo_ao_terminal}',
    tecnica: 'cat README.txt',
    arquivo: '/home/agente/README.txt',
    pontos: 80,
  },
  {
    numero: 2,
    texto: 'VESPAS{navegacao_e_poder}',
    tecnica: 'cd /tmp/notas && cat plano.txt',
    arquivo: '/tmp/notas/plano.txt',
    pontos: 80,
  },
  {
    numero: 3,
    texto: 'VESPAS{arquivos_ocultos_escondem_segredos}',
    tecnica: 'ls -a /tmp/logs && cat .invasor.log',
    arquivo: '/tmp/logs/.invasor.log',
    pontos: 100,
  },
  {
    numero: 4,
    texto: 'VESPAS{usuarios_do_sistema_contam_historias}',
    tecnica: 'grep VESPAS /etc/passwd',
    arquivo: '/etc/passwd',
    pontos: 120,
  },
  {
    numero: 5,
    texto: 'VESPAS{credenciais_no_codigo_sao_crime}',
    tecnica: 'grep -r VESPAS /var/www',
    arquivo: '/var/www/html/config.php',
    pontos: 140,
  },
  {
    numero: 6,
    texto: 'VESPAS{base64_nao_e_criptografia}',
    tecnica: 'cat backup.b64 | base64 -d',
    arquivo: '/var/www/html/uploads/backup.b64',
    pontos: 160,
  },
  {
    numero: 7,
    texto: 'VESPAS{find_e_a_arma_do_investigador}',
    tecnica: 'find /opt -name "flag7.txt"',
    arquivo: '/opt/segredo/nivel1/nivel2/nivel3/flag7.txt',
    pontos: 200,
  },
]

const FLAG_REGEX = /VESPAS\{[^}]+\}/g

export function detectarFlag(saida: string): Flag | null {
  const matches = saida.match(FLAG_REGEX)
  if (!matches) return null
  for (const match of matches) {
    const flag = FLAGS.find((f) => f.texto === match)
    if (flag) return flag
  }
  return null
}

export function calcularBonusVelocidade(tempoMs: number): number {
  const minutos = tempoMs / 60000
  if (minutos <= 15) return 300
  if (minutos <= 20) return 150
  if (minutos <= 30) return 50
  return 0
}
