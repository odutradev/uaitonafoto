import { emailBlocks } from '@email/builder/blocks'
import { enrichEmail } from '@email/utils'

import type { PasswordChangedEmailVariables } from './types'

const passwordChangedEmail = enrichEmail<PasswordChangedEmailVariables>({
  subject: () => 'Sua senha foi alterada - uaiToNaFoto',
  build: ({ userName, changedAt, recoveryUrl }) => ({
    preheader: `A senha da sua conta foi alterada em ${changedAt}.`,
    eyebrow: 'Segurança da conta',
    title: 'Sua senha foi alterada',
    blocks: [
      emailBlocks.paragraph(`Olá, **${userName}**!`),
      emailBlocks.paragraph(`A senha da sua conta no **uaiToNaFoto** foi alterada em **${changedAt}**. A partir de agora, use a nova senha para entrar.`),
      emailBlocks.notice('danger', [
        'Se você não fez essa alteração, alguém pode ter acessado sua conta.',
        'Peça um novo link de redefinição agora mesmo para recuperar o acesso e escolher uma senha que só você conhece.'
      ], 'Não foi você?'),
      emailBlocks.button('Recuperar minha conta', recoveryUrl),
      emailBlocks.paragraph('Se foi você, está tudo certo e não precisa fazer mais nada.')
    ]
  })
})

export default passwordChangedEmail
