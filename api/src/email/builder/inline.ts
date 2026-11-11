import { EmailColors } from '@email/builder/theme'

const BoldPattern = /\*\*(.+?)\*\*/g

export const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export const formatInlineHtml = (value: string): string =>
  escapeHtml(value).replace(BoldPattern, (_match, content: string) => `<strong style="color: ${EmailColors.ink}; font-weight: 700;">${content}</strong>`)

export const formatInlineText = (value: string): string => value.replace(BoldPattern, '$1')
