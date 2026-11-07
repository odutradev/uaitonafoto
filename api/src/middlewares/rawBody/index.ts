import type { IncomingMessage, ServerResponse } from 'http'
import type { RawBodyRequest } from './types'

export const captureRawBody = (req: IncomingMessage, _res: ServerResponse, buffer: Buffer): void => {
  ;(req as RawBodyRequest).rawBody = buffer.toString('utf8')
}

export default captureRawBody
