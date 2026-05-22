import { type PistaOSINT } from '@/types/detetive-osint'

export const PISTAS: PistaOSINT[] = [
  {
    id: 'p1_instagram',
    fonte: 'rede_social_publica',
    pontos: 20,
    conteudo:
      'Perfil público @luna_estudante. Foto de capa mostra uniforme com nome da escola. Bio: "16 anos | Curitiba | amo fotografia 📸". Última postagem: selfie marcada como "Shopping Mueller".',
    dado_revelado: 'Escola Estadual Dom Pedro II, 16 anos, mora em Curitiba, frequenta o Shopping Mueller',
  },
  {
    id: 'p2_exif',
    fonte: 'metadado_exif',
    pontos: 25,
    requer_pista: 'p1_instagram',
    conteudo:
      'Metadados EXIF extraídos da foto de perfil de Luna:\n\nModelo: iPhone 13\nData: 15/03/2025 às 14:32\nGPS: -25.4297° S, -49.2711° O\n\n[Coordenadas correspondem ao Bairro Batel, Curitiba — raio de 200m]',
    dado_revelado: 'Localização GPS precisa — Bairro Batel, Curitiba (raio 200m)',
  },
  {
    id: 'p3_tiktok',
    fonte: 'padrao_postagem',
    pontos: 20,
    conteudo:
      'TikTok @luna.fotos (público). Vídeo "fazendo dever" mostra janela com prédio residencial ao fundo. Vídeo "minha rotina": "acordo 6h, sigo pro colégio às 7h, volto meio-dia e meia, ginástica às 18h toda terça e quinta".',
    dado_revelado: 'Rotina semanal detalhada — saída 7h, retorno 12h30, academia terça e quinta às 18h',
  },
  {
    id: 'p4_discord',
    fonte: 'forum_publico',
    pontos: 15,
    conteudo:
      'Servidor público "Fotógrafos de Curitiba" no Discord. Mensagens de @luna_estudante: "alguém vai à Feira do Largo no domingo?", "to com nota baixa em mat, to em pânico 😭", "minha mãe não deixa eu ir sozinha pra foto-rua, é chato isso".',
    dado_revelado: 'Vai à Feira do Largo no domingo, nota baixa em matemática, dependência parental',
  },
  {
    id: 'p5_imagem_reversa',
    fonte: 'imagem_publicada',
    pontos: 20,
    requer_pista: 'p1_instagram',
    conteudo:
      'Busca reversa da foto de perfil encontrou correspondência em blog escolar (postagem de 2024): "Alunos do 2º ano A participam do projeto de fotografia. Na foto: Luna Ferreira Santos, 15 anos, junto com colegas."',
    dado_revelado: 'Nome completo: Luna Ferreira Santos — vinculado a escola e turma',
  },
]
