import { emailBlocks } from '@email/builder/blocks'
import { enrichEmail } from '@email/utils'

import type { WelcomeEmailVariables } from './types'

const welcomeEmail = enrichEmail<WelcomeEmailVariables>({
  subject: () => 'Boas-vindas ao uai to na foto',
  build: ({ userName, appUrl, billingUrl }) => ({
    preheader: 'Sua conta está pronta. Veja como criar seu primeiro evento em poucos minutos.',
    eyebrow: 'Boas-vindas',
    title: 'Que bom ter você por aqui!',
    blocks: [
      emailBlocks.paragraph(`Olá, **${userName}**!`),
      emailBlocks.paragraph('Sua conta no **uai to na foto** está pronta. Com ela, seus convidados enviam fotos pelo celular e tudo aparece no telão e no álbum do evento, sem instalar nada.'),
      emailBlocks.heading('Seu primeiro evento em 4 passos'),
      emailBlocks.steps([
        { title: 'Garanta seu crédito', description: 'Resgate o teste grátis ou escolha um plano na área de **Créditos e planos**.' },
        { title: 'Crie o evento', description: 'Defina nome, data e horário. Leva menos de um minuto.' },
        { title: 'Compartilhe com os convidados', description: 'Envie o link ou mostre o QR Code. Ninguém precisa baixar aplicativo.' },
        { title: 'Ligue o telão', description: 'Abra o telão em uma TV ou projetor e veja as fotos chegando ao vivo.' }
      ]),
      emailBlocks.button('Criar meu primeiro evento', appUrl),
      emailBlocks.fallbackLink('Ainda sem créditos? Comece pelo teste grátis:', billingUrl)
    ]
  })
})

export default welcomeEmail
