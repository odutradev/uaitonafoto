import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import {
  closeEvent,
  createEventScreen,
  deleteEvent,
  getEvent,
  removeEventScreen,
  reopenEvent,
  resetEventLockouts,
  setEventScreenBlock,
  startEvent,
  updateEvent,
  updateEventScreen
} from '@actions/events'
import { buildRoomStreamUrl } from '@actions/guest/client'
import { getErrorMessage } from '@config/events'

import type { EventItem, EventScreenHistoryEntry, EventScreenSlot, UpdateEventPayload } from '@actions/events/types'

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

  const refresh = useCallback(async () => {
    try {
      const refreshed = await getEvent(eventId)
      setEvent(refreshed)
    } catch {
    }
  }, [eventId])

  useEffect(() => {
    if (!eventId || typeof window === 'undefined' || !('EventSource' in window)) return undefined

    let isActive = true
    let eventSource: EventSource | null = null

    try {
      const streamUrl = buildRoomStreamUrl(eventId)
      eventSource = new EventSource(streamUrl)

      eventSource.addEventListener('screen:disconnect', (e: MessageEvent) => {
        if (!isActive) return
        try {
          const data = JSON.parse(e.data) as {
            screenId?: string
            screens?: EventScreenSlot[]
            historyEntry?: EventScreenHistoryEntry
          }
          setEvent((prev) => {
            if (!prev) return prev
            const nextScreens = Array.isArray(data.screens)
              ? data.screens
              : data.screenId
                ? (prev.screens ?? []).filter((s) => s.id !== data.screenId)
                : prev.screens
            const nextHistory = data.historyEntry
              ? [data.historyEntry, ...(prev.screenHistory ?? [])].slice(0, 30)
              : prev.screenHistory
            return {
              ...prev,
              screens: nextScreens,
              screenHistory: nextHistory
            }
          })
          toast.info('Um telão foi desconectado e a vaga foi liberada.')
        } catch {
          refresh()
        }
      })

      eventSource.addEventListener('screen:activate', (e: MessageEvent) => {
        if (!isActive) return
        try {
          const data = JSON.parse(e.data) as {
            screens?: EventScreenSlot[]
            historyEntry?: EventScreenHistoryEntry
          }
          setEvent((prev) => {
            if (!prev) return prev
            const nextScreens = Array.isArray(data.screens) ? data.screens : prev.screens
            const nextHistory = data.historyEntry
              ? [data.historyEntry, ...(prev.screenHistory ?? [])].slice(0, 30)
              : prev.screenHistory
            return {
              ...prev,
              screens: nextScreens,
              screenHistory: nextHistory
            }
          })
          toast.success('Um telão acabou de ser conectado!')
        } catch {
          refresh()
        }
      })

      eventSource.addEventListener('screen:create', (e: MessageEvent) => {
        if (!isActive) return
        try {
          const data = JSON.parse(e.data) as { screens?: EventScreenSlot[] }
          if (Array.isArray(data.screens)) {
            setEvent((prev) => (prev ? { ...prev, screens: data.screens! } : prev))
          }
        } catch {
          refresh()
        }
      })

      eventSource.addEventListener('screen:update', (e: MessageEvent) => {
        if (!isActive) return
        try {
          const data = JSON.parse(e.data) as { screens?: EventScreenSlot[] }
          if (Array.isArray(data.screens)) {
            setEvent((prev) => (prev ? { ...prev, screens: data.screens! } : prev))
          }
        } catch {
          refresh()
        }
      })

      const handleScreenStatusChange = (e: MessageEvent) => {
        if (!isActive) return
        try {
          const data = JSON.parse(e.data) as {
            screens?: EventScreenSlot[]
            historyEntry?: EventScreenHistoryEntry
          }
          setEvent((prev) => {
            if (!prev) return prev
            const nextScreens = Array.isArray(data.screens) ? data.screens : prev.screens
            const nextHistory = data.historyEntry
              ? [...(prev.screenHistory ?? []).filter((h) => h.id !== data.historyEntry!.id), data.historyEntry]
              : prev.screenHistory
            return {
              ...prev,
              screens: nextScreens,
              screenHistory: nextHistory
            }
          })
        } catch {
          refresh()
        }
      }

      eventSource.addEventListener('screen:block', handleScreenStatusChange)
      eventSource.addEventListener('screen:unblock', handleScreenStatusChange)
    } catch {
    }

    return () => {
      isActive = false
      if (eventSource) eventSource.close()
    }
  }, [eventId, refresh])

  useEffect(() => {
    const screens = event?.screens ?? []
    if (screens.length === 0) return undefined

    const hasPendingScreen = screens.some((screen) => !screen.activatedAt)
    const intervalMs = hasPendingScreen ? 4_000 : 10_000

    const intervalId = window.setInterval(() => {
      if (document.hidden) return
      getEvent(eventId)
        .then(setEvent)
        .catch(() => undefined)
    }, intervalMs)

    return () => window.clearInterval(intervalId)
  }, [eventId, event?.screens])

  const addScreen = useCallback(
    async (name?: string) => {
      try {
        const screens = await createEventScreen(eventId, name)
        setEvent((prev) => (prev ? { ...prev, screens } : prev))
        toast.success('PIN do telão gerado!')
      } catch (error) {
        toast.error(getErrorMessage(error, 'Não foi possível gerar o PIN do telão.'))
      }
    },
    [eventId]
  )

  const disconnectScreen = useCallback(
    async (screenId: string) => {
      try {
        const screens = await removeEventScreen(eventId, screenId)
        setEvent((prev) => (prev ? { ...prev, screens } : prev))
        toast.success('Telão desconectado.')
      } catch (error) {
        toast.error(getErrorMessage(error, 'Não foi possível desconectar o telão.'))
      }
    },
    [eventId]
  )

  const updateScreen = useCallback(
    async (screenId: string, name?: string) => {
      try {
        const screens = await updateEventScreen(eventId, screenId, name)
        setEvent((prev) => (prev ? { ...prev, screens } : prev))
        toast.success('Identificação do telão atualizada!')
      } catch (error) {
        toast.error(getErrorMessage(error, 'Não foi possível atualizar o telão.'))
      }
    },
    [eventId]
  )

  const toggleBlockScreen = useCallback(
    async (screenId: string, blocked: boolean) => {
      try {
        const screens = await setEventScreenBlock(eventId, screenId, blocked)
        setEvent((prev) => (prev ? { ...prev, screens } : prev))
        toast.success(blocked ? 'Telão bloqueado com sucesso.' : 'Telão desbloqueado com sucesso!')
      } catch (error) {
        toast.error(
          getErrorMessage(
            error,
            blocked ? 'Não foi possível bloquear o telão.' : 'Não foi possível desbloquear o telão.'
          )
        )
      }
    },
    [eventId]
  )

  const start = useCallback(async () => {
    try {
      const updated = await startEvent(eventId)
      setEvent(updated)
      toast.success('Evento iniciado! O sistema e telão estão ativos.')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível iniciar o evento.'))
    }
  }, [eventId])

  const close = useCallback(async () => {
    try {
      const updated = await closeEvent(eventId)
      setEvent(updated)
      toast.success('Evento encerrado. A galeria está liberada!')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível encerrar o evento.'))
    }
  }, [eventId])

  const reopen = useCallback(async () => {
    try {
      const updated = await reopenEvent(eventId)
      setEvent(updated)
      toast.success('Evento reaberto com sucesso!')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível reabrir o evento.'))
    }
  }, [eventId])

  const unlockPin = useCallback(
    async (scope: 'all' | 'screen' | 'guest' = 'all') => {
      try {
        const result = await resetEventLockouts(eventId, scope)
        toast.success(result.message || 'Dispositivos desbloqueados com sucesso!')
      } catch (error) {
        toast.error(getErrorMessage(error, 'Não foi possível desbloquear os dispositivos.'))
      }
    },
    [eventId]
  )

  return {
    event,
    isLoading,
    save,
    remove,
    addScreen,
    disconnectScreen,
    updateScreen,
    toggleBlockScreen,
    refresh,
    start,
    close,
    reopen,
    unlockPin
  }
}

export default useEventDetails
