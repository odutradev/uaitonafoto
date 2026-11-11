export const AllowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as const
export type AllowedMimeType = (typeof AllowedMimeTypes)[number]

export type MimeExtensionMap = Record<string, string>
