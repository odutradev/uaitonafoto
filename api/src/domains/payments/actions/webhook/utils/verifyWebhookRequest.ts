import { verifyStandardWebhookSignature, verifyWebhookSignature } from '@abacatepay/types'

import type { IncomingHttpHeaders } from 'http'

const readHeader = (headers: IncomingHttpHeaders, name: string): string | undefined => {
  const value = headers[name]
  return Array.isArray(value) ? value[0] : value
}

export const verifyWebhookRequest = (rawBody: string | undefined, headers: IncomingHttpHeaders, secret: string): boolean => {
  if (!rawBody) return false

  const standardSignature = readHeader(headers, 'webhook-signature')

  if (standardSignature) {
    const id = readHeader(headers, 'webhook-id')
    const timestamp = readHeader(headers, 'webhook-timestamp')

    if (!id || !timestamp) return false

    return verifyStandardWebhookSignature(rawBody, { id, timestamp, signature: standardSignature }, secret)
  }

  const legacySignature = readHeader(headers, 'x-webhook-signature')

  return legacySignature ? verifyWebhookSignature(rawBody, legacySignature) : false
}

export default verifyWebhookRequest
