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
    tag: 'fotos ao vivo no telão · sem aplicativo · sem cadastro',
    title: 'suas fotos no telão em tempo real com missões interativas.',
    description:
      'A experiência definitiva para casamentos, festas e eventos corporativos. O convidado aponta a câmera, cumpre desafios fotográficos divertidos e vê a foto subir no telão na hora. Zero fricção para todos.',
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
    subtitle: 'Três passos simples que qualquer convidado faz em menos de 10 segundos direto pelo navegador.',
    steps: [
      {
        id: 'step-1',
        icon: 'qr_code',
        title: '1. escaneia o qr code',
        description:
          'O convidado aponta a câmera do celular para o display de mesa ou tela. Abre direto no navegador sem precisar instalar nada.'
      },
      {
        id: 'step-2',
        icon: 'camera',
        title: '2. entra na foto & cumpre missões',
        description:
          'Informa apenas o primeiro nome, cumpre missões divertidas da festa e tira a foto. Compressão inteligente ultra-rápida para redes móveis.'
      },
      {
        id: 'step-3',
        icon: 'tv',
        title: '3. sobe pro telão ao vivo',
        description:
          'A foto ganha destaque instantâneo no telão, entra no mosaico dinâmico e fica salva no mural para todos curtirem e comentarem no celular.'
      }
    ]
  },
  liveWall: {
    brandName: 'uai to na foto',
    badge: 'múltiplos telões ao vivo',
    title: 'transmita em smart tvs e projetores',
    description:
      'Modo 16:9 de alta performance. Conecte múltiplos telões simultâneos com PIN individual (palco principal, entrada, lounge) e rotação contínua.',
    qrInstruction: 'escaneie e entre no telão'
  },
  guestFeed: {
    badge: 'Mural & Desafios Fotográficos',
    title: 'interação e engajamento na palma da mão',
    description:
      'Os convidados curtem fotos em tempo real com botão de coração, cumprem missões temáticas do evento e guardam recordações inesquecíveis direto pelo celular.',
    activityCard: {
      action: 'marina cumpriu a missão "O brinde da mesa"',
      timeAgo: 'há 2 minutos'
    },
    cta: {
      text: 'Experimentar agora',
      href: '/signup'
    }
  },
  features: {
    tag: 'Recursos Completos da Plataforma',
    title: 'tudo o que o seu evento precisa para ser inesquecível',
    subtitle:
      'Projetado do zero para máxima interação dos convidados, controle absoluto dos anfitriões e destaque profissional para cerimonialistas.',
    items: [
      {
        id: 'feat-screens',
        icon: 'tv',
        title: 'Múltiplos Telões Simultâneos',
        description:
          'Conecte TVs, telões de LED e projetores ao mesmo tempo. Cada ponto tem PIN exclusivo e monitoramento online de sinal em tempo real.',
        badge: 'Até 4 Telões'
      },
      {
        id: 'feat-challenges',
        icon: 'challenges',
        title: 'Missões Fotográficas Interativas',
        description:
          'Desafie os convidados a cumprirem missões (selfie com a noiva, foto do look, o brinde da noite) estimulando cliques divertidos e espontâneos.',
        badge: 'Novo'
      },
      {
        id: 'feat-moderation',
        icon: 'moderation',
        title: 'Moderação em Tempo Real',
        description:
          'Mantenha o controle da projeção: ative a moderação prévia com PIN para que apenas fotos aprovadas pela equipe apareçam no telão.'
      },
      {
        id: 'feat-print',
        icon: 'print',
        title: 'Display de Mesa Pronto para Impressão',
        description:
          'Gere cartões elegantes em alta definição com o QR Code do evento, prontos para exportar em PNG e colocar nos centros de mesa.'
      },
      {
        id: 'feat-whitelabel',
        icon: 'whitelabel',
        title: 'White-Label com Botão WhatsApp',
        description:
          'Assessorias e fotógrafos colocam sua própria logomarca no telão e no app mobile, com botão direto para WhatsApp captando novos clientes.',
        badge: 'Agências'
      },
      {
        id: 'feat-download',
        icon: 'download',
        title: 'Download Completo em Alta Definição',
        description:
          'Baixe todas as fotos originais do evento em um único arquivo compactado (.zip) em alta resolução após o encerramento da festa.'
      }
    ]
  },
  plans: {
    tag: 'Preços transparentes via Pix e Cartão',
    title: 'planos simples para anfitriões e agências',
    subtitle:
      'Sem surpresas. Escolha entre o Passe Avulso completo por evento ou nossos planos mensais para cerimonialistas com créditos acumulativos.'
  },
  finalCta: {
    title: 'pronto para transformar as fotos do seu próximo evento?',
    description:
      'Casamentos, formaturas, aniversários ou eventos corporativos com a melhor experiência de múltiplos telões e fotos ao vivo do Brasil.',
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
