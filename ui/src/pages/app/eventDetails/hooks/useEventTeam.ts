import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { addOrganizer, getEventTeam, removeTeamMember } from '@actions/events'
import { getErrorMessage } from '@config/events'

import type { TeamMember } from '@actions/events/types'

const useEventTeam = (eventId: string) => {
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
      try {
        setMembers(await addOrganizer(eventId, email))
        toast.success('Organizador adicionado!')
        return true
      } catch (error) {
        toast.error(getErrorMessage(error, 'Não foi possível adicionar o organizador.'))
        return false
      }
    },
    [eventId]
  )

  const remove = useCallback(
    async (userId: string) => {
      try {
        setMembers(await removeTeamMember(eventId, userId))
      } catch (error) {
        toast.error(getErrorMessage(error, 'Não foi possível remover o membro.'))
      }
    },
    [eventId]
  )

  return { members, isLoading, add, remove }
}

export default useEventTeam
