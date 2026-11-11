import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { deleteGuestPhoto, getGuestEvent, getGuestFeed, getGuestSession, joinEvent, toggleGuestPhotoLike, uploadGuestPhoto } from '@actions/guest'
import { buildRoomStreamUrl, clearGuestToken, getStoredGuestToken, storeGuestToken } from '@utils/api/guest'
import usePinLockout from '@hooks/usePinLockout'
import useAction from '@hooks/useAction'

import type { PaginationMeta } from '@utils/types/events'
import type { GuestEventInfo, GuestPhoto, GuestProfile } from '@utils/types/guest'
import type { UseGuestEventPageReturn } from './types'
import createPageContext from '@utils/functions/createPageContext'

const FEED_PAGE_SIZE = 24

const useGuestEventPageState = (): UseGuestEventPageReturn => {
  const { token: eventToken = '' } = useParams()
  const runAction = useAction()
  const lockout = usePinLockout({ scope: 'guest', targetId: eventToken })
  const [event, setEvent] = useState<GuestEventInfo | null>(null)
  const [guest, setGuest] = useState<GuestProfile | null>(null)
  const [guestToken, setGuestToken] = useState<string | null>(() => getStoredGuestToken(eventToken))
  const [photosSent, setPhotosSent] = useState(0)
  const [completedChallengeIds, setCompletedChallengeIds] = useState<string[]>([])
  const [photos, setPhotos] = useState<GuestPhoto[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const loadFeed = useCallback(
    async (sessionToken: string, targetPage = page) => {
      try {
        const result = await getGuestFeed(sessionToken, { page: targetPage, limit: FEED_PAGE_SIZE })
        setPhotos(result.data)
        setMeta(result.meta)
      } catch {
        setPhotos([])
        setMeta(null)
      }
    },
    [page]
  )

  useEffect(() => {
    let isActive = true

    const init = async () => {
      setIsLoading(true)
      const storedToken = getStoredGuestToken(eventToken)

      if (storedToken) {
        try {
          const session = await getGuestSession(storedToken)
          if (!isActive) return
          setGuest(session.guest)
          setEvent(session.event)
          setPhotosSent(session.photosSent)
          setCompletedChallengeIds(session.completedChallengeIds ?? [])
          setGuestToken(storedToken)
          await loadFeed(storedToken, 1)
          setIsLoading(false)
          return
        } catch {
          clearGuestToken(eventToken)
          if (isActive) setGuestToken(null)
        }
      }

      try {
        const info = await getGuestEvent(eventToken)
        if (isActive) setEvent(info)
      } catch {
        if (isActive) setNotFound(true)
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    init()
    return () => {
      isActive = false
    }
  }, [eventToken, loadFeed])

  useEffect(() => {
    if (guestToken) loadFeed(guestToken, page)
  }, [guestToken, page, loadFeed])

  useEffect(() => {
    if (!guestToken || !eventToken) return undefined

    let isActive = true
    let eventSource: EventSource | null = null

    if (typeof window !== 'undefined' && 'EventSource' in window) {
      const streamUrl = buildRoomStreamUrl(eventToken, guestToken)
      eventSource = new EventSource(streamUrl)

      eventSource.addEventListener('photo:new', (e: MessageEvent) => {
        if (!isActive) return
        try {
          const photo = JSON.parse(e.data) as GuestPhoto
          if (!photo?.id) return

          setPhotos((current) => {
            if (current.some((p) => p.id === photo.id)) return current
            if (page === 1) {
              const adaptedPhoto: GuestPhoto = {
                ...photo,
                mine: photo.guestName === guest?.name
              }
              return [adaptedPhoto, ...current].slice(0, FEED_PAGE_SIZE)
            }
            return current
          })

          setMeta((prev) => {
            if (!prev) return null
            const total = prev.total + 1
            return {
              ...prev,
              total,
              totalPages: Math.ceil(total / FEED_PAGE_SIZE)
            }
          })
        } catch {
        }
      })

      eventSource.addEventListener('photo:delete', (e: MessageEvent) => {
        if (!isActive) return
        try {
          const { photoId } = JSON.parse(e.data) as { photoId: string }
          if (!photoId) return

          setPhotos((current) => current.filter((p) => p.id !== photoId))
          setMeta((prev) => {
            if (!prev) return null
            const total = Math.max(0, prev.total - 1)
            return {
              ...prev,
              total,
              totalPages: Math.max(1, Math.ceil(total / FEED_PAGE_SIZE))
            }
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

      eventSource.addEventListener('lockout:reset', () => {
        if (!isActive) return
        lockout.resetLockout()
      })
    }

    return () => {
      isActive = false
      if (eventSource) eventSource.close()
    }
  }, [guestToken, eventToken, page, guest?.name])

  const join = async (name: string, pin?: string) => {
    if (lockout.isLocked) return
    await runAction({
      action: () => joinEvent(eventToken, name, pin),
      toastMessages: { error: 'Não foi possível entrar no evento.' },
      onError: (error) => lockout.recordFailure(error),
      callback: (response) => {
        lockout.resetLockout()
        storeGuestToken(eventToken, response.guestToken)
        setGuestToken(response.guestToken)
        setGuest(response.guest)
        setEvent(response.event)
        setPhotosSent(0)
        setCompletedChallengeIds(response.completedChallengeIds ?? [])
      }
    })
  }

  const upload = async (file: File, challengeId?: string, challengeTitle?: string) => {
    if (!guestToken) return
    setIsUploading(true)
    await runAction({
      action: async () => {
        await uploadGuestPhoto(guestToken, file, challengeId, challengeTitle)
        setPhotosSent((count) => count + 1)
        if (challengeId) {
          setCompletedChallengeIds((prev) => (prev.includes(challengeId) ? prev : [...prev, challengeId]))
        }
        setPage(1)
        await loadFeed(guestToken, 1)
      },
      toastMessages: {
        success: challengeTitle ? `Desafio "${challengeTitle}" cumprido! Foto enviada!` : 'Foto enviada!',
        error: 'Não foi possível enviar a foto.'
      }
    })
    setIsUploading(false)
  }

  const toggleLike = async (photoId: string) => {
    if (!guestToken) return
    await runAction({
      action: () => toggleGuestPhotoLike(guestToken, photoId),
      toastMessages: { error: 'Não foi possível registrar a curtida.' },
      callback: (result) =>
        setPhotos((items) =>
          items.map((item) =>
            item.id === photoId ? { ...item, likedByMe: result.liked, likesCount: result.likesCount } : item
          )
        )
    })
  }

  const removePhoto = async (photoId: string) => {
    if (!guestToken) return
    await runAction({
      action: async () => {
        await deleteGuestPhoto(guestToken, photoId)
        setPhotosSent((count) => Math.max(0, count - 1))
        await loadFeed(guestToken, page)
      },
      toastMessages: { success: 'Foto excluída.', error: 'Não foi possível excluir a foto.' }
    })
  }

  return {
    event,
    guest,
    photosSent,
    completedChallengeIds,
    photos,
    meta,
    page,
    isLoading,
    isUploading,
    notFound,
    lockout,
    setPage,
    join,
    upload,
    toggleLike,
    removePhoto
  }
}

const { PageProvider: GuestEventPageProvider, usePage: useGuestEventPage } = createPageContext(
  useGuestEventPageState,
  'useGuestEventPage'
)

export { GuestEventPageProvider }
export default useGuestEventPage
