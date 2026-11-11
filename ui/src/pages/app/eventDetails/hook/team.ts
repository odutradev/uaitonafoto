import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { addOrganizer, getEventTeam, removeTeamMember } from '@actions/events'
import { getErrorMessage } from '@utils/functions/events'

import type { TeamMember } from '@utils/types/events'
import useAction from '@hooks/useAction'

const useEventTeam = (eventId: string) => {
  const runAction = useAction()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getEventTeam(eventId)
      .then(setMembers)
      .catch((error) => toast.error(getErrorMessage(error, 'Não foi possível carregar a equipe.')))
      .finally(() => setIsLoading(false))
  }, [eventId])

  const add = useCallback(
    async (email: string): Promise<boolean> => {
      const updatedMembers = await runAction({
        action: () => addOrganizer(eventId, email),
        toastMessages: { success: 'Organizador adicionado!', error: 'Não foi possível adicionar o organizador.' },
        callback: setMembers
      })
      return updatedMembers !== undefined
    },
    [eventId, runAction]
  )

  const remove = useCallback(
    async (userId: string) => {
      await runAction({
        action: async () => {
          setMembers(await removeTeamMember(eventId, userId))
        },
        toastMessages: { error: 'Não foi possível remover o membro.' }
      })
    },
    [eventId, runAction]
  )

  return { members, isLoading, add, remove }
}

export default useEventTeam
