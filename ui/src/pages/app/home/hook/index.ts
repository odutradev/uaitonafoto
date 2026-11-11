import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import createPageContext from '@utils/functions/createPageContext'
import { getMyEvents } from '@actions/events'
import { getMeData } from '@actions/auth'
import useAction from '@hooks/useAction'
import useAuthStore from '@stores/auth'
import useAuth from '@hooks/useAuth'

import type { EventItem } from '@utils/types/events'
import type { UseHomePageReturn } from './types'

const useHomePageState = (): UseHomePageReturn => {
  const navigate = useNavigate()
  const runAction = useAction()
  const { user } = useAuth()
  const updateUser = useAuthStore((state) => state.updateUser)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [events, setEvents] = useState<EventItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const reload = useCallback(async () => {
    setIsLoading(true)
    await runAction({
      action: () => getMyEvents({ limit: 50 }),
      toastMessages: { error: 'Não foi possível carregar seus eventos.' },
      callback: (result) => setEvents(result.data)
    })
    setIsLoading(false)
  }, [runAction])

  useEffect(() => {
    reload()
  }, [reload])

  useEffect(() => {
    getMeData().then(updateUser).catch(() => undefined)
  }, [updateUser])

  const handleOpenCreate = useCallback(() => setIsCreateOpen(true), [])
  const handleCloseCreate = useCallback(() => setIsCreateOpen(false), [])
  const handleOpenEvent = useCallback((eventId: string) => navigate(`/app/events/${eventId}`), [navigate])
  const handleEventCreated = useCallback((event: EventItem) => navigate(`/app/events/${event.id}`), [navigate])

  return {
    user,
    firstName: user?.name.split(' ')[0] ?? '',
    events,
    isLoading,
    isCreateOpen,
    reload,
    handleOpenCreate,
    handleCloseCreate,
    handleOpenEvent,
    handleEventCreated
  }
}

const { PageProvider: HomePageProvider, usePage: useHomePage } = createPageContext(useHomePageState, 'useHomePage')

export { HomePageProvider }
export default useHomePage
