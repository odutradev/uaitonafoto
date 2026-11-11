import type { SceneKind, SceneTone } from "@components/scenePhoto/types";

export interface LinkItem {
  text: string;
  href: string;
}

export interface PhotoItem {
  id: string;
  kind: SceneKind;
  tone: SceneTone;
  author: string;
  caption: string;
}

export interface LiveToast {
  author: string;
  text: string;
}

export interface HeaderData {
  loginButton: LinkItem;
  signupButton: LinkItem;
  links: LinkItem[];
}

export interface HeroData {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  emphasis: string[];
  chips: string[];
  occasions: string[];
  primaryCta: LinkItem;
  secondaryCta: LinkItem;
  photos: PhotoItem[];
  toasts: LiveToast[];
  qrLabel: string;
}

export interface StoryStage {
  label: string;
  title: string;
  text: string;
}

export interface PhotoTrap {
  label: string;
  note: string;
}

export interface ProblemData {
  eyebrow: string;
  title: string;
  highlight: string;
  stages: StoryStage[];
  traps: PhotoTrap[];
  albumLabel: string;
  photos: PhotoItem[];
}

export interface JourneyStep {
  time: string;
  title: string;
  text: string;
}

export interface GuestJourneyData {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  steps: JourneyStep[];
  guestName: string;
  eventName: string;
  photo: PhotoItem;
}

export interface LiveScreen {
  label: string;
  pin: string;
  photos: PhotoItem[];
}

export interface LiveHighlight {
  title: string;
  text: string;
}

export interface LiveEventData {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  screens: LiveScreen[];
  missionsTitle: string;
  missionsText: string;
  missions: string[][];
  highlights: LiveHighlight[];
}

export interface QueuePhoto extends PhotoItem {
  table: string;
  mission?: string;
  shouldReject?: boolean;
}

export interface TableActivity {
  name: string;
  photos: number;
}

export interface OrganizerViewData {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  queue: QueuePhoto[];
  tables: TableActivity[];
  bullets: LiveHighlight[];
}

export interface GuestAlbum {
  id: string;
  name: string;
  role: string;
  tone: SceneTone;
  photos: (PhotoItem & { time: string })[];
}

export interface AfterPartyData {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  guests: GuestAlbum[];
  compareTitle: string;
  compareText: string;
  compareBefore: string;
  compareAfter: string;
  download: {
    fileName: string;
    count: string;
    size: string;
    button: string;
    done: string;
  };
}

export interface HostStep {
  title: string;
  text: string;
  path: string;
}

export interface HostStepsData {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  steps: HostStep[];
}

export interface FeatureItem {
  id: string;
  icon: "tv" | "missions" | "moderation" | "table" | "whitelabel" | "feed";
  title: string;
  description: string;
  badge?: string;
}

export interface FeaturesSectionData {
  eyebrow: string;
  title: string;
  highlight: string;
  items: FeatureItem[];
}

export interface PlansSectionData {
  tag: string;
  title: string;
  subtitle: string;
}

export interface AudienceItem {
  title: string;
  text: string;
}

export interface InlineCtaData {
  title: string;
  text: string;
  primary: LinkItem;
  secondary: LinkItem;
}

export interface InlineCtasData {
  organizer: InlineCtaData;
  afterParty: InlineCtaData;
  hostSteps: InlineCtaData;
}

export interface FinalCtaData {
  title: string;
  description: string;
  button: LinkItem;
  domain: string;
}

export interface FooterData {
  copyrightSuffix: string;
  companyName: string;
  cnpj: string;
}

export interface LandingPageData {
  header: HeaderData;
  hero: HeroData;
  problem: ProblemData;
  guestJourney: GuestJourneyData;
  liveEvent: LiveEventData;
  organizerView: OrganizerViewData;
  afterParty: AfterPartyData;
  hostSteps: HostStepsData;
  features: FeaturesSectionData;
  plans: PlansSectionData;
  audiences: AudienceItem[];
  inlineCtas: InlineCtasData;
  finalCta: FinalCtaData;
  footer: FooterData;
}

export const landingPageData: LandingPageData = {
  header: {
    loginButton: { text: "Entrar", href: "/signin" },
    signupButton: { text: "Criar evento", href: "/signup" },
    links: [
      { text: "o produto", href: "#produto" },
      { text: "convidado", href: "#convidado" },
      { text: "ao vivo", href: "#ao-vivo" },
      { text: "pós-evento", href: "#pos-evento" },
      { text: "planos", href: "#planos" }
    ]
  },
  hero: {
    eyebrow: "fotos ao vivo no telão",
    title: "suas fotos no telão em",
    highlight: "tempo real.",
    description:
      "O convidado aponta a câmera para um QR Code, digita o primeiro nome e envia fotos direto do navegador. Elas aparecem na hora no telão da festa. No fim, você baixa todas as fotos em alta qualidade e revive o evento pelo olhar de cada convidado.",
    emphasis: ["todas as fotos em alta qualidade", "pelo olhar de cada convidado"],
    chips: ["sem app", "sem cadastro", "fotos originais"],
    occasions: ["casamentos", "aniversários", "formaturas", "corporativos"],
    primaryCta: { text: "Criar meu evento", href: "/signup" },
    secondaryCta: { text: "Ver como funciona", href: "#produto" },
    photos: [
      { id: "hero-1", kind: "toast", tone: "amber", author: "marina", caption: "o brinde da mesa" },
      { id: "hero-2", kind: "bouquet", tone: "rose", author: "tia célia", caption: "selfie com o buquê" },
      { id: "hero-3", kind: "dance", tone: "dusk", author: "joão", caption: "a pista lotada" },
      { id: "hero-4", kind: "rings", tone: "cream", author: "lucas", caption: "as alianças" },
      { id: "hero-5", kind: "sparkler", tone: "night", author: "bia", caption: "a saída dos noivos" },
      { id: "hero-6", kind: "cake", tone: "gold", author: "rafa", caption: "o corte do bolo" }
    ],
    toasts: [
      { author: "marina", text: 'cumpriu "o brinde da mesa" 🥂' },
      { author: "tia célia", text: "enviou uma foto do buquê" },
      { author: "joão", text: 'cumpriu "a pista lotada" 🪩' },
      { author: "lucas", text: "curtiu a foto da marina" },
      { author: "bia", text: "entrou pelo QR Code da mesa 7" },
      { author: "rafa", text: 'cumpriu "o corte do bolo" 🎂' }
    ],
    qrLabel: "escaneie e entre no telão"
  },
  problem: {
    eyebrow: "o produto",
    title: "as melhores fotos da festa,",
    highlight: "no lugar certo.",
    stages: [
      {
        label: "o problema",
        title: "as fotos ficam presas no celular dos convidados.",
        text: "Grupos de WhatsApp comprimem as imagens, link de drive ninguém lembra de abrir e app que exige download e cadastro simplesmente não é usado. O anfitrião fica sem as fotos e a festa perde um momento de interação."
      },
      {
        label: "a solução",
        title: "zero fricção, direto no navegador.",
        text: "Um QR Code na mesa ou no telão leva o convidado ao mural do evento. Em segundos ele envia fotos, curte as dos outros e cumpre missões. Tudo aparece ao vivo no telão."
      },
      {
        label: "o resultado",
        title: "a festa inteira, pelo olhar de quem estava lá.",
        text: "As fotos são guardadas como foram tiradas, sem compressão. O álbum reúne os ângulos, as risadas e os bastidores que o fotógrafo oficial não pega."
      }
    ],
    traps: [
      { label: "grupo do whatsapp", note: "foto comprimida" },
      { label: "link do drive", note: "ninguém abriu" },
      { label: "app da festa", note: "baixe para participar" }
    ],
    albumLabel: "álbum do evento · originais",
    photos: [
      { id: "problem-1", kind: "selfie", tone: "sky", author: "marina", caption: "mesa 4" },
      { id: "problem-2", kind: "toast", tone: "amber", author: "joão", caption: "mesa 1" },
      { id: "problem-3", kind: "bouquet", tone: "rose", author: "tia célia", caption: "mesa 7" }
    ]
  },
  guestJourney: {
    eyebrow: "e o convidado?",
    title: "do QR Code ao telão em menos de",
    highlight: "10 segundos.",
    description:
      "Nada de baixar app, criar senha ou preencher cadastro. O convidado usa a câmera que já tem no bolso e participa direto do navegador.",
    steps: [
      { time: "00:02", title: "aponta a câmera", text: "no QR Code da mesa ou do telão" },
      { time: "00:05", title: "digita o nome", text: "sem app, sem senha, sem cadastro" },
      { time: "00:09", title: "envia e curte", text: "a foto sobe no telão na hora" }
    ],
    guestName: "marina",
    eventName: "casamento ana & pedro",
    photo: { id: "journey-1", kind: "toast", tone: "amber", author: "marina", caption: "o brinde da mesa" }
  },
  liveEvent: {
    eyebrow: "ao vivo, no evento",
    title: "a festa inteira aparece",
    highlight: "no telão.",
    description:
      "TVs, LEDs e projetores ao mesmo tempo, no palco, na entrada e no lounge. Cada tela tem seu PIN e roda as fotos que acabaram de chegar, em mosaico e sem travar.",
    screens: [
      {
        label: "palco",
        pin: "4821",
        photos: [
          { id: "stage-1", kind: "rings", tone: "cream", author: "lucas", caption: "as alianças" },
          { id: "stage-2", kind: "dance", tone: "dusk", author: "joão", caption: "a pista lotada" },
          { id: "stage-3", kind: "toast", tone: "amber", author: "marina", caption: "o brinde da mesa" }
        ]
      },
      {
        label: "entrada",
        pin: "1937",
        photos: [
          { id: "entry-1", kind: "bouquet", tone: "rose", author: "tia célia", caption: "selfie com o buquê" },
          { id: "entry-2", kind: "selfie", tone: "sky", author: "bia", caption: "os padrinhos" },
          { id: "entry-3", kind: "cake", tone: "gold", author: "rafa", caption: "o corte do bolo" }
        ]
      },
      {
        label: "lounge",
        pin: "7754",
        photos: [
          { id: "lounge-1", kind: "sparkler", tone: "night", author: "pedro", caption: "a saída" },
          { id: "lounge-2", kind: "selfie", tone: "sage", author: "carol", caption: "a mesa mais animada" },
          { id: "lounge-3", kind: "dance", tone: "amber", author: "vó lúcia", caption: "dançando" }
        ]
      }
    ],
    missionsTitle: "missões fotográficas",
    missionsText:
      "Desafios temáticos por tipo de evento que fazem os convidados circularem, rirem e fotografarem o que importa.",
    missions: [
      [
        "selfie com o buquê",
        "o brinde da mesa",
        "a pista lotada",
        "foto com os noivos",
        "o primeiro beijo",
        "a gravata mais torta"
      ],
      [
        "o corte do bolo",
        "a mesa mais animada",
        "parabéns pra você",
        "foto com a família",
        "o melhor passinho",
        "o padrinho chorando"
      ],
      [
        "o chapéu pro alto",
        "a turma toda",
        "o abraço do reitor",
        "o look da noite",
        "bastidores do palco",
        "a pose mais criativa"
      ]
    ],
    highlights: [
      { title: "até 4 telões", text: "palco, entrada e lounge, cada um com seu PIN" },
      { title: "mural com curtidas", text: "o convidado acompanha e curte tudo no celular" },
      { title: "display de mesa", text: "cartões com QR Code prontos para imprimir" }
    ]
  },
  organizerView: {
    eyebrow: "o olhar do organizador",
    title: "a festa pelos olhos dos convidados,",
    highlight: "na sua mão.",
    description:
      "Enquanto a festa acontece, você vê cada foto chegando, quem tirou e de qual mesa. Aprove o que vai pro telão, remova o que não deve e bloqueie convidados, tudo pelo celular.",
    queue: [
      {
        id: "queue-1",
        kind: "toast",
        tone: "amber",
        author: "marina",
        caption: "o brinde da mesa",
        table: "mesa 4",
        mission: "o brinde da mesa"
      },
      {
        id: "queue-2",
        kind: "selfie",
        tone: "night",
        author: "convidado 23",
        caption: "foto escura e tremida",
        table: "mesa 9",
        shouldReject: true
      },
      {
        id: "queue-3",
        kind: "bouquet",
        tone: "rose",
        author: "tia célia",
        caption: "selfie com o buquê",
        table: "mesa 7",
        mission: "selfie com o buquê"
      },
      {
        id: "queue-4",
        kind: "dance",
        tone: "dusk",
        author: "joão",
        caption: "a pista lotada",
        table: "mesa 1",
        mission: "a pista lotada"
      },
      { id: "queue-5", kind: "cake", tone: "gold", author: "rafa", caption: "o corte do bolo", table: "mesa 2" },
      { id: "queue-6", kind: "rings", tone: "cream", author: "lucas", caption: "as alianças", table: "mesa 3" }
    ],
    tables: [
      { name: "mesa 1", photos: 38 },
      { name: "mesa 2", photos: 21 },
      { name: "mesa 3", photos: 12 },
      { name: "mesa 4", photos: 47 },
      { name: "mesa 5", photos: 9 },
      { name: "mesa 6", photos: 26 },
      { name: "mesa 7", photos: 33 },
      { name: "mesa 8", photos: 15 },
      { name: "pista", photos: 64 }
    ],
    bullets: [
      { title: "moderação ao vivo", text: "aprove ou rejeite antes de ir ao telão" },
      { title: "equipe organizadora", text: "chame a assessoria para moderar junto" },
      { title: "controle dos telões", text: "conecte, pause e troque as telas pelo painel" }
    ]
  },
  afterParty: {
    eyebrow: "pós-evento",
    title: "reviva a festa",
    highlight: "pelo olhar de cada convidado.",
    description:
      "Ao encerrar, o álbum mostra o evento pela perspectiva de quem estava lá: cada foto, quem tirou e em que momento. Escolha um convidado e veja a festa como ele viu.",
    guests: [
      {
        id: "marina",
        name: "marina",
        role: "mesa 4 · amiga da noiva",
        tone: "amber",
        photos: [
          { id: "marina-1", time: "19:42", kind: "selfie", tone: "sky", author: "marina", caption: "chegando" },
          { id: "marina-2", time: "20:15", kind: "rings", tone: "cream", author: "marina", caption: "o sim" },
          { id: "marina-3", time: "21:30", kind: "toast", tone: "amber", author: "marina", caption: "o brinde" },
          { id: "marina-4", time: "23:58", kind: "dance", tone: "dusk", author: "marina", caption: "a pista" }
        ]
      },
      {
        id: "celia",
        name: "tia célia",
        role: "mesa 7 · família da noiva",
        tone: "rose",
        photos: [
          { id: "celia-1", time: "19:20", kind: "bouquet", tone: "rose", author: "tia célia", caption: "as flores" },
          { id: "celia-2", time: "20:05", kind: "rings", tone: "gold", author: "tia célia", caption: "a cerimônia" },
          { id: "celia-3", time: "22:10", kind: "cake", tone: "cream", author: "tia célia", caption: "o bolo" },
          { id: "celia-4", time: "22:40", kind: "selfie", tone: "rose", author: "tia célia", caption: "com a vó" }
        ]
      },
      {
        id: "joao",
        name: "joão",
        role: "mesa 1 · padrinho",
        tone: "dusk",
        photos: [
          { id: "joao-1", time: "18:50", kind: "selfie", tone: "sage", author: "joão", caption: "bastidores" },
          { id: "joao-2", time: "21:35", kind: "toast", tone: "gold", author: "joão", caption: "o discurso" },
          { id: "joao-3", time: "00:30", kind: "dance", tone: "night", author: "joão", caption: "a pista" },
          { id: "joao-4", time: "01:45", kind: "sparkler", tone: "dusk", author: "joão", caption: "a saída" }
        ]
      },
      {
        id: "bia",
        name: "bia",
        role: "mesa 2 · prima do noivo",
        tone: "sky",
        photos: [
          { id: "bia-1", time: "19:55", kind: "bouquet", tone: "sage", author: "bia", caption: "a decoração" },
          { id: "bia-2", time: "21:12", kind: "selfie", tone: "sky", author: "bia", caption: "os primos" },
          { id: "bia-3", time: "23:05", kind: "cake", tone: "gold", author: "bia", caption: "os doces" },
          { id: "bia-4", time: "01:50", kind: "sparkler", tone: "night", author: "bia", caption: "o fim" }
        ]
      }
    ],
    compareTitle: "fotos originais, do jeito que foram tiradas.",
    compareText: "Sem a compressão do WhatsApp. Arraste para comparar.",
    compareBefore: "grupo do whatsapp",
    compareAfter: "uaiToNaFoto · original",
    download: {
      fileName: "casamento-ana-e-pedro.zip",
      count: "1.284 fotos",
      size: "4,7 GB",
      button: "Baixar todas em alta",
      done: "pronto para baixar"
    }
  },
  hostSteps: {
    eyebrow: "passo a passo",
    title: "do cadastro ao álbum",
    highlight: "em poucos minutos.",
    description: "O roteiro do anfitrião (ou da assessoria) para colocar um evento no ar.",
    steps: [
      {
        title: "crie sua conta",
        text: "Cadastre-se com e-mail ou Google. Para experimentar, ative o teste grátis.",
        path: "/signup"
      },
      {
        title: "crie o evento",
        text: "Informe nome, tipo, data e horário. Ative com o teste grátis, um passe avulso ou um crédito do seu plano de agência.",
        path: "painel → novo evento"
      },
      {
        title: "configure do seu jeito",
        text: "Defina PIN de entrada, limite de fotos por convidado, se as fotos aparecem durante ou só depois da festa, as missões e a equipe organizadora.",
        path: "evento → configurações, missões e equipe"
      },
      {
        title: "espalhe o QR Code e ligue os telões",
        text: "Imprima os cartões de mesa ou compartilhe o link. Abra o telão no navegador da TV ou do projetor e conecte cada tela pelo painel.",
        path: "evento → link e telões"
      },
      {
        title: "acompanhe e modere ao vivo",
        text: "Veja as fotos chegando, aprove ou remova o que não deve ir ao telão e gerencie convidados e telões em tempo real.",
        path: "evento → fotos e convidados"
      },
      {
        title: "reviva a festa e baixe tudo em alta",
        text: "O álbum mostra o evento pela perspectiva dos convidados. Baixe todas as fotos originais num único .zip.",
        path: "evento → álbum"
      }
    ]
  },
  features: {
    eyebrow: "recursos",
    title: "tudo o que o",
    highlight: "evento precisa.",
    items: [
      {
        id: "feat-screens",
        icon: "tv",
        title: "Múltiplos telões",
        description: "TVs, LEDs e projetores ao mesmo tempo (palco, entrada, lounge), cada um com seu PIN.",
        badge: "até 4"
      },
      {
        id: "feat-missions",
        icon: "missions",
        title: "Missões fotográficas",
        description: 'Desafios temáticos por tipo de evento, como "selfie com o buquê" ou "o brinde da mesa".'
      },
      {
        id: "feat-moderation",
        icon: "moderation",
        title: "Moderação ao vivo",
        description: "Aprove ou rejeite fotos antes de irem ao telão e bloqueie convidados, tudo pelo celular."
      },
      {
        id: "feat-table",
        icon: "table",
        title: "Display de mesa",
        description: "Cartões com QR Code em alta definição, prontos para imprimir e espalhar pelas mesas."
      },
      {
        id: "feat-whitelabel",
        icon: "whitelabel",
        title: "White-label",
        description: "A marca da assessoria no telão e no app, com botão direto para o WhatsApp.",
        badge: "agências"
      },
      {
        id: "feat-feed",
        icon: "feed",
        title: "Mural com curtidas",
        description: "Feed no celular em que os convidados acompanham e curtem as fotos de todos em tempo real."
      }
    ]
  },
  plans: {
    tag: "planos",
    title: "simples e diretos.",
    subtitle:
      "Passe avulso para quem vai fazer uma festa, ou assinatura mensal com créditos para quem organiza eventos todo mês. Pagamento via PIX ou cartão."
  },
  audiences: [
    { title: "anfitriões", text: "Uma festa, um passe e todas as fotos dos convidados." },
    { title: "equipe", text: "Ajuda a moderar fotos e cuidar dos telões." },
    { title: "convidados", text: "Participam sem conta e sem app." },
    { title: "agências", text: "Cada festa vira vitrine da sua marca." }
  ],
  inlineCtas: {
    organizer: {
      title: "quer esse controle na sua festa?",
      text: "Você decide o que vai para o telão, de qualquer celular, enquanto curte o evento.",
      primary: { text: "Criar meu evento", href: "/signup" },
      secondary: { text: "Ver planos", href: "#planos" }
    },
    afterParty: {
      title: "todas as fotos da festa, originais, num link só.",
      text: "Garanta o álbum completo do seu evento pelo olhar de cada convidado.",
      primary: { text: "Garantir meu álbum", href: "/signup" },
      secondary: { text: "Ver planos", href: "#planos" }
    },
    hostSteps: {
      title: "em poucos minutos seu evento está no ar.",
      text: "Crie agora e teste o QR Code antes da festa.",
      primary: { text: "Começar agora", href: "/signup" },
      secondary: { text: "Ver planos", href: "#planos" }
    }
  },
  finalCta: {
    title: "pronto para transformar as fotos do seu evento?",
    description: "Crie o evento em minutos e veja a primeira foto subir no telão.",
    button: { text: "Criar meu evento agora", href: "/signup" },
    domain: "uaitonafoto.com.br"
  },
  footer: {
    copyrightSuffix: "todos os direitos reservados.",
    companyName: "Lite Technology LTDA",
    cnpj: "55.717.105/0001-58"
  }
};

export default landingPageData;
