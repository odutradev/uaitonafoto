export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as const
export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number]

export type MimeExtensionMap = Record<string, string>
