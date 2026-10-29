import { enrichTemplate } from '@email/utils'

import type { LocalEmailTemplate } from '@email/types'

export const passwordResetTemplateDef: LocalEmailTemplate = {
  subject: 'Redefinição de Senha - Alvará da Sorte',
  markdownBody: `
# 🔐 Redefinição de Senha - Alvará da Sorte

Olá, **{{userName}}**!

Recebemos uma solicitação para redefinir a senha da sua conta no **Alvará da Sorte**.

Para criar uma nova senha, acesse o link abaixo:

👉 **[Clique aqui para redefinir sua senha]({{resetLink}})**

Se o botão acima não funcionar, copie e cole o endereço abaixo no seu navegador:
{{resetLink}}

---

⚠️ **Importante:**
- Este link é válido por **1 hora** e pode ser utilizado apenas uma vez.
- Caso você não tenha solicitado a alteração de senha, ignore este e-mail com segurança. Sua senha atual permanecerá inalterada.
`
}

export const passwordResetTemplate = enrichTemplate(passwordResetTemplateDef)

