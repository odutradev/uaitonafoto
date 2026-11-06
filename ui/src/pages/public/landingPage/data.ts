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
          'A foto ganha destaque instantâneo no telão da festa, integra o mosaico dinâmico e fica disponível para todos curtirem no celular.'
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
    badge: 'Interação dos Convidados',
    title: 'interação na palma da mão',
    description:
      'Os convidados curtem fotos em tempo real com o botão de coração, adicionam legendas divertidas e guardam recordações direto pelo celular.',
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
    subtitle: 'Sem taxas escondidas. Crie desde um evento de teste gratuito até uma operação completa de cerimonial.'
  },
  finalCta: {
    title: 'pronto para transformar as fotos do seu próximo evento?',
    description:
      'Casamentos, formaturas, aniversários ou eventos corporativos com a melhor experiência de telão ao vivo do Brasil.',
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
