import type { z } from 'zod'
import type {
  albumQuerySchema,
  albumResponseSchema,
  eventGuestListResponseSchema,
  eventIdParamsSchema,
  eventPhotoParamsSchema,
  screenQuerySchema,
  screenResponseSchema
} from './schemas'

export type EventIdRequest = { params: z.infer<typeof eventIdParamsSchema> }

export type EventPhotoRequest = { params: z.infer<typeof eventPhotoParamsSchema> }

export type ScreenRequest = {
  params: z.infer<typeof eventIdParamsSchema>
  query: z.infer<typeof screenQuerySchema>
}

export type AlbumRequest = {
  params: z.infer<typeof eventIdParamsSchema>
  query: z.infer<typeof albumQuerySchema>
}

export type ScreenResponse = z.infer<typeof screenResponseSchema>

export type AlbumResponse = z.infer<typeof albumResponseSchema>

export type EventGuestListResponse = z.infer<typeof eventGuestListResponseSchema>
