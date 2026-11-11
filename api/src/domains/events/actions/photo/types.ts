import type { likeResponseSchema, listFeedQuerySchema, listFeedResponseSchema, photoParamsSchema, photoSchema } from './schemas'

﻿import type { z } from 'zod'

export type PhotoResponse = z.infer<typeof photoSchema>

export type PhotoParamsRequest = { params: z.infer<typeof photoParamsSchema> }

export type ListFeedRequest = { query: z.infer<typeof listFeedQuerySchema> }

export type ListFeedResponse = z.infer<typeof listFeedResponseSchema>

export type LikeResponse = z.infer<typeof likeResponseSchema>
