import { emailBlocks } from '@email/builder/blocks'
import { enrichEmail } from '@email/utils'

import type { GalleryExpiredEmailVariables } from './types'

const galleryExpiredEmail = enrichEmail<GalleryExpiredEmailVariables>({
  subject: ({ eventName }) => `O álbum de ${eventName} expirou - uaiToNaFoto`,
  build: ({ userName, eventName, appUrl }) => ({
    preheader: `O prazo do álbum de ${eventName} terminou e as fotos foram apagadas.`,
    eyebrow: 'Álbum expirado',
    title: 'O álbum do seu evento expirou',
    blocks: [
      emailBlocks.paragraph(`Olá, **${userName}**!`),
      emailBlocks.paragraph(`O prazo de armazenamento do álbum de **${eventName}** terminou e, como combinado, as fotos foram apagadas dos nossos servidores.`),
      emailBlocks.paragraph('Obrigado por usar o **uaiToNaFoto**. Quando tiver a próxima comemoração, é só criar um novo evento.'),
      emailBlocks.button('Criar novo evento', appUrl)
    ]
  })
})

export default galleryExpiredEmail
