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

export interface FeatureItem {
  id: string
  icon: 'tv' | 'challenges' | 'moderation' | 'print' | 'whitelabel' | 'download'
  title: string
  description: string
  badge?: string
}

export interface FeaturesSectionData {
  tag: string
  title: string
  subtitle: string
  items: FeatureItem[]
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

export interface PlansSectionData {
  tag: string
  title: string
  subtitle: string
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
  features: FeaturesSectionData
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
    tag: 'fotos ao vivo no telão · sem app · sem cadastro',
    title: 'suas fotos no telão em tempo real.',
    description:
      'O convidado aponta a câmera, cumpre missões fotográficas e vê a foto subir no telão na hora. Zero complicação.',
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
    title: 'como funciona',
    subtitle: 'Três passos simples direto pelo navegador do celular.',
    steps: [
      {
        id: 'step-1',
        icon: 'qr_code',
        title: '1. escaneia o qr code',
        description: 'Abra a câmera do celular no display de mesa ou tela. Sem baixar app.'
      },
      {
        id: 'step-2',
        icon: 'camera',
        title: '2. fotos & missões',
        description: 'Digite o nome, cumpra desafios divertidos e envie suas fotos.'
      },
      {
        id: 'step-3',
        icon: 'tv',
        title: '3. ao vivo no telão',
        description: 'A foto entra na hora no telão e no mural interativo da festa.'
      }
    ]
  },
  liveWall: {
    brandName: 'uai to na foto',
    badge: 'múltiplos telões ao vivo',
    title: 'transmita em smart tvs e projetores',
    description:
      'Conecte múltiplos telões simultâneos com PIN individual (palco, entrada e lounge) com rotação contínua e mosaico dinâmico.',
    qrInstruction: 'escaneie e entre no telão'
  },
  guestFeed: {
    badge: 'Mural & Desafios',
    title: 'interação na palma da mão',
    description:
      'Feed mobile onde os convidados curtem fotos em tempo real e cumprem missões temáticas do evento.',
    activityCard: {
      action: 'marina cumpriu "O brinde da mesa"',
      timeAgo: 'há 2 minutos'
    },
    cta: {
      text: 'Experimentar agora',
      href: '/signup'
    }
  },
  features: {
    tag: 'Recursos Completos',
    title: 'tudo o que o seu evento precisa',
    subtitle:
      'Interação para os convidados, controle para os anfitriões e destaque para cerimonialistas.',
    items: [
      {
        id: 'feat-screens',
        icon: 'tv',
        title: 'Múltiplos Telões',
        description:
          'Conecte TVs, LEDs e projetores simultâneos com PIN individual e monitoramento de sinal.',
        badge: 'Até 4 Telões'
      },
      {
        id: 'feat-challenges',
        icon: 'challenges',
        title: 'Missões Interativas',
        description:
          'Desafie os convidados a cumprirem fotos temáticas e agite o clima da festa.',
        badge: 'Novo'
      },
      {
        id: 'feat-moderation',
        icon: 'moderation',
        title: 'Moderação ao Vivo',
        description:
          'Filtro de segurança com PIN para aprovar fotos antes de subirem no telão.'
      },
      {
        id: 'feat-print',
        icon: 'print',
        title: 'Display de Mesa',
        description:
          'Gere cartões com QR Code em alta definição prontos para imprimir e colocar nas mesas.'
      },
      {
        id: 'feat-whitelabel',
        icon: 'whitelabel',
        title: 'White-Label & WhatsApp',
        description:
          'Sua logomarca no telão e no app mobile com botão direto para orçamentos via WhatsApp.',
        badge: 'Agências'
      },
      {
        id: 'feat-download',
        icon: 'download',
        title: 'Download em Alta Resolução',
        description:
          'Baixe todas as fotos originais em arquivo compactado (.zip) após o evento.'
      }
    ]
  },
  plans: {
    tag: 'Preços transparentes',
    title: 'planos simples e diretos',
    subtitle:
      'Escolha entre o Passe Avulso por evento ou planos mensais para assessorias com créditos acumulativos.'
  },
  finalCta: {
    title: 'pronto para transformar as fotos do seu evento?',
    description:
      'A melhor experiência de múltiplos telões ao vivo e interação para sua festa.',
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
  features: featuresData,
  plans: plansData,
  finalCta: finalCtaData,
  footer: footerData
} = landingPageData

export default landingPageData
