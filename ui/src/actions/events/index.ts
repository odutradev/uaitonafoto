import api from '@utils/api'
import screenApi, { withScreenToken } from '@utils/api/screen'
import type {
  ActivateScreenResponse,
  AlbumParams,
  ApproveAllPhotosResponse,
  CreateEventPayload,
  EventChallenge,
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
} from '@utils/types/events'

export const createEvent = async (payload: CreateEventPayload): Promise<EventItem> => {
  const response = await api.post<EventItem>('/events/create', payload)
  return response.data
}

export const getMyEvents = async (params?: PaginationParams): Promise<Paginated<EventItem>> => {
  const response = await api.get<Paginated<EventItem>>('/events/list', { params })
  return response.data
}

export const getEvent = async (id: string): Promise<EventItem> => {
  const response = await api.get<EventItem>(`/events/${id}/details`)
  return response.data
}

export const updateEvent = async (id: string, payload: UpdateEventPayload): Promise<EventItem> => {
  const response = await api.put<EventItem>(`/events/${id}/update`, payload)
  return response.data
}

export const deleteEvent = async (id: string): Promise<EventItem> => {
  const response = await api.delete<EventItem>(`/events/${id}/remove`)
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
  const response = await api.get<TeamMember[]>(`/events/${id}/team/list`)
  return response.data
}

export const addOrganizer = async (id: string, email: string): Promise<TeamMember[]> => {
  const response = await api.post<TeamMember[]>(`/events/${id}/team/add`, { email })
  return response.data
}

export const removeTeamMember = async (id: string, userId: string): Promise<TeamMember[]> => {
  const response = await api.delete<TeamMember[]>(`/events/${id}/team/${userId}/remove`)
  return response.data
}

export const getEventGuests = async (id: string): Promise<EventGuest[]> => {
  const response = await api.get<EventGuest[]>(`/events/${id}/guests/list`)
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
  const response = await screenApi.get<ScreenResponse>(`/events/${id}/screen/details`, {
    ...withScreenToken(screenToken),
    params
  })
  return response.data
}

export const disconnectEventScreen = async (id: string, screenToken: string): Promise<void> => {
  await screenApi.post(`/events/${id}/screen/disconnect`, {}, withScreenToken(screenToken))
}

export const createEventScreen = async (id: string, name?: string): Promise<EventScreenSlot[]> => {
  const response = await api.post<EventScreenSlot[]>(`/events/${id}/screens/create`, {
    ...(name?.trim() ? { name: name.trim() } : {})
  })
  return response.data
}

export const removeEventScreen = async (id: string, screenId: string): Promise<EventScreenSlot[]> => {
  const response = await api.delete<EventScreenSlot[]>(`/events/${id}/screens/${screenId}/remove`)
  return response.data
}

export const updateEventScreen = async (id: string, screenId: string, name?: string): Promise<EventScreenSlot[]> => {
  const response = await api.patch<EventScreenSlot[]>(`/events/${id}/screens/${screenId}/update`, {
    ...(name?.trim() ? { name: name.trim() } : { name: '' })
  })
  return response.data
}

export const setEventScreenBlock = async (id: string, screenId: string, blocked: boolean): Promise<EventScreenSlot[]> => {
  const response = await api.patch<EventScreenSlot[]>(`/events/${id}/screens/${screenId}/block`, {
    blocked
  })
  return response.data
}

export const getEventAlbum = async (id: string, params?: AlbumParams): Promise<Paginated<EventPhoto>> => {
  const response = await api.get<Paginated<EventPhoto>>(`/events/${id}/album/list`, { params })
  return response.data
}

export const deleteEventPhoto = async (id: string, photoId: string): Promise<EventPhoto> => {
  const response = await api.delete<EventPhoto>(`/events/${id}/photos/${photoId}/remove`)
  return response.data
}

export const approveEventPhoto = async (id: string, photoId: string): Promise<EventPhoto> => {
  const response = await api.patch<EventPhoto>(`/events/${id}/photos/${photoId}/approve`)
  return response.data
}

export const rejectEventPhoto = async (id: string, photoId: string): Promise<EventPhoto> => {
  const response = await api.patch<EventPhoto>(`/events/${id}/photos/${photoId}/reject`)
  return response.data
}

export const approveAllEventPhotos = async (id: string): Promise<ApproveAllPhotosResponse> => {
  const response = await api.post<ApproveAllPhotosResponse>(`/events/${id}/photos/approve-all`)
  return response.data
}

export const resetEventLockouts = async (
  id: string,
  scope: 'all' | 'screen' | 'guest' = 'all'
): Promise<ResetLockoutsResponse> => {
  const response = await api.post<ResetLockoutsResponse>(`/events/${id}/lockout/reset`, { scope })
  return response.data
}

export const downloadEventAlbumZip = async (id: string): Promise<Blob> => {
  const response = await api.get<Blob>(`/events/${id}/album/download-zip`, {
    responseType: 'blob'
  })
  return response.data
}

export const getEventChallenges = async (id: string): Promise<EventChallenge[]> => {
  const response = await api.get<EventChallenge[]>(`/events/${id}/challenges/list`)
  return response.data
}

export const addEventChallenge = async (
  id: string,
  title: string,
  description?: string
): Promise<EventChallenge[]> => {
  const response = await api.post<EventChallenge[]>(`/events/${id}/challenges/create`, { title, description })
  return response.data
}

export const deleteEventChallenge = async (
  id: string,
  challengeId: string
): Promise<EventChallenge[]> => {
  const response = await api.delete<EventChallenge[]>(`/events/${id}/challenges/${challengeId}/remove`)
  return response.data
}

export const toggleEventChallenge = async (
  id: string,
  challengeId: string
): Promise<EventChallenge[]> => {
  const response = await api.patch<EventChallenge[]>(`/events/${id}/challenges/${challengeId}/toggle`)
  return response.data
}

export const resetEventChallenges = async (id: string): Promise<EventChallenge[]> => {
  const response = await api.post<EventChallenge[]>(`/events/${id}/challenges/reset`)
  return response.data
}

export const updateEventGuest = async (
  id: string,
  guestId: string,
  name: string
): Promise<EventGuest> => {
  const response = await api.patch<EventGuest>(`/events/${id}/guests/${guestId}/update`, { name })
  return response.data
}

export const setEventGuestBlock = async (
  id: string,
  guestId: string,
  blocked: boolean
): Promise<EventGuest> => {
  const response = await api.patch<EventGuest>(`/events/${id}/guests/${guestId}/block`, { blocked })
  return response.data
}

export const deleteEventGuest = async (id: string, guestId: string): Promise<void> => {
  await api.delete(`/events/${id}/guests/${guestId}/remove`)
}
