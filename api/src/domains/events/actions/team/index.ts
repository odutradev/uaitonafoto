import defineAction from '@factories/defineAction'
import userRepository from '@domains/users/repositories'
import eventRepository from '../../repositories/events'
import findMemberRole from '../event/utils/findMemberRole'
import buildTeamResponse from './utils/buildTeamResponse'
import {
  addOrganizerSchema,
  removeMemberParamsSchema,
  teamListResponseSchema,
  teamParamsSchema
} from './schemas'

import type { ManageRequestBody, ManageRequestResponse } from '@middlewares/manageRequest/types'
import type {
  AddOrganizerRequest,
  ListTeamRequest,
  RemoveMemberRequest,
  TeamListResponse
} from './types'

export const listTeam = defineAction(
  {
    method: 'get',
    path: '/events/:id/team',
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

export const addOrganizer = defineAction(
  {
    method: 'post',
    path: '/events/:id/team',
    summary: 'Adicionar organizador à equipe pelo e-mail (somente criador)',
    tags: ['Equipe do Evento'],
    authenticate: true,
    schema: { params: teamParamsSchema, body: addOrganizerSchema },
    responses: {
      200: { description: 'Equipe atualizada', schema: teamListResponseSchema },
      403: { description: 'Somente o criador pode gerenciar a equipe' },
      404: { description: 'Evento ou usuário não encontrado' },
      409: { description: 'Usuário já faz parte da equipe' }
    }
  },
  async ({ ids, params, data, manageError }: ManageRequestBody<AddOrganizerRequest>): ManageRequestResponse<TeamListResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const event = await eventRepository.findById(params.id)
    if (!event) return manageError({ code: 'not_found' })
    if (findMemberRole(event, ids.userId) !== 'creator') return manageError({ code: 'forbidden' })

    const user = await userRepository.findByEmail(data.email)
    if (!user) return manageError({ code: 'user_not_found' })

    const updated = await eventRepository.addMember(event.id, user.id, 'organizer')
    if (!updated) return manageError({ code: 'conflict' })

    return buildTeamResponse(updated)
  }
)

export const removeMember = defineAction(
  {
    method: 'delete',
    path: '/events/:id/team/:userId',
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
  async ({ ids, params, manageError }: ManageRequestBody<RemoveMemberRequest>): ManageRequestResponse<TeamListResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const event = await eventRepository.findById(params.id)
    if (!event) return manageError({ code: 'not_found' })

    const role = findMemberRole(event, ids.userId)
    const canRemove = role === 'creator' || (role === 'organizer' && params.userId === ids.userId)
    if (!canRemove) return manageError({ code: 'forbidden' })

    const updated = await eventRepository.removeMember(event.id, params.userId)
    if (!updated) return manageError({ code: 'not_found' })

    return buildTeamResponse(updated)
  }
)
