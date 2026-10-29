import api from '@services/api'

import type { ListPresetsResponse, CreatePresetRequest, UpdatePresetRequest, PresetResponse } from './types'

export const getPresets = async (): Promise<ListPresetsResponse> => {
  const response = await api.get<ListPresetsResponse>('/presets')
  return response.data
}

export const createPreset = async (payload: CreatePresetRequest): Promise<PresetResponse> => {
  const response = await api.post<PresetResponse>('/presets', payload)
  return response.data
}

export const updatePreset = async (id: string, payload: UpdatePresetRequest): Promise<PresetResponse> => {
  const response = await api.patch<PresetResponse>(`/presets/${id}`, payload)
  return response.data
}

export const deletePreset = async (id: string): Promise<void> => {
  await api.delete(`/presets/${id}`)
}
