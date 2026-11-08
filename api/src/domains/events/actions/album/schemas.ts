import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

import { createPaginatedSchema, paginationQuerySchema } from '@factories/pagination/schemas'
import { eventPinSchema, eventScreenSlotSchema } from '../event/schemas'
import { photoSchema } from '../photo/schemas'

extendZodWithOpenApi(z)

export const eventIdParamsSchema = z
  .object({
    id: z.string().min(1).openapi({ example: '665f1c2e9b1e8a001c8e4d30' })
  })
  .openapi('EventIdParams')

export const eventPhotoParamsSchema = z
  .object({
    id: z.string().min(1).openapi({ example: '665f1c2e9b1e8a001c8e4d30' }),
    photoId: z.string().min(1).openapi({ example: '665f1c2e9b1e8a001c8e4d50' })
  })
  .openapi('EventPhotoParams')

export const eventScreenParamsSchema = z
  .object({
    id: z.string().min(1).openapi({ example: '665f1c2e9b1e8a001c8e4d30' }),
    screenId: z.string().min(1).openapi({ example: '665f1c2e9b1e8a001c8e4d99' })
  })
  .openapi('EventScreenParams')

export const createScreenSlotSchema = z
  .object({
    name: z.string().trim().max(60).optional().openapi({ example: 'Telão Entrada', description: 'Apelido ou local do telão' })
  })
  .openapi('CreateScreenSlot')

export const updateScreenSlotSchema = z
  .object({
    name: z.string().trim().max(60).optional().openapi({ example: 'Área VIP', description: 'Novo apelido ou local do telão' })
  })
  .openapi('UpdateScreenSlot')

export const screenSlotListResponseSchema = z.array(eventScreenSlotSchema).openapi('ScreenSlotListResponse')

export const activateScreenSchema = z
  .object({
    pin: eventPinSchema
  })
  .openapi('ActivateScreen')

export const screenEventInfoSchema = z
  .object({
    id: z.string().openapi({ example: '665f1c2e9b1e8a001c8e4d30' }),
    name: z.string().openapi({ example: 'Casamento Ana & Pedro' }),
    guestToken: z.string().openapi({ example: 'k3J9xQ2mZ1aB' })
  })
  .openapi('ScreenEventInfo')

export const activateScreenResponseSchema = z
  .object({
    screenToken: z.string().openapi({ description: 'Credencial de sessão do telão para salvar no localStorage' }),
    event: screenEventInfoSchema,
    pin: z.string().nullable().openapi({ example: '4829', description: 'PIN atual de acesso do evento (null se desativado)' })
  })
  .openapi('ActivateScreenResponse')

export const screenQuerySchema = z
  .object({
    since: z.string().datetime().optional().openapi({
      example: '2026-12-20T22:10:00.000Z',
      description: 'Retorna apenas fotos enviadas após este instante (use o nextSince da resposta anterior)'
    }),
    limit: z.coerce.number().int().min(1).max(100).optional().openapi({ example: 50 })
  })
  .openapi('ScreenQuery')

export const screenResponseSchema = z
  .object({
    event: screenEventInfoSchema,
    photos: z.array(photoSchema).openapi({ description: 'Fotos em ordem cronológica (mais antigas primeiro)' }),
    nextSince: z.string().optional().openapi({ description: 'Cursor para a próxima chamada' }),
    pin: z.string().nullable().openapi({ example: '4829', description: 'PIN atual de acesso do evento (null se desativado)' })
  })
  .openapi('ScreenResponse')

export const albumQuerySchema = paginationQuerySchema
  .extend({
    guestId: z.string().optional().openapi({ description: 'Filtra por convidado' })
  })
  .openapi('AlbumQuery')

export const albumResponseSchema = createPaginatedSchema(photoSchema, 'AlbumResponse')

export const eventGuestSchema = z
  .object({
    id: z.string().openapi({ example: '665f1c2e9b1e8a001c8e4d40' }),
    name: z.string().openapi({ example: 'Maria' }),
    photosCount: z.number().openapi({ example: 4 }),
    createdAt: z.string().openapi({ example: '2026-12-20T21:30:00.000Z' })
  })
  .openapi('EventGuestResponse')

export const eventGuestListResponseSchema = z.array(eventGuestSchema).openapi('EventGuestListResponse')
