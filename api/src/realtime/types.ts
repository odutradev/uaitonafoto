import type { Request, Response } from 'express'

export interface RealtimeClient {
  id: string
  res: Response
  pingTimer: NodeJS.Timeout
}

export type RealtimeRoom = Set<RealtimeClient>

export interface SubscribeRealtimeParams {
  eventId: string
  req: Request
  res: Response
}

export interface RealtimeStats {
  totalRooms: number
  totalClients: number
}
