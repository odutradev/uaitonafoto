import { useCallback, useEffect, useRef, useState } from 'react'

import { activateEventScreen, getEventScreen } from '@actions/events'
import {
  buildScreenStreamUrl,
  clearScreenCredential,
  getStoredScreenEvent,
  getStoredScreenToken,
  storeScreenCredential
} from '@actions/events/screenClient'
import { getErrorMessage } from '@config/events'
import usePinLockout from '@hooks/usePinLockout'

import type { EventPhoto, ScreenEventInfo } from '@actions/events/types'

const FAST_POLL_INTERVAL_MS = 5000
const SYNC_POLL_INTERVAL_MS = 45000
const ROTATE_INTERVAL_MS = 6000
const NEW_ARRIVAL_DURATION_MS = 3500

const useEventScreen = (eventId: string) => {
  const [screenToken, setScreenToken] = useState<string | null>(() => getStoredScreenToken(eventId))
  const [event, setEvent] = useState<ScreenEventInfo | null>(() => getStoredScreenEvent(eventId))
  const [pin, setPin] = useState<string | null>(null)
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
  }, [eventId])

  const activate = useCallback(
    async (inputPin: string) => {
      if (lockout.isLocked) return
      setIsActivating(true)
      setActivationError(null)
      try {
        const result = await activateEventScreen(eventId, inputPin)
        lockout.resetLockout()
        storeScreenCredential(eventId, result.screenToken, result.event)
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

  const disconnect = useCallback(() => {
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
  }, [eventId])

  const triggerNewPhotoArrival = useCallback(() => {
    setIsNewArrival(true)
    if (newArrivalTimerRef.current) {
      window.clearTimeout(newArrivalTimerRef.current)
    }
    newArrivalTimerRef.current = window.setTimeout(() => {
      setIsNewArrival(false)
      newArrivalTimerRef.current = null
    }, NEW_ARRIVAL_DURATION_MS)
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
        storeScreenCredential(eventId, screenToken, result.event)
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
        scheduleFallbackPoll(SYNC_POLL_INTERVAL_MS)
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
          // Ignore parse error
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
          // Ignore parse error
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
          // Ignore parse error
        }
      })

      eventSource.addEventListener('pin:change', (e: MessageEvent) => {
        if (!isActive) return
        try {
          const { pin: nextPin } = JSON.parse(e.data) as { pin: string | null }
          setPin(nextPin)
        } catch {
          // Ignore parse error
        }
      })

      eventSource.onerror = () => {
        if (!isActive) return
        setIsLiveStreamConnected(false)
        scheduleFallbackPoll(FAST_POLL_INTERVAL_MS)
      }
    } else {
      scheduleFallbackPoll(FAST_POLL_INTERVAL_MS)
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
    }, ROTATE_INTERVAL_MS)

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

export default useEventScreen
