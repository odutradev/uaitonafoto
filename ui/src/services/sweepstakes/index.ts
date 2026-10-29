import api from '@services/api'

import type { UpdateParticipationRequest, AddManualParticipationRequest, ListSweepstakesResponse, SweepstakeDetailsResponse, CreateSweepstakeRequest, UpdateSweepstakeRequest, ParticipationResponse, JoinSweepstakeRequest, SweepstakeResponse, SetGamesRequest, SetResultRequest } from './types'

export const getSweepstakes = async (userId?: string): Promise<ListSweepstakesResponse> => {
  const response = await api.get<ListSweepstakesResponse>('/sweepstakes', {
    params: userId ? { userId } : undefined
  })
  return response.data
}

export const createSweepstake = async (payload: CreateSweepstakeRequest): Promise<SweepstakeResponse> => {
  const response = await api.post<SweepstakeResponse>('/sweepstakes', payload)
  return response.data
}

export const updateSweepstake = async (id: string, payload: UpdateSweepstakeRequest): Promise<SweepstakeResponse> => {
  const response = await api.patch<SweepstakeResponse>(`/sweepstakes/${id}`, payload)
  return response.data
}

export const deleteSweepstake = async (id: string): Promise<void> => {
  await api.delete(`/sweepstakes/${id}`)
}

export const getSweepstakeDetails = async (id: string): Promise<SweepstakeDetailsResponse> => {
  const response = await api.get<SweepstakeDetailsResponse>(`/sweepstakes/${id}/details`)
  return response.data
}

export const joinSweepstake = async (id: string, payload: JoinSweepstakeRequest): Promise<void> => {
  const formData = new FormData()
  formData.append('receipt', payload.receipt)
  if (payload.quotaCount) formData.append('quotaCount', String(payload.quotaCount))
  if (payload.suggestedNumbers && payload.suggestedNumbers.length > 0) {
    formData.append('suggestedNumbers', JSON.stringify(payload.suggestedNumbers))
  }
  await api.post(`/sweepstakes/${id}/join`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const addManualParticipation = async (id: string, payload: AddManualParticipationRequest): Promise<ParticipationResponse> => {
  const response = await api.post<ParticipationResponse>(`/sweepstakes/${id}/participations/manual`, payload)
  return response.data
}

export const updateParticipation = async (sweepstakeId: string, participationId: string, payload: UpdateParticipationRequest): Promise<ParticipationResponse> => {
  const response = await api.patch<ParticipationResponse>(`/sweepstakes/${sweepstakeId}/participations/${participationId}`, payload)
  return response.data
}

export const deleteParticipation = async (sweepstakeId: string, participationId: string): Promise<void> => {
  await api.delete(`/sweepstakes/${sweepstakeId}/participations/${participationId}`)
}

export const setSweepstakeGames = async (id: string, payload: SetGamesRequest): Promise<SweepstakeResponse> => {
  const response = await api.patch<SweepstakeResponse>(`/sweepstakes/${id}/games`, payload)
  return response.data
}

export const setSweepstakeResult = async (id: string, payload: SetResultRequest): Promise<SweepstakeResponse> => {
  const response = await api.patch<SweepstakeResponse>(`/sweepstakes/${id}/result`, payload)
  return response.data
}

export const sendParticipationResultEmail = async (sweepstakeId: string, participationId: string): Promise<ParticipationResponse> => {
  const response = await api.post<ParticipationResponse>(`/sweepstakes/${sweepstakeId}/participations/${participationId}/send-result-email`)
  return response.data
}
