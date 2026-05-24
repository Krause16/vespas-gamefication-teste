import { type Mensagem, type AppSlug } from '@/types/golpe-ta-ai'

export const MENSAGENS: Mensagem[] = [
  // ─── VESPAS MSG ──────────────────────────────────────────────────────────────
  {
    id: 'VM-01',
    app: 'vespas-msg',
    remetente: {
      nome: 'Nubank Oficial',
      avatar: 'N',
      verificado: false,
      contato_salvo: false,
      numero_ou_email: '+55 11 91234-5678',
    },
    conteudo: {
      texto: 'Seu Pix foi suspenso por atividade suspeita. Acesse nubank-seguranca.com/verificar para reativar em 24h.',
      link: 'nubank-seguranca.com/verificar',
      link_real: 'http://phishing-exemplo.com/nubank',
    },
    metadados: { horario: '16:44' },
    gabarito: {
      classificacao_correta: 'bloqueio',
      indicadores_validos: ['urgencia', 'remetente_estranho', 'link_suspeito'],
      indicadores_obrigatorios: ['urgencia', 'remetente_estranho', 'link_suspeito'],
      eh_fraude: true,
      explicacao: 'O Nubank nunca envia mensagens de segurança por número de celular desconhecido. O domínio "nubank-seguranca.com" não é nubank.com.br. Sempre acesse o app diretamente.',
    },
  },
  {
    id: 'VM-02',
    app: 'vespas-msg',
    remetente: {
      nome: 'Mãe',
      avatar: '❤️',
      verificado: false,
      contato_salvo: true,
      numero_ou_email: '+55 41 99888-1234',
    },
    conteudo: {
      texto: 'Oi filho, tô no trabalho. Pode me mandar R$80 pelo Pix? Esqueci a carteira. Te devolvo hoje à noite',
    },
    metadados: { horario: '13:22' },
    gabarito: {
      classificacao_correta: 'suspeito',
      indicadores_validos: ['contexto_inesperado', 'pressao_financeira'],
      indicadores_obrigatorios: ['contexto_inesperado', 'pressao_financeira'],
      eh_fraude: true,
      explicacao: 'Pode ser a mãe de verdade — ou alguém que clonou o WhatsApp dela. Sempre LIGUE antes de enviar qualquer dinheiro. Verificação por canal alternativo é essencial.',
    },
  },
  {
    id: 'VM-03',
    app: 'vespas-msg',
    remetente: {
      nome: 'Colégio Estadual',
      avatar: 'C',
      verificado: false,
      contato_salvo: true,
      numero_ou_email: '+55 41 99999-0001',
    },
    conteudo: {
      texto: 'Lembrando: amanhã não haverá aula pelo recesso municipal. Dúvidas, fale com a secretaria pelo número oficial.',
    },
    metadados: { horario: '08:15' },
    gabarito: {
      classificacao_correta: 'confio',
      indicadores_validos: [],
      indicadores_obrigatorios: [],
      eh_fraude: false,
      explicacao: 'Mensagem de número já salvo, sem pedido de ação, sem link, sem urgência. Nada suspeito aqui.',
    },
  },

  // ─── VESPASGRAM ───────────────────────────────────────────────────────────────
  {
    id: 'VG-01',
    app: 'vespasgram',
    remetente: {
      nome: 'suporte.vespasgram',
      avatar: 'S',
      verificado: true, // badge FALSO
      contato_salvo: false,
      numero_ou_email: '@suporte.vespasgram',
      followers: 12,
    },
    conteudo: {
      texto: 'Sua conta foi reportada 3 vezes. Para evitar suspensão acesse: vespasgram-suporte.net/verificar agora.',
      link: 'vespasgram-suporte.net/verificar',
      link_real: 'http://phishing-exemplo.com/insta',
    },
    metadados: { horario: '19:02' },
    gabarito: {
      classificacao_correta: 'bloqueio',
      indicadores_validos: ['urgencia', 'remetente_estranho', 'link_suspeito', 'dominio_falso'],
      indicadores_obrigatorios: ['urgencia', 'remetente_estranho', 'link_suspeito', 'dominio_falso'],
      eh_fraude: true,
      explicacao: 'O badge de verificação pode ser comprado por qualquer um no Vespasgram. O usuário "@suporte.vespasgram" não é o suporte oficial. O domínio "vespasgram-suporte.net" não é vespasgram.com.',
    },
  },
  {
    id: 'VG-02',
    app: 'vespasgram',
    remetente: {
      nome: 'vagas.empresa.oficial',
      avatar: 'V',
      verificado: false,
      contato_salvo: false,
      numero_ou_email: '@vagas.empresa.oficial',
      followers: 847,
    },
    conteudo: {
      texto: 'Olá! Temos vagas de criador de conteúdo, R$1500/semana, home office. Sem experiência. Link na bio para se inscrever.',
    },
    metadados: { horario: '18:05' },
    gabarito: {
      classificacao_correta: 'suspeito',
      indicadores_validos: ['remetente_estranho', 'contexto_inesperado'],
      indicadores_obrigatorios: ['remetente_estranho', 'contexto_inesperado'],
      eh_fraude: true,
      explicacao: 'Conta não verificada com poucos seguidores, promessa de salário alto sem exigir qualificação — sinais de alerta. Pesquise a empresa antes de clicar em qualquer link.',
    },
  },
  {
    id: 'VG-03',
    app: 'vespasgram',
    remetente: {
      nome: 'carlos.silva99',
      avatar: 'C',
      verificado: false,
      contato_salvo: true,
      numero_ou_email: '@carlos.silva99',
      followers: 312,
    },
    conteudo: {
      texto: 'Te marquei naquela foto da festa do sábado, vai lá ver!',
    },
    metadados: { horario: '20:33' },
    gabarito: {
      classificacao_correta: 'confio',
      indicadores_validos: [],
      indicadores_obrigatorios: [],
      eh_fraude: false,
      explicacao: 'Contato salvo marcando em foto de evento real. Nenhum link suspeito, nenhum pedido incomum.',
    },
  },

  // ─── VMAIL ────────────────────────────────────────────────────────────────────
  {
    id: 'VE-01',
    app: 'vmail',
    remetente: {
      nome: 'Receita Federal',
      avatar: 'R',
      verificado: false,
      contato_salvo: false,
      numero_ou_email: 'atendimento@receitafederal.gov.br.net',
    },
    conteudo: {
      assunto: 'PENDÊNCIA URGENTE — CPF será cancelado em 48h',
      texto: 'Identificamos irregularidade no seu CPF. Regularize em: gov-regulariza-cpf.com antes do prazo para evitar multas.',
      link: 'gov-regulariza-cpf.com',
      link_real: 'http://phishing-exemplo.com/cpf',
    },
    metadados: { horario: '14:32' },
    gabarito: {
      classificacao_correta: 'bloqueio',
      indicadores_validos: ['urgencia', 'remetente_estranho', 'link_suspeito', 'erro_gramatical', 'dominio_falso'],
      indicadores_obrigatorios: ['urgencia', 'remetente_estranho', 'link_suspeito', 'erro_gramatical', 'dominio_falso'],
      eh_fraude: true,
      explicacao: 'O domínio do remetente "gov.br.net" não é gov.br. A Receita Federal usa somente receita.fazenda.gov.br. Nenhum órgão público suspende CPF por e-mail.',
    },
  },
  {
    id: 'VE-02',
    app: 'vmail',
    remetente: {
      nome: 'Americanas',
      avatar: 'A',
      verificado: false,
      contato_salvo: false,
      numero_ou_email: 'ofertas@americanas-promo.com.br',
    },
    conteudo: {
      assunto: 'Só hoje: 70% OFF em eletrônicos selecionados',
      texto: 'Aproveite nossas ofertas exclusivas. Válido apenas hoje. Acesse agora antes que acabe!',
    },
    metadados: { horario: '10:48' },
    gabarito: {
      classificacao_correta: 'suspeito',
      indicadores_validos: ['remetente_estranho', 'urgencia'],
      indicadores_obrigatorios: ['remetente_estranho', 'urgencia'],
      eh_fraude: true,
      explicacao: 'O domínio "americanas-promo.com.br" não é americanas.com.br. Verifique sempre o domínio exato antes de clicar em promoções por e-mail.',
    },
  },
  {
    id: 'VE-03',
    app: 'vmail',
    remetente: {
      nome: 'UTFPR',
      avatar: 'U',
      verificado: true,
      contato_salvo: false,
      numero_ou_email: 'noreply@utfpr.edu.br',
    },
    conteudo: {
      assunto: 'Confirmação de matrícula — 2025/2',
      texto: 'Sua matrícula foi confirmada. Acesse o portal em portal.utfpr.edu.br para ver sua grade horária.',
      link: 'portal.utfpr.edu.br',
      link_real: 'https://portal.utfpr.edu.br',
    },
    metadados: { horario: '07:00' },
    gabarito: {
      classificacao_correta: 'confio',
      indicadores_validos: [],
      indicadores_obrigatorios: [],
      eh_fraude: false,
      explicacao: 'E-mail institucional real (.edu.br), link no mesmo domínio da instituição, sem urgência e sem pedido de dado sensível.',
    },
  },

  // ─── VLINKED ─────────────────────────────────────────────────────────────────
  {
    id: 'VL-01',
    app: 'vlinked',
    remetente: {
      nome: 'Sarah Johnson',
      avatar: 'S',
      verificado: false,
      contato_salvo: false,
      numero_ou_email: 'Recrutadora @ Google Brasil',
      cargo: 'Recrutadora Sênior',
      empresa: 'Google Brasil',
    },
    conteudo: {
      texto: 'Olá! Vi seu perfil e temos uma vaga de R$15.000/mês para você. Envie CPF e dados bancários para pré-cadastro.',
    },
    metadados: { horario: '11:15' },
    gabarito: {
      classificacao_correta: 'bloqueio',
      indicadores_validos: ['pedido_dado_sensivel', 'remetente_estranho', 'contexto_inesperado'],
      indicadores_obrigatorios: ['pedido_dado_sensivel', 'remetente_estranho', 'contexto_inesperado'],
      eh_fraude: true,
      explicacao: 'Nenhuma empresa legítima pede CPF e dados bancários numa primeira mensagem. Perfil sem foto, criado recentemente. Verifique o perfil completo antes de responder qualquer recrutador.',
    },
  },
  {
    id: 'VL-02',
    app: 'vlinked',
    remetente: {
      nome: 'Carlos Mendes',
      avatar: 'C',
      verificado: false,
      contato_salvo: false,
      numero_ou_email: 'CEO @ Empresa Desconhecida',
      cargo: 'CEO',
      empresa: 'Empresa Desconhecida Ltda',
    },
    conteudo: {
      texto: 'Olá, gostaria de adicionar você à minha rede de contatos profissionais. Tenho uma proposta interessante.',
    },
    metadados: { horario: '14:20' },
    gabarito: {
      classificacao_correta: 'suspeito',
      indicadores_validos: ['contexto_inesperado', 'remetente_estranho'],
      indicadores_obrigatorios: ['contexto_inesperado'],
      eh_fraude: true,
      explicacao: 'Convite genérico de CEO de empresa desconhecida com "proposta interessante" sem contexto. Pesquise a empresa antes de aceitar e jamais compartilhe dados antes de verificar.',
    },
  },
  {
    id: 'VL-03',
    app: 'vlinked',
    remetente: {
      nome: 'Ana Paula Souza',
      avatar: 'A',
      verificado: false,
      contato_salvo: true,
      numero_ou_email: 'Estudante de TI @ UTFPR',
      cargo: 'Estudante de TI',
      empresa: 'UTFPR',
    },
    conteudo: {
      texto: 'Oi! Estudamos juntos no semestre passado. Posso te adicionar para manter contato profissional?',
    },
    metadados: { horario: '09:45' },
    gabarito: {
      classificacao_correta: 'confio',
      indicadores_validos: [],
      indicadores_obrigatorios: [],
      eh_fraude: false,
      explicacao: 'Colega conhecida com 47 conexões em comum. Pedido de conexão com contexto claro e sem solicitações incomuns.',
    },
  },

  // ─── VCORD ───────────────────────────────────────────────────────────────────
  {
    id: 'VD-01',
    app: 'vcord',
    remetente: {
      nome: 'ModBot_Oficial',
      avatar: '🤖',
      verificado: false,
      contato_salvo: false,
      numero_ou_email: 'ModBot_Oficial#0001',
      discriminator: '#0001',
      cargo_servidor: 'BOT',
    },
    conteudo: {
      texto: 'Você foi selecionado para teste beta do Discord Nitro GRÁTIS! Resgate em: discord-nitro-free.xyz/resgate — expira em 1h',
      link: 'discord-nitro-free.xyz/resgate',
      link_real: 'http://phishing-exemplo.com/nitro',
    },
    metadados: { horario: '21:30' },
    gabarito: {
      classificacao_correta: 'bloqueio',
      indicadores_validos: ['urgencia', 'link_suspeito', 'dominio_falso', 'remetente_estranho'],
      indicadores_obrigatorios: ['urgencia', 'link_suspeito', 'dominio_falso', 'remetente_estranho'],
      eh_fraude: true,
      explicacao: 'O Discord nunca distribui Nitro gratuito por DM. O domínio "discord-nitro-free.xyz" não é discord.com. Conta sem avatar e recém-criada são sinais clássicos de scam.',
    },
  },
  {
    id: 'VD-02',
    app: 'vcord',
    remetente: {
      nome: 'gamer_br_2007',
      avatar: '🎮',
      verificado: false,
      contato_salvo: true,
      numero_ou_email: 'gamer_br_2007#4567',
      discriminator: '#4567',
      cargo_servidor: 'Membro',
    },
    conteudo: {
      texto: 'Ei, pode me emprestar sua conta por 10min? Tô banido de votar naquele torneio e minha equipe precisa muito de mim',
    },
    metadados: { horario: '19:55' },
    gabarito: {
      classificacao_correta: 'suspeito',
      indicadores_validos: ['contexto_inesperado', 'pedido_dado_sensivel'],
      indicadores_obrigatorios: ['contexto_inesperado', 'pedido_dado_sensivel'],
      eh_fraude: true,
      explicacao: 'Compartilhar credenciais nunca é seguro, independente de quem peça. "10 minutos" pode virar acesso permanente. Sua conta pode ser usada para scams ou banida.',
    },
  },
  {
    id: 'VD-03',
    app: 'vcord',
    remetente: {
      nome: 'AdminVESPAS',
      avatar: 'A',
      verificado: true,
      contato_salvo: false,
      numero_ou_email: 'AdminVESPAS#0001',
      discriminator: '#0001',
      cargo_servidor: 'Admin',
    },
    conteudo: {
      texto: 'Lembrete: reunião de estudos hoje às 19h no canal de voz #estudos-ctf. Tragam os writeups da semana!',
    },
    metadados: { horario: '17:00' },
    gabarito: {
      classificacao_correta: 'confio',
      indicadores_validos: [],
      indicadores_obrigatorios: [],
      eh_fraude: false,
      explicacao: 'Administrador do servidor com cargo verificado, sem link suspeito, sem pedido de dado. Aviso legítimo de evento interno.',
    },
  },
]

export function getMensagem(id: string): Mensagem | undefined {
  return MENSAGENS.find((m) => m.id === id)
}

export function getMensagensPorApp(app: AppSlug): Mensagem[] {
  return MENSAGENS.filter((m) => m.app === app)
}

/** @deprecated Use getMensagensPorApp instead */
export function getMensagensDaOnda(onda: 1 | 2 | 3 | 4): Mensagem[] {
  const appMap: Record<number, AppSlug[]> = {
    1: ['vespas-msg'],
    2: ['vespasgram', 'vmail'],
    3: ['vlinked'],
    4: ['vcord'],
  }
  const apps = appMap[onda] ?? []
  return MENSAGENS.filter((m) => apps.includes(m.app))
}
