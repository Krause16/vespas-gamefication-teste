# GDD — Jogo 1: O Golpe Tá Aí

**Slug:** `golpe-ta-ai`  
**Nível:** 1 (Conscientização)  
**Tema-âncora:** Engenharia Social e Phishing  
**Faixa-alvo:** 9º ano EF e 1º ano EM  
**Duração estimada:** 12–18 minutos  
**Sprint de desenvolvimento:** Sprint 3

---

## 1. Conceito central

O aluno recebe mensagens num smartphone simulado e precisa classificar
cada uma como legítima ou fraudulenta — mas não basta classificar:
precisa apontar os indicadores específicos que sustentam seu julgamento.

**Por que é o primeiro jogo:** Máximo impacto imediato com menor
complexidade técnica. Todo aluno já recebeu mensagem suspeita.
A interface (celular simulado) é imediatamente familiar.
Define o padrão visual e técnico para os jogos seguintes.

---

## 2. Estrutura de dados

```ts
// src/types/golpe-ta-ai.ts

export type ClassificacaoMensagem = 'confio' | 'suspeito' | 'bloqueio'

export type IndicadorFraude =
  | 'urgencia'
  | 'remetente_estranho'
  | 'link_suspeito'
  | 'erro_gramatical'
  | 'pedido_dado_sensivel'
  | 'contexto_inesperado'
  | 'pressao_financeira'
  | 'deepfake_audio'
  | 'dominio_falso'
  | 'numero_desconhecido'

export type CanalMensagem = 'whatsapp' | 'instagram' | 'email' | 'sms'

export type OndaMensagem = 1 | 2 | 3 | 4

export interface Mensagem {
  id: string
  onda: OndaMensagem
  canal: CanalMensagem
  remetente: {
    nome: string
    avatar?: string           // emoji ou inicial
    verificado: boolean       // badge de conta verificada
    contato_salvo: boolean    // aparece como nome ou número
    numero_ou_email: string   // mostrado abaixo do nome
  }
  conteudo: {
    texto: string
    link?: string             // link visível na mensagem
    link_real?: string        // destino real (pode diferir do visível)
    audio?: boolean           // mensagem de áudio (onda 4)
    imagem?: boolean          // imagem anexada
  }
  metadados: {
    horario: string           // ex: "14:32"
    data?: string             // só aparece se não for hoje
  }
  gabarito: {
    classificacao_correta: ClassificacaoMensagem
    indicadores_validos: IndicadorFraude[]  // o que pode ser marcado
    indicadores_obrigatorios: IndicadorFraude[]  // mínimo para pontuação
    eh_fraude: boolean
    explicacao: string        // texto do debriefing pós-classificação
  }
}

export interface RespostaJogador {
  mensagem_id: string
  classificacao: ClassificacaoMensagem
  indicadores_marcados: IndicadorFraude[]
  tempo_decisao_ms: number
}

export interface ResultadoMensagem {
  correta: boolean
  pontuacao: number           // 0–100
  indicadores_corretos: IndicadorFraude[]
  indicadores_perdidos: IndicadorFraude[]
  indicadores_erroneos: IndicadorFraude[]
}

export interface EstadoJogo {
  fase: 'intro' | 'jogando' | 'debriefing' | 'resultado_final'
  onda_atual: OndaMensagem
  mensagem_atual_idx: number
  mensagens_da_onda: Mensagem[]
  respostas: RespostaJogador[]
  resultados: ResultadoMensagem[]
  pontuacao_total: number
  tempo_inicio: number        // Date.now()
}
```

---

## 3. Conteúdo — banco de mensagens

### Onda 1 — Óbvios (3 mensagens)

**M1-01 — Príncipe moderno**
- Canal: Email
- Remetente: "Banco Centra1 do Brasil" / bancoentra1@outlook.com.br
- Conteúdo: "Sua conta foi BLOQUEADA! Clique AGORA em [bit.ly/desbloquear-conta-urgente] para evitar o cancelamento definitivo em 24h!!!"
- Classificação: bloqueio
- Indicadores obrigatórios: urgencia, remetente_estranho, link_suspeito, erro_gramatical
- Explicação: "Bancos nunca enviam e-mails de outlook.com.br. O link encurtado esconde o destino real. O uso de 'URGENTE' e prazos curtos é gatilho clássico de engenharia social."

**M1-02 — Mensagem legítima da escola**
- Canal: WhatsApp
- Remetente: "Colégio Estadual" / +55 41 99999-0001 (contato salvo)
- Conteúdo: "Lembrando que amanhã não haverá aula por conta do recesso municipal. Dúvidas, fale com a secretaria."
- Classificação: confio
- Indicadores obrigatórios: nenhum
- Explicação: "Mensagem de número já salvo, sem pedido de ação, sem link, sem urgência. Nada suspeito aqui."

**M1-03 — Falsa premiação**
- Canal: SMS
- Remetente: +55 11 98888-7777 (não salvo)
- Conteúdo: "Parabens! Voce foi selecionado para receber R$2.847,00 do programa Renda Extra do Governo Federal. Resgate em: gov-renda-extra.blogspot.com"
- Classificação: bloqueio
- Indicadores obrigatórios: urgencia, remetente_estranho, link_suspeito, erro_gramatical, pedido_dado_sensivel
- Explicação: "Erros de acentuação, número desconhecido, domínio de blog (.blogspot) fingindo ser governo. Nenhum programa do governo distribui dinheiro por SMS."

---

### Onda 2 — Brasileiros (4 mensagens)

**M2-01 — Golpe do Pix**
- Canal: WhatsApp
- Remetente: "Nubank" / +55 11 91234-5678 (não salvo)
- Conteúdo: "Seu Pix foi temporariamente suspenso por atividade suspeita. Para liberar, confirme seus dados em: nubank-seguranca.com/verificar"
- Classificação: bloqueio
- Indicadores obrigatórios: remetente_estranho, link_suspeito, pedido_dado_sensivel, contexto_inesperado
- Explicação: "O Nubank nunca usa números de celular para comunicados de segurança. O domínio 'nubank-seguranca.com' não é nubank.com.br. Sempre acesse apps diretamente."

**M2-02 — Golpe dos Correios**
- Canal: SMS
- Remetente: CORREIOS (alfanumérico — parece legítimo)
- Conteúdo: "Seu pacote (BR123456789) está retido na alfândega. Taxa de R$14,90 necessária. Acesse: correios-rastreio.net/liberar"
- Classificação: bloqueio
- Indicadores obrigatórios: link_suspeito, pedido_dado_sensivel
- Explicação: "O remetente alfanumérico pode ser falsificado (SIM Swapping). O domínio correto dos Correios é correios.com.br, não correios-rastreio.net. Taxa de alfândega legítima nunca é paga por link de SMS."

**M2-03 — Mensagem da mãe**
- Canal: WhatsApp
- Remetente: "Mãe" (contato salvo)
- Conteúdo: "Oi filho, tô no trabalho ainda. Pode me mandar R$50 pelo Pix? Esqueci a carteira em casa. Depois te devolvo quando chegar"
- Classificação: suspeito
- Indicadores obrigatórios: contexto_inesperado, pressao_financeira
- Explicação: "Pode ser a mãe de verdade — ou alguém que clonou o WhatsApp dela. A ação correta é LIGAR para a mãe antes de enviar qualquer dinheiro. Verificação por canal alternativo."

**M2-04 — Oferta de emprego real**
- Canal: Instagram
- Remetente: @vagas_empresa_xpto (não verificado, 340 seguidores)
- Conteúdo: "Olá! Temos vagas de digitador em home office, R$800/semana. Sem experiência. Clique no link da bio para se cadastrar."
- Classificação: suspeito
- Indicadores obrigatórios: remetente_estranho, contexto_inesperado
- Explicação: "Conta sem verificação, poucos seguidores, promessa de remuneração alta sem exigência de qualificação são sinais de alerta. Não é certeza de golpe, mas exige pesquisa antes de qualquer clique."

---

### Onda 3 — Direcionados (3 mensagens)

**M3-01 — Falsa diretora da escola**
- Canal: WhatsApp
- Remetente: "Diretora Marcia Silva" / +55 41 98877-6655 (não salvo)
- Conteúdo: "Boa tarde. Sou a diretora do colégio. Precisamos que você traga amanhã o comprovante de residência atualizado. Qualquer dúvida, responda aqui mesmo."
- Classificação: suspeito
- Indicadores obrigatórios: remetente_estranho, contexto_inesperado
- Explicação: "A escola tem canais oficiais de comunicação. Um número desconhecido pedindo documentos deve ser verificado diretamente na secretaria presencialmente ou pelo número oficial da escola."

**M3-02 — Crush hackeado**
- Canal: Instagram
- Remetente: @usuario_conhecido (conta que o aluno segue, perfil real)
- Conteúdo: "ei vc topa fazer uma pesquisa rápida pra mim? é de um minuto só, clica aqui: pesquisa-digital.co/form?ref=amigos"
- Classificação: suspeito
- Indicadores obrigatórios: link_suspeito, contexto_inesperado
- Explicação: "A conta pode ter sido comprometida. Pedido de clique em link sem contexto, mesmo de contato conhecido, merece uma confirmação direta — ligar ou mandar mensagem por outro canal."

**M3-03 — Mensagem da escola legítima com link**
- Canal: Email
- Remetente: "Secretaria Acadêmica" / secretaria@colegioestadual.edu.br
- Conteúdo: "Informamos que o boletim do 2º bimestre está disponível no Portal do Aluno. Acesse: portaldoaluno.colegioestadual.edu.br"
- Classificação: confio
- Indicadores obrigatórios: nenhum
- Explicação: "E-mail institucional real (.edu.br), link no mesmo domínio da instituição, sem urgência e sem pedido de dado sensível. Este é o padrão de comunicação legítima."

---

### Onda 4 — Pós-IA (3 mensagens)

**M4-01 — Áudio do parente**
- Canal: WhatsApp
- Remetente: "Tio João" (contato salvo)
- Conteúdo: [Ícone de áudio] "01:12 — Clipe de voz: alguém com a voz parecida com o tio diz que está preso numa delegacia e precisa de R$500 para pagar a fiança. Pede sigilo."
- Classificação: bloqueio
- Indicadores obrigatórios: deepfake_audio, pressao_financeira, contexto_inesperado
- Explicação: "Clonagem de voz por IA está acessível hoje. Antes de qualquer ação, ligue diretamente para o número que você sempre usa para falar com essa pessoa. O pedido de sigilo é sinal claro de manipulação."

**M4-02 — Vaga com entrevista por IA**
- Canal: Email
- Remetente: "RH Corporativo" / rh@empresa-tech.com.br
- Conteúdo: "Seu currículo foi selecionado. Para avançar, faça a entrevista inicial com nossa IA em: entrevista.empresa-tech.com.br. Envie também seu CPF e data de nascimento para geração do contrato."
- Classificação: bloqueio
- Indicadores obrigatórios: pedido_dado_sensivel, link_suspeito
- Explicação: "Empresas legítimas nunca pedem CPF por e-mail antes de qualquer etapa. 'entrevista.empresa-tech.com.br' pode ser domínio diferente de 'empresa-tech.com.br'. Verifique no site oficial da empresa antes de fornecer qualquer dado."

**M4-03 — Notícia falsa do governo**
- Canal: WhatsApp (grupo "Família 👨‍👩‍👧‍👦")
- Remetente: Avó (contato salvo, em grupo familiar)
- Conteúdo: [Imagem] Foto de "matéria" com logo de jornal conhecido. Texto: "URGENTE: Governo libera saque de R$3.000 para todos os cidadãos. Cadastre-se antes de amanhã: auxilio-extra-gov.com"
- Classificação: bloqueio
- Indicadores obrigatórios: urgencia, link_suspeito, dominio_falso
- Explicação: "Imagens de manchetes podem ser fabricadas ou editadas. O domínio não é .gov.br. A avó provavelmente caiu no golpe antes. Verifique sempre em fontes oficiais (gov.br) antes de clicar ou repassar."

---

## 4. Interface — descrição de telas

### 4.1 Tela de intro (3–5 segundos)

```
Background: #1a1a1a
Centro: ícone de vespa pulsando levemente
Texto: "OPERAÇÃO PHISHING" (Montserrat Bold, esmeralda)
Subtexto: "Identifique os golpes antes que te peguem"
Barra de progresso preenchendo → entra no jogo
```

### 4.2 Interface principal (durante o jogo)

```
┌─────────────────────────────────────────────┐
│  ⬅  O GOLPE TÁ AÍ         Onda 1/4  ●●○○  │  ← header
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  [Tabs: WhatsApp | Insta | Email | SMS]  │
│  ├─────────────────────────────────────┤   │
│  │                                     │   │
│  │  📱 Simulação do smartphone         │   │
│  │     (card da mensagem atual)        │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌──── MARQUE OS INDICADORES ────┐          │
│  │  [urgência] [link suspeito]   │          │
│  │  [remetente] [erro gramatical]│          │
│  │  [dado sensível] [contexto]   │          │
│  └───────────────────────────────┘          │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │  [CONFIO]   [SUSPEITO]   [BLOQUEIO]  │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

**Card de mensagem (WhatsApp):**
- Header verde escuro com ícone de cadeado
- Avatar circular + nome + número abaixo
- Balão de mensagem branco sobre fundo escuro
- Horário no canto inferior direito do balão
- Link clicável (sem navegar, apenas sublinhado)

**Botões de classificação:**
- CONFIO → background vespa-firewall (#27746e)
- SUSPEITO → background #6b5b00 (amarelo escuro)
- BLOQUEIO → background vespa-cobre (#ad550a)
- Ao clicar: animação de press + brilho breve

**Indicadores (chips selecionáveis):**
- Default: borda --color-border, fundo transparente
- Selecionado: borda --vespa-esmeralda, fundo rgba(57,255,20,0.1)

### 4.3 Debriefing (após cada mensagem)

```
┌─────────────────────────────────────────────┐
│                                             │
│     ✅  CORRETO!  +85pts                   │  ou ❌ ERRADO
│                                             │
│  "Banco Central não usa outlook.com.br.     │
│   O link encurtado esconde o destino."      │
│                                             │
│  Você marcou corretamente:                  │
│  ✅ urgência  ✅ remetente  ❌ link (perdeu)│
│                                             │
│           [ PRÓXIMA MENSAGEM → ]            │
└─────────────────────────────────────────────┘
```

### 4.4 Transição de onda

Tela de 2–3 segundos entre ondas:
- "ONDA 2 — GOLPES BRASILEIROS"
- Animação hexagonal (3 hexágonos pulsando)
- Nível de dificuldade em texto

### 4.5 Resultado final

```
┌─────────────────────────────────────────────┐
│                                             │
│    MISSÃO CONCLUÍDA                         │
│                                             │
│         [Hexágono com pontuação]            │
│              1.840 pts                      │
│                                             │
│    Precisão geral:      87%                 │
│    Melhor categoria:    Golpes BR           │
│    Atenção necessária:  Ataques pós-IA      │
│                                             │
│    ┌─────────────────────────────────────┐  │
│    │ Das 13 mensagens, você detectou     │  │
│    │ corretamente 11 tentativas de       │  │
│    │ fraude. 1 te enganou.               │  │
│    │ No mundo real, isso teria custado   │  │
│    │ tempo, dados ou dinheiro.           │  │
│    └─────────────────────────────────────┘  │
│                                             │
│       [ VOLTAR AO HUB ]                     │
└─────────────────────────────────────────────┘
```

---

## 5. Lógica de pontuação

```ts
// src/lib/jogos/golpe-ta-ai/pontuacao.ts

const PONTOS_BASE_CLASSIFICACAO = 40
const PONTOS_POR_INDICADOR = 10
const BONUS_TODOS_INDICADORES = 15
const PENALIDADE_INDICADOR_ERRADO = -5
const PENALIDADE_CLASSIFICACAO_ERRADA = -20

function calcularPontuacaoMensagem(
  mensagem: Mensagem,
  resposta: RespostaJogador
): ResultadoMensagem {
  const classificacaoCorreta =
    resposta.classificacao === mensagem.gabarito.classificacao_correta

  let pontuacao = 0

  if (classificacaoCorreta) {
    pontuacao += PONTOS_BASE_CLASSIFICACAO

    const corretos = resposta.indicadores_marcados.filter(i =>
      mensagem.gabarito.indicadores_validos.includes(i)
    )
    const erroneos = resposta.indicadores_marcados.filter(i =>
      !mensagem.gabarito.indicadores_validos.includes(i)
    )
    const perdidos = mensagem.gabarito.indicadores_obrigatorios.filter(i =>
      !resposta.indicadores_marcados.includes(i)
    )

    pontuacao += corretos.length * PONTOS_POR_INDICADOR
    pontuacao += erroneos.length * PENALIDADE_INDICADOR_ERRADO

    const marcouTodosObrigatorios = mensagem.gabarito.indicadores_obrigatorios
      .every(i => resposta.indicadores_marcados.includes(i))
    if (marcouTodosObrigatorios) pontuacao += BONUS_TODOS_INDICADORES

    return {
      correta: true,
      pontuacao: Math.max(0, pontuacao),
      indicadores_corretos: corretos,
      indicadores_perdidos: perdidos,
      indicadores_erroneos: erroneos,
    }
  } else {
    return {
      correta: false,
      pontuacao: Math.max(0, PENALIDADE_CLASSIFICACAO_ERRADA),
      indicadores_corretos: [],
      indicadores_perdidos: mensagem.gabarito.indicadores_obrigatorios,
      indicadores_erroneos: resposta.indicadores_marcados,
    }
  }
}
```

---

## 6. Store do jogo

```ts
// src/stores/golpeTaAiStore.ts
import { create } from 'zustand'

interface GolpeTaAiStore {
  estado: EstadoJogo
  iniciarJogo: () => void
  responderMensagem: (resposta: RespostaJogador) => void
  proximaMensagem: () => void
  proximaOnda: () => void
  resetar: () => void
}
```

---

## 7. Integração com Supabase

Ao final de cada sessão, registrar:

```ts
// Tabela: sessoes_jogos
{
  jogo_slug: 'golpe-ta-ai',
  jogador_id: string,          // ID anônimo da sessão
  sala_id?: string,            // se em gincana
  pontuacao: number,
  duracao_segundos: number,
  metadata: {
    precisao_onda_1: number,
    precisao_onda_2: number,
    precisao_onda_3: number,
    precisao_onda_4: number,
    indicadores_mais_perdidos: IndicadorFraude[],
    mensagem_que_enganou?: string,  // id da mensagem
  }
}
```

---

## 8. Componentes a criar

```
src/app/(aluno)/jogos/golpe-ta-ai/
  └── page.tsx                      ← orquestrador do jogo

src/components/jogos/golpe-ta-ai/
  ├── GolpeTaAiGame.tsx             ← componente raiz
  ├── SmartphoneFrame.tsx           ← frame visual do celular
  ├── MensagemCard.tsx              ← card de cada mensagem
  ├── AbaTabs.tsx                   ← tabs WhatsApp/Insta/Email/SMS
  ├── IndicadoresGrid.tsx           ← chips selecionáveis
  ├── BotoesClassificacao.tsx       ← Confio/Suspeito/Bloqueio
  ├── Debriefing.tsx                ← tela de feedback pós-resposta
  ├── TransicaoOnda.tsx             ← tela entre ondas
  └── ResultadoFinal.tsx            ← tela de encerramento

src/lib/jogos/golpe-ta-ai/
  ├── mensagens.ts                  ← banco de dados das mensagens
  ├── pontuacao.ts                  ← lógica de cálculo
  └── index.ts                      ← exports públicos
```

---

## 9. Critérios de "pronto" específicos deste jogo

- [ ] Todas as 13 mensagens implementadas e revisadas
- [ ] Debriefing de cada mensagem com texto explicativo correto
- [ ] Pontuação calculada corretamente (teste unitário)
- [ ] Animação de acerto/erro funcionando
- [ ] Transição entre ondas implementada
- [ ] Resultado final com estatísticas corretas
- [ ] Sessão salva no Supabase ao final
- [ ] Funciona em celular com tela de 390px sem scroll horizontal
- [ ] Sem bugs de estado ao jogar duas vezes seguidas sem reload
