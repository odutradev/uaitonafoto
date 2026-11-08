import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { deleteEvent, getEvent, updateEvent } from '@actions/events'
import { getErrorMessage } from '@config/events'

import type { EventItem, UpdateEventPayload } from '@actions/events/types'

const useEventDetails = (eventId: string) => {
  const navigate = useNavigate()
  const [event, setEvent] = useState<EventItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isActive = true
    setIsLoading(true)

    getEvent(eventId)
      .then((result) => isActive && setEvent(result))
      .catch((error) => {
        toast.error(getErrorMessage(error, 'Evento não encontrado.'))
        navigate('/app', { replace: true })
      })
      .finally(() => isActive && setIsLoading(false))

    return () => {
      isActive = false
    }
  }, [eventId, navigate])

  useEffect(() => {
    if (!event?.settings.pinEnabled || !event.settings.pinRotate) return undefined

    const updatedAtMs = Date.parse(event.settings.pinUpdatedAt)
    const rotationMs = event.settings.pinRotationMinutes * 60_000
    const elapsedMs = Number.isNaN(updatedAtMs) ? rotationMs : Date.now() - updatedAtMs
    const delayMs = Math.max(1000, rotationMs - elapsedMs + 500)

    const timeoutId = window.setTimeout(() => {
      getEvent(eventId)
        .then(setEvent)
        .catch(() => undefined)
    }, delayMs)

    return () => window.clearTimeout(timeoutId)
  }, [
    eventId,
    event?.settings.pinEnabled,
    event?.settings.pinRotate,
    event?.settings.pinRotationMinutes,
    event?.settings.pinUpdatedAt
  ])

  const save = useCallback(
    async (payload: UpdateEventPayload) => {
      try {
        setEvent(await updateEvent(eventId, payload))
        toast.success('Evento atualizado!')
      } catch (error) {
        toast.error(getErrorMessage(error, 'Não foi possível atualizar o evento.'))
      }
    },
    [eventId]
  )

  const remove = useCallback(async () => {
    try {
      await deleteEvent(eventId)
      toast.success('Evento excluído.')
      navigate('/app', { replace: true })
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível excluir o evento.'))
    }
  }, [eventId, navigate])

  return { event, isLoading, save, remove }
}

export default useEventDetails
