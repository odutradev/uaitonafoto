export interface LotteryItemResponse {
  type: string
  name: string
  color: string
  contestNumber: number
  nextContestNumber: number
  drawDate: string | null
  estimatedPrize: number
  accumulatedPrize: number
  isAccumulated: boolean
  lastDrawnNumbers?: string[]
}

export type ListLotteriesResponse = LotteryItemResponse[]
