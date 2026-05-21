# CLAUDE.md — Contrato de Desenvolvimento: Plataforma VESPAS

Leia este arquivo inteiro antes de qualquer ação. Ele é o contrato entre você
e o projeto. Decisões aqui são definitivas — não as questione, apenas siga-as.

---

## 1. O que é este projeto

Plataforma web gamificada de cibersegurança para o projeto de extensão VESPAS
(Vanguarda de Estudos em Segurança, Privacidade e Ameaças em Sistemas) da
UTFPR — Câmpus Curitiba.

**Propósito:** Ferramenta para oficinas em escolas públicas de Ensino
Fundamental II e Médio, ensinando cibersegurança por meio de jogos interativos.

**Ambição:** Produto de nível profissional que será utilizado por gerações
futuras de bolsistas do VESPAS. Cada linha de código deve ser escrita como se
outra pessoa fosse mantê-la amanhã — porque vai.

---

## 2. Decisões arquiteturais (não negociáveis)

### 2.1 Stack

| Camada | Tecnologia | Versão mínima |
|---|---|---|
| Framework | Next.js App Router | 14+ |
| Linguagem | TypeScript | 5+ (strict mode sempre) |
| Estilização | Tailwind CSS + CSS variables | 3.4+ |
| Animação | Framer Motion | 11+ |
| Estado global | Zustand | 4+ |
| Backend/Auth | Supabase | JS client 2+ |
| Componentes base | shadcn/ui customizado | latest |
| Ícones | Lucide React | latest |
| PWA | next-pwa | latest |
| Terminal (jogo 3) | xterm.js | 5+ |
| Áudio | Tone.js | 14+ |
| Testes | Vitest + Playwright | latest |

### 2.2 Plataforma

PWA mobile-first. O breakpoint base é 390px (iPhone 14). Desktop e tablet
são suportados mas não são o contexto primário. O painel do instrutor
(modo `/instrutor`) é a única exceção: otimizado para 1280px+ (projetor).

### 2.3 TypeScript

`strict: true` no tsconfig, sem exceções. Zero uso de `any`. Tipos explícitos
em todas as funções públicas. Se um tipo não existe, crie-o em
`src/types/[domínio].ts`.

### 2.4 CSS

Nunca use valores hardcoded de cor. Sempre use as CSS variables definidas
em `src/app/globals.css` (ver seção de identidade visual em `docs/identidade.md`).
Tailwind custom tokens mapeados sobre essas variables.

### 2.5 Banco de dados

Schema Supabase declarado em `supabase/migrations/`. Toda mudança de schema
é uma nova migration, nunca edição direta. Row Level Security (RLS) ativado
em todas as tabelas com dados de usuário.

---

## 3. Estrutura de pastas

```
/
├── CLAUDE.md                  ← você está aqui
├── docs/
│   ├── PRD.md                 ← visão completa do produto
│   ├── identidade.md          ← design tokens, tipografia, cores
│   └── jogos/
│       ├── n1-golpe-ta-ai.md  ← GDD completo do Jogo 1
│       ├── n2-detetive-osint.md
│       └── n3-terminal-ctf.md
├── src/
│   ├── app/
│   │   ├── (publico)/
│   │   │   ├── entrar/        ← entrada por código de gincana
│   │   │   └── solo/          ← modo solo sem gincana
│   │   ├── (aluno)/
│   │   │   ├── hub/           ← tela principal pós-entrada
│   │   │   └── jogos/
│   │   │       └── [slug]/    ← cada jogo é uma rota dinâmica
│   │   ├── (instrutor)/
│   │   │   └── sala/
│   │   │       └── [codigo]/  ← painel do instrutor
│   │   ├── api/               ← route handlers Next.js
│   │   ├── globals.css        ← CSS variables VESPAS
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                ← shadcn/ui customizado
│   │   ├── vespas/            ← componentes de marca (Logo, Hexágono, etc.)
│   │   └── jogos/             ← componentes compartilhados entre jogos
│   ├── lib/
│   │   ├── supabase/          ← client, server, tipos gerados
│   │   ├── jogos/             ← lógica de negócio de cada jogo (isolada)
│   │   │   ├── golpe-ta-ai/
│   │   │   ├── detetive-osint/
│   │   │   └── terminal-ctf/
│   │   └── utils.ts
│   ├── stores/                ← stores Zustand
│   ├── types/                 ← tipos TypeScript do domínio
│   └── hooks/                 ← hooks customizados
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── public/
│   ├── fonts/                 ← Azonix, Montserrat (self-hosted)
│   ├── marca/                 ← logo SVG, vespa SVG
│   └── manifest.json          ← PWA manifest
└── tests/
    ├── unit/
    └── e2e/
```

---

## 4. Identidade visual (resumo operacional)

Leia `docs/identidade.md` para especificação completa.
Resumo para uso imediato:

```css
/* Cores primárias */
--vespa-grafite:      #2e2e2e;   /* background principal (dark) */
--vespa-esmeralda:    #39ff14;   /* acento crítico, vitórias, glow */
--vespa-nevoa:        #d9e2ec;   /* texto sobre escuro */

/* Cores funcionais */
--vespa-azul-link:    #0d70ce;   /* ações primárias */
--vespa-cripto:       #1f4e79;   /* cards, segundo plano */
--vespa-firewall:     #27746e;   /* estados seguros */
--vespa-circuito:     #649f17;   /* sucesso secundário */
--vespa-cobre:        #ad550a;   /* alertas, ataques, perigo */
```

**Tipografia:**
- `font-display` = Azonix → SOMENTE para o wordmark "VESPAS"
- `font-body` = Montserrat → todo o resto
- `font-mono` = JetBrains Mono → terminal, código, CTF

**Vibe visual:** cyberpunk institucional. Escuro, glow esmeralda em momentos
de tensão/vitória, hexágonos como elemento estrutural, curvas de circuito como
elemento decorativo. Não é Matrix. Não é néon anos 80. É preciso, técnico,
sério — mas com personalidade.

---

## 5. Convenções de código

### Nomenclatura
- Componentes: PascalCase (`MensagemCard.tsx`)
- Hooks: camelCase com prefixo `use` (`useGincana.ts`)
- Stores: camelCase com sufixo `Store` (`gincanStore.ts`)
- Tipos: PascalCase com sufixo descritivo (`MensagemFraude`, `ResultadoJogo`)
- Constantes: SNAKE_UPPER_CASE
- Arquivos de rota Next.js: lowercase com hífens

### Componentes
- Funcionais sempre. Zero class components.
- Props tipadas com interface própria no topo do arquivo.
- Exportação nomeada para componentes, default para páginas.
- Separar lógica de negócio da apresentação: hooks para lógica, JSX limpo.

### Comentários
- Comente o **porquê**, não o **o quê**.
- Decisões arquiteturais não óbvias merecem bloco JSDoc.
- Sem comentários `// TODO` sem issue associada.

---

## 6. Domínio e glossário

| Termo | Definição no código |
|---|---|
| `Gincana` | Sessão competitiva ao vivo conduzida pelo instrutor |
| `Sala` | Instância de uma Gincana, identificada por código de 6 dígitos |
| `Equipe` | Grupo de alunos dentro de uma Sala |
| `Jogador` | Aluno individual (pode estar em equipe ou no modo solo) |
| `Jogo` | Um dos mini-games da plataforma (identificado por `slug`) |
| `Sessao` | Uma jogada completa de um Jogador em um Jogo |
| `Pontuacao` | Score de uma Sessão (lógica específica por jogo) |
| `Instrutor` | Membro do VESPAS que conduz a Gincana |
| `Nivel` | Nível de dificuldade (1, 2 ou 3) |
| `Slug` | Identificador de URL de um Jogo (`golpe-ta-ai`, `detetive-osint`, `terminal-ctf`) |

---

## 7. Comandos do projeto

```bash
# Instalar dependências
npm install

# Desenvolvimento local
npm run dev

# Build de produção
npm run build

# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Type check
npm run type-check

# Lint
npm run lint

# Supabase local
npx supabase start
npx supabase db reset
```

---

## 8. Ordem de desenvolvimento (Sprints)

Siga esta ordem. Não antecipe sprints.

| Sprint | Entregável | Status |
|---|---|---|
| 0 | Fundação: setup Next.js, Tailwind VESPAS, fontes, componentes base, layout | ⬜ |
| 1 | Identidade & Hub: tela de entrada por código, hub do aluno, navegação | ⬜ |
| 2 | Supabase: schema, auth anônima, RLS | ⬜ |
| 3 | Jogo 1 completo: O Golpe Tá Aí | ⬜ |
| 4 | Sistema de Gincana: sala, painel instrutor, ranking realtime | ⬜ |
| 5 | Jogo 2 completo: Detetive OSINT | ⬜ |
| 6 | Jogo 3 completo: Terminal CTF | ⬜ |
| 7 | PWA, polimento, testes, modo solo | ⬜ |

---

## 9. Qualidade — definição de "pronto"

Um sprint só está concluído quando:
- [ ] TypeScript compila sem erros (`npm run type-check` limpo)
- [ ] Lint passa sem warnings (`npm run lint` limpo)
- [ ] Componentes novos têm testes unitários
- [ ] Funciona em Chrome Mobile (simulador 390px)
- [ ] Funciona em Safari iOS (quirks de PWA)
- [ ] Acessibilidade básica: contraste WCAG AA, foco visível, aria-labels
- [ ] Zero `console.log` em código de produção

---

## 10. O que NUNCA fazer

- Nunca usar `any` em TypeScript
- Nunca hardcodar cores — sempre CSS variables
- Nunca criar componentes monolíticos com mais de 200 linhas de JSX
- Nunca misturar lógica de negócio com lógica de apresentação no mesmo arquivo
- Nunca commitar credenciais ou `.env` com valores reais
- Nunca ignorar erros do Supabase — sempre tratar explicitamente
- Nunca criar migration "destrutiva" sem comentário explicando o motivo
