import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

import { createPaginatedSchema, paginationQuerySchema } from '@factories/pagination/schemas'

extendZodWithOpenApi(z)

export const eventTypeSchema = z.enum(['birthday', 'wedding', 'corporate', 'other']).openapi({ example: 'wedding' })

export const eventMemberRoleSchema = z.enum(['creator', 'organizer']).openapi({ example: 'creator' })

export const eventSettingsSchema = z
  .object({
    uploadWindowHours: z.number().int().min(0).max(168).openapi({
      example: 24,
      description: 'Horas após o término do evento em que convidados ainda podem enviar fotos'
    }),
    galleryDurationDays: z.number().int().min(1).max(365).openapi({
      example: 30,
      description: 'Dias de disponibilidade da galeria após o término do evento'
    }),
    maxPhotosPerGuest: z.number().int().min(1).max(100).openapi({
      example: 10,
      description: 'Quantidade máxima de fotos por convidado'
    }),
    photoVisibility: z.enum(['during_event', 'after_event']).openapi({
      example: 'during_event',
      description: 'Fotos visíveis durante o evento (telão/feed) ou apenas após o término'
    })
  })
  .openapi('EventSettings')

export const eventMemberSchema = z
  .object({
    userId: z.string().openapi({ example: '665f1c2e9b1e8a001c8e4d12' }),
    role: eventMemberRoleSchema,
    addedAt: z.string().openapi({ example: '2026-11-08T17:00:00.000Z' })
  })
  .openapi('EventMember')

export const eventSchema = z
  .object({
    id: z.string().openapi({ example: '665f1c2e9b1e8a001c8e4d30' }),
    name: z.string().openapi({ example: 'Casamento Ana & Pedro' }),
    description: z.string().optional().openapi({ example: 'Celebração no Sítio Boa Vista' }),
    type: eventTypeSchema,
    startsAt: z.string().openapi({ example: '2026-12-20T21:00:00.000Z' }),
    endsAt: z.string().openapi({ example: '2026-12-21T05:00:00.000Z' }),
    guestToken: z.string().openapi({ example: 'k3J9xQ2mZ1aB' }),
    settings: eventSettingsSchema,
    uploadsCloseAt: z.string().openapi({ example: '2026-12-22T05:00:00.000Z' }),
    galleryExpiresAt: z.string().openapi({ example: '2027-01-20T05:00:00.000Z' }),
    members: z.array(eventMemberSchema),
    myRole: eventMemberRoleSchema,
    createdAt: z.string().openapi({ example: '2026-11-08T17:00:00.000Z' }),
    updatedAt: z.string().openapi({ example: '2026-11-08T17:00:00.000Z' })
  })
  .openapi('EventResponse')

export const createEventSchema = z
  .object({
    name: z.string().trim().min(1).max(120).openapi({ example: 'Casamento Ana & Pedro' }),
    description: z.string().trim().max(500).optional(),
    type: eventTypeSchema,
    startsAt: z.string().datetime().openapi({ example: '2026-12-20T21:00:00.000Z' }),
    endsAt: z.string().datetime().openapi({ example: '2026-12-21T05:00:00.000Z' }),
    settings: eventSettingsSchema.partial().optional()
  })
  .openapi('CreateEvent')

export const updateEventSchema = createEventSchema.partial().openapi('UpdateEvent')

export const eventParamsSchema = z
  .object({
    id: z.string().min(1).openapi({ example: '665f1c2e9b1e8a001c8e4d30' })
  })
  .openapi('EventParams')

export const listEventsQuerySchema = paginationQuerySchema.openapi('ListEventsQuery')

export const listEventsResponseSchema = createPaginatedSchema(eventSchema, 'ListEventsResponse')
