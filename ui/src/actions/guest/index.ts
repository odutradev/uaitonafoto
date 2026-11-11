import guestApi, { withGuestToken } from '@utils/api/guest'
import type { Paginated, PaginationParams } from '@utils/types/events'
import type { GuestEventInfo, GuestPhoto, GuestSession, JoinEventResponse, LikeResult } from '@utils/types/guest'

export const getGuestEvent = async (eventToken: string): Promise<GuestEventInfo> => {
  const response = await guestApi.get<GuestEventInfo>(`/guest/events/${eventToken}/details`)
  return response.data
}

export const joinEvent = async (eventToken: string, name: string, pin?: string): Promise<JoinEventResponse> => {
  const response = await guestApi.post<JoinEventResponse>(`/guest/events/${eventToken}/join`, {
    name,
    ...(pin ? { pin } : {})
  })
  return response.data
}

export const getGuestSession = async (guestToken: string): Promise<GuestSession> => {
  const response = await guestApi.get<GuestSession>('/guest/me/details', withGuestToken(guestToken))
  return response.data
}

export const uploadGuestPhoto = async (
  guestToken: string,
  file: File,
  challengeId?: string,
  challengeTitle?: string,
  focalY?: number
): Promise<GuestPhoto> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('capturedAt', (file.lastModified || Date.now()).toString())
  if (challengeId) {
    formData.append('challengeId', challengeId)
  }
  if (challengeTitle) {
    formData.append('challengeTitle', challengeTitle)
  }
  if (typeof focalY === 'number') {
    formData.append('focalY', Math.round(focalY).toString())
  }
  const response = await guestApi.post<GuestPhoto>('/guest/photos/upload', formData, withGuestToken(guestToken))
  return response.data
}

export const getGuestFeed = async (guestToken: string, params?: PaginationParams): Promise<Paginated<GuestPhoto>> => {
  const response = await guestApi.get<Paginated<GuestPhoto>>('/guest/feed/list', { ...withGuestToken(guestToken), params })
  return response.data
}

export const toggleGuestPhotoLike = async (guestToken: string, photoId: string): Promise<LikeResult> => {
  const response = await guestApi.post<LikeResult>(`/guest/photos/${photoId}/like`, undefined, withGuestToken(guestToken))
  return response.data
}

export const deleteGuestPhoto = async (guestToken: string, photoId: string): Promise<GuestPhoto> => {
  const response = await guestApi.delete<GuestPhoto>(`/guest/photos/${photoId}/remove`, withGuestToken(guestToken))
  return response.data
}
