import { randomUUID } from 'crypto'
import createLogger from '@utils/logger'

import type { Request, Response } from 'express'

const logger = createLogger('event-stream')

interface SSEClient {
  id: string
  res: Response
  pingTimer: NodeJS.Timeout
}

const eventRooms = new Map<string, Set<SSEClient>>()

const PING_INTERVAL_MS = 25000

export const subscribeEventStream = ({
  eventId,
  req,
  res
}: {
  eventId: string
  req: Request
  res: Response
}): void => {
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

  const client: SSEClient = { id: clientId, res, pingTimer }

  if (!eventRooms.has(eventId)) {
    eventRooms.set(eventId, new Set())
  }
  const room = eventRooms.get(eventId)!
  room.add(client)

  logger.info(`Client [${clientId}] subscribed to event stream [${eventId}] (room size: ${room.size})`)

  res.write(': connected\n\n')
  res.write(
    `event: ready\ndata: ${JSON.stringify({ eventId, timestamp: new Date().toISOString() })}\n\n`
  )

  const cleanup = () => {
    clearInterval(pingTimer)
    const currentRoom = eventRooms.get(eventId)
    if (currentRoom) {
      currentRoom.delete(client)
      if (currentRoom.size === 0) {
        eventRooms.delete(eventId)
      }
    }
    logger.info(`Client [${clientId}] disconnected from event stream [${eventId}]`)
  }

  req.on('close', cleanup)
  res.on('finish', cleanup)
}

export const broadcastEvent = (eventId: string, eventName: string, data: unknown): void => {
  const room = eventRooms.get(eventId)
  if (!room || room.size === 0) return

  const message = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`
  const staleClients: SSEClient[] = []

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
    eventRooms.delete(eventId)
  }
}

export const closeAllEventStreams = (): void => {
  logger.info('Closing all active SSE event streams...')
  const shutdownMessage = `event: close\ndata: ${JSON.stringify({ reason: 'shutdown' })}\n\n`

  for (const [eventId, room] of eventRooms.entries()) {
    for (const client of room) {
      clearInterval(client.pingTimer)
      if (!client.res.writableEnded) {
        try {
          client.res.write(shutdownMessage)
          client.res.end()
        } catch {
          // Ignore write error on shutdown
        }
      }
    }
    room.clear()
  }

  eventRooms.clear()
  logger.success('All SSE event streams closed successfully')
}

export const getEventStreamStats = (): { totalRooms: number; totalClients: number } => {
  let totalClients = 0
  for (const room of eventRooms.values()) {
    totalClients += room.size
  }
  return {
    totalRooms: eventRooms.size,
    totalClients
  }
}

