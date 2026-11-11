import type { addOrganizerSchema, removeMemberParamsSchema, teamListResponseSchema, teamMemberSchema, teamParamsSchema } from './schemas'

﻿import type { z } from 'zod'

export type ListTeamRequest = { params: z.infer<typeof teamParamsSchema> }

export type AddOrganizerRequest = {
  params: z.infer<typeof teamParamsSchema>
  body: z.infer<typeof addOrganizerSchema>
}

export type RemoveMemberRequest = { params: z.infer<typeof removeMemberParamsSchema> }

export type TeamMemberResponse = z.infer<typeof teamMemberSchema>

export type TeamListResponse = z.infer<typeof teamListResponseSchema>
