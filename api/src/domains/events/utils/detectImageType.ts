import type { DetectedImageType } from './types'

const JPEG_SIGNATURE = [0xff, 0xd8, 0xff]
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]

const startsWith = (buffer: Buffer, signature: number[], offset = 0): boolean =>
  signature.every((byte, index) => buffer[offset + index] === byte)

export const detectImageType = (buffer: Buffer): DetectedImageType | null => {
  if (startsWith(buffer, JPEG_SIGNATURE)) return { contentType: 'image/jpeg', extension: 'jpg' }
  if (startsWith(buffer, PNG_SIGNATURE)) return { contentType: 'image/png', extension: 'png' }

  const isWebp = buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  if (isWebp) return { contentType: 'image/webp', extension: 'webp' }

  return null
}
