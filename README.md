# VESPAS — Plataforma de Cibersegurança

Plataforma web gamificada de cibersegurança desenvolvida para o projeto de extensão **VESPAS** (Vanguarda de Estudos em Segurança, Privacidade e Ameaças em Sistemas) da **UTFPR — Câmpus Curitiba**.

Ferramenta utilizada em oficinas em escolas públicas de Ensino Fundamental II e Médio, ensinando cibersegurança por meio de jogos interativos.

---

## Stack tecnológica

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript 5 (strict) |
| Estilização | Tailwind CSS v4 |
| Animação | motion/react (Framer Motion 12) |
| Estado global | Zustand 5 |
| Backend/Auth | Supabase (auth anônima + RLS) |
| PWA | next-pwa |
| Terminal (Jogo 3) | xterm.js |
| Testes unitários | Vitest |
| Testes E2E | Playwright |

---

## Como rodar localmente

**1. Clone e instale:**

```bash
git clone <url-do-repo>
cd vespas-docs
npm install
```

**2. Configure variáveis de ambiente:**

```bash
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase
```

**3. Inicie o banco de dados local (opcional):**

```bash
npx supabase start
npx supabase db reset
```

**4. Rode o servidor de desenvolvimento:**

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## Comandos disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção (após build)
npm run lint         # ESLint
npm run type-check   # TypeScript sem emissão
npm run test         # Testes unitários (Vitest)
npx playwright test  # Testes E2E (requer servidor ativo)
```

---

## Estrutura de pastas resumida

```
src/
├── app/
│   ├── (publico)/entrar/   # Entrada por código de sala
│   ├── (publico)/solo/     # Modo solo (sem gincana)
│   ├── (aluno)/hub/        # Hub de missões do aluno
│   ├── (aluno)/jogos/      # Rota dinâmica dos jogos
│   └── (instrutor)/sala/   # Painel do instrutor
├── components/
│   ├── vespas/             # Componentes de marca (HexGrid, DesignSystem...)
│   ├── jogos/              # Componentes dos jogos
│   └── ui/                 # Componentes base (shadcn/ui)
├── lib/
│   ├── supabase/           # Cliente, auth, jogadores, sessões
│   └── jogos/              # Lógica de negócio de cada jogo
├── stores/                 # Zustand stores
├── types/                  # Tipos TypeScript do domínio
└── hooks/                  # Hooks customizados
```

---

## Deploy na Vercel

1. Importe o repositório em [vercel.com](https://vercel.com)
2. Adicione as variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
3. Deploy automático a cada push na branch `main`

---

## Jogos disponíveis

| Jogo | Slug | Descrição |
|---|---|---|
| O Golpe Tá Aí | `golpe-ta-ai` | Smartphone simulado com 5 apps — detecte mensagens fraudulentas |
| Detetive OSINT | `detetive-osint` | Investigue a pegada digital de um perfil público |
| Terminal CTF | `terminal-ctf` | Desafio em terminal Unix — capture as flags |

---

## Créditos

**VESPAS — UTFPR Câmpus Curitiba**
Projeto de extensão universitária em Segurança, Privacidade e Ameaças em Sistemas.
