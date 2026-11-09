export interface PlanFeatureInfo {
  label: string
  tooltip: string
}

const KNOWN_FEATURES_MAP: Record<string, PlanFeatureInfo> = {
  // Teste Grátis
  'até 25 fotos compartilhadas no mural': {
    label: 'Até 25 fotos no mural',
    tooltip: 'Compartilhe até 25 fotos no telão e no mural durante a degustação do plano grátis.'
  },
  'duração do evento: 4 horas no mural e telão': {
    label: '4h de mural e telão',
    tooltip: 'Telão ao vivo e recepção de fotos ativos por até 4 horas contínuas.'
  },
  "modo telão ao vivo com marca d'água": {
    label: "Telão com marca d'água",
    tooltip: "Transmissão ao vivo em tela cheia com discreta marca d'água de testes."
  },
  'código qr pronto para os convidados': {
    label: 'QR Code instantâneo',
    tooltip: 'Código pronto para os convidados apontarem a câmera e entrarem direto pelo celular sem app.'
  },
  'mural no celular com curtidas em tempo real': {
    label: 'Mural mobile interativo',
    tooltip: 'Feed no celular onde todos os convidados acompanham as fotos e curtem em tempo real.'
  },
  'galeria ativa por 14 dias': {
    label: 'Galeria ativa por 14 dias',
    tooltip: 'Álbum digital acessível para visualização por 14 dias após o término do evento.'
  },

  // Passe do Evento
  '1 evento completo com fotos ilimitadas': {
    label: 'Fotos ilimitadas',
    tooltip: 'Sem limite de fotos: receba quantos cliques seus convidados quiserem enviar.'
  },
  '8 horas de telão ao vivo e recepção de fotos': {
    label: '8h de telão ao vivo',
    tooltip: 'Transmissão contínua no telão e recepção de fotos durante toda a festa.'
  },
  '2 telões simultâneos com pin individual': {
    label: '2 telões simultâneos',
    tooltip: 'Conecte até 2 TVs ou projetores diferentes (ex: palco e entrada) com PIN individual.'
  },
  '1 convidado na equipe organizadora': {
    label: '1 organizador extra',
    tooltip: 'Permite adicionar 1 membro de suporte ou cerimonial para ajudar na moderação das fotos.'
  },
  'convidados ilimitados sem app e sem cadastro': {
    label: 'Convidados ilimitados',
    tooltip: 'Todos os convidados participam sem precisar baixar app nem criar conta.'
  },
  'moderação de fotos em tempo real com pin': {
    label: 'Moderação ao vivo com PIN',
    tooltip: 'Aprove ou rejeite fotos em tempo real antes de serem projetadas no telão.'
  },
  'missões fotográficas interativas': {
    label: 'Missões fotográficas',
    tooltip: 'Desafios temáticos (ex: selfie com os noivos, brinde da mesa) para agitar a festa.'
  },
  'display de mesa com qr code para impressão': {
    label: 'Displays de mesa inclusos',
    tooltip: 'Gere cartões em alta definição prontos para imprimir e colocar nas mesas dos convidados.'
  },
  'download de todas as fotos em alta resolução (.zip)': {
    label: 'Download do álbum em .zip',
    tooltip: 'Baixe todas as fotos enviadas pelos convidados em resolução original em um único arquivo.'
  },
  'galeria online ativa por 90 dias': {
    label: 'Galeria online por 90 dias',
    tooltip: 'O álbum do evento fica disponível para download e recordações por 3 meses.'
  },

  // Agência Essencial
  '4 eventos inclusos por mês': {
    label: '4 eventos por mês',
    tooltip: '4 créditos de eventos completos todo mês. Créditos não utilizados acumulam enquanto o plano estiver ativo.'
  },
  '3 telões simultâneos por evento': {
    label: '3 telões simultâneos',
    tooltip: 'Conecte até 3 telões ou projetores em diferentes ambientes com sincronização instantânea.'
  },
  '2 convidados na equipe organizadora': {
    label: '2 organizadores extras',
    tooltip: 'Adicione até 2 membros da sua equipe para moderar e operar os eventos simultaneamente.'
  },
  'sua própria marca white-label no telão e app': {
    label: 'Marca White-Label',
    tooltip: 'Exiba a marca e o nome da sua assessoria no topo do telão e no app mobile dos convidados.'
  },
  'créditos acumulativos enquanto o plano estiver ativo': {
    label: 'Créditos acumulativos',
    tooltip: 'Os créditos de eventos não expiram ao fim do mês enquanto você mantiver a assinatura ativa.'
  },
  'crédito extra avulso por r$ 69,00': {
    label: 'Evento extra por R$ 69',
    tooltip: 'Precisa de mais eventos no mês? Compre créditos avulsos adicionais com desconto exclusivo.'
  },

  // Agência Pro
  '10 eventos inclusos por mês': {
    label: '10 eventos por mês',
    tooltip: '10 créditos de eventos completos mensais, ideais para empresas com múltiplos eventos por semana.'
  },
  '4 telões simultâneos por evento': {
    label: '4 telões simultâneos',
    tooltip: 'Conecte até 4 telas simultâneas em espaços amplos ou múltiplos ambientes.'
  },
  '5 convidados na equipe organizadora': {
    label: '5 organizadores extras',
    tooltip: 'Adicione até 5 membros da equipe com acesso individual à moderação de fotos.'
  },
  'sua marca em destaque para atrair novos clientes': {
    label: 'Sua marca em destaque',
    tooltip: 'Posicionamento visual premium para apresentar seus serviços a centenas de convidados.'
  },
  'botão direto para seu whatsapp no mural de fotos': {
    label: 'Botão de WhatsApp no app',
    tooltip: 'Link direto para seu WhatsApp no app dos convidados para receber solicitações de orçamento.'
  }
}

/**
 * Normaliza e resolve o texto de uma feature em formato minimalista (label)
 * acompanhado de uma explicação detalhada (tooltip) para o ícone de informação.
 */
export const resolvePlanFeature = (rawFeature: string): PlanFeatureInfo => {
  const normalized = rawFeature.trim().toLowerCase()

  if (KNOWN_FEATURES_MAP[normalized]) {
    return KNOWN_FEATURES_MAP[normalized]
  }

  // Tenta correspondência parcial por palavras-chave principais
  for (const [key, info] of Object.entries(KNOWN_FEATURES_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return info
    }
  }

  // Se tem separador ':' (Ex: "Armazenamento: 1 ano")
  if (rawFeature.includes(':')) {
    const parts = rawFeature.split(':')
    const label = parts[0].trim()
    const tooltip = parts.slice(1).join(':').trim()
    return {
      label: label.length > 25 ? label.slice(0, 25) + '...' : label,
      tooltip: tooltip || rawFeature
    }
  }

  // Fallback genérico: se for curto usa como label, senão resume
  if (rawFeature.length <= 26) {
    return {
      label: rawFeature,
      tooltip: rawFeature
    }
  }

  return {
    label: rawFeature.slice(0, 24) + '...',
    tooltip: rawFeature
  }
}

