import { type Dica } from '@/types/terminal-ctf'

export const DICAS: Dica[] = [
  // Flag 1
  { flag_numero: 1, nivel: 1, texto: 'Você já leu todos os arquivos do seu diretório inicial?', custo_pontos: 5 },
  { flag_numero: 1, nivel: 2, texto: 'Use o comando cat para ler arquivos de texto.', custo_pontos: 12 },
  { flag_numero: 1, nivel: 3, texto: 'Digite: cat README.txt', custo_pontos: 25 },

  // Flag 2
  { flag_numero: 2, nivel: 1, texto: 'Há um arquivo que menciona outros locais no servidor.', custo_pontos: 5 },
  { flag_numero: 2, nivel: 2, texto: 'Leia o arquivo missao.txt. Ele menciona um diretório.', custo_pontos: 12 },
  { flag_numero: 2, nivel: 3, texto: 'cd /tmp/notas && cat plano.txt', custo_pontos: 25 },

  // Flag 3
  { flag_numero: 3, nivel: 1, texto: 'Nem todo arquivo aparece com ls normal.', custo_pontos: 5 },
  { flag_numero: 3, nivel: 2, texto: 'Arquivos que começam com ponto são ocultos. Use ls -a para vê-los.', custo_pontos: 12 },
  { flag_numero: 3, nivel: 3, texto: 'cd /tmp/logs && ls -a — veja o que aparece', custo_pontos: 25 },

  // Flag 4
  { flag_numero: 4, nivel: 1, texto: 'O arquivo /etc/passwd lista os usuários do sistema.', custo_pontos: 5 },
  { flag_numero: 4, nivel: 2, texto: 'Use grep para buscar padrões em arquivos de texto.', custo_pontos: 12 },
  { flag_numero: 4, nivel: 3, texto: 'grep VESPAS /etc/passwd', custo_pontos: 25 },

  // Flag 5
  { flag_numero: 5, nivel: 1, texto: 'Desenvolvedores às vezes deixam segredos em arquivos de configuração.', custo_pontos: 5 },
  { flag_numero: 5, nivel: 2, texto: 'O servidor web tem arquivos em /var/www. grep -r busca recursivamente.', custo_pontos: 12 },
  { flag_numero: 5, nivel: 3, texto: 'grep -r VESPAS /var/www', custo_pontos: 25 },

  // Flag 6
  { flag_numero: 6, nivel: 1, texto: 'Há um arquivo de backup no servidor web. Ele parece codificado.', custo_pontos: 5 },
  { flag_numero: 6, nivel: 2, texto: 'A extensão .b64 sugere codificação base64. base64 -d decodifica.', custo_pontos: 12 },
  { flag_numero: 6, nivel: 3, texto: 'cat /var/www/html/uploads/backup.b64 | base64 -d', custo_pontos: 25 },

  // Flag 7
  { flag_numero: 7, nivel: 1, texto: 'Há arquivos enterrados em subdiretórios muito profundos.', custo_pontos: 5 },
  { flag_numero: 7, nivel: 2, texto: 'O comando find busca arquivos em toda uma árvore de diretórios.', custo_pontos: 12 },
  { flag_numero: 7, nivel: 3, texto: 'find /opt -name "flag7.txt"', custo_pontos: 25 },
]

export function obterProximaDica(
  flag_numero: number,
  dicas_usadas: Array<{ flag_numero: number; nivel: number }>,
): Dica | null {
  const nivelUsado = dicas_usadas
    .filter((d) => d.flag_numero === flag_numero)
    .reduce((max, d) => Math.max(max, d.nivel), 0)

  const proximo_nivel = (nivelUsado + 1) as 1 | 2 | 3
  if (proximo_nivel > 3) return null

  return DICAS.find((d) => d.flag_numero === flag_numero && d.nivel === proximo_nivel) ?? null
}
