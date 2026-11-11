import { emailBlocks } from '@email/builder/blocks'
import { enrichEmail } from '@email/utils'

import type { SubscriptionActivatedEmailVariables } from './types'

const subscriptionActivatedEmail = enrichEmail<SubscriptionActivatedEmailVariables>({
  subject: ({ planName }) => `Assinatura ativada: ${planName} - uaiToNaFoto`,
  build: ({ userName, planName, amountFormatted, creditsAdded, paymentMethodLabel, nextBillingDate, appUrl }) => ({
    preheader: `Sua assinatura ${planName} está ativa e +${creditsAdded} créditos já estão na conta.`,
    eyebrow: 'Assinatura ativada',
    title: `Bem-vindo ao plano ${planName}`,
    blocks: [
      emailBlocks.paragraph(`Olá, **${userName}**!`),
      emailBlocks.paragraph(`O primeiro pagamento da assinatura **${planName}** foi confirmado. Seus créditos do mês já estão disponíveis e, a cada renovação, novos créditos são somados à sua conta.`),
      emailBlocks.details([
        { label: 'Plano', value: planName },
        { label: 'Valor mensal', value: amountFormatted },
        { label: 'Créditos por ciclo', value: `+${creditsAdded}` },
        { label: 'Método de pagamento', value: paymentMethodLabel },
        ...(nextBillingDate ? [{ label: 'Próxima cobrança', value: nextBillingDate }] : [])
      ], 'Resumo da assinatura'),
      emailBlocks.button('Criar um evento', appUrl),
      emailBlocks.paragraph('Você pode cancelar a recorrência quando quiser pela área de **Créditos e planos**.')
    ]
  })
})

export default subscriptionActivatedEmail
