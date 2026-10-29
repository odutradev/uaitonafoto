export interface PresetResponse {
  receiverName: string
  createdAt: string
  updatedAt: string
  adminId: string
  bank: string
  pix: string
  id: string
}

export type ListPresetsResponse = PresetResponse[]

export interface CreatePresetRequest {
  receiverName: string
  bank: string
  pix: string
}

export interface UpdatePresetRequest {
  receiverName?: string
  bank?: string
  pix?: string
}