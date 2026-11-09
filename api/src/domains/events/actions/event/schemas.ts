import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

import { createPaginatedSchema, paginationQuerySchema } from '@factories/pagination/schemas'

extendZodWithOpenApi(z)

export const eventTypeSchema = z.enum(['birthday', 'wedding', 'corporate', 'other']).openapi({ example: 'wedding' })

export const eventCreditTypeSchema = z.enum(['free', 'paid']).openapi({ example: 'paid' })

export const eventPlanTierSchema = z.enum(['single', 'essential', 'pro']).openapi({ example: 'single' })

export const eventMemberRoleSchema = z.enum(['creator', 'organizer']).openapi({ example: 'creator' })

export const pinRotationMinutesSchema = z
  .union([z.literal(5), z.literal(15), z.literal(30), z.literal(60)])
  .openapi({ example: 15, description: 'Intervalo em minutos para rotação automática do PIN (5, 15, 30 ou 60)' })

export const eventPinSchema = z
  .string()
  .trim()
  .regex(/^\d{4}$/, 'O PIN deve conter exatamente 4 dígitos numéricos')
  .openapi({ example: '4829', description: 'PIN numérico de 4 dígitos para acesso dos convidados' })

export const eventCustomizationSchema = z
  .object({
    enabled: z.boolean().default(false),
    agencyName: z.string().optional(),
    agencyLogoUrl: z.string().optional(),
    agencyWhatsapp: z.string().optional(),
    agencyTagline: z.string().optional(),
    whatsappMessage: z.string().optional()
  })
  .openapi('EventCustomization')

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
    photoVisibility: z.enum(['during_event', 'after_event']).openapi({
      example: 'during_event',
      description: 'Fotos visíveis durante o evento (telão/feed) ou apenas após o término'
    }),
    pinEnabled: z.boolean().openapi({
      example: true,
      description: 'Indica se os convidados precisam informar o PIN para entrar no evento'
    }),
    pin: eventPinSchema,
    pinRotate: z.boolean().openapi({
      example: true,
      description: 'Indica se o PIN deve alternar automaticamente a cada intervalo configurado'
    }),
    pinRotationMinutes: pinRotationMinutesSchema,
    pinUpdatedAt: z.string().openapi({
      example: '2026-11-08T17:00:00.000Z',
      description: 'Instante da última geração/alteração do PIN'
    }),
    moderationEnabled: z.boolean().default(false).optional().openapi({
      example: false,
      description: 'Indica se fotos passam por moderação prévia da equipe antes de aparecerem no telão'
    }),
    challengesEnabled: z.boolean().default(false).optional().openapi({
      example: false,
      description: 'Indica se as missões fotográficas interativas estão ativadas'
    }),
    challengesMode: z.enum(['choose', 'random']).default('choose').optional().openapi({
      example: 'choose',
      description: 'Modo de seleção dos desafios: choose (escolha do convidado) ou random (sorteado aleatoriamente)'
    })
  })
  .openapi('EventSettings')

export const eventChallengeSchema = z
  .object({
    id: z.string().openapi({ example: '665f1c2e9b1e8a001c8e4d88' }),
    title: z.string().openapi({ example: 'Foto com o padrinho mais animado 🕺' }),
    description: z.string().optional(),
    active: z.boolean().default(true).openapi({ example: true }),
    createdAt: z.string().openapi({ example: '2026-11-09T01:00:00.000Z' })
  })
  .openapi('EventChallenge')

export const eventSettingsInputSchema = eventSettingsSchema
  .omit({ pinUpdatedAt: true })
  .partial()
  .openapi('EventSettingsInput')

export const eventMemberSchema = z
  .object({
    userId: z.string().openapi({ example: '665f1c2e9b1e8a001c8e4d12' }),
    role: eventMemberRoleSchema,
    addedAt: z.string().openapi({ example: '2026-11-08T17:00:00.000Z' })
  })
  .openapi('EventMember')

export const eventScreenSlotSchema = z
  .object({
    id: z.string().openapi({ example: '665f1c2e9b1e8a001c8e4d99' }),
    name: z.string().optional().openapi({ example: 'Telão Entrada', description: 'Apelido ou local do telão' }),
    pin: eventPinSchema,
    createdAt: z.string().openapi({ example: '2026-11-08T17:00:00.000Z' }),
    activatedAt: z.string().optional().openapi({ example: '2026-11-08T17:05:00.000Z' }),
    lastSeenAt: z.string().optional().openapi({ example: '2026-11-08T18:00:00.000Z', description: 'Último polling/atividade' })
  })
  .openapi('EventScreenSlot')

export const eventScreenHistoryEntrySchema = z
  .object({
    id: z.string().openapi({ example: '665f1c2e9b1e8a001c8e4d99' }),
    screenId: z.string().openapi({ example: '665f1c2e9b1e8a001c8e4d88' }),
    name: z.string().optional().openapi({ example: 'Telão Entrada' }),
    action: z.enum(['connected', 'disconnected']).openapi({ example: 'connected' }),
    timestamp: z.string().openapi({ example: '2026-11-09T18:00:00.000Z' })
  })
  .openapi('EventScreenHistoryEntry')

export const eventSchema = z
  .object({
    id: z.string().openapi({ example: '665f1c2e9b1e8a001c8e4d30' }),
    name: z.string().openapi({ example: 'Casamento Ana & Pedro' }),
    description: z.string().optional().openapi({ example: 'Celebração no Sítio Boa Vista' }),
    type: eventTypeSchema,
    creditType: eventCreditTypeSchema,
    planTier: eventPlanTierSchema.default('single'),
    maxOrganizers: z.number().int().openapi({ example: 1 }),
    maxScreens: z.number().int().openapi({ example: 2 }),
    startsAt: z.string().openapi({ example: '2026-12-20T21:00:00.000Z' }),
    endsAt: z.string().openapi({ example: '2026-12-21T05:00:00.000Z' }),
    guestToken: z.string().openapi({ example: 'k3J9xQ2mZ1aB' }),
    settings: eventSettingsSchema,
    customization: eventCustomizationSchema.optional(),
    uploadsCloseAt: z.string().openapi({ example: '2026-12-22T05:00:00.000Z' }),
    galleryExpiresAt: z.string().openapi({ example: '2027-01-20T05:00:00.000Z' }),
    closedAt: z.string().optional().openapi({ example: '2026-12-21T02:00:00.000Z' }),
    phase: z.enum(['upcoming', 'open', 'closed', 'expired']).optional(),
    challenges: z.array(eventChallengeSchema).optional().default([]),
    members: z.array(eventMemberSchema),
    screens: z.array(eventScreenSlotSchema),
    screenHistory: z.array(eventScreenHistoryEntrySchema).optional().default([]),
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
    creditType: eventCreditTypeSchema.optional(),
    planTier: eventPlanTierSchema.optional(),
    startsAt: z.string().datetime().openapi({ example: '2026-12-20T21:00:00.000Z' }),
    endsAt: z.string().datetime().optional().openapi({ example: '2026-12-21T05:00:00.000Z' }),
    customization: eventCustomizationSchema.optional(),
    challenges: z.array(eventChallengeSchema).optional(),
    settings: eventSettingsInputSchema.optional()
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
