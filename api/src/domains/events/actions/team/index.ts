import { addOrganizerSchema, removeMemberParamsSchema, teamListResponseSchema, teamParamsSchema } from './schemas'
import { sendTeamInviteEmail, sendTeamRemovedEmail } from '@domains/events/utils/notifyEventEmail'
import { resolveEventLimits } from '@domains/events/utils/eventLimits'
import eventRepository from '@domains/events/repositories/events'
import { findMemberRole } from '@domains/events/actions/event'
import userRepository from '@domains/users/repositories/users'
import { resolveFrontendBaseUrl } from '@email/links'
import defineAction from '@factories/defineAction'

import type { AddOrganizerRequest, ListTeamRequest, RemoveMemberRequest, TeamListResponse } from './types'
import type { ManageRequestBody, ManageRequestResponse } from '@middlewares/manageRequest/types'
import type { EventEntity } from '@domains/events/repositories/events/types'

const buildTeamResponse = async (event: EventEntity): Promise<TeamListResponse> => {
  const users = await Promise.all(event.members.map((member) => userRepository.findById(member.userId)))

  return event.members.flatMap((member, index) => {
    const user = users[index]
    if (!user) return []

    return [
      {
        userId: member.userId,
        name: user.fullName || user.name,
        email: user.email,
        photoUrl: user.photoUrl,
        role: member.role,
        addedAt: member.addedAt
      }
    ]
  })
}

export const listTeam = defineAction(
  {
    method: 'get',
    path: '/events/:id/team/list',
    summary: 'Listar equipe organizadora do evento',
    tags: ['Equipe do Evento'],
    authenticate: true,
    schema: { params: teamParamsSchema },
    responses: {
      200: { description: 'Membros da equipe', schema: teamListResponseSchema },
      403: { description: 'Usuário não pertence à equipe do evento' },
      404: { description: 'Evento não encontrado' }
    }
  },
  async ({ ids, params, manageError }: ManageRequestBody<ListTeamRequest>): ManageRequestResponse<TeamListResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const event = await eventRepository.findById(params.id)
    if (!event) return manageError({ code: 'not_found' })
    if (!findMemberRole(event, ids.userId)) return manageError({ code: 'forbidden' })

    return buildTeamResponse(event)
  }
)

export const MaxOrganizers = 5

export const addOrganizer = defineAction(
  {
    method: 'post',
    path: '/events/:id/team/add',
    summary: 'Adicionar organizador à equipe pelo e-mail (somente criador)',
    tags: ['Equipe do Evento'],
    authenticate: true,
    schema: { params: teamParamsSchema, body: addOrganizerSchema },
    responses: {
      200: { description: 'Equipe atualizada', schema: teamListResponseSchema },
      403: { description: 'Somente o criador pode gerenciar a equipe' },
      404: { description: 'Evento ou usuário não encontrado' },
      409: { description: 'Usuário já faz parte da equipe ou limite de organizadores atingido' }
    }
  },
  async ({ ids, params, data, defaultExpress, manageError }: ManageRequestBody<AddOrganizerRequest>): ManageRequestResponse<TeamListResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const event = await eventRepository.findById(params.id)
    if (!event) return manageError({ code: 'not_found' })
    if (findMemberRole(event, ids.userId) !== 'creator') return manageError({ code: 'forbidden' })

    const { maxOrganizers } = await resolveEventLimits(event)
    const organizersCount = event.members.filter((member) => member.role === 'organizer').length
    if (organizersCount >= maxOrganizers) {
      return manageError({
        code: 'conflict',
        details: `Limite de ${maxOrganizers} ${maxOrganizers === 1 ? 'convidado' : 'convidados'} na equipe atingido para este evento`
      })
    }

    const user = await userRepository.findByEmail(data.email)
    if (!user) return manageError({ code: 'user_not_found' })

    const updated = await eventRepository.addMember(event.id, user.id, 'organizer')
    if (!updated) return manageError({ code: 'conflict' })

    void sendTeamInviteEmail(updated, user, ids.userId, resolveFrontendBaseUrl(defaultExpress.req.headers.origin))

    return buildTeamResponse(updated)
  }
)

export const removeMember = defineAction(
  {
    method: 'delete',
    path: '/events/:id/team/:userId/remove',
    summary: 'Remover organizador (criador remove qualquer organizador; organizador pode sair)',
    tags: ['Equipe do Evento'],
    authenticate: true,
    schema: { params: removeMemberParamsSchema },
    responses: {
      200: { description: 'Equipe atualizada', schema: teamListResponseSchema },
      403: { description: 'Sem permissão para remover este membro' },
      404: { description: 'Evento ou membro não encontrado' }
    }
  },
  async ({ ids, params, defaultExpress, manageError }: ManageRequestBody<RemoveMemberRequest>): ManageRequestResponse<TeamListResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const event = await eventRepository.findById(params.id)
    if (!event) return manageError({ code: 'not_found' })

    const role = findMemberRole(event, ids.userId)
    const canRemove = role === 'creator' || (role === 'organizer' && params.userId === ids.userId)
    if (!canRemove) return manageError({ code: 'forbidden' })

    const updated = await eventRepository.removeMember(event.id, params.userId)
    if (!updated) return manageError({ code: 'not_found' })

    if (params.userId !== ids.userId) void sendTeamRemovedEmail(updated, params.userId, resolveFrontendBaseUrl(defaultExpress.req.headers.origin))

    return buildTeamResponse(updated)
  }
)
