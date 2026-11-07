import { enrichTemplate } from '@email/utils'

import type { LocalEmailTemplate } from '@email/types'

export const subscriptionPaymentFailedTemplateDef: LocalEmailTemplate = {
  subject: 'Atenção: falha na cobrança de {{planName}} - uai to na foto',
  markdownBody: `
# ⚠️ Pendência na Cobrança da Assinatura - uai to na foto

Olá, **{{userName}}**!

Não conseguimos concluir a cobrança recorrente da sua assinatura **{{planName}}**.

### 📋 Detalhes da Cobrança
- **Plano:** {{planName}}
- **Valor:** {{amountFormatted}}
- **Método de pagamento:** {{paymentMethodLabel}}

Verifique os dados do seu meio de pagamento ({{paymentMethodLabel}}) para regularizar sua assinatura. Assim que o pagamento for confirmado, seus créditos mensais serão liberados automaticamente.

👉 **[Gerenciar minha assinatura]({{appUrl}})**
`
}

export const subscriptionPaymentFailedTemplate = enrichTemplate(subscriptionPaymentFailedTemplateDef)
