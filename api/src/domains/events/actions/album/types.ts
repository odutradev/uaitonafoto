import type { z } from 'zod'
import type {
  activateScreenResponseSchema,
  activateScreenSchema,
  albumQuerySchema,
  albumResponseSchema,
  createScreenSlotSchema,
  eventGuestListResponseSchema,
  eventIdParamsSchema,
  eventPhotoParamsSchema,
  eventScreenParamsSchema,
  screenQuerySchema,
  screenResponseSchema,
  screenSlotListResponseSchema
} from './schemas'

export type EventIdRequest = { params: z.infer<typeof eventIdParamsSchema> }

export type CreateScreenSlotRequest = {
  params: z.infer<typeof eventIdParamsSchema>
  body?: z.infer<typeof createScreenSlotSchema>
}

export type EventPhotoRequest = { params: z.infer<typeof eventPhotoParamsSchema> }

export type EventScreenRequest = { params: z.infer<typeof eventScreenParamsSchema> }

export type ActivateScreenRequest = {
  params: z.infer<typeof eventIdParamsSchema>
  body: z.infer<typeof activateScreenSchema>
}

export type ScreenRequest = {
  params: z.infer<typeof eventIdParamsSchema>
  query: z.infer<typeof screenQuerySchema>
}

export type AlbumRequest = {
  params: z.infer<typeof eventIdParamsSchema>
  query: z.infer<typeof albumQuerySchema>
}

export type ScreenSlotListResponse = z.infer<typeof screenSlotListResponseSchema>

export type ActivateScreenResponse = z.infer<typeof activateScreenResponseSchema>

export type ScreenResponse = z.infer<typeof screenResponseSchema>

export type AlbumResponse = z.infer<typeof albumResponseSchema>

export type EventGuestListResponse = z.infer<typeof eventGuestListResponseSchema>
