import { emailBlocks } from '@email/builder/blocks'
import { enrichEmail } from '@email/utils'

import type { PasswordResetEmailVariables } from './types'

const passwordResetEmail = enrichEmail<PasswordResetEmailVariables>({
  subject: () => 'Redefinição de senha - uaiToNaFoto',
  build: ({ userName, resetLink }) => ({
    preheader: 'Use o link para criar uma nova senha. Ele vale por 1 hora.',
    eyebrow: 'Segurança da conta',
    title: 'Vamos criar uma nova senha',
    blocks: [
      emailBlocks.paragraph(`Olá, **${userName}**!`),
      emailBlocks.paragraph('Recebemos um pedido para redefinir a senha da sua conta no **uaiToNaFoto**. Clique no botão abaixo para escolher uma nova senha.'),
      emailBlocks.button('Redefinir minha senha', resetLink),
      emailBlocks.notice('warning', [
        'O link vale por **1 hora** e só pode ser usado uma vez.',
        'Não pediu a troca? Pode ignorar este e-mail, sua senha atual continua a mesma.'
      ], 'Antes de continuar'),
      emailBlocks.fallbackLink('Se o botão não funcionar, copie e cole este endereço no navegador:', resetLink)
    ]
  })
})

export default passwordResetEmail
