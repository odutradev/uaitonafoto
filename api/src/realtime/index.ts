import { randomUUID } from 'crypto'
import createLogger from '@utils/logger'

import type {
  RealtimeClient,
  RealtimeRoom,
  RealtimeStats,
  SubscribeRealtimeParams
} from './types'

const logger = createLogger('realtime')

const realtimeRooms = new Map<string, RealtimeRoom>()

const PING_INTERVAL_MS = 25000

export const subscribeRealtimeStream = ({
  eventId,
  req,
  res
}: SubscribeRealtimeParams): void => {
  if (res.headersSent) return

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no'
  })

  res.flushHeaders?.()

  const clientId = randomUUID()
  const pingTimer = setInterval(() => {
    if (!res.writableEnded) {
      res.write(': ping\n\n')
    }
  }, PING_INTERVAL_MS)

  pingTimer.unref()

  const client: RealtimeClient = { id: clientId, res, pingTimer }

  if (!realtimeRooms.has(eventId)) {
    realtimeRooms.set(eventId, new Set())
  }
  const room = realtimeRooms.get(eventId)!
  room.add(client)

  logger.info(`Client [${clientId}] subscribed to realtime stream [${eventId}] (room size: ${room.size})`)

  res.write(': connected\n\n')
  res.write(
    `event: ready\ndata: ${JSON.stringify({ eventId, timestamp: new Date().toISOString() })}\n\n`
  )

  const cleanup = () => {
    clearInterval(pingTimer)
    const currentRoom = realtimeRooms.get(eventId)
    if (currentRoom) {
      currentRoom.delete(client)
      if (currentRoom.size === 0) {
        realtimeRooms.delete(eventId)
      }
    }
    logger.info(`Client [${clientId}] disconnected from realtime stream [${eventId}]`)
  }

  req.on('close', cleanup)
  res.on('finish', cleanup)
}

export const broadcastRealtimeEvent = (
  eventId: string,
  eventName: string,
  data: unknown
): void => {
  const room = realtimeRooms.get(eventId)
  if (!room || room.size === 0) return

  const message = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`
  const staleClients: RealtimeClient[] = []

  for (const client of room) {
    if (client.res.writableEnded) {
      staleClients.push(client)
      continue
    }

    try {
      client.res.write(message)
    } catch (err) {
      logger.warn(`Failed to write to client [${client.id}] in event [${eventId}]:`, err)
      staleClients.push(client)
    }
  }

  for (const stale of staleClients) {
    clearInterval(stale.pingTimer)
    room.delete(stale)
  }

  if (room.size === 0) {
    realtimeRooms.delete(eventId)
  }
}

export const closeAllRealtimeStreams = (): void => {
  logger.info('Closing all active realtime streams...')
  const shutdownMessage = `event: close\ndata: ${JSON.stringify({ reason: 'shutdown' })}\n\n`

  for (const [eventId, room] of realtimeRooms.entries()) {
    for (const client of room) {
      clearInterval(client.pingTimer)
      if (!client.res.writableEnded) {
        try {
          client.res.write(shutdownMessage)
          client.res.end()
        } catch {
        }
      }
    }
    room.clear()
  }

  realtimeRooms.clear()
  logger.success('All realtime streams closed successfully')
}

export const getRealtimeStats = (): RealtimeStats => {
  let totalClients = 0
  for (const room of realtimeRooms.values()) {
    totalClients += room.size
  }
  return {
    totalRooms: realtimeRooms.size,
    totalClients
  }
}

export const subscribeEventStream = subscribeRealtimeStream
export const broadcastEvent = broadcastRealtimeEvent
export const closeAllEventStreams = closeAllRealtimeStreams
export const getEventStreamStats = getRealtimeStats

export default {
  subscribe: subscribeRealtimeStream,
  broadcast: broadcastRealtimeEvent,
  closeAll: closeAllRealtimeStreams,
  getStats: getRealtimeStats
}
