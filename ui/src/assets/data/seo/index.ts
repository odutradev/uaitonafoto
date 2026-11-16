// Dados de SEO compartilhados pelo app (títulos por página e FAQ) e pelo plugin de build
// (meta tags, JSON-LD, conteúdo pré-renderizado, sitemap e robots). Este arquivo não pode
// importar nada com alias, porque também é carregado pelo vite.config.ts.

export interface SeoSection {
  title: string;
  text: string;
  items?: string[];
}

export interface SeoPage {
  key: SeoPageKey;
  path: string;
  file: string;
  title: string;
  description: string;
  heading: string;
  intro: string;
  sections: SeoSection[];
  isIndexable: boolean;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SeoPlan {
  name: string;
  price: number;
  billing: "evento" | "mês" | "grátis";
  description: string;
}

export type SeoPageKey = "landing" | "presentation" | "termsOfUse" | "refundPolicy" | "brandIdentity";

export const siteUrl = "https://uaitonafoto.com.br";
export const siteName = "uaiToNaFoto";
export const siteTagline = "Fotos dos convidados no telão em tempo real";
export const siteLocale = "pt_BR";
export const themeColor = "#FFCF1F";
export const ogImage = { path: "/og-image.png", width: 1200, height: 630, alt: "Telão do uaiToNaFoto com fotos dos convidados ao vivo" };

export const organization = {
  name: siteName,
  legalName: "Lite Technology LTDA",
  taxId: "55.717.105/0001-58",
  logoPath: "/icon-512.png",
  // Preencha com os perfis oficiais (Instagram, TikTok, YouTube...) para o Google ligar a marca às redes.
  socialProfiles: [] as string[]
};

export const seoPlans: SeoPlan[] = [
  {
    name: "Teste Grátis",
    price: 0,
    billing: "grátis",
    description: "Até 25 fotos no mural, 4h de mural e telão com marca d'água e galeria por 14 dias."
  },
  {
    name: "Passe do Evento",
    price: 99,
    billing: "evento",
    description:
      "Fotos e convidados ilimitados, 8h de telão ao vivo, 2 telões simultâneos, moderação, missões, display de mesa, download das fotos originais em .zip e galeria por 90 dias."
  },
  {
    name: "Agência Essencial",
    price: 247,
    billing: "mês",
    description: "4 eventos por mês, 3 telões por evento, 2 organizadores, white-label e créditos acumulativos."
  },
  {
    name: "Agência Pro",
    price: 447,
    billing: "mês",
    description: "10 eventos por mês, 4 telões por evento, 5 organizadores, marca em destaque e botão de WhatsApp no mural."
  }
];

export const faqItems: FaqItem[] = [
  {
    question: "Os convidados precisam baixar algum aplicativo?",
    answer:
      "Não. O convidado aponta a câmera do celular para o QR Code, digita o primeiro nome e já pode enviar fotos direto do navegador. Sem app, sem senha e sem cadastro."
  },
  {
    question: "Como as fotos aparecem no telão?",
    answer:
      "Abra o telão no navegador da Smart TV, do computador ligado ao projetor ou do painel de LED e conecte a tela pelo painel do evento com um PIN. Cada foto enviada aparece na hora, em mosaico."
  },
  {
    question: "Posso usar mais de um telão no mesmo evento?",
    answer:
      "Sim. O Passe do Evento permite 2 telões simultâneos, o plano Agência Essencial 3 e o Agência Pro 4 telões por evento, cada um com seu PIN, como palco, entrada e lounge."
  },
  {
    question: "As fotos perdem qualidade?",
    answer:
      "Não. As fotos são guardadas exatamente como foram tiradas, sem a compressão do WhatsApp. Ao final, o anfitrião baixa todas as originais em alta qualidade num único arquivo .zip."
  },
  {
    question: "Dá para controlar o que vai para o telão?",
    answer:
      "Sim. Com a moderação ao vivo você aprova ou rejeita cada foto antes de ir ao telão, remove fotos e bloqueia convidados pelo celular. A equipe organizadora pode moderar junto."
  },
  {
    question: "Quanto custa?",
    answer:
      "Você pode começar pelo teste grátis. O Passe do Evento custa R$ 99 por evento, e assessorias e cerimonialistas têm planos mensais a partir de R$ 247. O pagamento é por PIX ou cartão."
  },
  {
    question: "Por quanto tempo as fotos ficam disponíveis?",
    answer:
      "No Passe do Evento a galeria fica no ar por 90 dias depois da festa, e no teste grátis por 14 dias. Nesse período você pode baixar todas as fotos originais quando quiser."
  },
  {
    question: "Para quais eventos o uaiToNaFoto funciona?",
    answer:
      "Casamentos, aniversários, festas de 15 anos, formaturas, eventos corporativos e confraternizações. Há missões fotográficas prontas para cada tipo de evento."
  },
  {
    question: "Sou assessora ou cerimonialista. Como funciona para mim?",
    answer:
      "Os planos de agência têm créditos mensais de eventos, white-label com a sua marca no telão e no mural dos convidados, equipe organizadora e botão de WhatsApp para gerar novos contratos em cada festa."
  }
];

const formatPrice = (plan: SeoPlan) => {
  if (plan.billing === "grátis") return "R$ 0";
  const value = `R$ ${plan.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  return plan.billing === "mês" ? `${value}/mês` : `${value} por evento`;
};

export const seoPages: SeoPage[] = [
  {
    key: "landing",
    path: "/",
    file: "index.html",
    title: "uaiToNaFoto | Fotos dos convidados no telão em tempo real",
    description:
      "Telão de fotos ao vivo para casamentos, aniversários e formaturas. Convidados enviam fotos pelo QR Code, sem app e sem cadastro, e você baixa todas em alta qualidade.",
    heading: "Suas fotos no telão em tempo real",
    intro:
      "O convidado aponta a câmera para um QR Code, digita o primeiro nome e envia fotos direto do navegador. Elas aparecem na hora no telão da festa. No fim, você baixa todas as fotos em alta qualidade e revive o evento pelo olhar de cada convidado.",
    sections: [
      {
        title: "As melhores fotos da festa, no lugar certo",
        text: "Grupos de WhatsApp comprimem as imagens, link de drive ninguém abre e app que exige download não é usado. Com um QR Code na mesa ou no telão, o convidado envia fotos em segundos, curte as dos outros e cumpre missões."
      },
      {
        title: "Do QR Code ao telão em menos de 10 segundos",
        text: "Nada de baixar app, criar senha ou preencher cadastro. O convidado usa a câmera do celular e participa direto do navegador.",
        items: ["Aponta a câmera para o QR Code", "Digita o primeiro nome", "Envia a foto, que sobe no telão na hora"]
      },
      {
        title: "Telão ao vivo em TVs, LEDs e projetores",
        text: "Conecte vários telões ao mesmo tempo, no palco, na entrada e no lounge, cada um com seu PIN, com mosaico dinâmico e QR Code fixo para novos convidados."
      },
      {
        title: "Recursos para o seu evento",
        text: "Tudo o que o anfitrião e a assessoria precisam para a festa.",
        items: [
          "Múltiplos telões simultâneos",
          "Missões fotográficas por tipo de evento",
          "Moderação ao vivo pelo celular",
          "Display de mesa com QR Code para imprimir",
          "White-label para assessorias e cerimonialistas",
          "Mural com curtidas em tempo real"
        ]
      },
      {
        title: "Todas as fotos em alta qualidade, pelo olhar de cada convidado",
        text: "As fotos são guardadas como foram tiradas, sem compressão. O álbum mostra o evento pela perspectiva de quem estava lá, e você baixa todas as originais num único .zip."
      },
      {
        title: "Planos",
        text: "Passe avulso para quem vai fazer uma festa ou assinatura mensal com créditos para quem organiza eventos todo mês. Pagamento via PIX ou cartão.",
        items: seoPlans.map((plan) => `${plan.name}: ${formatPrice(plan)}. ${plan.description}`)
      }
    ],
    isIndexable: true,
    priority: 1,
    changeFrequency: "weekly"
  },
  {
    key: "presentation",
    path: "/apresentacao",
    file: "apresentacao.html",
    title: "Apresentação | uaiToNaFoto",
    description:
      "Conheça o uaiToNaFoto em poucos slides: como os convidados enviam fotos pelo QR Code, o telão ao vivo, a moderação e o álbum com todas as fotos em alta qualidade.",
    heading: "Apresentação do uaiToNaFoto",
    intro:
      "Uma visão rápida do produto: o problema das fotos espalhadas nos celulares, a experiência do convidado, o telão ao vivo, o controle do organizador, o álbum pós-evento e os planos.",
    sections: [],
    isIndexable: true,
    priority: 0.6,
    changeFrequency: "monthly"
  },
  {
    key: "termsOfUse",
    path: "/termos-de-uso",
    file: "termos-de-uso.html",
    title: "Termos de uso | uaiToNaFoto",
    description: "Termos de uso da plataforma uaiToNaFoto, de fotos dos convidados no telão em tempo real.",
    heading: "Termos de uso",
    intro: "Condições de uso da plataforma uaiToNaFoto para anfitriões, equipes organizadoras e convidados.",
    sections: [],
    isIndexable: true,
    priority: 0.3,
    changeFrequency: "yearly"
  },
  {
    key: "refundPolicy",
    path: "/politica-de-cancelamento",
    file: "politica-de-cancelamento.html",
    title: "Política de cancelamento e reembolso | uaiToNaFoto",
    description: "Como funcionam o cancelamento de assinaturas e o reembolso de passes e planos do uaiToNaFoto.",
    heading: "Política de cancelamento e reembolso",
    intro: "Regras de cancelamento e reembolso dos passes de evento e dos planos mensais do uaiToNaFoto.",
    sections: [],
    isIndexable: true,
    priority: 0.3,
    changeFrequency: "yearly"
  },
  {
    key: "brandIdentity",
    path: "/identidade",
    file: "identidade.html",
    title: "Identidade visual | uaiToNaFoto",
    description: "Logo, cores e tipografia da marca uaiToNaFoto.",
    heading: "Identidade visual do uaiToNaFoto",
    intro: "Logo, paleta de cores e tipografia oficiais da marca uaiToNaFoto.",
    sections: [],
    isIndexable: true,
    priority: 0.2,
    changeFrequency: "yearly"
  }
];

// Rotas alternativas do app que devem redirecionar (301) para a URL canônica.
export const seoRedirects: Record<string, string> = {
  "/termos": "/termos-de-uso",
  "/cancelamento-e-reembolso": "/politica-de-cancelamento",
  "/politica-de-reembolso": "/politica-de-cancelamento",
  "/id": "/identidade",
  "/brand": "/identidade"
};

// Áreas privadas ou de convidados que nunca devem ser rastreadas.
export const seoDisallowedPaths = ["/app", "/e/", "/signin", "/signup", "/reset-password"];

export const getSeoPage = (key: SeoPageKey): SeoPage => {
  const page = seoPages.find((item) => item.key === key);
  if (!page) throw new Error(`SEO page not found: ${key}`);
  return page;
};
