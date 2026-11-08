import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { getMyEvents } from '@actions/events'
import { getErrorMessage } from '@config/events'

import type { EventItem } from '@actions/events/types'

const useEvents = () => {
  const [events, setEvents] = useState<EventItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const reload = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getMyEvents({ limit: 50 })
      setEvents(result.data)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível carregar seus eventos.'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { events, isLoading, reload }
}

export default useEvents
