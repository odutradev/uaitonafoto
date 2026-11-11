import { emailBlocks } from '@email/builder/blocks'
import { enrichEmail } from '@email/utils'

import type { AdminAlertEmailVariables } from './types'

const adminAlertEmail = enrichEmail<AdminAlertEmailVariables>({
  subject: ({ title }) => `[Alerta] ${title} - uaiToNaFoto`,
  build: ({ adminName, title, description, occurredAt, details, logsUrl }) => ({
    preheader: `${title}: ${description}`,
    eyebrow: 'Alerta do sistema',
    title,
    footerNote: 'Você recebeu este alerta porque é administrador do uaiToNaFoto. Alertas iguais são agrupados por 1 hora.',
    blocks: [
      emailBlocks.paragraph(`Olá, **${adminName}**!`),
      emailBlocks.notice('danger', [description], 'O que aconteceu'),
      emailBlocks.details([{ label: 'Quando', value: occurredAt }, ...details], 'Detalhes técnicos'),
      emailBlocks.button('Ver logs do sistema', logsUrl)
    ]
  })
})

export default adminAlertEmail
