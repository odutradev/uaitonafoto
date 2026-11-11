import { emailBlocks } from '@email/builder/blocks'
import { enrichEmail } from '@email/utils'

import type { TeamRemovedEmailVariables } from './types'

const teamRemovedEmail = enrichEmail<TeamRemovedEmailVariables>({
  subject: ({ eventName }) => `Você saiu da equipe de "${eventName}" - uai to na foto`,
  build: ({ memberName, eventName, appUrl }) => ({
    preheader: `Seu acesso de organizador ao evento ${eventName} foi removido.`,
    eyebrow: 'Equipe do evento',
    title: 'Seu acesso ao evento foi removido',
    blocks: [
      emailBlocks.paragraph(`Olá, **${memberName}**!`),
      emailBlocks.paragraph(`O criador do evento **${eventName}** removeu você da equipe organizadora. Você não tem mais acesso ao painel, às fotos e ao telão deste evento.`),
      emailBlocks.paragraph('Acha que foi engano? Fale com quem criou o evento para ser adicionado de novo.'),
      emailBlocks.button('Ir para meus eventos', appUrl)
    ]
  })
})

export default teamRemovedEmail
