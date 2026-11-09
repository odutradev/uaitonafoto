import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

import { eventChallengeSchema, eventCustomizationSchema, eventPinSchema, eventTypeSchema } from '../event/schemas'

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
    photoVisibility: z.enum(['during_event', 'after_event']),
    requiresPin: z.boolean().openapi({
      example: true,
      description: 'Indica se é necessário informar o PIN numérico de 4 dígitos para entrar no evento'
    }),
    customization: eventCustomizationSchema.optional(),
    challengesEnabled: z.boolean().default(false).optional(),
    challengesMode: z.enum(['choose', 'random']).default('choose').optional(),
    challenges: z.array(eventChallengeSchema).default([]),
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
    name: z.string().trim().min(1).max(60).openapi({ example: 'Maria' }),
    pin: eventPinSchema.optional()
  })
  .openapi('JoinEvent')

export const joinEventResponseSchema = z
  .object({
    guestToken: z.string().openapi({ description: 'JWT de sessão do convidado (Authorization: Bearer)' }),
    guest: guestSchema,
    event: guestEventInfoSchema,
    completedChallengeIds: z.array(z.string()).default([])
  })
  .openapi('JoinEventResponse')

export const guestSessionResponseSchema = z
  .object({
    guest: guestSchema,
    event: guestEventInfoSchema,
    photosSent: z.number().openapi({ example: 3 }),
    completedChallengeIds: z.array(z.string()).default([])
  })
  .openapi('GuestSessionResponse')
