import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

import { eventMemberRoleSchema, eventParamsSchema } from '@domains/events/actions/event/schemas'

extendZodWithOpenApi(z)

export const teamMemberSchema = z
  .object({
    userId: z.string().openapi({ example: '665f1c2e9b1e8a001c8e4d12' }),
    name: z.string().openapi({ example: 'Ana Souza' }),
    email: z.string().openapi({ example: 'ana@email.com' }),
    photoUrl: z.string().optional(),
    role: eventMemberRoleSchema,
    addedAt: z.string().openapi({ example: '2026-11-08T17:00:00.000Z' })
  })
  .openapi('TeamMemberResponse')

export const teamListResponseSchema = z.array(teamMemberSchema).openapi('TeamListResponse')

export const teamParamsSchema = eventParamsSchema

export const addOrganizerSchema = z
  .object({
    email: z.string().trim().toLowerCase().email().openapi({ example: 'pedro@email.com' })
  })
  .openapi('AddOrganizer')

export const removeMemberParamsSchema = z
  .object({
    id: z.string().min(1).openapi({ example: '665f1c2e9b1e8a001c8e4d30' }),
    userId: z.string().min(1).openapi({ example: '665f1c2e9b1e8a001c8e4d12' })
  })
  .openapi('RemoveMemberParams')
