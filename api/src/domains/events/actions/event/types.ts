import type { createEventSchema, eventParamsSchema, eventSchema, listEventsQuerySchema, listEventsResponseSchema, updateEventSchema } from './schemas'
import type { z } from 'zod'

export type CreateEventRequest = { body: z.infer<typeof createEventSchema> }

export type GetEventRequest = { params: z.infer<typeof eventParamsSchema> }

export type UpdateEventRequest = {
  params: z.infer<typeof eventParamsSchema>
  body: z.infer<typeof updateEventSchema>
}

export type ListEventsRequest = { query: z.infer<typeof listEventsQuerySchema> }

export type EventResponse = z.infer<typeof eventSchema>

export type ListEventsResponse = z.infer<typeof listEventsResponseSchema>
