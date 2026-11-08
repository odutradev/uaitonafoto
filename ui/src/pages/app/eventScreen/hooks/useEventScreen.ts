import { useEffect, useRef, useState } from 'react'

import { getEvent, getEventScreen } from '@actions/events'
import { getErrorMessage } from '@config/events'

import type { EventItem, EventPhoto } from '@actions/events/types'

const POLL_INTERVAL_MS = 5000
const ROTATE_INTERVAL_MS = 6000

const useEventScreen = (eventId: string) => {
  const [event, setEvent] = useState<EventItem | null>(null)
  const [photos, setPhotos] = useState<EventPhoto[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const cursorRef = useRef<string | undefined>(undefined)
  const seenIdsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    getEvent(eventId).then(setEvent).catch((error) => setMessage(getErrorMessage(error, 'Evento não encontrado.')))
  }, [eventId])

  useEffect(() => {
    let isActive = true

    const poll = async () => {
      try {
        const result = await getEventScreen(eventId, { since: cursorRef.current, limit: 100 })
        if (!isActive) return

        cursorRef.current = result.nextSince
        setMessage(null)

        const fresh = result.photos.filter((photo) => !seenIdsRef.current.has(photo.id))
        if (fresh.length === 0) return

        fresh.forEach((photo) => seenIdsRef.current.add(photo.id))
        setPhotos((current) => {
          if (current.length > 0) setCurrentIndex(current.length)
          return [...current, ...fresh]
        })
      } catch (error) {
        if (isActive) setMessage(getErrorMessage(error, 'Não foi possível atualizar o telão.'))
      }
    }

    poll()
    const intervalId = window.setInterval(poll, POLL_INTERVAL_MS)

    return () => {
      isActive = false
      window.clearInterval(intervalId)
    }
  }, [eventId])

  useEffect(() => {
    if (photos.length < 2) return undefined

    const intervalId = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % photos.length)
    }, ROTATE_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [photos.length, currentIndex])

  return { event, currentPhoto: photos[currentIndex], photosCount: photos.length, message }
}

export default useEventScreen
