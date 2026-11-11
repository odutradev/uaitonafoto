import { emailBlocks } from '@email/builder/blocks'
import { enrichEmail } from '@email/utils'

import type { SubscriptionRenewalReminderEmailVariables } from './types'

const formatDaysLabel = (days: number): string => {
  if (days <= 0) return 'hoje'
  if (days === 1) return 'amanhã'
  return `em ${days} dias`
}

const subscriptionRenewalReminderEmail = enrichEmail<SubscriptionRenewalReminderEmailVariables>({
  subject: ({ planName, daysUntilBilling }) => `Sua assinatura ${planName} renova ${formatDaysLabel(daysUntilBilling)} - uai to na foto`,
  build: ({ userName, planName, amountFormatted, billingDate, daysUntilBilling, paymentMethodLabel, billingUrl }) => ({
    preheader: `A próxima cobrança de ${amountFormatted} acontece em ${billingDate}.`,
    eyebrow: 'Lembrete de renovação',
    title: `Sua assinatura renova ${formatDaysLabel(daysUntilBilling)}`,
    blocks: [
      emailBlocks.paragraph(`Olá, **${userName}**!`),
      emailBlocks.paragraph(`Passando para avisar que a assinatura **${planName}** será renovada em **${billingDate}**. Assim que o pagamento for confirmado, os novos créditos entram na sua conta.`),
      emailBlocks.details([
        { label: 'Plano', value: planName },
        { label: 'Valor', value: amountFormatted },
        { label: 'Data da cobrança', value: billingDate },
        { label: 'Método de pagamento', value: paymentMethodLabel }
      ], 'Próxima cobrança'),
      emailBlocks.paragraph('Confira se o seu meio de pagamento está em dia para não perder a renovação.'),
      emailBlocks.button('Gerenciar assinatura', billingUrl)
    ]
  })
})

export default subscriptionRenewalReminderEmail
