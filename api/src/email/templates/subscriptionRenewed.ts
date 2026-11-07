import { enrichTemplate } from '@email/utils'

import type { LocalEmailTemplate } from '@email/types'

export const subscriptionRenewedTemplateDef: LocalEmailTemplate = {
  subject: 'Renovação confirmada: {{planName}} - uai to na foto',
  markdownBody: `
# ✅ Assinatura Renovada - uai to na foto

Olá, **{{userName}}**!

O pagamento mensal da sua assinatura **{{planName}}** foi confirmado e seus novos créditos já estão disponíveis na sua conta.

### 📋 Resumo da Renovação
- **Plano:** {{planName}}
- **Valor pago:** {{amountFormatted}}
- **Créditos adicionados:** +{{creditsAdded}}
- **Próxima renovação estimada:** {{nextBillingDate}}

Acesse o painel para gerenciar seus eventos e acompanhar seus créditos:

👉 **[Acessar minha conta]({{appUrl}})**
`
}

export const subscriptionRenewedTemplate = enrichTemplate(subscriptionRenewedTemplateDef)
