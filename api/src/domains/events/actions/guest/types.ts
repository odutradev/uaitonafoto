import type { z } from 'zod'
import type {
  guestEventInfoSchema,
  guestSessionResponseSchema,
  guestTokenParamsSchema,
  joinEventResponseSchema,
  joinEventSchema
} from './schemas'

export type GetGuestEventRequest = { params: z.infer<typeof guestTokenParamsSchema> }

export type JoinEventRequest = {
  params: z.infer<typeof guestTokenParamsSchema>
  body: z.infer<typeof joinEventSchema>
}

export type GuestEventInfo = z.infer<typeof guestEventInfoSchema>

export type JoinEventResponse = z.infer<typeof joinEventResponseSchema>

export type GuestSessionResponse = z.infer<typeof guestSessionResponseSchema>
