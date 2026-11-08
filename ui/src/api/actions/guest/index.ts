import guestApi, { withGuestToken } from './client'
import type { Paginated, PaginationParams } from '@actions/events/types'
import type { GuestEventInfo, GuestPhoto, GuestSession, JoinEventResponse, LikeResult } from './types'

export const getGuestEvent = async (eventToken: string): Promise<GuestEventInfo> => {
  const response = await guestApi.get<GuestEventInfo>(`/guest/events/${eventToken}`)
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
  const response = await guestApi.get<GuestSession>('/guest/me', withGuestToken(guestToken))
  return response.data
}

export const uploadGuestPhoto = async (guestToken: string, file: File): Promise<GuestPhoto> => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await guestApi.post<GuestPhoto>('/guest/photos', formData, withGuestToken(guestToken))
  return response.data
}

export const getGuestFeed = async (guestToken: string, params?: PaginationParams): Promise<Paginated<GuestPhoto>> => {
  const response = await guestApi.get<Paginated<GuestPhoto>>('/guest/feed', { ...withGuestToken(guestToken), params })
  return response.data
}

export const toggleGuestPhotoLike = async (guestToken: string, photoId: string): Promise<LikeResult> => {
  const response = await guestApi.post<LikeResult>(`/guest/photos/${photoId}/like`, undefined, withGuestToken(guestToken))
  return response.data
}

export const deleteGuestPhoto = async (guestToken: string, photoId: string): Promise<GuestPhoto> => {
  const response = await guestApi.delete<GuestPhoto>(`/guest/photos/${photoId}`, withGuestToken(guestToken))
  return response.data
}
