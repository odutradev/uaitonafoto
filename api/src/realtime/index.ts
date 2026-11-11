import { randomUUID } from 'crypto'

import createLogger from '@utils/logger'

import type { RealtimeClient, RealtimeRoom, RealtimeStats, SubscribeRealtimeParams } from './types'

const logger = createLogger('realtime')

const realtimeRooms = new Map<string, RealtimeRoom>()

const PingIntervalMs = 25000

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
  }, PingIntervalMs)

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

  const writeToClient = (client: RealtimeClient): boolean => {
    if (client.res.writableEnded) return false

    try {
      client.res.write(message)
      return true
    } catch (err) {
      logger.warn(`Failed to write to client [${client.id}] in event [${eventId}]:`, err)
      return false
    }
  }

  const staleClients = Array.from(room).filter((client) => !writeToClient(client))

  staleClients.forEach((stale) => {
    clearInterval(stale.pingTimer)
    room.delete(stale)
  })

  if (room.size === 0) {
    realtimeRooms.delete(eventId)
  }
}

export const closeAllRealtimeStreams = (): void => {
  logger.info('Closing all active realtime streams...')
  const shutdownMessage = `event: close\ndata: ${JSON.stringify({ reason: 'shutdown' })}\n\n`

  realtimeRooms.forEach((room) => {
    room.forEach((client) => {
      clearInterval(client.pingTimer)
      if (client.res.writableEnded) return

      try {
        client.res.write(shutdownMessage)
        client.res.end()
      } catch {
        return
      }
    })
    room.clear()
  })

  realtimeRooms.clear()
  logger.success('All realtime streams closed successfully')
}

export const getRealtimeStats = (): RealtimeStats => {
  const totalClients = Array.from(realtimeRooms.values()).reduce((total, room) => total + room.size, 0)
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
