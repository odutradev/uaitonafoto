import { useCallback, useEffect, useRef, useState } from 'react'

import { activateEventScreen, getEventScreen } from '@actions/events'
import {
  clearScreenCredential,
  getStoredScreenEvent,
  getStoredScreenToken,
  storeScreenCredential
} from '@actions/events/screenClient'
import { getErrorMessage } from '@config/events'

import type { EventPhoto, ScreenEventInfo } from '@actions/events/types'

const POLL_INTERVAL_MS = 5000
const ROTATE_INTERVAL_MS = 6000

const useEventScreen = (eventId: string) => {
  const [screenToken, setScreenToken] = useState<string | null>(() => getStoredScreenToken(eventId))
  const [event, setEvent] = useState<ScreenEventInfo | null>(() => getStoredScreenEvent(eventId))
  const [pin, setPin] = useState<string | null>(null)
  const [photos, setPhotos] = useState<EventPhoto[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const [activationError, setActivationError] = useState<string | null>(null)
  const [isActivating, setIsActivating] = useState(false)
  const cursorRef = useRef<string | undefined>(undefined)
  const seenIdsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    cursorRef.current = undefined
    seenIdsRef.current.clear()
    setPhotos([])
    setCurrentIndex(0)
    setMessage(null)
    setActivationError(null)
    setScreenToken(getStoredScreenToken(eventId))
    setEvent(getStoredScreenEvent(eventId))
  }, [eventId])

  const activate = useCallback(
    async (inputPin: string) => {
      setIsActivating(true)
      setActivationError(null)
      try {
        const result = await activateEventScreen(eventId, inputPin)
        storeScreenCredential(eventId, result.screenToken, result.event)
        setScreenToken(result.screenToken)
        setEvent(result.event)
        setPin(result.pin)
      } catch (error) {
        setActivationError(getErrorMessage(error, 'Não foi possível ativar o telão.'))
      } finally {
        setIsActivating(false)
      }
    },
    [eventId]
  )

  useEffect(() => {
    if (!screenToken) return undefined

    let isActive = true

    const poll = async () => {
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
          setActivationError('Este telão foi desconectado ou sua credencial expirou. Informe um novo PIN.')
          return
        }
        setMessage(getErrorMessage(error, 'Não foi possível atualizar o telão.'))
      }
    }

    poll()
    const intervalId = window.setInterval(poll, POLL_INTERVAL_MS)

    return () => {
      isActive = false
      window.clearInterval(intervalId)
    }
  }, [eventId, screenToken])

  useEffect(() => {
    if (photos.length < 2) return undefined

    const intervalId = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % photos.length)
    }, ROTATE_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [photos.length, currentIndex])

  return {
    isActivated: Boolean(screenToken),
    isActivating,
    activationError,
    activate,
    event,
    pin,
    currentPhoto: photos[currentIndex],
    photosCount: photos.length,
    message
  }
}

export default useEventScreen
