import { emailBlocks } from '@email/builder/blocks'
import { enrichEmail } from '@email/utils'

import type { PaymentPendingEmailVariables } from './types'

const paymentPendingEmail = enrichEmail<PaymentPendingEmailVariables>({
  subject: ({ planName }) => `Pagamento aguardando: ${planName} - uaiToNaFoto`,
  build: ({ userName, planName, amountFormatted, checkoutUrl, expiresAt, isPixAvailable }) => ({
    preheader: `Seu pagamento de ${amountFormatted} está aguardando. O link vale até ${expiresAt}.`,
    eyebrow: 'Aguardando pagamento',
    title: 'Falta só concluir o pagamento',
    blocks: [
      emailBlocks.paragraph(`Olá, **${userName}**!`),
      emailBlocks.paragraph(isPixAvailable
        ? `Geramos o pagamento de **${planName}**. Abra o link abaixo para pagar com **PIX** e liberar seus créditos na hora.`
        : `Geramos o pagamento de **${planName}**. Abra o link abaixo para concluir e liberar seus créditos.`),
      emailBlocks.details([
        { label: 'Produto', value: planName },
        { label: 'Valor', value: amountFormatted },
        { label: 'Válido até', value: expiresAt }
      ], 'Resumo do pagamento'),
      emailBlocks.button('Concluir pagamento', checkoutUrl),
      emailBlocks.notice('warning', [
        `Depois de **${expiresAt}** o link expira e será preciso gerar um novo pagamento.`,
        'Já pagou? Pode ignorar este e-mail: a confirmação chega em instantes.'
      ]),
      emailBlocks.fallbackLink('Se o botão não funcionar, copie e cole este endereço no navegador:', checkoutUrl)
    ]
  })
})

export default paymentPendingEmail
