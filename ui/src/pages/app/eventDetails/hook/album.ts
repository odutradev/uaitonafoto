import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import {
  approveAllEventPhotos,
  approveEventPhoto,
  deleteEventPhoto,
  getEventAlbum,
  getEventGuests,
  rejectEventPhoto
} from '@actions/events'
import { buildRoomStreamUrl } from '@utils/api/guest'

import type { EventGuest, EventPhoto, PaginationMeta } from '@utils/types/events'
import useAction from '@hooks/useAction'

const ALBUM_PAGE_SIZE = 24

export type AlbumStatusFilter = 'all' | 'pending' | 'approved' | 'rejected'

const useEventAlbum = (eventId: string, isModerationEnabled = false) => {
  const runAction = useAction()
  const [photos, setPhotos] = useState<EventPhoto[]>([])
  const [guests, setGuests] = useState<EventGuest[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [page, setPage] = useState(1)
  const [guestId, setGuestId] = useState('')
  const [statusFilter, setStatusFilter] = useState<AlbumStatusFilter>(() =>
    isModerationEnabled ? 'pending' : 'all'
  )
  const [pendingCount, setPendingCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const load = useCallback(async () => {
    setIsLoading(true)
    await runAction({
      action: async () => {
        const result = await getEventAlbum(eventId, {
          page,
          limit: ALBUM_PAGE_SIZE,
          guestId: guestId || undefined,
          status: statusFilter
        })
        setPhotos(result.data)
        setMeta(result.meta)
      },
      toastMessages: { error: 'Não foi possível carregar o álbum.' }
    })
    setIsLoading(false)
  }, [eventId, page, guestId, statusFilter, runAction])

  const refreshPendingCount = useCallback(async () => {
    if (!isModerationEnabled) return
    try {
      const pendingResult = await getEventAlbum(eventId, {
        page: 1,
        limit: 1,
        status: 'pending'
      })
      setPendingCount(pendingResult.meta.total)
    } catch {
    }
  }, [eventId, isModerationEnabled])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    refreshPendingCount()
  }, [refreshPendingCount])

  useEffect(() => {
    getEventGuests(eventId).then(setGuests).catch(() => undefined)
  }, [eventId])

  useEffect(() => {
    if (!eventId || typeof window === 'undefined' || !('EventSource' in window)) return undefined

    let isActive = true
    const streamUrl = buildRoomStreamUrl(eventId)
    const eventSource = new EventSource(streamUrl)

    eventSource.addEventListener('photo:pending', (e: MessageEvent) => {
      if (!isActive) return
      try {
        const photo = JSON.parse(e.data) as EventPhoto
        if (!photo?.id) return

        setPendingCount((prev) => prev + 1)
        toast.info(`Nova foto enviada por ${photo.guestName} para moderação.`)

        if (statusFilter === 'pending' || statusFilter === 'all') {
          setPhotos((current) => {
            if (current.some((p) => p.id === photo.id)) return current
            return [photo, ...current]
          })
        }
      } catch {
      }
    })

    eventSource.addEventListener('photo:moderated', (e: MessageEvent) => {
      if (!isActive) return
      try {
        const data = JSON.parse(e.data) as { photoId: string; status: 'approved' | 'rejected' }
        if (!data?.photoId) return

        refreshPendingCount()

        setPhotos((current) => {
          if (statusFilter === 'pending') {
            return current.filter((p) => p.id !== data.photoId)
          }
          return current.map((p) =>
            p.id === data.photoId ? { ...p, status: data.status } : p
          )
        })
      } catch {
      }
    })

    eventSource.addEventListener('photo:delete', (e: MessageEvent) => {
      if (!isActive) return
      try {
        const data = JSON.parse(e.data) as { photoId: string }
        if (!data?.photoId) return
        setPhotos((current) => current.filter((p) => p.id !== data.photoId))
        refreshPendingCount()
      } catch {
      }
    })

    return () => {
      isActive = false
      eventSource.close()
    }
  }, [eventId, statusFilter, refreshPendingCount])

  const changeGuest = (nextGuestId: string) => {
    setPage(1)
    setGuestId(nextGuestId)
  }

  const changeStatusFilter = (nextFilter: AlbumStatusFilter) => {
    setPage(1)
    setStatusFilter(nextFilter)
  }

  const removePhoto = async (photoId: string) => {
    await runAction({
      action: () => deleteEventPhoto(eventId, photoId),
      toastMessages: { success: 'Foto removida com sucesso.', error: 'Não foi possível remover a foto.' },
      callback: () => {
        setPhotos((current) => current.filter((p) => p.id !== photoId))
        refreshPendingCount()
      }
    })
  }

  const approvePhoto = async (photoId: string) => {
    await runAction({
      action: () => approveEventPhoto(eventId, photoId),
      toastMessages: { success: 'Foto aprovada e enviada para o telão!', error: 'Não foi possível aprovar a foto.' },
      callback: () => {
        if (statusFilter === 'pending') {
          setPhotos((current) => current.filter((p) => p.id !== photoId))
        } else {
          setPhotos((current) =>
            current.map((p) => (p.id === photoId ? { ...p, status: 'approved' } : p))
          )
        }
        setPendingCount((prev) => Math.max(0, prev - 1))
      }
    })
  }

  const rejectPhoto = async (photoId: string) => {
    await runAction({
      action: () => rejectEventPhoto(eventId, photoId),
      toastMessages: { error: 'Não foi possível rejeitar a foto.' },
      callback: () => {
        toast.info('Foto rejeitada.')
        if (statusFilter === 'pending') {
          setPhotos((current) => current.filter((p) => p.id !== photoId))
        } else {
          setPhotos((current) =>
            current.map((p) => (p.id === photoId ? { ...p, status: 'rejected' } : p))
          )
        }
        setPendingCount((prev) => Math.max(0, prev - 1))
      }
    })
  }

  const approveAll = async () => {
    await runAction({
      action: () => approveAllEventPhotos(eventId),
      toastMessages: { error: 'Não foi possível aprovar todas as fotos.' },
      callback: (res) => {
        toast.success(`${res.approvedCount} ${res.approvedCount === 1 ? 'foto aprovada' : 'fotos aprovadas'} com sucesso!`)
        setPendingCount(0)
        load()
      }
    })
  }

  return {
    photos,
    guests,
    meta,
    page,
    guestId,
    statusFilter,
    pendingCount,
    isLoading,
    setPage,
    changeGuest,
    changeStatusFilter,
    removePhoto,
    approvePhoto,
    rejectPhoto,
    approveAll,
    refresh: load
  }
}

export default useEventAlbum
