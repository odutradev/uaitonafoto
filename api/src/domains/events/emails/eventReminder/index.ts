import { emailBlocks } from '@email/builder/blocks'
import { enrichEmail } from '@email/utils'

import type { EventReminderEmailVariables } from './types'

const eventReminderEmail = enrichEmail<EventReminderEmailVariables>({
  subject: ({ eventName }) => `Falta pouco para ${eventName}! Checklist do telão - uaiToNaFoto`,
  build: ({ userName, eventName, startsAt, screenUrl, guestUrl, eventUrl }) => ({
    preheader: `${eventName} começa em ${startsAt}. Veja o checklist para o telão funcionar sem susto.`,
    eyebrow: 'Lembrete do evento',
    title: 'Falta pouco para o seu evento',
    blocks: [
      emailBlocks.paragraph(`Olá, **${userName}**!`),
      emailBlocks.paragraph(`**${eventName}** começa em **${startsAt}**. Separe 10 minutos antes do início para deixar tudo pronto.`),
      emailBlocks.heading('Checklist do telão'),
      emailBlocks.steps([
        { title: 'Crie o telão no painel', description: 'Na aba **Telão** do evento, crie um telão e anote o PIN de 4 dígitos.' },
        { title: 'Conecte o computador à TV ou projetor', description: `No navegador, abra **${screenUrl}** e digite o PIN do telão.` },
        { title: 'Teste a internet e a energia', description: 'Prefira cabo ou um Wi-Fi estável e deixe o computador ligado na tomada.' },
        { title: 'Deixe o QR Code à vista', description: 'Coloque o QR Code nas mesas, na entrada ou no próprio telão para os convidados entrarem.' },
        { title: 'Envie uma foto de teste', description: 'Abra o link dos convidados no celular e confirme que a foto aparece no telão.' }
      ]),
      emailBlocks.button('Abrir o painel do evento', eventUrl),
      emailBlocks.fallbackLink('Link dos convidados:', guestUrl)
    ]
  })
})

export default eventReminderEmail
