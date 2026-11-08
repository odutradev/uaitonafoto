import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

import { eventTypeSchema } from '../event/schemas'

extendZodWithOpenApi(z)

export const eventPhaseSchema = z.enum(['upcoming', 'open', 'closed', 'expired']).openapi({
  example: 'open',
  description: 'upcoming: ainda não começou · open: envio liberado · closed: envio encerrado, galeria disponível · expired: galeria encerrada'
})

export const guestEventInfoSchema = z
  .object({
    name: z.string().openapi({ example: 'Casamento Ana & Pedro' }),
    description: z.string().optional(),
    type: eventTypeSchema,
    startsAt: z.string().openapi({ example: '2026-12-20T21:00:00.000Z' }),
    endsAt: z.string().openapi({ example: '2026-12-21T05:00:00.000Z' }),
    uploadsCloseAt: z.string().openapi({ example: '2026-12-22T05:00:00.000Z' }),
    galleryExpiresAt: z.string().openapi({ example: '2027-01-20T05:00:00.000Z' }),
    maxPhotosPerGuest: z.number().openapi({ example: 10 }),
    photoVisibility: z.enum(['during_event', 'after_event']),
    phase: eventPhaseSchema
  })
  .openapi('GuestEventInfo')

export const guestSchema = z
  .object({
    id: z.string().openapi({ example: '665f1c2e9b1e8a001c8e4d40' }),
    name: z.string().openapi({ example: 'Maria' })
  })
  .openapi('GuestResponse')

export const guestTokenParamsSchema = z
  .object({
    token: z.string().min(1).openapi({ example: 'k3J9xQ2mZ1aB' })
  })
  .openapi('GuestTokenParams')

export const joinEventSchema = z
  .object({
    name: z.string().trim().min(1).max(60).openapi({ example: 'Maria' })
  })
  .openapi('JoinEvent')

export const joinEventResponseSchema = z
  .object({
    guestToken: z.string().openapi({ description: 'JWT de sessão do convidado (Authorization: Bearer)' }),
    guest: guestSchema,
    event: guestEventInfoSchema
  })
  .openapi('JoinEventResponse')

export const guestSessionResponseSchema = z
  .object({
    guest: guestSchema,
    event: guestEventInfoSchema,
    photosSent: z.number().openapi({ example: 3 }),
    photosRemaining: z.number().openapi({ example: 7 })
  })
  .openapi('GuestSessionResponse')
