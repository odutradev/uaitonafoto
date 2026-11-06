import { timingSafeEqual } from 'crypto'

export const isValidWebhookSecret = (received: string, expected: string): boolean => {
  const receivedBuffer = Buffer.from(received)
  const expectedBuffer = Buffer.from(expected)

  if (receivedBuffer.length !== expectedBuffer.length) return false

  return timingSafeEqual(receivedBuffer, expectedBuffer)
}

export default isValidWebhookSecret
