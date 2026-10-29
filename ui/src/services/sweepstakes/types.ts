export interface ResultSyncAttempt {
  attemptNumber: number
  timestamp: string
  success: boolean
  message?: string
  drawnNumbers?: number[]
}

export interface ResultSyncLog {
  status: 'pending' | 'success' | 'failed'
  attemptsCount: number
  maxAttempts: number
  lastAttemptAt?: string
  nextAttemptAt?: string
  successAt?: string
  attempts: ResultSyncAttempt[]
}

export interface SweepstakeResponse {
  purchaseLimitDate: string
  availableQuotas: number
  description: string
  prizeValue: number
  quotaPrice: number
  games?: number[][]
  result?: number[]
  createdAt: string
  updatedAt: string
  presetId: string
  drawDate: string
  adminId: string
  title: string
  id: string
  contestNumber?: number
  lotteryType?: string
  resultSyncLog?: ResultSyncLog
  metadata: {
    filledQuotas: number
  }
  userParticipation?: {
    isParticipant: boolean
    quotaCount: number
    joinedAt: string | null
  }
}

export type ListSweepstakesResponse = SweepstakeResponse[]

export interface CreateSweepstakeRequest {
  purchaseLimitDate: string
  availableQuotas: number
  description: string
  prizeValue: number
  quotaPrice: number
  presetId: string
  drawDate: string
  title: string
  contestNumber?: number
  lotteryType?: string
}

export interface UpdateSweepstakeRequest {
  purchaseLimitDate?: string
  availableQuotas?: number
  description?: string
  prizeValue?: number
  quotaPrice?: number
  presetId?: string
  drawDate?: string
  title?: string
  contestNumber?: number
  lotteryType?: string
}

export interface SetGamesRequest {
  games: number[][]
}

export interface SetResultRequest {
  result: number[]
}

export interface ParticipationResponse {
  userDepartment: string
  sweepstakeId: string
  receiptUrl: string
  createdAt: string
  userPhone: string
  userName: string
  userId: string
  id: string
  quotaCount?: number
  suggestedNumbers?: number[]
  userPhotoUrl?: string
  resultEmailSent?: boolean
  resultEmailSentAt?: string
}

export interface UpdateParticipationRequest {
  quotaCount?: number
  userName?: string
  userDepartment?: string
  userPhone?: string
  suggestedNumbers?: number[]
}

export interface SweepstakeDetailsResponse extends SweepstakeResponse {
  participations: ParticipationResponse[]
}

export interface JoinSweepstakeRequest {
  receipt: File
  quotaCount?: number
  suggestedNumbers?: number[]
}

export interface AddManualParticipationRequest {
  email: string
  quotaCount?: number
  suggestedNumbers?: number[]
}