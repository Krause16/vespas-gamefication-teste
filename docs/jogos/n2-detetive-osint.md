# GDD — Jogo 2: Detetive OSINT

**Slug:** `detetive-osint`  
**Nível:** 2 (Privacidade & Pegada Digital)  
**Tema-âncora:** OSINT e Privacidade  
**Faixa-alvo:** 1º e 2º ano EM  
**Duração estimada:** 18–25 minutos  
**Sprint de desenvolvimento:** Sprint 5

---

## 1. Conceito central

Jogo de investigação em três atos. No Ato 1, o aluno caça um alvo fictício
usando técnicas reais de OSINT. No Ato 2, descobre que foi caçado da mesma
forma. No Ato 3, aprende a se defender.

**Por que este é o Jogo 2:** Ato 2 é o momento pedagógico mais poderoso
da plataforma. É o único jogo com virada narrativa que fala diretamente
sobre o próprio aluno.

---

## 2. Estrutura de dados

```ts
// src/types/detetive-osint.ts

export type FonteOSINT =
  | 'rede_social_publica'
  | 'metadado_exif'
  | 'padrao_postagem'
  | 'geotagging'
  | 'conexao_social'
  | 'forum_publico'
  | 'imagem_publicada'

export interface PistaOSINT {
  id: string
  fonte: FonteOSINT
  conteudo: string              // texto descritivo da pista
  dado_revelado: string         // o que essa pista expõe
  pontos: number
  requer_pista?: string         // id de pista que deve ser descoberta antes
}

export interface AlvoFicticio {
  nome: string                  // "Luna"
  username: string              // "@luna_estudante"
  escola: string
  bairro: string
  rotina: string                // descrição da rotina diária
  vulnerabilidades: string[]    // pontos de exposição
  pistas: PistaOSINT[]
}

export interface PerfilAlunoFicticio {
  // preenchido pelo aluno na tela de intro, fingindo ser personagem
  apelido: string
  escola_ficticia: string
  bairro_ficticio: string
  rede_favorita: 'instagram' | 'tiktok' | 'twitter' | 'discord'
  posta_fotos_escola: boolean
  posta_localizacao: boolean
  perfil_publico: boolean
  melhor_amigo_online: boolean  // se tem amigos que sabe onde mora
}

export interface ScoreExposicao {
  total: number                 // 0–100
  categorias: {
    localizacao: number
    rotina: number
    conexoes: number
    emocional: number
  }
}

export interface AjustePrivacidade {
  id: string
  descricao: string
  reducao_score: number
  acao_real: string             // o que fazer na vida real
}

export interface EstadoJogo {
  fase: 'intro' | 'perfil' | 'ato1' | 'ato2_revelacao' | 'ato3_defesa' | 'resultado'
  perfil_aluno: PerfilAlunoFicticio | null
  pistas_descobertas: string[]          // ids de PistaOSINT
  score_exposicao_luna: ScoreExposicao
  score_exposicao_aluno: ScoreExposicao // calculado no Ato 2
  ajustes_aplicados: string[]           // ids de AjustePrivacidade
  pontuacao: number
  tempo_inicio: number
}
```

---

## 3. Fluxo de telas

### 3.0 Intro (20 segundos)

Animação: tela de "terminal de investigação" abrindo.
Texto datilografado: "ACESSO CONCEDIDO — OPERAÇÃO RASTRO DIGITAL"
Briefing narrativo sobre Luna e o caso.

### 3.1 Tela de Perfil (Ato 0, camuflado)

**O que o aluno vê:** "Antes de começar, crie seu agente encoberto"
**O que está acontecendo:** Coleta de dados para o Ato 2

Campos apresentados como "criação de personagem":
- Apelido do agente
- Escola onde estuda (fictícia — "Estadual Centro", "IFPR", etc.)
- Bairro onde mora (lista de bairros genéricos)
- Rede social favorita
- "Seu agente costuma postar fotos com localização ativa?" (sim/não)
- "Seu agente tem o perfil público?" (sim/não)
- "Tem um melhor amigo online que sabe onde você mora?" (sim/não)

**UX:** Layout de formulário disfarçado de "ficha de agente" com estética militar/tech. Não parece um quiz. Parece character creation de RPG.

### 3.2 Ato 1 — A Investigação

Layout dividido em dois painéis (no desktop) ou abas (no mobile):
- **Painel esquerdo / Aba "Evidências":** fontes disponíveis para investigar
- **Painel direito / Aba "Quadro":** pistas descobertas e score de exposição da Luna

**Fontes disponíveis (clicáveis):**

1. **Perfil Instagram de @luna_estudante (público)**
   - Foto de capa: uniforme escolar com nome da escola visível
   - Bio: "16 anos | Curitiba | amo fotografia 📸"
   - Última foto: selfie com localização "Shopping Mueller"
   - Pista revelada: escola + faixa etária + cidade

2. **Analisador de Metadados EXIF**
   - Aluno faz upload de uma foto de Luna (simulado — clica num botão)
   - Sistema exibe tabela de metadados falsa:
     ```
     Modelo: iPhone 13
     Data: 15/03/2025 às 14:32
     GPS: -25.4297° S, -49.2711° O
     ```
   - Link para Google Maps (fictício no jogo, não navega)
   - Pista revelada: localização precisa da casa

3. **TikTok @luna.fotos**
   - Vídeo fazendo dever de casa: fundo mostra janela com prédio específico
   - Vídeo "minha rotina": sai às 7h, volta às 12h30, faz musculação às 18h
   - Pista revelada: rotina semanal detalhada

4. **Discord — servidor "Fotógrafos de Curitiba"**
   - Mensagens públicas: menciona que vai a uma feira no domingo
   - Menciona preocupação com nota de matemática
   - Pista revelada: atividades do fim de semana + vulnerabilidade emocional

5. **Busca reversa de imagem (simulada)**
   - Foto de perfil de Luna aparece em outro site com nome completo
   - Pista revelada: nome completo

**Score de exposição de Luna:** sobe visualmente conforme pistas são descobertas.
Barra de progresso com ícones: 🏠 Localização | ⏰ Rotina | 👥 Conexões | 💭 Emocional

Quando score ≥ 80%: destrava "LOCALIZAÇÃO CONFIRMADA" e passa pro Ato 2.

### 3.3 Ato 2 — A Virada (o momento pedagógico central)

**Transição:** tela escurece. Som de alerta. Texto surge lentamente:

> "Você foi eficiente, Agente."
> "Em 8 minutos, localizou a escola, o bairro, a rotina e as vulnerabilidades de Luna."
> "Agora uma pergunta:"

Pausa de 2 segundos.

> "E se o alvo fosse você?"

**Nova tela:** mesma interface de investigação, mas com os dados do perfil
que o aluno preencheu no início, processados pelo "sistema". Score de
exposição do aluno construído a partir das respostas dele.

Exemplos de inferências mostradas:
- "Você estuda no [escola que disse], que fica em [bairro informado]"
- "Se seu perfil é público, qualquer um pode ver suas fotos e localização"
- "Se você posta fotos com localização ativa, um invasor te localizaria em menos de 3 cliques"

O sistema mostra um "relatório de exposição" do aluno com 4 categorias coloridas (verde → vermelho).

**Não há interação aqui.** O aluno apenas assiste. Tempo: 30–45 segundos de exibição.

### 3.4 Ato 3 — Defesa

**Painel de configurações fictício** com 8 ajustes possíveis:

```ts
const AJUSTES: AjustePrivacidade[] = [
  {
    id: 'perfil_privado',
    descricao: 'Tornar o perfil principal privado',
    reducao_score: 20,
    acao_real: 'Instagram: Configurações → Privacidade → Conta Privada'
  },
  {
    id: 'remover_geolocalizacao',
    descricao: 'Desativar geotag automático em fotos',
    reducao_score: 25,
    acao_real: 'iOS: Ajustes → Privacidade → Serviços de Localização → Câmera → Nunca'
  },
  {
    id: 'separar_contas',
    descricao: 'Criar conta separada para conteúdo público',
    reducao_score: 15,
    acao_real: 'Manter um perfil pessoal privado e outro público sem dados identificáveis'
  },
  {
    id: 'restringir_stories',
    descricao: 'Limitar quem vê seus Stories',
    reducao_score: 10,
    acao_real: 'Instagram: Stories → Configurações → Ocultar story de...'
  },
  {
    id: 'remover_escola_bio',
    descricao: 'Remover nome da escola da bio',
    reducao_score: 10,
    acao_real: 'Não coloque escola, bairro ou cidade na bio pública'
  },
  {
    id: 'revisar_seguidores',
    descricao: 'Revisar lista de seguidores e remover desconhecidos',
    reducao_score: 8,
    acao_real: 'Periodicamente, revise quem te segue e remova contas suspeitas'
  },
  {
    id: 'exif_fotos',
    descricao: 'Remover metadados antes de postar fotos',
    reducao_score: 15,
    acao_real: 'Use apps como Metapho (iOS) ou ExifEraser (Android) antes de postar'
  },
  {
    id: 'verificar_apps',
    descricao: 'Revogar permissão de localização de apps desnecessários',
    reducao_score: 10,
    acao_real: 'Configurações → Privacidade → Localização → revisar app a app'
  },
]
```

Cada ajuste aplicado anima a barra de score descendo e o ícone associado
mudando de vermelho para verde.

**Mínimo para avançar:** aplicar pelo menos 3 ajustes.

### 3.5 Resultado final

Score final de investigação (quanto o aluno descobriu sobre Luna) +
score de exposição restante do próprio perfil após os ajustes.

Dois cards lado a lado:
- "Como investigador: [X]% do alvo exposto"
- "Sua exposição restante: [Y]%"

5 ações da vida real geradas dinamicamente com base nos ajustes que ele
NÃO aplicou — são as que ele mais precisa fazer.

---

## 4. Lógica de pontuação

```ts
// Ato 1: pontos por pistas descobertas
// Bônus por completar antes de 10 minutos

// Ato 3: pontos por ajustes aplicados
// Bônus se score de exposição cair abaixo de 30%

function calcularPontuacaoFinal(estado: EstadoJogo): number {
  const pontosInvestigacao = estado.pistas_descobertas
    .map(id => PISTAS.find(p => p.id === id)?.pontos ?? 0)
    .reduce((a, b) => a + b, 0)

  const pontosDefesa = estado.ajustes_aplicados.length * 50

  const bonusVelocidade = estado.tempo_inicio
    ? calcularBonusVelocidade(Date.now() - estado.tempo_inicio)
    : 0

  return pontosInvestigacao + pontosDefesa + bonusVelocidade
}
```

---

## 5. Componentes a criar

```
src/app/(aluno)/jogos/detetive-osint/
  └── page.tsx

src/components/jogos/detetive-osint/
  ├── DetetiveOsintGame.tsx
  ├── TelaIntro.tsx
  ├── FormularioPerfil.tsx           ← char creation disfarçado
  ├── PainelInvestigacao.tsx         ← Ato 1
  ├── FonteInvestigacao.tsx          ← card de cada fonte clicável
  ├── QuadroEvidencias.tsx           ← pistas descobertas + score Luna
  ├── BarraExposicao.tsx             ← componente de score visual
  ├── TelaVirada.tsx                 ← Ato 2 (animação)
  ├── RelatorioExposicaoAluno.tsx    ← relatório pessoal
  ├── PainelPrivacidade.tsx          ← Ato 3
  ├── AjustePrivacidadeCard.tsx      ← card de cada ajuste
  └── ResultadoFinal.tsx

src/lib/jogos/detetive-osint/
  ├── pistas.ts
  ├── ajustes.ts
  ├── score.ts
  └── index.ts
```

---

## 6. Critérios de "pronto"

- [ ] Formulário de perfil disfarçado funcional
- [ ] 5 fontes de investigação implementadas com conteúdo fictício
- [ ] Score de exposição calculado e animado corretamente
- [ ] Ato 2 usa dados do formulário inicial (não valores hardcoded)
- [ ] Ato 3 com todos os 8 ajustes e animação de redução de score
- [ ] Ações da vida real geradas dinamicamente ao final
- [ ] Sessão salva no Supabase
- [ ] Sem regressão no Jogo 1 após merge
