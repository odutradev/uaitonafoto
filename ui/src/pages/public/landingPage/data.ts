export interface LinkItem {
  text: string
  href: string
}

export interface HeaderData {
  loginButton: LinkItem
}

export interface HeroData {
  tag: string
  title: string
  description: string
  primaryCta: LinkItem
  secondaryCta: LinkItem
}

export interface StepItem {
  id: string
  icon: 'qr_code' | 'camera' | 'tv' | string
  title: string
  description: string
}

export interface HowItWorksData {
  title: string
  subtitle: string
  steps: StepItem[]
}

export interface LiveWallData {
  brandName: string
  badge: string
  title: string
  description: string
  qrInstruction: string
}

export interface GuestFeedData {
  badge: string
  title: string
  description: string
  activityCard: {
    action: string
    timeAgo: string
  }
  cta: LinkItem
}

export interface PlanCardData {
  id: string
  abacateProductId: string
  badge?: string
  tag: string
  title: string
  price: string
  period: string
  costPerEvent?: string
  description: string
  features: string[]
  cta: LinkItem
  highlighted?: boolean
}

export interface UpsellBannerData {
  badge: string
  title: string
  price: string
  description: string
}

export interface PlansSectionData {
  tag: string
  title: string
  subtitle: string
  plans: PlanCardData[]
  upsell: UpsellBannerData
}

export interface FinalCtaData {
  title: string
  description: string
  button: LinkItem
}

export interface FooterData {
  copyrightSuffix: string
  companyName: string
  cnpj: string
}

export interface LandingPageData {
  header: HeaderData
  hero: HeroData
  howItWorks: HowItWorksData
  liveWall: LiveWallData
  guestFeed: GuestFeedData
  plans: PlansSectionData
  finalCta: FinalCtaData
  footer: FooterData
}

export const landingPageData: LandingPageData = {
  header: {
    loginButton: {
      text: 'Entrar',
      href: '/signin'
    }
  },
  hero: {
    tag: 'compartilhamento de fotos em tempo real',
    title: 'aponte a câmera, entre na foto e veja ela subir no telão.',
    description:
      'A experiência definitiva para casamentos, festas e eventos corporativos. Zero fricção: o convidado escaneia o QR Code, tira a foto e ela vai pro telão na hora. Sem aplicativo e sem cadastro.',
    primaryCta: {
      text: 'Criar meu evento',
      href: '/signup'
    },
    secondaryCta: {
      text: 'Acessar plataforma',
      href: '/signin'
    }
  },
  howItWorks: {
    title: 'como o uai to na foto funciona',
    subtitle: 'Três passos simples que qualquer convidado faz em menos de 10 segundos.',
    steps: [
      {
        id: 'step-1',
        icon: 'qr_code',
        title: '1. escaneia o qr code',
        description:
          'O convidado aponta a câmera do celular para o QR Code na mesa ou no telão. Abre direto no navegador sem precisar instalar nada.'
      },
      {
        id: 'step-2',
        icon: 'camera',
        title: '2. entra na foto',
        description:
          'Informa apenas o primeiro nome, tira a foto ou escolhe da galeria. Compressão automática inteligente para redes móveis no evento.'
      },
      {
        id: 'step-3',
        icon: 'tv',
        title: '3. sobe pro telão',
        description:
          'A foto ganha destaque instantâneo no telão da festa, integra o mosaico dinâmico e fica disponível para todos curtirem no feed mobile.'
      }
    ]
  },
  liveWall: {
    brandName: 'uai to na foto',
    badge: 'telão ao vivo',
    title: 'transmita em smart tvs e projetores',
    description:
      'Modo 16:9 otimizado com destaque de cada foto por 5 segundos antes de alimentar o mosaico ao vivo.',
    qrInstruction: 'escaneie e entre no telão'
  },
  guestFeed: {
    badge: 'Feed Mobile do Convidado',
    title: 'interação na palma da mão',
    description:
      'Os convidados curtem fotos em tempo real com o botão de coração, adicionam legendas divertidas e baixam recordações direto pelo celular.',
    activityCard: {
      action: 'marina adicionou uma foto',
      timeAgo: 'há 2 minutos'
    },
    cta: {
      text: 'Experimentar agora',
      href: '/signup'
    }
  },
  plans: {
    tag: 'Preços transparentes via Pix e Cartão',
    title: 'planos simples para anfitriões e agências',
    subtitle: 'Sem taxas escondidas. Crie desde um evento de teste gratuito até uma operação completa de cerimonial.',
    plans: [
      {
        id: 'free_trial',
        abacateProductId: 'free_trial',
        tag: 'Degustação',
        title: 'Modo Degustação',
        price: 'Grátis',
        period: 'sem cartão',
        description: 'Experimente a dinâmica do telão e do app no seu evento sem nenhum compromisso financeiro.',
        features: [
          'Até 25 fotos compartilhadas no feed',
          'Modo Telão (Live Wall) com marca d\'água',
          'QR Code pronto para exibir aos convidados',
          'Feed mobile com curtidas em tempo real',
          'Galeria ativa por 7 dias'
        ],
        cta: {
          text: 'Começar grátis',
          href: '/signup'
        },
        highlighted: false
      },
      {
        id: 'b2c_event_pass',
        abacateProductId: 'prod_b2c_event_pass',
        tag: 'Evento Único',
        title: 'Passe do Evento',
        price: 'R$ 147',
        period: 'pagamento único',
        description: 'Perfeito para noivos, aniversariantes e formaturas contratando para uma data especial.',
        features: [
          '1 evento completo com fotos ilimitadas',
          'Convidados ilimitados sem precisar de aplicativo',
          'Modo Telão ao vivo sem marcas d\'água',
          'Moderação de fotos por PIN de segurança',
          'Download de todas as fotos em alta resolução (.zip)',
          'Galeria ativa por 90 dias'
        ],
        cta: {
          text: 'Criar meu evento',
          href: '/signup'
        },
        highlighted: false
      },
      {
        id: 'agency_essential',
        abacateProductId: 'prod_agency_essential',
        tag: 'Cerimonialistas',
        title: 'Agência Essencial',
        price: 'R$ 247',
        period: '/mês',
        costPerEvent: 'R$ 61,75 por evento (58% OFF)',
        description: 'Para assessores e cerimonialistas que realizam eventos com frequência regular.',
        features: [
          '4 eventos inclusos por mês',
          'Selo White-Label: sua marca no telão e no app mobile',
          'Link para seu WhatsApp/Instagram no telão',
          'Rollover de 60 dias (créditos acumulam contra sazonalidade)',
          'Acesso de moderação por PIN para equipe na festa',
          'Crédito extra avulso por R$ 69,00'
        ],
        cta: {
          text: 'Assinar Essencial',
          href: '/signup'
        },
        highlighted: false
      },
      {
        id: 'agency_pro',
        abacateProductId: 'prod_agency_pro',
        badge: 'Mais Escolhido',
        tag: 'Alta Demanda',
        title: 'Agência Pro',
        price: 'R$ 447',
        period: '/mês',
        costPerEvent: 'R$ 44,70 por evento (70% OFF)',
        description: 'O melhor custo-benefício para agências consolidadas com múltiplos eventos por semana.',
        features: [
          '10 eventos inclusos por mês',
          'Selo White-Label exclusivo gerador de leads',
          'Botão direto para seu WhatsApp no mural de fotos',
          'Rollover de 60 dias com teto de até 20 créditos acumulados',
          'Painel de moderação para recepcionistas na festa',
          'Crédito extra avulso por apenas R$ 49,00',
          'Suporte prioritário via WhatsApp'
        ],
        cta: {
          text: 'Assinar Agência Pro',
          href: '/signup'
        },
        highlighted: true
      }
    ],
    upsell: {
      badge: 'Order Bump / Adicional Opcional',
      title: 'Extensão Galeria 1 Ano + Cápsula do Tempo',
      price: '+ R$ 39,00',
      description: 'Mantenha a galeria de recordações online por 1 ano completo e libere o Modo Cápsula do Tempo para revelar fotos apenas no dia seguinte.'
    }
  },
  finalCta: {
    title: 'pronto para transformar as fotos do seu próximo evento?',
    description:
      'Casamentos, formaturas, aniversários ou eventos corporativos com a melhor experiência de live wall do Brasil.',
    button: {
      text: 'Criar meu evento agora',
      href: '/signup'
    }
  },
  footer: {
    copyrightSuffix: 'todos os direitos reservados.',
    companyName: 'Lite Technology LTDA',
    cnpj: '55.717.105/0001-58'
  }
}

export const {
  header: headerData,
  hero: heroData,
  howItWorks: howItWorksData,
  liveWall: liveWallData,
  guestFeed: guestFeedData,
  plans: plansData,
  finalCta: finalCtaData,
  footer: footerData
} = landingPageData

export default landingPageData
