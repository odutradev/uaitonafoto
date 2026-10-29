import { enrichTemplate } from '@email/utils'

import type { LocalEmailTemplate } from '@email/types'

export const sweepstakeResultTemplateDef: LocalEmailTemplate = {
  subject: 'Resultado do Bolão: {{sweepstakeTitle}} - uai to na foto',
  markdownBody: `
# 🎲 Resultado do Bolão - uai to na foto

Olá, **{{userName}}**!

Os resultados do bolão **{{sweepstakeTitle}}** acabam de ser apurados!

### 🏆 Dezenas Sorteadas
**{{drawnNumbers}}**

{{lotteryInfo}}

### 🎟️ Sua Participação
- **Cotas:** {{quotaCount}} {{quotaLabel}}
- **Total Arrecadado no Bolão:** {{collectedValue}}
- **Prêmio Estimado:** {{prizeValue}}

### 📋 Jogos Realizados e Acertos
{{gamesList}}

Acompanhe os detalhes completos acessando a plataforma do **uai to na foto**.

Boa sorte a todos os participantes! 🍀
`
}

export const sweepstakeResultTemplate = enrichTemplate(sweepstakeResultTemplateDef)
