import { emailBlocks } from '@email/builder/blocks'
import { enrichEmail } from '@email/utils'

import type { GalleryExpiringEmailVariables } from './types'

const formatDaysLeft = (days: number): string => {
  if (days <= 1) return 'amanhã'
  return `em ${days} dias`
}

const galleryExpiringEmail = enrichEmail<GalleryExpiringEmailVariables>({
  subject: ({ eventName, daysLeft }) => `As fotos de ${eventName} expiram ${formatDaysLeft(daysLeft)} - uaiToNaFoto`,
  build: ({ userName, eventName, daysLeft, galleryExpiresAt, eventUrl }) => ({
    preheader: `Baixe o álbum antes de ${galleryExpiresAt}. Depois disso as fotos são apagadas.`,
    eyebrow: 'Álbum expirando',
    title: `Seu álbum expira ${formatDaysLeft(daysLeft)}`,
    blocks: [
      emailBlocks.paragraph(`Olá, **${userName}**!`),
      emailBlocks.paragraph(`O álbum do evento **${eventName}** fica disponível até **${galleryExpiresAt}**. Depois disso, todas as fotos são apagadas e não podem ser recuperadas.`),
      emailBlocks.notice('danger', [
        'Baixe o arquivo .zip com todas as fotos e guarde uma cópia no seu computador ou na nuvem.'
      ], 'Não deixe para depois'),
      emailBlocks.button('Baixar o álbum agora', eventUrl)
    ]
  })
})

export default galleryExpiringEmail
