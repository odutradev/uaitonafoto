import api from '@interceptor'
import screenApi, { withScreenToken } from './screenClient'
import type {
  ActivateScreenResponse,
  AlbumParams,
  CreateEventPayload,
  EventGuest,
  EventItem,
  EventPhoto,
  EventScreenSlot,
  Paginated,
  PaginationParams,
  ResetLockoutsResponse,
  ScreenParams,
  ScreenResponse,
  TeamMember,
  UpdateEventPayload
} from './types'

export const createEvent = async (payload: CreateEventPayload): Promise<EventItem> => {
  const response = await api.post<EventItem>('/events', payload)
  return response.data
}

export const getMyEvents = async (params?: PaginationParams): Promise<Paginated<EventItem>> => {
  const response = await api.get<Paginated<EventItem>>('/events', { params })
  return response.data
}

export const getEvent = async (id: string): Promise<EventItem> => {
  const response = await api.get<EventItem>(`/events/${id}`)
  return response.data
}

export const updateEvent = async (id: string, payload: UpdateEventPayload): Promise<EventItem> => {
  const response = await api.put<EventItem>(`/events/${id}`, payload)
  return response.data
}

export const deleteEvent = async (id: string): Promise<EventItem> => {
  const response = await api.delete<EventItem>(`/events/${id}`)
  return response.data
}

export const startEvent = async (id: string): Promise<EventItem> => {
  const response = await api.post<EventItem>(`/events/${id}/start`)
  return response.data
}

export const closeEvent = async (id: string): Promise<EventItem> => {
  const response = await api.post<EventItem>(`/events/${id}/close`)
  return response.data
}

export const reopenEvent = async (id: string): Promise<EventItem> => {
  const response = await api.post<EventItem>(`/events/${id}/reopen`)
  return response.data
}

export const getEventTeam = async (id: string): Promise<TeamMember[]> => {
  const response = await api.get<TeamMember[]>(`/events/${id}/team`)
  return response.data
}

export const addOrganizer = async (id: string, email: string): Promise<TeamMember[]> => {
  const response = await api.post<TeamMember[]>(`/events/${id}/team`, { email })
  return response.data
}

export const removeTeamMember = async (id: string, userId: string): Promise<TeamMember[]> => {
  const response = await api.delete<TeamMember[]>(`/events/${id}/team/${userId}`)
  return response.data
}

export const getEventGuests = async (id: string): Promise<EventGuest[]> => {
  const response = await api.get<EventGuest[]>(`/events/${id}/guests`)
  return response.data
}

export const activateEventScreen = async (id: string, pin: string): Promise<ActivateScreenResponse> => {
  const response = await screenApi.post<ActivateScreenResponse>(`/events/${id}/screen/activate`, { pin })
  return response.data
}

export const getEventScreen = async (
  id: string,
  screenToken: string,
  params?: ScreenParams
): Promise<ScreenResponse> => {
  const response = await screenApi.get<ScreenResponse>(`/events/${id}/screen`, {
    ...withScreenToken(screenToken),
    params
  })
  return response.data
}

export const createEventScreen = async (id: string, name?: string): Promise<EventScreenSlot[]> => {
  const response = await api.post<EventScreenSlot[]>(`/events/${id}/screens`, {
    ...(name?.trim() ? { name: name.trim() } : {})
  })
  return response.data
}

export const removeEventScreen = async (id: string, screenId: string): Promise<EventScreenSlot[]> => {
  const response = await api.delete<EventScreenSlot[]>(`/events/${id}/screens/${screenId}`)
  return response.data
}

export const updateEventScreen = async (id: string, screenId: string, name?: string): Promise<EventScreenSlot[]> => {
  const response = await api.patch<EventScreenSlot[]>(`/events/${id}/screens/${screenId}`, {
    ...(name?.trim() ? { name: name.trim() } : { name: '' })
  })
  return response.data
}

export const getEventAlbum = async (id: string, params?: AlbumParams): Promise<Paginated<EventPhoto>> => {
  const response = await api.get<Paginated<EventPhoto>>(`/events/${id}/album`, { params })
  return response.data
}

export const deleteEventPhoto = async (id: string, photoId: string): Promise<EventPhoto> => {
  const response = await api.delete<EventPhoto>(`/events/${id}/photos/${photoId}`)
  return response.data
}

export const resetEventLockouts = async (
  id: string,
  scope: 'all' | 'screen' | 'guest' = 'all'
): Promise<ResetLockoutsResponse> => {
  const response = await api.post<ResetLockoutsResponse>(`/events/${id}/lockout/reset`, { scope })
  return response.data
}
