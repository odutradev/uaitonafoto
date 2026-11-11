import { emailBlocks } from '@email/builder/blocks'
import { enrichEmail } from '@email/utils'

import type { EventCreatedEmailVariables } from './types'

const eventCreatedEmail = enrichEmail<EventCreatedEmailVariables>({
  subject: ({ eventName }) => `Evento criado: ${eventName} - uai to na foto`,
  build: ({ userName, eventName, startsAt, endsAt, galleryExpiresAt, pinDescription, guestUrl, eventUrl }) => ({
    preheader: `${eventName} está pronto. Compartilhe o link com seus convidados.`,
    eyebrow: 'Evento criado',
    title: `${eventName} está pronto!`,
    blocks: [
      emailBlocks.paragraph(`Olá, **${userName}**!`),
      emailBlocks.paragraph('Seu evento foi criado. Agora é só compartilhar o link com os convidados para eles começarem a enviar fotos.'),
      emailBlocks.details([
        { label: 'Evento', value: eventName },
        { label: 'Início', value: startsAt },
        { label: 'Término', value: endsAt },
        { label: 'Álbum disponível até', value: galleryExpiresAt },
        { label: 'PIN dos convidados', value: pinDescription }
      ], 'Resumo do evento'),
      emailBlocks.notice('warning', [
        `Link dos convidados: **${guestUrl}**`,
        'Envie pelo WhatsApp, coloque no convite ou mostre o QR Code no dia. Ninguém precisa baixar aplicativo.'
      ], 'Compartilhe com os convidados'),
      emailBlocks.button('Abrir o painel do evento', eventUrl),
      emailBlocks.paragraph('No painel você também gera o QR Code, configura o telão e convida outras pessoas para organizar com você.')
    ]
  })
})

export default eventCreatedEmail
