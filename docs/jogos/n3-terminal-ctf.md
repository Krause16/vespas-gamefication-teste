# GDD — Jogo 3: Terminal CTF

**Slug:** `terminal-ctf`  
**Nível:** 3 (Defesa Ativa)  
**Tema-âncora:** Mentalidade de Hacker Ético e Linux  
**Faixa-alvo:** 3º ano EM  
**Duração estimada:** 25–40 minutos  
**Sprint de desenvolvimento:** Sprint 6

---

## 1. Conceito central

Terminal Linux funcional no navegador. O aluno navega um filesystem fictício
de um servidor comprometido, encontrando 7 flags escondidas com técnicas
crescentes. Nenhuma animação fingindo ser terminal — é xterm.js de verdade,
respondendo a comandos reais.

**Por que é o terceiro jogo:** É o boss. Requer mais tempo, mais foco, e
entrega o maior impacto vocacional. Alunos do 3º ano saem sabendo que existe
uma carreira em segurança — e que eles são capazes de começar nela.

---

## 2. Filesystem simulado

O servidor fictício tem a seguinte estrutura. O aluno começa em `/home/agente`.

```
/
├── home/
│   └── agente/          ← diretório inicial do aluno
│       ├── README.txt
│       └── missao.txt
├── var/
│   └── www/
│       └── html/
│           ├── index.html
│           ├── config.php     ← contém credencial hardcoded (Flag 5)
│           └── uploads/
│               └── backup.b64 ← arquivo base64 (Flag 6)
├── tmp/
│   ├── logs/
│   │   ├── acesso.log
│   │   ├── erro.log
│   │   └── .invasor.log   ← arquivo oculto (Flag 3)
│   └── notas/
│       └── plano.txt
├── etc/
│   └── passwd             ← versão fictícia segura (Flag 4 — grep)
├── opt/
│   └── segredo/
│       └── nivel1/
│           └── nivel2/
│               └── nivel3/
│                   └── flag7.txt  ← find necessário (Flag 5 é aqui na verdade)
└── root/
    └── (sem permissão)    ← Permission denied simulado
```

**Conteúdo dos arquivos-chave:**

```
# /home/agente/README.txt
Bem-vindo, Agente.
Este servidor foi comprometido às 03:47 de hoje.
O invasor deixou rastros. Encontre as 7 flags.
Cada flag tem o formato: VESPAS{texto_aqui}

Comece pelo básico. Você sabe o que fazer.

# /home/agente/missao.txt
MISSÃO CLASSIFICADA — OPERAÇÃO SERVIDOR ZERO
Status: COMPROMETIDO
Objetivo: Localizar evidências deixadas pelo invasor
Prazo: Antes do backup ser sobrescrito
Flag 1: Está bem na sua frente. Só olhe.

# /tmp/notas/plano.txt
o ataque foi em 3 etapas
primeiro consegui acesso via ssh com senha fraca
depois fiz upload do webshell
a flag tá nos logs mas eles nao vao achar facil
VESPAS{eng_social_eh_a_porta_de_entrada}    ← Flag 4

# /tmp/logs/.invasor.log  (arquivo oculto)
[03:47:12] Login bem-sucedido: admin/admin123
[03:47:45] Upload: webshell.php
[03:48:01] Execução remota ativada
[03:48:33] VESPAS{arquivos_ocultos_escondem_segredos}   ← Flag 3

# /etc/passwd (fictício)
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
agente:x:1000:1000:Agente VESPAS:/home/agente:/bin/bash
invasor:x:1337:1337:VESPAS{usuarios_do_sistema_contam_historias}:/tmp:/bin/sh
# ↑ Flag 4 via grep

# /var/www/html/config.php
<?php
// NUNCA commitar credenciais — VESPAS{credenciais_no_codigo_sao_crime}
$db_host = "localhost";
$db_user = "webadmin";
$db_pass = "Tr0ub4dor&3";
$db_name = "escola_db";
?>
# ↑ Flag 5

# /var/www/html/uploads/backup.b64
(conteúdo base64 que decodifica para texto com a Flag 6)
VkVTUEFTe2Jhc2U2NF9uYW9fZV9jcmlwdG9ncmFmaWF9
# decodifica para: VESPAS{base64_nao_e_criptografia}   ← Flag 6

# /opt/segredo/nivel1/nivel2/nivel3/flag7.txt
Parabéns. Você chegou ao fim.
VESPAS{find_e_a_arma_do_investigador}    ← Flag 7
```

**Flags e técnica necessária:**

| # | Flag | Técnica | Arquivo |
|---|---|---|---|
| 1 | `VESPAS{bem_vindo_ao_terminal}` | `cat README.txt` | /home/agente/README.txt |
| 2 | `VESPAS{navegacao_e_poder}` | `cd /tmp/notas && cat missao.txt` | /home/agente/missao.txt menciona /tmp |
| 3 | `VESPAS{arquivos_ocultos_escondem_segredos}` | `ls -a /tmp/logs && cat .invasor.log` | /tmp/logs/.invasor.log |
| 4 | `VESPAS{usuarios_do_sistema_contam_historias}` | `grep VESPAS /etc/passwd` | /etc/passwd |
| 5 | `VESPAS{credenciais_no_codigo_sao_crime}` | `grep -r VESPAS /var/www` | /var/www/html/config.php |
| 6 | `VESPAS{base64_nao_e_criptografia}` | `cat backup.b64 \| base64 -d` | /var/www/html/uploads/backup.b64 |
| 7 | `VESPAS{find_e_a_arma_do_investigador}` | `find /opt -name "flag7.txt"` | /opt/segredo/.../flag7.txt |

---

## 3. Comandos suportados pelo terminal simulado

O simulador implementa apenas estes comandos (rejeita outros com mensagem adequada):

```ts
type ComandoSuportado =
  | 'ls'        // ls, ls -a, ls -la, ls [path]
  | 'cd'        // cd [path], cd .., cd ~
  | 'cat'       // cat [arquivo]
  | 'pwd'       // mostra diretório atual
  | 'grep'      // grep [padrão] [arquivo], grep -r [padrão] [dir]
  | 'find'      // find [dir] -name [nome]
  | 'echo'      // echo [texto]
  | 'base64'    // base64 -d [arquivo] ou cat x | base64 -d
  | 'clear'     // limpa o terminal
  | 'help'      // lista comandos disponíveis
  | 'hint'      // sistema de dicas
```

**Respostas a comandos não suportados:**
```
$ sudo rm -rf /
bash: sudo: command not found (este ambiente é restrito)

$ python3
bash: python3: command not found

$ whoami
agente
```

---

## 4. Sistema de dicas

Acionado pelo comando `hint` ou botão na UI.

```ts
interface Dica {
  flag_numero: number
  nivel: 1 | 2 | 3
  texto: string
  custo_pontos: number
}

const DICAS: Dica[] = [
  // Flag 1
  { flag_numero: 1, nivel: 1, texto: "Você já leu todos os arquivos do seu diretório inicial?", custo_pontos: 5 },
  { flag_numero: 1, nivel: 2, texto: "Use o comando cat para ler arquivos de texto.", custo_pontos: 12 },
  { flag_numero: 1, nivel: 3, texto: "Digite: cat README.txt", custo_pontos: 25 },

  // Flag 2
  { flag_numero: 2, nivel: 1, texto: "Há um arquivo que menciona outros locais no servidor.", custo_pontos: 5 },
  { flag_numero: 2, nivel: 2, texto: "Leia o arquivo missao.txt. Ele menciona um diretório.", custo_pontos: 12 },
  { flag_numero: 2, nivel: 3, texto: "cd /tmp/notas && cat missao.txt", custo_pontos: 25 },

  // Flag 3
  { flag_numero: 3, nivel: 1, texto: "Nem todo arquivo aparece com ls normal.", custo_pontos: 5 },
  { flag_numero: 3, nivel: 2, texto: "Arquivos que começam com ponto são ocultos. Use ls -a para vê-los.", custo_pontos: 12 },
  { flag_numero: 3, nivel: 3, texto: "cd /tmp/logs && ls -a — veja o que aparece", custo_pontos: 25 },

  // ... demais flags
]
```

O terminal exibe quanto de pontos será descontado antes de confirmar.
Não há limite de dicas, mas a pontuação pode zerar.

---

## 5. Interface

### 5.1 Layout

```
┌─────────────────────────────────────────────────────┐
│  ⬅  TERMINAL CTF         Flags: ●●●○○○○  720pts    │
├────────────────────┬────────────────────────────────┤
│                    │  MISSÃO ATIVA                  │
│  $ cat README.txt  │  ─────────────────────────     │
│  Bem-vindo...      │  Flag 1 ✅ VESPAS{bem_vindo}   │
│                    │  Flag 2 ✅                     │
│  $ cd /tmp/logs    │  Flag 3 ✅                     │
│  $ ls -a           │  Flag 4 ⬜ Localizar           │
│  .  ..  acesso.log │  Flag 5 ⬜ Em busca            │
│  erro.log          │  Flag 6 ⬜ Encoding            │
│  .invasor.log  ←   │  Flag 7 ⬜ Explorar            │
│                    │  ─────────────────────────     │
│  $ _               │  [ DICA -5pts ]                │
│                    │                                │
└────────────────────┴────────────────────────────────┘
```

**Mobile:** painel lateral deslizável (swipe da direita). Terminal ocupa 100% da largura por padrão.

### 5.2 Estilo do terminal

```ts
// Configuração xterm.js
const terminalOptions = {
  theme: {
    background:  '#0d0d0d',     // quase preto
    foreground:  '#d9e2ec',     // vespa névoa
    cursor:      '#39ff14',     // esmeralda
    cursorAccent:'#0d0d0d',
    selection:   'rgba(57,255,20,0.3)',
    black:       '#2e2e2e',
    green:       '#39ff14',     // output de sucesso
    yellow:      '#ad550a',     // alertas
    blue:        '#0d70ce',     // links/info
    red:         '#cc3333',     // erros
    white:       '#d9e2ec',
  },
  fontFamily: '"JetBrains Mono", "Cascadia Code", monospace',
  fontSize: 14,
  lineHeight: 1.5,
  cursorBlink: true,
  cursorStyle: 'block',
}
```

### 5.3 Animação de flag encontrada

Quando o aluno encontra uma flag:
1. O texto da flag aparece em verde com glow esmeralda
2. Painel lateral pulsa com animação
3. Flag item no painel muda de ⬜ para ✅ com animação de check
4. Som de "unlock" curto (Tone.js)
5. Notificação toast: "+[X] pontos — Flag [N] encontrada!"

### 5.4 Debriefing de cada flag

Após confirmar a flag com `submit VESPAS{...}` ou automaticamente (quando cat/grep retorna flag):

```
┌─────────────────────────────────────────────┐
│  ✅ FLAG 3 ENCONTRADA                       │
│                                             │
│  "Arquivos ocultos escondem segredos"       │
│                                             │
│  Você aprendeu:                             │
│  No Linux, arquivos que começam com '.'     │
│  são ocultos por padrão. Atacantes usam     │
│  isso para esconder ferramentas maliciosas. │
│  ls -a é um dos primeiros comandos que um  │
│  analista de segurança usa ao investigar   │
│  um servidor suspeito.                     │
│                                             │
│         [ CONTINUAR ]                       │
└─────────────────────────────────────────────┘
```

---

## 6. Lógica de pontuação

```ts
const PONTOS_POR_FLAG = [80, 80, 100, 120, 140, 160, 200]  // flags 1–7
const CUSTO_DICA = [5, 12, 25]  // por nível de dica

function calcularBonusVelocidade(tempoMs: number): number {
  const minutos = tempoMs / 60000
  if (minutos <= 15) return 300
  if (minutos <= 20) return 150
  if (minutos <= 30) return 50
  return 0
}

// Pontuação máxima teórica sem dicas em ≤15min: 880 + 300 = 1180
```

---

## 7. Implementação do terminal simulado

O terminal NÃO usa um processo real de servidor. É uma máquina de estados
em TypeScript que simula o filesystem e responde a comandos.

```ts
// src/lib/jogos/terminal-ctf/filesystem.ts

export interface Arquivo {
  nome: string
  conteudo: string
  oculto: boolean      // começa com '.'
  executavel: boolean
  permissao: 'leitura' | 'negado'
}

export interface Diretorio {
  nome: string
  oculto: boolean
  filhos: (Arquivo | Diretorio)[]
}

export interface EstadoFilesystem {
  raiz: Diretorio
  diretorio_atual: string[]   // path como array, ex: ['home', 'agente']
}

export function executarComando(
  comando: string,
  args: string[],
  estado: EstadoFilesystem
): { saida: string; novo_estado: EstadoFilesystem; flag_encontrada?: string }
```

---

## 8. Componentes a criar

```
src/app/(aluno)/jogos/terminal-ctf/
  └── page.tsx

src/components/jogos/terminal-ctf/
  ├── TerminalCTFGame.tsx
  ├── TerminalWindow.tsx          ← wrapper do xterm.js
  ├── PainelMissao.tsx            ← flags e status lateral
  ├── FlagItem.tsx                ← item individual da lista
  ├── DebriefingFlag.tsx          ← modal após flag encontrada
  ├── SistemaDicas.tsx            ← botão e modal de dicas
  └── ResultadoFinal.tsx

src/lib/jogos/terminal-ctf/
  ├── filesystem.ts               ← estrutura e conteúdo do FS
  ├── comandos.ts                 ← interpretador de comandos
  ├── flags.ts                    ← definição das 7 flags
  ├── dicas.ts                    ← sistema de dicas
  └── index.ts
```

---

## 9. Critérios de "pronto"

- [ ] Terminal xterm.js funcional no navegador
- [ ] Todos os 10 comandos suportados implementados com comportamento correto
- [ ] Filesystem simulado completo com todos os arquivos
- [ ] Todas as 7 flags detectáveis e com debriefing
- [ ] Sistema de dicas funcionando e descontando pontuação
- [ ] Animação de flag encontrada implementada
- [ ] Painel lateral funcional no mobile (swipe)
- [ ] Pontuação calculada corretamente
- [ ] Sessão salva no Supabase
- [ ] Sem regressão nos Jogos 1 e 2 após merge
- [ ] Testa em iOS Safari (xterm.js tem quirks em Safari)
