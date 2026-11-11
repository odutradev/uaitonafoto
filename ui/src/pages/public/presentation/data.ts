import type { SceneKind, SceneTone } from "@components/scenePhoto/types";

export interface SlidePoint {
  title: string;
  text: string;
}

export interface SlidePhoto {
  id: string;
  kind: SceneKind;
  tone: SceneTone;
  author: string;
  caption: string;
}

export interface SlideHeading {
  eyebrow: string;
  title: string;
  highlight: string;
}

export interface PresentationData {
  cover: SlideHeading & { lead: string; chips: string[]; photo: SlidePhoto; qrLabel: string };
  problem: SlideHeading & { points: SlidePoint[]; conclusion: string };
  solution: SlideHeading & { steps: SlidePoint[]; stats: SlidePoint[]; photo: SlidePhoto };
  live: SlideHeading & { points: SlidePoint[]; screens: { label: string; pin: string; photo: SlidePhoto }[] };
  organizer: SlideHeading & { points: SlidePoint[]; queue: SlidePhoto & { table: string; mission: string } };
  afterParty: SlideHeading & { points: SlidePoint[]; photos: (SlidePhoto & { time: string })[] };
  setup: SlideHeading & { steps: SlidePoint[] };
  audiences: SlideHeading & { points: SlidePoint[] };
  plans: SlideHeading & { lead: string; fallback: string };
  closing: SlideHeading & { lead: string; domain: string; cta: { text: string; href: string } };
}

export const presentationData: PresentationData = {
  cover: {
    eyebrow: "apresentação do produto",
    title: "suas fotos no telão em",
    highlight: "tempo real.",
    lead: "O convidado aponta a câmera, digita o nome e a foto aparece na hora no telão. No fim, o anfitrião baixa tudo em alta qualidade.",
    chips: ["sem app", "sem cadastro", "fotos originais"],
    photo: { id: "cover", kind: "toast", tone: "amber", author: "marina", caption: "o brinde da mesa" },
    qrLabel: "escaneie e entre no telão"
  },
  problem: {
    eyebrow: "o problema",
    title: "as fotos da festa ficam",
    highlight: "presas no celular.",
    points: [
      { title: "WhatsApp comprime", text: "As fotos chegam borradas e se perdem no grupo." },
      { title: "Drive ninguém abre", text: "O link fica esquecido depois da festa." },
      { title: "App ninguém baixa", text: "Exigir download e cadastro mata a participação." }
    ],
    conclusion: "O anfitrião fica sem as fotos e a festa perde um momento de interação."
  },
  solution: {
    eyebrow: "a solução",
    title: "do QR Code ao telão em",
    highlight: "10 segundos.",
    steps: [
      { title: "aponta a câmera", text: "no QR Code da mesa ou do telão" },
      { title: "digita o nome", text: "sem app, sem senha, sem cadastro" },
      { title: "envia e curte", text: "a foto sobe no telão na hora" }
    ],
    stats: [
      { title: "0", text: "apps para baixar" },
      { title: "0", text: "cadastros" },
      { title: "100%", text: "no navegador" }
    ],
    photo: { id: "solution", kind: "selfie", tone: "sky", author: "marina", caption: "mesa 4" }
  },
  live: {
    eyebrow: "ao vivo, no evento",
    title: "a festa inteira",
    highlight: "no telão.",
    points: [
      { title: "Até 4 telões", text: "TVs, LEDs e projetores, cada um com seu PIN." },
      { title: "Missões fotográficas", text: '"Selfie com o buquê", "o brinde da mesa"…' },
      { title: "Mural com curtidas", text: "O convidado acompanha e curte tudo no celular." },
      { title: "Display de mesa", text: "Cartões com QR Code prontos para imprimir." }
    ],
    screens: [
      {
        label: "palco",
        pin: "4821",
        photo: { id: "stage", kind: "dance", tone: "dusk", author: "joão", caption: "a pista lotada" }
      },
      {
        label: "entrada",
        pin: "1937",
        photo: { id: "entry", kind: "bouquet", tone: "rose", author: "tia célia", caption: "selfie com o buquê" }
      },
      {
        label: "lounge",
        pin: "7754",
        photo: { id: "lounge", kind: "cake", tone: "gold", author: "rafa", caption: "o corte do bolo" }
      }
    ]
  },
  organizer: {
    eyebrow: "o organizador",
    title: "a festa pelo olhar dos convidados,",
    highlight: "na sua mão.",
    points: [
      { title: "Cada foto com contexto", text: "Quem tirou, de qual mesa e em qual missão." },
      { title: "Moderação ao vivo", text: "Aprove ou rejeite antes de ir ao telão." },
      { title: "Bloqueio de convidados", text: "Remova quem passar do ponto, na hora." },
      { title: "Equipe e telões", text: "Chame a assessoria e controle as telas pelo painel." }
    ],
    queue: {
      id: "queue",
      kind: "toast",
      tone: "amber",
      author: "marina",
      caption: "o brinde da mesa",
      table: "mesa 4",
      mission: "o brinde da mesa"
    }
  },
  afterParty: {
    eyebrow: "pós-evento",
    title: "a festa pelo olhar de",
    highlight: "cada convidado.",
    points: [
      { title: "Álbum por convidado", text: "Cada foto com quem tirou e em que momento." },
      { title: "Originais num .zip", text: "Tudo em alta qualidade, sem compressão." },
      { title: "Galeria online", text: "Para rever e compartilhar depois da festa." }
    ],
    photos: [
      { id: "after-1", time: "19:42", kind: "selfie", tone: "sky", author: "marina", caption: "chegando" },
      { id: "after-2", time: "20:15", kind: "rings", tone: "cream", author: "marina", caption: "o sim" },
      { id: "after-3", time: "21:30", kind: "toast", tone: "amber", author: "marina", caption: "o brinde" },
      { id: "after-4", time: "23:58", kind: "dance", tone: "dusk", author: "marina", caption: "a pista" }
    ]
  },
  setup: {
    eyebrow: "como colocar no ar",
    title: "do cadastro ao álbum em",
    highlight: "poucos minutos.",
    steps: [
      { title: "crie sua conta", text: "e-mail ou Google, com teste grátis" },
      { title: "crie o evento", text: "nome, tipo, data e horário" },
      { title: "configure", text: "PIN, limites, missões e equipe" },
      { title: "espalhe o QR Code", text: "cartões de mesa e telões conectados" },
      { title: "modere ao vivo", text: "fotos, convidados e telões" },
      { title: "baixe tudo em alta", text: "álbum completo num .zip" }
    ]
  },
  audiences: {
    eyebrow: "para quem é",
    title: "uma plataforma,",
    highlight: "quatro públicos.",
    points: [
      { title: "Anfitriões", text: "Uma festa, um passe e todas as fotos dos convidados." },
      { title: "Agências", text: "White-label: sua marca no telão e no app, com botão para o seu WhatsApp." },
      { title: "Equipe", text: "Ajuda a moderar fotos e cuidar dos telões." },
      { title: "Convidados", text: "Participam sem conta e sem app." }
    ]
  },
  plans: {
    eyebrow: "planos",
    title: "simples e",
    highlight: "diretos.",
    lead: "Passe avulso para uma festa ou assinatura mensal com créditos para quem organiza eventos todo mês. PIX ou cartão.",
    fallback: "Veja os planos atualizados em uaitonafoto.com.br/#planos"
  },
  closing: {
    eyebrow: "vamos começar?",
    title: "pronto para transformar as fotos do seu",
    highlight: "evento?",
    lead: "Crie o evento em minutos e veja a primeira foto subir no telão.",
    domain: "uaitonafoto.com.br",
    cta: { text: "Criar meu evento", href: "/signup" }
  }
};

export default presentationData;
