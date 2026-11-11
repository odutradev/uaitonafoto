import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import createPageContext from '@utils/functions/createPageContext'
import { buildGuestLink } from '@utils/functions/events'
import useAction from '@hooks/useAction'

import type { ScreenLayoutMode, ScreenPhotoFit } from '@pages/app/eventScreen/types'
import type { UseEventScreenPageReturn } from './types'
import type { FormEvent } from 'react'

import { activateEventScreen, disconnectEventScreen, getEventScreen } from '@actions/events'
import { buildScreenStreamUrl, clearScreenCredential, getStoredScreenEvent, getStoredScreenPin, getStoredScreenToken, storeScreenCredential, storeScreenPin } from '@utils/api/screen'
import { getErrorMessage } from '@utils/functions/events'
import usePinLockout from '@hooks/usePinLockout'

import type { EventPhoto, ScreenEventInfo } from '@utils/types/events'

const fastPollIntervalMs = 5000
const syncPollIntervalMs = 45000
const rotateIntervalMs = 6000
const newArrivalDurationMs = 3500

const useEventScreenSession = (eventId: string) => {
  const [screenToken, setScreenToken] = useState<string | null>(() => getStoredScreenToken(eventId))
  const [event, setEvent] = useState<ScreenEventInfo | null>(() => getStoredScreenEvent(eventId))
  const [pin, setPin] = useState<string | null>(() => getStoredScreenPin(eventId))
  const [photos, setPhotos] = useState<EventPhoto[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const [activationError, setActivationError] = useState<string | null>(null)
  const [isActivating, setIsActivating] = useState(false)
  const [isLiveStreamConnected, setIsLiveStreamConnected] = useState(false)
  const [isNewArrival, setIsNewArrival] = useState(false)

  const cursorRef = useRef<string | undefined>(undefined)
  const seenIdsRef = useRef<Set<string>>(new Set())
  const newArrivalTimerRef = useRef<number | null>(null)

  const lockout = usePinLockout({ scope: 'screen', targetId: eventId })

  useEffect(() => {
    cursorRef.current = undefined
    seenIdsRef.current.clear()
    setPhotos([])
    setCurrentIndex(0)
    setMessage(null)
    setActivationError(null)
    setIsLiveStreamConnected(false)
    setIsNewArrival(false)
    setScreenToken(getStoredScreenToken(eventId))
    setEvent(getStoredScreenEvent(eventId))
    setPin(getStoredScreenPin(eventId))
  }, [eventId])

  const activate = useCallback(
    async (inputPin: string) => {
      if (lockout.isLocked) return
      setIsActivating(true)
      setActivationError(null)
      try {
        const result = await activateEventScreen(eventId, inputPin)
        lockout.resetLockout()
        storeScreenCredential(eventId, result.screenToken, result.event, result.pin)
        setScreenToken(result.screenToken)
        setEvent(result.event)
        setPin(result.pin)
      } catch (error) {
        lockout.recordFailure(error)
        setActivationError(getErrorMessage(error, 'Não foi possível ativar o telão.'))
      } finally {
        setIsActivating(false)
      }
    },
    [eventId, lockout]
  )

  const disconnect = useCallback(async () => {
    if (screenToken) {
      try {
        await disconnectEventScreen(eventId, screenToken)
      } catch {
      }
    }
    clearScreenCredential(eventId)
    cursorRef.current = undefined
    seenIdsRef.current.clear()
    setPhotos([])
    setCurrentIndex(0)
    setScreenToken(null)
    setEvent(null)
    setPin(null)
    setMessage(null)
    setActivationError(null)
    setIsLiveStreamConnected(false)
    setIsNewArrival(false)
    if (newArrivalTimerRef.current) {
      window.clearTimeout(newArrivalTimerRef.current)
      newArrivalTimerRef.current = null
    }
  }, [eventId, screenToken])

  const triggerNewPhotoArrival = useCallback(() => {
    setIsNewArrival(true)
    if (newArrivalTimerRef.current) {
      window.clearTimeout(newArrivalTimerRef.current)
    }
    newArrivalTimerRef.current = window.setTimeout(() => {
      setIsNewArrival(false)
      newArrivalTimerRef.current = null
    }, newArrivalDurationMs)
  }, [])

  useEffect(() => {
    if (!screenToken) return undefined

    let isActive = true
    let eventSource: EventSource | null = null
    let fallbackPollTimer: number | null = null

    const fetchPhotos = async () => {
      try {
        const result = await getEventScreen(eventId, screenToken, { since: cursorRef.current, limit: 100 })
        if (!isActive) return

        cursorRef.current = result.nextSince
        storeScreenCredential(eventId, screenToken, result.event, result.pin)
        setEvent(result.event)
        setPin(result.pin)
        setMessage(null)

        const fresh = result.photos.filter((photo) => !seenIdsRef.current.has(photo.id))
        if (fresh.length === 0) return

        fresh.forEach((photo) => seenIdsRef.current.add(photo.id))
        setPhotos((current) => {
          if (current.length > 0) setCurrentIndex(current.length)
          return [...current, ...fresh]
        })
      } catch (error) {
        if (!isActive) return
        const status = (error as { response?: { status?: number } })?.response?.status
        if (status === 401) {
          clearScreenCredential(eventId)
          cursorRef.current = undefined
          seenIdsRef.current.clear()
          setPhotos([])
          setScreenToken(null)
          setIsLiveStreamConnected(false)
          setActivationError('Este telão foi desconectado ou sua credencial expirou. Informe um novo PIN.')
          return
        }
        setMessage(getErrorMessage(error, 'Não foi possível atualizar o telão.'))
      }
    }

    const scheduleFallbackPoll = (intervalMs: number) => {
      if (fallbackPollTimer) window.clearInterval(fallbackPollTimer)
      fallbackPollTimer = window.setInterval(fetchPhotos, intervalMs)
    }

    fetchPhotos()

    if (typeof window !== 'undefined' && 'EventSource' in window) {
      const streamUrl = buildScreenStreamUrl(eventId, screenToken)
      eventSource = new EventSource(streamUrl)

      eventSource.addEventListener('ready', () => {
        if (!isActive) return
        setIsLiveStreamConnected(true)
        scheduleFallbackPoll(syncPollIntervalMs)
      })

      eventSource.addEventListener('photo:new', (e: MessageEvent) => {
        if (!isActive) return
        try {
          const photo = JSON.parse(e.data) as EventPhoto
          if (!photo?.id || seenIdsRef.current.has(photo.id)) return

          seenIdsRef.current.add(photo.id)
          cursorRef.current = photo.createdAt

          setPhotos((current) => {
            setCurrentIndex(current.length)
            return [...current, photo]
          })
          triggerNewPhotoArrival()
        } catch {
        }
      })

      eventSource.addEventListener('photo:delete', (e: MessageEvent) => {
        if (!isActive) return
        try {
          const { photoId } = JSON.parse(e.data) as { photoId: string }
          if (!photoId) return

          seenIdsRef.current.delete(photoId)
          setPhotos((current) => {
            const next = current.filter((p) => p.id !== photoId)
            setCurrentIndex((idx) => Math.min(idx, Math.max(0, next.length - 1)))
            return next
          })
        } catch {
        }
      })

      eventSource.addEventListener('photo:like', (e: MessageEvent) => {
        if (!isActive) return
        try {
          const { photoId, likesCount } = JSON.parse(e.data) as { photoId: string; likesCount: number }
          if (!photoId) return

          setPhotos((current) =>
            current.map((item) => (item.id === photoId ? { ...item, likesCount } : item))
          )
        } catch {
        }
      })

      eventSource.addEventListener('pin:change', (e: MessageEvent) => {
        if (!isActive) return
        try {
          const { pin: nextPin } = JSON.parse(e.data) as { pin: string | null }
          setPin(nextPin)
          storeScreenPin(eventId, nextPin)
        } catch {
        }
      })

      eventSource.addEventListener('lockout:reset', () => {
        if (!isActive) return
        lockout.resetLockout()
        setActivationError(null)
      })

      eventSource.onerror = () => {
        if (!isActive) return
        setIsLiveStreamConnected(false)
        scheduleFallbackPoll(fastPollIntervalMs)
      }
    } else {
      scheduleFallbackPoll(fastPollIntervalMs)
    }

    return () => {
      isActive = false
      if (eventSource) eventSource.close()
      if (fallbackPollTimer) window.clearInterval(fallbackPollTimer)
      if (newArrivalTimerRef.current) {
        window.clearTimeout(newArrivalTimerRef.current)
        newArrivalTimerRef.current = null
      }
    }
  }, [eventId, screenToken, triggerNewPhotoArrival])

  useEffect(() => {
    if (photos.length < 2 || isNewArrival) return undefined

    const intervalId = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % photos.length)
    }, rotateIntervalMs)

    return () => window.clearInterval(intervalId)
  }, [photos.length, currentIndex, isNewArrival])

  return {
    isActivated: Boolean(screenToken),
    isActivating,
    activationError,
    activate,
    disconnect,
    lockout,
    event,
    pin,
    photos,
    currentIndex,
    selectPhoto: setCurrentIndex,
    currentPhoto: photos[currentIndex],
    photosCount: photos.length,
    message,
    isLiveStreamConnected,
    isNewArrival
  }
}

const screenShowPinStorageKey = 'uaitonafoto:screen:show_pin'
const screenLayoutStorageKey = 'uaitonafoto:screen:layout'
const screenPhotoFitStorageKey = 'uaitonafoto:screen:photo_fit'

const useEventScreenPageState = (): UseEventScreenPageReturn => {
  const { token, id } = useParams()
  const runAction = useAction()
  const eventIdentifier = token || id || ''
  const session = useEventScreenSession(eventIdentifier)
  const { activate, disconnect, lockout, event, pin } = session
  const [pinInput, setPinInput] = useState('')
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [layoutMode, setLayoutMode] = useState<ScreenLayoutMode>(() => {
    const stored = localStorage.getItem(screenLayoutStorageKey)
    if (
      stored === 'stories' ||
      stored === 'lateral' ||
      stored === 'stage' ||
      stored === 'mosaic' ||
      stored === 'duo'
    ) {
      return stored
    }
    // Compatibilidade com configurações anteriores
    if (stored === 'side-hub') return 'lateral'
    if (stored === 'classic') return 'stage'
    if (stored === 'social-feed') return 'stories'
    return 'stories'
  })
  const [photoFit, setPhotoFit] = useState<ScreenPhotoFit>(() => {
    const stored = localStorage.getItem(screenPhotoFitStorageKey) as ScreenPhotoFit | null
    if (stored && ['cover', 'contain'].includes(stored)) {
      return stored
    }
    return 'contain'
  })
  const [showPin, setShowPin] = useState<boolean>(() => {
    const stored = localStorage.getItem(screenShowPinStorageKey)
    return stored !== null ? stored === 'true' : true
  })

  const handleTogglePinVisibility = () => {
    setShowPin((prev) => {
      const next = !prev
      localStorage.setItem(screenShowPinStorageKey, String(next))
      return next
    })
  }

  const handleLayoutChange = (mode: ScreenLayoutMode) => {
    setLayoutMode(mode)
    localStorage.setItem(screenLayoutStorageKey, mode)
  }

  const handlePhotoFitChange = (fit: ScreenPhotoFit) => {
    setPhotoFit(fit)
    localStorage.setItem(screenPhotoFitStorageKey, fit)
  }

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }

  const handleActivateSubmit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault()
    if (lockout.isLocked || !/^\d{4}$/.test(pinInput)) return
    await activate(pinInput)
  }

  const guestLink = event ? buildGuestLink(event.guestToken) : token ? buildGuestLink(token) : ''


  const handleOpenSettings = () => setIsSettingsModalOpen(true)
  const handleCloseSettings = () => setIsSettingsModalOpen(false)
  const handleOpenDisconnect = () => setIsDisconnectModalOpen(true)
  const handleCloseDisconnect = () => setIsDisconnectModalOpen(false)

  const handleConfirmDisconnect = async () => {
    setIsDisconnectModalOpen(false)
    await runAction({
      action: disconnect,
      callback: () => {
        toast.info('Telão desconectado e vaga liberada com sucesso.')
      }
    })
  }

  return {
    ...session,
    token,
    guestLink,
    pinInput,
    setPinInput,
    isDisconnectModalOpen,
    isSettingsModalOpen,
    layoutMode,
    photoFit,
    showPin,
    hasPin: Boolean(pin),
    handleTogglePinVisibility,
    handleLayoutChange,
    handlePhotoFitChange,
    handleFullscreen,
    handleActivateSubmit,
    handleOpenSettings,
    handleCloseSettings,
    handleOpenDisconnect,
    handleCloseDisconnect,
    handleConfirmDisconnect
  }
}

const { PageProvider: EventScreenPageProvider, usePage: useEventScreenPage } = createPageContext(
  useEventScreenPageState,
  'useEventScreenPage'
)

export { EventScreenPageProvider }
export default useEventScreenPage
