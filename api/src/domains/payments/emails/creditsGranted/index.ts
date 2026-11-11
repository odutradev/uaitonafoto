import { emailBlocks } from '@email/builder/blocks'
import { enrichEmail } from '@email/utils'

import type { CreditsGrantedEmailVariables } from './types'

const formatCreditsLabel = (amount: number): string => `${amount} ${amount === 1 ? 'crédito' : 'créditos'}`

const creditsGrantedEmail = enrichEmail<CreditsGrantedEmailVariables>({
  subject: ({ creditsAdded }) => `Você recebeu ${formatCreditsLabel(creditsAdded)} - uai to na foto`,
  build: ({ userName, creditsAdded, creditTypeLabel, reason, totalCredits, appUrl }) => ({
    preheader: `Adicionamos ${formatCreditsLabel(creditsAdded)} na sua conta.`,
    eyebrow: 'Créditos adicionados',
    title: `+${formatCreditsLabel(creditsAdded)} na sua conta`,
    blocks: [
      emailBlocks.paragraph(`Olá, **${userName}**!`),
      emailBlocks.paragraph(`Nossa equipe adicionou **${formatCreditsLabel(creditsAdded)}** na sua conta. Eles já podem ser usados para criar eventos.`),
      emailBlocks.details([
        { label: 'Créditos adicionados', value: `+${creditsAdded}` },
        { label: 'Tipo', value: creditTypeLabel },
        ...(reason ? [{ label: 'Motivo', value: reason }] : []),
        { label: 'Saldo atual', value: formatCreditsLabel(totalCredits) }
      ], 'Detalhes'),
      emailBlocks.button('Criar um evento', appUrl)
    ]
  })
})

export default creditsGrantedEmail
