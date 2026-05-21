# Identidade Visual VESPAS — Design Tokens

Fonte primária: Manual de Marca VESPAS (UTFPR Curitiba).
Este documento é a tradução desse manual em tokens de desenvolvimento.

---

## 1. Cores

### Paleta primária

```css
/* globals.css — raiz de todos os tokens de cor */
:root {
  /* Fundação */
  --vespa-grafite:      #2e2e2e;
  --vespa-esmeralda:    #39ff14;
  --vespa-nevoa:        #d9e2ec;

  /* Funcionais */
  --vespa-azul-link:    #0d70ce;
  --vespa-cripto:       #1f4e79;
  --vespa-firewall:     #27746e;
  --vespa-circuito:     #649f17;
  --vespa-cobre:        #ad550a;
}
```

### Mapeamento semântico

| Token semântico | Valor | Uso |
|---|---|---|
| `--color-bg` | `var(--vespa-grafite)` | Background de todas as telas |
| `--color-bg-card` | `#1a1a1a` | Fundo de cards e painéis |
| `--color-bg-elevated` | `#3a3a3a` | Elementos elevados sobre o bg |
| `--color-text-primary` | `var(--vespa-nevoa)` | Texto principal |
| `--color-text-secondary` | `#8899a8` | Texto secundário, labels |
| `--color-text-disabled` | `#4a4a4a` | Texto desabilitado |
| `--color-accent` | `var(--vespa-esmeralda)` | Acento, vitórias, CTAs destaque |
| `--color-accent-glow` | `rgba(57,255,20,0.25)` | Box-shadow de glow esmeralda |
| `--color-primary` | `var(--vespa-azul-link)` | Ação primária (botões, links) |
| `--color-safe` | `var(--vespa-firewall)` | Estado seguro, resposta correta |
| `--color-danger` | `var(--vespa-cobre)` | Alerta, ataque, resposta errada |
| `--color-border` | `rgba(212,226,236,0.12)` | Bordas sutis |
| `--color-border-strong` | `rgba(212,226,236,0.28)` | Bordas mais visíveis |

### Tailwind config

```js
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      vespa: {
        grafite:    'var(--vespa-grafite)',
        esmeralda:  'var(--vespa-esmeralda)',
        nevoa:      'var(--vespa-nevoa)',
        azulLink:   'var(--vespa-azul-link)',
        cripto:     'var(--vespa-cripto)',
        firewall:   'var(--vespa-firewall)',
        circuito:   'var(--vespa-circuito)',
        cobre:      'var(--vespa-cobre)',
      },
    },
    backgroundColor: {
      base:     'var(--color-bg)',
      card:     'var(--color-bg-card)',
      elevated: 'var(--color-bg-elevated)',
    },
    textColor: {
      primary:   'var(--color-text-primary)',
      secondary: 'var(--color-text-secondary)',
    },
  }
}
```

---

## 2. Tipografia

### Fontes

| Fonte | Uso | Arquivo |
|---|---|---|
| **Azonix** | SOMENTE o wordmark "VESPAS" | `public/fonts/Azonix.woff2` |
| **Montserrat** | Todo o resto (UI, corpo, títulos) | Google Fonts ou self-hosted |
| **JetBrains Mono** | Terminal (Jogo 3), código, hashes | Google Fonts ou self-hosted |

### Hierarquia tipográfica

```css
/* Escala de tamanhos — mobile-first */
--text-xs:   0.75rem;   /* 12px — labels, metadados */
--text-sm:   0.875rem;  /* 14px — corpo secundário */
--text-base: 1rem;      /* 16px — corpo principal (MÍNIMO em mobile) */
--text-lg:   1.125rem;  /* 18px — subtítulos */
--text-xl:   1.25rem;   /* 20px — títulos de seção */
--text-2xl:  1.5rem;    /* 24px — títulos de tela */
--text-3xl:  1.875rem;  /* 30px — display */
--text-4xl:  2.25rem;   /* 36px — hero */
```

### Carregamento das fontes (next/font)

```tsx
// src/app/layout.tsx
import { Montserrat, JetBrains_Mono } from 'next/font/google'
import localFont from 'next/font/local'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const azonix = localFont({
  src: '../public/fonts/Azonix.woff2',
  variable: '--font-display',
  display: 'swap',
})
```

**CRÍTICO:** A fonte Azonix está em `public/fonts/Azonix.woff2`.
Se o arquivo não existir, usar Montserrat Black como fallback
e deixar um `// TODO: adicionar Azonix.woff2` visível.

---

## 3. Elementos visuais de marca

### Hexágono

Elemento estrutural da marca (do manual de marca). Usar como:
- Grid de seleção de jogos no hub
- Conquistas e badges
- Células do ranking
- Elementos decorativos de background

Componente base em `src/components/vespas/Hexagono.tsx`.

```tsx
// Proporção correta de hexágono regular
// height = width * (√3/2) ≈ width * 0.866
// Usar clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)
```

### Curvas de circuito

Elemento decorativo (do manual de marca). Usar como:
- Transições entre telas (Framer Motion path animation)
- Separadores de seção
- Background de telas de loading

### Logo / Vespa Esmeralda

- SVG em `public/marca/vespa.svg`
- SVG em `public/marca/logo-completo.svg` (vespa + wordmark)
- Não distorcer proporções
- Respeitar margem de segurança: 3× a altura da letra "E" do wordmark

---

## 4. Efeitos e animações

### Glow esmeralda

Usado em: vitórias, acertos, CTAs de destaque, bordas de elementos ativos.

```css
.glow-esmeralda {
  box-shadow:
    0 0 8px var(--color-accent-glow),
    0 0 24px var(--color-accent-glow),
    0 0 48px rgba(57,255,20,0.1);
}
```

### Durations padrão (Framer Motion)

```ts
export const DURATION = {
  instant:  0.08,
  fast:     0.15,
  normal:   0.25,
  slow:     0.4,
  entering: 0.35,
} as const

export const EASE = {
  out:     [0.0, 0.0, 0.2, 1.0],
  in:      [0.4, 0.0, 1.0, 1.0],
  inOut:   [0.4, 0.0, 0.2, 1.0],
  spring:  { type: 'spring', stiffness: 400, damping: 30 },
} as const
```

### Transição de entrada de tela

Padrão para todas as páginas: fade + translateY(+8px) → posição final.
Duração: 0.35s, ease: out.

---

## 5. Componentes de interface — guia de uso

### Botão primário

```
Background: --color-primary (#0d70ce)
Text: --vespa-nevoa
Border: none
Border-radius: 8px
Padding: 14px 24px
Font: Montserrat SemiBold 16px
Hover: brightness(1.1) + leve glow azul
Active: scale(0.97)
```

### Botão de acento (ações de destaque)

```
Background: --vespa-esmeralda (#39ff14)
Text: --vespa-grafite (preto sobre verde)
Border-radius: 8px
Padding: 14px 24px
Font: Montserrat Bold 16px
Hover: brightness(0.9) + glow esmeralda
```

### Card

```
Background: --color-bg-card (#1a1a1a)
Border: 1px solid --color-border
Border-radius: 12px
Padding: 20px
Sombra: 0 2px 12px rgba(0,0,0,0.4)
```

### Input

```
Background: #1a1a1a
Border: 1px solid --color-border-strong
Border-radius: 8px
Text: --color-text-primary
Placeholder: --color-text-secondary
Focus: border-color --color-primary + glow sutil azul
Font: Montserrat Regular 16px
Padding: 12px 16px
```

---

## 6. Responsividade

Mobile-first. Breakpoints:

```ts
// src/lib/breakpoints.ts
export const BP = {
  sm:  '640px',   // tablet pequeno
  md:  '768px',   // tablet
  lg:  '1024px',  // desktop pequeno
  xl:  '1280px',  // painel do instrutor (target)
} as const
```

O painel do instrutor (`/instrutor/sala/[codigo]`) é a única tela
desenvolvida desktop-first. Todas as demais: mobile-first.

---

## 7. Acessibilidade (mínimo obrigatório)

- Contraste texto/fundo mínimo 4.5:1 (WCAG AA) em todos os elementos
- Foco visível em todos os elementos interativos (outline personalizado na cor do acento)
- Todos os ícones decorativos com `aria-hidden="true"`
- Todos os ícones funcionais com `aria-label` descritivo
- Ordem de foco lógica (não quebrar com `tabindex` positivo)
- Animações respeitam `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
