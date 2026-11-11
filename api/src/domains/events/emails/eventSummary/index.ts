import { emailBlocks } from '@email/builder/blocks'
import { enrichEmail } from '@email/utils'

import type { EventSummaryEmailVariables } from './types'

const formatCount = (count: number, singular: string, plural: string): string => `${count} ${count === 1 ? singular : plural}`

const eventSummaryEmail = enrichEmail<EventSummaryEmailVariables>({
  subject: ({ eventName }) => `${eventName} terminou: veja o resumo - uai to na foto`,
  build: ({ userName, eventName, photosCount, guestsCount, galleryExpiresAt, eventUrl }) => ({
    preheader: `${formatCount(photosCount, 'foto', 'fotos')} de ${formatCount(guestsCount, 'convidado', 'convidados')}. Baixe o álbum completo.`,
    eyebrow: 'Evento encerrado',
    title: 'Que festa! Aqui está o resumo',
    blocks: [
      emailBlocks.paragraph(`Olá, **${userName}**!`),
      emailBlocks.paragraph(`O evento **${eventName}** foi encerrado. Veja como foi:`),
      emailBlocks.details([
        { label: 'Fotos no álbum', value: String(photosCount) },
        { label: 'Convidados participantes', value: String(guestsCount) },
        { label: 'Álbum disponível até', value: galleryExpiresAt }
      ], 'Resumo do evento'),
      emailBlocks.paragraph('O álbum completo já pode ser baixado em um arquivo .zip pelo painel do evento.'),
      emailBlocks.button('Baixar o álbum', eventUrl),
      emailBlocks.notice('warning', [
        `Depois de **${galleryExpiresAt}** as fotos são apagadas para sempre. Baixe e guarde uma cópia antes disso.`
      ])
    ]
  })
})

export default eventSummaryEmail
