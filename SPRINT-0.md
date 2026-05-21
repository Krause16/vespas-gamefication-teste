# Sprint 0 — Fundação Técnica

**Objetivo:** Repositório configurado, stack rodando, identidade VESPAS
aplicada nos componentes base. Ao final deste sprint, o projeto deve
parecer o produto — visualmente correto — mesmo sem lógica de negócio.

---

## Prompt para Claude Code (Sprint 0)

Cole este bloco inteiro no Claude Code ao iniciar:

---

```
Leia o arquivo CLAUDE.md na raiz do projeto antes de qualquer ação.

Você vai executar o Sprint 0 da plataforma VESPAS. Objetivo: fundar o
projeto com toda a stack configurada e os componentes visuais base prontos.

AÇÕES A EXECUTAR (nesta ordem):

1. CRIAR PROJETO NEXT.JS
   npx create-next-app@latest . --typescript --tailwind --eslint --app
   --src-dir --import-alias "@/*" --no-turbopack

2. INSTALAR DEPENDÊNCIAS
   npm install framer-motion zustand @supabase/supabase-js
   npm install lucide-react
   npm install -D @types/node

   Para shadcn/ui:
   npx shadcn@latest init
   (selecionar: Default style, Zinc base color, CSS variables: yes)

   Componentes shadcn necessários agora:
   npx shadcn@latest add button card badge progress tabs toast

3. CONFIGURAR TAILWIND
   Editar tailwind.config.ts para adicionar os tokens VESPAS conforme
   docs/identidade.md, seção "Tailwind config".

4. CONFIGURAR GLOBALS.CSS
   Adicionar todas as CSS variables VESPAS em :root conforme
   docs/identidade.md, seções 1 e 2.
   Incluir a regra prefers-reduced-motion.
   Configurar font-family como variáveis CSS.

5. CONFIGURAR FONTES
   Em src/app/layout.tsx, configurar Montserrat e JetBrains Mono via
   next/font/google. Azonix via next/font/local (o arquivo será adicionado
   depois — deixar o fallback Montserrat Black por agora com TODO visível).

6. CRIAR COMPONENTES VESPAS BASE

   a) src/components/vespas/Logo.tsx
      - Wordmark "VESPAS" em Azonix (fallback Montserrat Black)
      - Props: size ('sm' | 'md' | 'lg'), variant ('full' | 'icon-only' | 'text-only')
      - Cor configurável por prop, default: --vespa-nevoa

   b) src/components/vespas/Hexagono.tsx
      - Polígono hexagonal usando clip-path
      - Props: size (number em px), fill (string), children (ReactNode)
      - Usar: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)

   c) src/components/vespas/GlowCard.tsx
      - Card com efeito de borda e glow esmeralda em hover
      - Props: children, className, glowColor (default: --vespa-esmeralda)

   d) src/components/vespas/VespaBackground.tsx
      - Background decorativo com padrão de hexágonos sutis
      - SVG pattern repetido, opacidade muito baixa (~0.05)
      - Para usar como bg de telas

7. CRIAR LAYOUT PRINCIPAL
   src/app/layout.tsx com:
   - Meta tags (viewport, theme-color: #2e2e2e)
   - Fontes configuradas
   - Background: var(--color-bg)
   - Nenhum padding/margin global (cada página define o seu)

8. CRIAR PÁGINA HOME TEMPORÁRIA
   src/app/page.tsx — apenas uma tela de splash mostrando:
   - Logo VESPAS centralizado
   - Tagline: "Plataforma em construção"
   - Versão atual
   - (Não é a tela final — só prova que a stack está funcionando)

9. CONFIGURAR VARIÁVEIS DE AMBIENTE
   Criar .env.local com:
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   (valores vazios por ora — Sprint 2 configura o Supabase)

   Criar .env.example com as mesmas chaves (este vai pro git)

10. CONFIGURAR .GITIGNORE
    Garantir que .env.local está ignorado.

11. TYPE-CHECK E LINT
    Rodar: npm run type-check && npm run lint
    Corrigir todos os erros antes de considerar pronto.

RESULTADO ESPERADO:
- npm run dev roda sem erros
- Página home exibe logo VESPAS com background grafite
- npm run type-check: zero erros
- npm run lint: zero warnings
- Componentes vespas/ exportados e importáveis
```

---

## O que NÃO fazer no Sprint 0

- Não criar rotas além da home temporária
- Não conectar ao Supabase (Sprint 2)
- Não criar lógica de jogo
- Não instalar dependências além das listadas acima

---

## Verificação manual após Sprint 0

Abra `localhost:3000` e confirme:
- [ ] Fundo grafite (#2e2e2e) visível
- [ ] Logo VESPAS renderizando (mesmo que em fallback de fonte)
- [ ] Sem erros no console do navegador
- [ ] Inspetor de elementos mostra CSS variables VESPAS definidas em :root
