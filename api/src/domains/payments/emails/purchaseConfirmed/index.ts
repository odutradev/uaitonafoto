import { emailBlocks } from '@email/builder/blocks'
import { enrichEmail } from '@email/utils'

import type { PurchaseConfirmedEmailVariables } from './types'

const purchaseConfirmedEmail = enrichEmail<PurchaseConfirmedEmailVariables>({
  subject: ({ planName }) => `Compra confirmada: ${planName} - uaiToNaFoto`,
  build: ({ userName, planName, amountFormatted, creditsAdded, paymentMethodLabel, paidAt, receiptUrl, appUrl }) => ({
    preheader: `Pagamento aprovado. +${creditsAdded} ${creditsAdded === 1 ? 'crédito já está' : 'créditos já estão'} na sua conta.`,
    eyebrow: 'Compra confirmada',
    title: 'Pagamento aprovado!',
    blocks: [
      emailBlocks.paragraph(`Olá, **${userName}**!`),
      emailBlocks.paragraph(`Recebemos o pagamento de **${planName}** e os créditos já estão disponíveis para criar seus eventos.`),
      emailBlocks.details([
        { label: 'Produto', value: planName },
        { label: 'Valor pago', value: amountFormatted },
        { label: 'Créditos adicionados', value: `+${creditsAdded}` },
        { label: 'Método de pagamento', value: paymentMethodLabel },
        { label: 'Data do pagamento', value: paidAt }
      ], 'Recibo da compra'),
      emailBlocks.button('Criar um evento', appUrl),
      ...(receiptUrl ? [emailBlocks.fallbackLink('Comprovante emitido pelo meio de pagamento:', receiptUrl)] : [])
    ]
  })
})

export default purchaseConfirmedEmail
