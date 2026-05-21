import { type Mensagem } from '@/types/golpe-ta-ai'

export const MENSAGENS: Mensagem[] = [
  // ─── Onda 1: Óbvios ───────────────────────────────────────────────────────
  {
    id: 'M1-01',
    onda: 1,
    canal: 'email',
    remetente: {
      nome: 'Banco Centra1 do Brasil',
      avatar: 'B',
      verificado: false,
      contato_salvo: false,
      numero_ou_email: 'bancoentra1@outlook.com.br',
    },
    conteudo: {
      texto: 'Sua conta foi BLOQUEADA! Clique AGORA em bit.ly/desbloquear-conta-urgente para evitar o cancelamento definitivo em 24h!!!',
      link: 'bit.ly/desbloquear-conta-urgente',
      link_real: 'http://phishing-exemplo.com/coletar-dados',
    },
    metadados: { horario: '14:32' },
    gabarito: {
      classificacao_correta: 'bloqueio',
      indicadores_validos: ['urgencia', 'remetente_estranho', 'link_suspeito', 'erro_gramatical'],
      indicadores_obrigatorios: ['urgencia', 'remetente_estranho', 'link_suspeito', 'erro_gramatical'],
      eh_fraude: true,
      explicacao: 'Bancos nunca enviam e-mails de outlook.com.br. O link encurtado esconde o destino real. O uso de "URGENTE" e prazos curtos é gatilho clássico de engenharia social.',
    },
  },
  {
    id: 'M1-02',
    onda: 1,
    canal: 'whatsapp',
    remetente: {
      nome: 'Colégio Estadual',
      avatar: 'C',
      verificado: false,
      contato_salvo: true,
      numero_ou_email: '+55 41 99999-0001',
    },
    conteudo: {
      texto: 'Lembrando que amanhã não haverá aula por conta do recesso municipal. Dúvidas, fale com a secretaria.',
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
  {
    id: 'M1-03',
    onda: 1,
    canal: 'sms',
    remetente: {
      nome: '+55 11 98888-7777',
      avatar: '?',
      verificado: false,
      contato_salvo: false,
      numero_ou_email: '+55 11 98888-7777',
    },
    conteudo: {
      texto: 'Parabens! Voce foi selecionado para receber R$2.847,00 do programa Renda Extra do Governo Federal. Resgate em: gov-renda-extra.blogspot.com',
      link: 'gov-renda-extra.blogspot.com',
      link_real: 'http://phishing-exemplo.com/renda-extra',
    },
    metadados: { horario: '11:07' },
    gabarito: {
      classificacao_correta: 'bloqueio',
      indicadores_validos: ['urgencia', 'remetente_estranho', 'link_suspeito', 'erro_gramatical', 'pedido_dado_sensivel'],
      indicadores_obrigatorios: ['urgencia', 'remetente_estranho', 'link_suspeito', 'erro_gramatical', 'pedido_dado_sensivel'],
      eh_fraude: true,
      explicacao: 'Erros de acentuação, número desconhecido, domínio de blog (.blogspot) fingindo ser governo. Nenhum programa do governo distribui dinheiro por SMS.',
    },
  },

  // ─── Onda 2: Brasileiros ──────────────────────────────────────────────────
  {
    id: 'M2-01',
    onda: 2,
    canal: 'whatsapp',
    remetente: {
      nome: 'Nubank',
      avatar: 'N',
      verificado: false,
      contato_salvo: false,
      numero_ou_email: '+55 11 91234-5678',
    },
    conteudo: {
      texto: 'Seu Pix foi temporariamente suspenso por atividade suspeita. Para liberar, confirme seus dados em: nubank-seguranca.com/verificar',
      link: 'nubank-seguranca.com/verificar',
      link_real: 'http://phishing-exemplo.com/nubank',
    },
    metadados: { horario: '16:44' },
    gabarito: {
      classificacao_correta: 'bloqueio',
      indicadores_validos: ['remetente_estranho', 'link_suspeito', 'pedido_dado_sensivel', 'contexto_inesperado'],
      indicadores_obrigatorios: ['remetente_estranho', 'link_suspeito', 'pedido_dado_sensivel', 'contexto_inesperado'],
      eh_fraude: true,
      explicacao: 'O Nubank nunca usa números de celular para comunicados de segurança. O domínio "nubank-seguranca.com" não é nubank.com.br. Sempre acesse apps diretamente.',
    },
  },
  {
    id: 'M2-02',
    onda: 2,
    canal: 'sms',
    remetente: {
      nome: 'CORREIOS',
      avatar: 'C',
      verificado: false,
      contato_salvo: false,
      numero_ou_email: 'CORREIOS',
    },
    conteudo: {
      texto: 'Seu pacote (BR123456789) está retido na alfândega. Taxa de R$14,90 necessária. Acesse: correios-rastreio.net/liberar',
      link: 'correios-rastreio.net/liberar',
      link_real: 'http://phishing-exemplo.com/correios',
    },
    metadados: { horario: '09:30' },
    gabarito: {
      classificacao_correta: 'bloqueio',
      indicadores_validos: ['link_suspeito', 'pedido_dado_sensivel', 'remetente_estranho'],
      indicadores_obrigatorios: ['link_suspeito', 'pedido_dado_sensivel'],
      eh_fraude: true,
      explicacao: 'O remetente alfanumérico pode ser falsificado (SIM Swapping). O domínio correto dos Correios é correios.com.br, não correios-rastreio.net. Taxa de alfândega legítima nunca é paga por link de SMS.',
    },
  },
  {
    id: 'M2-03',
    onda: 2,
    canal: 'whatsapp',
    remetente: {
      nome: 'Mãe',
      avatar: '❤️',
      verificado: false,
      contato_salvo: true,
      numero_ou_email: '+55 41 99888-1234',
    },
    conteudo: {
      texto: 'Oi filho, tô no trabalho ainda. Pode me mandar R$50 pelo Pix? Esqueci a carteira em casa. Depois te devolvo quando chegar',
    },
    metadados: { horario: '13:22' },
    gabarito: {
      classificacao_correta: 'suspeito',
      indicadores_validos: ['contexto_inesperado', 'pressao_financeira'],
      indicadores_obrigatorios: ['contexto_inesperado', 'pressao_financeira'],
      eh_fraude: true,
      explicacao: 'Pode ser a mãe de verdade — ou alguém que clonou o WhatsApp dela. A ação correta é LIGAR para a mãe antes de enviar qualquer dinheiro. Verificação por canal alternativo.',
    },
  },
  {
    id: 'M2-04',
    onda: 2,
    canal: 'instagram',
    remetente: {
      nome: '@vagas_empresa_xpto',
      avatar: 'V',
      verificado: false,
      contato_salvo: false,
      numero_ou_email: '340 seguidores',
    },
    conteudo: {
      texto: 'Olá! Temos vagas de digitador em home office, R$800/semana. Sem experiência. Clique no link da bio para se cadastrar.',
    },
    metadados: { horario: '18:05' },
    gabarito: {
      classificacao_correta: 'suspeito',
      indicadores_validos: ['remetente_estranho', 'contexto_inesperado'],
      indicadores_obrigatorios: ['remetente_estranho', 'contexto_inesperado'],
      eh_fraude: true,
      explicacao: 'Conta sem verificação, poucos seguidores, promessa de remuneração alta sem exigência de qualificação são sinais de alerta. Não é certeza de golpe, mas exige pesquisa antes de qualquer clique.',
    },
  },

  // ─── Onda 3: Direcionados ─────────────────────────────────────────────────
  {
    id: 'M3-01',
    onda: 3,
    canal: 'whatsapp',
    remetente: {
      nome: 'Diretora Marcia Silva',
      avatar: 'D',
      verificado: false,
      contato_salvo: false,
      numero_ou_email: '+55 41 98877-6655',
    },
    conteudo: {
      texto: 'Boa tarde. Sou a diretora do colégio. Precisamos que você traga amanhã o comprovante de residência atualizado. Qualquer dúvida, responda aqui mesmo.',
    },
    metadados: { horario: '15:10' },
    gabarito: {
      classificacao_correta: 'suspeito',
      indicadores_validos: ['remetente_estranho', 'contexto_inesperado', 'numero_desconhecido'],
      indicadores_obrigatorios: ['remetente_estranho', 'contexto_inesperado'],
      eh_fraude: true,
      explicacao: 'A escola tem canais oficiais de comunicação. Um número desconhecido pedindo documentos deve ser verificado diretamente na secretaria presencialmente ou pelo número oficial da escola.',
    },
  },
  {
    id: 'M3-02',
    onda: 3,
    canal: 'instagram',
    remetente: {
      nome: '@usuario_conhecido',
      avatar: 'U',
      verificado: false,
      contato_salvo: true,
      numero_ou_email: 'Segue você',
    },
    conteudo: {
      texto: 'ei vc topa fazer uma pesquisa rápida pra mim? é de um minuto só, clica aqui: pesquisa-digital.co/form?ref=amigos',
      link: 'pesquisa-digital.co/form?ref=amigos',
      link_real: 'http://phishing-exemplo.com/pesquisa',
    },
    metadados: { horario: '20:33' },
    gabarito: {
      classificacao_correta: 'suspeito',
      indicadores_validos: ['link_suspeito', 'contexto_inesperado'],
      indicadores_obrigatorios: ['link_suspeito', 'contexto_inesperado'],
      eh_fraude: true,
      explicacao: 'A conta pode ter sido comprometida. Pedido de clique em link sem contexto, mesmo de contato conhecido, merece uma confirmação direta — ligar ou mandar mensagem por outro canal.',
    },
  },
  {
    id: 'M3-03',
    onda: 3,
    canal: 'email',
    remetente: {
      nome: 'Secretaria Acadêmica',
      avatar: 'S',
      verificado: true,
      contato_salvo: false,
      numero_ou_email: 'secretaria@colegioestadual.edu.br',
    },
    conteudo: {
      texto: 'Informamos que o boletim do 2º bimestre está disponível no Portal do Aluno. Acesse: portaldoaluno.colegioestadual.edu.br',
      link: 'portaldoaluno.colegioestadual.edu.br',
      link_real: 'https://portaldoaluno.colegioestadual.edu.br',
    },
    metadados: { horario: '07:00' },
    gabarito: {
      classificacao_correta: 'confio',
      indicadores_validos: [],
      indicadores_obrigatorios: [],
      eh_fraude: false,
      explicacao: 'E-mail institucional real (.edu.br), link no mesmo domínio da instituição, sem urgência e sem pedido de dado sensível. Este é o padrão de comunicação legítima.',
    },
  },

  // ─── Onda 4: Pós-IA ──────────────────────────────────────────────────────
  {
    id: 'M4-01',
    onda: 4,
    canal: 'whatsapp',
    remetente: {
      nome: 'Tio João',
      avatar: '👴',
      verificado: false,
      contato_salvo: true,
      numero_ou_email: '+55 41 97766-5544',
    },
    conteudo: {
      texto: '01:12',
      audio: true,
    },
    metadados: { horario: '22:14' },
    gabarito: {
      classificacao_correta: 'bloqueio',
      indicadores_validos: ['deepfake_audio', 'pressao_financeira', 'contexto_inesperado'],
      indicadores_obrigatorios: ['deepfake_audio', 'pressao_financeira', 'contexto_inesperado'],
      eh_fraude: true,
      explicacao: 'Clonagem de voz por IA está acessível hoje. Antes de qualquer ação, ligue diretamente para o número que você sempre usa para falar com essa pessoa. O pedido de sigilo é sinal claro de manipulação.',
    },
  },
  {
    id: 'M4-02',
    onda: 4,
    canal: 'email',
    remetente: {
      nome: 'RH Corporativo',
      avatar: 'R',
      verificado: false,
      contato_salvo: false,
      numero_ou_email: 'rh@empresa-tech.com.br',
    },
    conteudo: {
      texto: 'Seu currículo foi selecionado. Para avançar, faça a entrevista inicial com nossa IA em: entrevista.empresa-tech.com.br. Envie também seu CPF e data de nascimento para geração do contrato.',
      link: 'entrevista.empresa-tech.com.br',
      link_real: 'http://phishing-exemplo.com/emprego',
    },
    metadados: { horario: '10:48' },
    gabarito: {
      classificacao_correta: 'bloqueio',
      indicadores_validos: ['pedido_dado_sensivel', 'link_suspeito', 'contexto_inesperado'],
      indicadores_obrigatorios: ['pedido_dado_sensivel', 'link_suspeito'],
      eh_fraude: true,
      explicacao: 'Empresas legítimas nunca pedem CPF por e-mail antes de qualquer etapa. "entrevista.empresa-tech.com.br" pode ser domínio diferente de "empresa-tech.com.br". Verifique no site oficial da empresa antes de fornecer qualquer dado.',
    },
  },
  {
    id: 'M4-03',
    onda: 4,
    canal: 'whatsapp',
    remetente: {
      nome: 'Família 👨‍👩‍👧‍👦',
      avatar: '👵',
      verificado: false,
      contato_salvo: true,
      numero_ou_email: 'Avó • Grupo familiar',
    },
    conteudo: {
      texto: 'URGENTE: Governo libera saque de R$3.000 para todos os cidadãos. Cadastre-se antes de amanhã: auxilio-extra-gov.com',
      link: 'auxilio-extra-gov.com',
      link_real: 'http://phishing-exemplo.com/auxilio',
      imagem: true,
    },
    metadados: { horario: '19:55' },
    gabarito: {
      classificacao_correta: 'bloqueio',
      indicadores_validos: ['urgencia', 'link_suspeito', 'dominio_falso'],
      indicadores_obrigatorios: ['urgencia', 'link_suspeito', 'dominio_falso'],
      eh_fraude: true,
      explicacao: 'Imagens de manchetes podem ser fabricadas ou editadas. O domínio não é .gov.br. A avó provavelmente caiu no golpe antes. Verifique sempre em fontes oficiais (gov.br) antes de clicar ou repassar.',
    },
  },
]

export function getMensagensDaOnda(onda: 1 | 2 | 3 | 4): Mensagem[] {
  return MENSAGENS.filter((m) => m.onda === onda)
}
