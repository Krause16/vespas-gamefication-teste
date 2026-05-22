import { type AjustePrivacidade } from '@/types/detetive-osint'

export const AJUSTES: AjustePrivacidade[] = [
  {
    id: 'perfil_privado',
    descricao: 'Tornar o perfil principal privado',
    reducao_score: 20,
    acao_real: 'Instagram: Configurações → Privacidade → Conta Privada',
  },
  {
    id: 'remover_geolocalizacao',
    descricao: 'Desativar geotag automático em fotos',
    reducao_score: 25,
    acao_real: 'iOS: Ajustes → Privacidade → Serviços de Localização → Câmera → Nunca',
  },
  {
    id: 'separar_contas',
    descricao: 'Criar conta separada para conteúdo público',
    reducao_score: 15,
    acao_real: 'Manter um perfil pessoal privado e outro público sem dados identificáveis',
  },
  {
    id: 'restringir_stories',
    descricao: 'Limitar quem vê seus Stories',
    reducao_score: 10,
    acao_real: 'Instagram: Stories → Configurações → Ocultar story de...',
  },
  {
    id: 'remover_escola_bio',
    descricao: 'Remover nome da escola da bio',
    reducao_score: 10,
    acao_real: 'Não coloque escola, bairro ou cidade na bio pública',
  },
  {
    id: 'revisar_seguidores',
    descricao: 'Revisar lista de seguidores e remover desconhecidos',
    reducao_score: 8,
    acao_real: 'Periodicamente, revise quem te segue e remova contas suspeitas',
  },
  {
    id: 'exif_fotos',
    descricao: 'Remover metadados antes de postar fotos',
    reducao_score: 15,
    acao_real: 'Use apps como Metapho (iOS) ou ExifEraser (Android) antes de postar',
  },
  {
    id: 'verificar_apps',
    descricao: 'Revogar permissão de localização de apps desnecessários',
    reducao_score: 10,
    acao_real: 'Configurações → Privacidade → Localização → revisar app a app',
  },
]
