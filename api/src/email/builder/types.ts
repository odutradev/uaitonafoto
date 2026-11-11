import type { NoticeTones } from '@email/builder/theme'

export type EmailNoticeTone = keyof typeof NoticeTones

export type EmailDetailItem = {
  label: string
  value: string
}

export type EmailBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'button'; label: string; url: string }
  | { type: 'details'; title?: string; items: EmailDetailItem[] }
  | { type: 'notice'; tone: EmailNoticeTone; title?: string; items: string[] }
  | { type: 'fallbackLink'; text: string; url: string }
  | { type: 'divider' }

export type EmailContent = {
  preheader: string
  eyebrow?: string
  title: string
  blocks: EmailBlock[]
  footerNote?: string
}

export type RenderedEmail = {
  html: string
  text: string
}
