import { emailBlocks } from '@email/builder/blocks'
import { enrichEmail } from '@email/utils'

import type { TeamInviteEmailVariables } from './types'

const teamInviteEmail = enrichEmail<TeamInviteEmailVariables>({
  subject: ({ eventName }) => `Você entrou na equipe de "${eventName}" - uai to na foto`,
  build: ({ memberName, inviterName, eventName, eventStartsAt, eventUrl }) => ({
    preheader: `${inviterName} adicionou você como organizador de ${eventName}.`,
    eyebrow: 'Equipe do evento',
    title: 'Você agora faz parte da equipe',
    blocks: [
      emailBlocks.paragraph(`Olá, **${memberName}**!`),
      emailBlocks.paragraph(`**${inviterName}** adicionou você como organizador do evento **${eventName}**.`),
      emailBlocks.details([
        { label: 'Evento', value: eventName },
        { label: 'Início', value: eventStartsAt },
        { label: 'Seu papel', value: 'Organizador' }
      ]),
      emailBlocks.paragraph('Como organizador, você acompanha as fotos ao vivo, modera o que aparece no telão e gerencia os convidados.'),
      emailBlocks.button('Abrir o evento', eventUrl)
    ]
  })
})

export default teamInviteEmail
