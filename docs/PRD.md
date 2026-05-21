# PRD — Plataforma VESPAS de Cibersegurança Gamificada

**Versão:** 1.0  
**Status:** Aprovado para desenvolvimento  
**Projeto:** VESPAS — UTFPR Câmpus Curitiba

---

## 1. Visão do Produto

Uma plataforma web progressiva (PWA) mobile-first que viabiliza oficinas de
cibersegurança em escolas de Ensino Fundamental II e Médio, transformando
conceitos técnicos complexos em experiências de jogo imersivas, competitivas
e pedagogicamente sólidas.

**Princípio norte:** Um aluno que jogar esta plataforma por 2 horas deve sair
diferente de como entrou — não apenas informado, mas com reflexos novos.

---

## 2. Problema

Membros do VESPAS conduzem oficinas em escolas, mas as abordagens
disponíveis (palestras, vídeos, slides) geram baixo engajamento e retenção
mínima em públicos do Ensino Médio. O conteúdo de cibersegurança é abstrato
e técnico, distante da experiência cotidiana dos estudantes — ainda que os
vetores de ataque mais comuns (phishing, golpes via Pix, exposição de dados
em redes sociais) afetam diretamente suas vidas.

Simultaneamente, o modelo de "palestra" não escala: depende do carisma do
apresentador, não produz evidência de aprendizagem, e não deixa rastro
pedagógico na escola.

---

## 3. Solução

Plataforma com dois modos de uso:

**Modo Gincana (contexto de oficina):**
- Instrutor abre uma "sala" com código de 6 dígitos
- Alunos entram via QR code + código, sem cadastro pesado
- Jogam em equipes, com ranking ao vivo projetado na sala
- Instrutor controla o ritmo, libera fases, aciona eventos globais
- Sistema gera relatório pedagógico ao final

**Modo Solo (uso contínuo):**
- Aluno acessa fora da oficina, em casa, quando quiser
- Progride pelos jogos no próprio ritmo
- Ranking nacional e por escola

---

## 4. Usuários

| Usuário | Contexto | Necessidade principal |
|---|---|---|
| Aluno (9º EF a 3º EM) | Celular Android/iOS, escola pública | Engajamento, desafio, senso de progressão |
| Instrutor VESPAS | Notebook + projetor, sala de aula | Controle da dinâmica, visibilidade em tempo real |
| Professor da escola | Pós-oficina, relatório | Evidência de aprendizagem da turma |

---

## 5. Escopo do MVP

### Incluído no MVP (Sprints 0–7)

- [ ] Tela de entrada por código de gincana
- [ ] Hub do aluno com os 3 jogos
- [ ] Jogo 1: O Golpe Tá Aí (Nível 1)
- [ ] Jogo 2: Detetive OSINT (Nível 2)
- [ ] Jogo 3: Terminal CTF (Nível 3)
- [ ] Sistema de gincana com sala, ranking ao vivo, painel do instrutor
- [ ] Auth anônima (sem dados pessoais de menor)
- [ ] Relatório básico por sessão
- [ ] PWA instalável (Android e iOS)
- [ ] Modo solo (acesso sem gincana ativa)

### Fora do escopo do MVP

- Cadastro de professor/escola
- Relatório avançado (gráficos, exportação PDF)
- Os 12 jogos restantes do catálogo completo
- Internacionalização
- Modo offline completo (apenas cache básico)
- Gamificação persistente (badges, níveis de jogador)

---

## 6. Princípios pedagógicos (não negociáveis no design dos jogos)

**P1 — Aprendizagem por evidência:** A teoria entra como debriefing pós-ação,
nunca como pré-requisito. O aluno age primeiro, entende depois.

**P2 — Um conceito-âncora por jogo:** Cada jogo ensina um conceito central
com profundidade, não dez conceitos superficialmente. Mais do que um
conceito-âncora + três satélites é sobrecarga cognitiva.

**P3 — Avaliação implícita:** Nenhum jogo exibe "quiz" ou "pergunta de
múltipla escolha". O gameplay em si gera os dados de aprendizagem. O aluno
percebe que está jogando; o sistema mede que ele está sendo avaliado.

---

## 7. Princípios de produto

**Velocidade é respeito:** Em contexto de oficina, um aluno com celular barato
não pode esperar. Nenhuma tela deve demorar mais de 2s para carregar no 4G
médio brasileiro.

**Zero fricção de entrada:** O caminho entre "escaneou o QR code" e "está
jogando" não pode ter mais de 3 passos.

**Identidade sem concessões:** Cada pixel segue o guia de marca VESPAS.
Nenhum componente genérico sem customização visual.

**Legibilidade acima de tudo:** Contraste WCAG AA em todos os textos.
Fontes nunca abaixo de 14px em contexto mobile.

---

## 8. Métricas de sucesso do MVP

| Métrica | Meta para considerar o piloto bem-sucedido |
|---|---|
| Tempo até primeira jogada | < 90 segundos desde o QR code |
| Taxa de conclusão do Jogo 1 | > 80% dos alunos que iniciaram |
| Engajamento no Jogo 3 | > 60% chegam à Flag 4 ou além |
| NPS informal dos alunos | > 7/10 na pergunta "valeu o tempo?" |
| NPS do instrutor | > 8/10 na pergunta "usaria de novo?" |

---

## 9. Restrições

**LGPD:** Nenhum dado pessoal identificável de menor de idade é coletado.
Auth anônima. Nicknames são escolhidos pelo aluno (não vinculados a cadastro).

**Infraestrutura:** Vercel (gratuito para escala de MVP). Supabase Free tier
suficiente para as primeiras oficinas. Custo zero de operação no MVP.

**Conectividade:** A escola pode ter Wi-Fi instável. Jogos devem degradar
graciosamente — não travar — em conexões lentas. Preferir operações locais
e sincronizar assincronamente quando possível.

**Dispositivos:** Suporte a Android 8+ e iOS 14+. Chrome e Safari como
browsers primários. Sem dependências de recursos experimentais.

---

## 10. Decisões de design registradas

| Decisão | Alternativas consideradas | Motivo da escolha |
|---|---|---|
| PWA em vez de app nativo | React Native/Expo, Flutter | Sem app store, sem instalação, atualização instantânea, QR code direto |
| Next.js App Router | Remix, Vite+React | Ecossistema maduro, Vercel deploy trivial, Server Components para performance |
| Supabase | Firebase, PocketBase | PostgreSQL real, RLS nativo, Realtime gratuito no tier free, SQL padrão facilita manutenção futura |
| Auth anônima | Login com e-mail, Google OAuth | LGPD com menores, zero fricção de entrada, contexto de oficina pontual |
| shadcn/ui | Chakra, MUI, Mantine | Componentes copiados (não dependência), 100% customizáveis, Tailwind-native |
