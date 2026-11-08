import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { deleteEventPhoto, getEventAlbum, getEventGuests } from '@actions/events'
import { getErrorMessage } from '@config/events'

import type { EventGuest, EventPhoto, PaginationMeta } from '@actions/events/types'

const ALBUM_PAGE_SIZE = 24

const useEventAlbum = (eventId: string, isAvailable: boolean) => {
  const [photos, setPhotos] = useState<EventPhoto[]>([])
  const [guests, setGuests] = useState<EventGuest[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [page, setPage] = useState(1)
  const [guestId, setGuestId] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const load = useCallback(async () => {
    if (!isAvailable) return
    setIsLoading(true)
    try {
      const result = await getEventAlbum(eventId, { page, limit: ALBUM_PAGE_SIZE, guestId: guestId || undefined })
      setPhotos(result.data)
      setMeta(result.meta)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível carregar o álbum.'))
    } finally {
      setIsLoading(false)
    }
  }, [eventId, isAvailable, page, guestId])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    getEventGuests(eventId).then(setGuests).catch(() => undefined)
  }, [eventId])

  const changeGuest = (nextGuestId: string) => {
    setPage(1)
    setGuestId(nextGuestId)
  }

  const removePhoto = async (photoId: string) => {
    try {
      await deleteEventPhoto(eventId, photoId)
      await load()
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível remover a foto.'))
    }
  }

  return { photos, guests, meta, page, guestId, isLoading, setPage, changeGuest, removePhoto }
}

export default useEventAlbum
