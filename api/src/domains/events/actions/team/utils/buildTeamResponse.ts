import userRepository from '@domains/users/repositories'

import type { EventEntity } from '../../../repositories/events/types'
import type { TeamListResponse } from '../types'

export const buildTeamResponse = async (event: EventEntity): Promise<TeamListResponse> => {
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

export default buildTeamResponse
