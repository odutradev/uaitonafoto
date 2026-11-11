import { formatInlineHtml, formatInlineText, escapeHtml } from '@email/builder/inline'
import { EmailColors, EmailFonts, NoticeTones } from '@email/builder/theme'

import type { EmailBlock, EmailDetailItem, EmailNoticeTone } from '@email/builder/types'

const paragraphStyle = `margin: 0 0 16px; font-family: ${EmailFonts.body}; font-size: 16px; line-height: 1.65; color: ${EmailColors.textGray};`

const renderDetailRowHtml = (item: EmailDetailItem, index: number): string => `
  <tr>
    <td style="padding: 12px 0; ${index > 0 ? `border-top: 1px solid ${EmailColors.border};` : ''} font-family: ${EmailFonts.body}; font-size: 14px; color: ${EmailColors.textGray};">${escapeHtml(item.label)}</td>
    <td align="right" style="padding: 12px 0 12px 16px; ${index > 0 ? `border-top: 1px solid ${EmailColors.border};` : ''} font-family: ${EmailFonts.body}; font-size: 14px; font-weight: 700; color: ${EmailColors.ink}; text-align: right;">${escapeHtml(item.value)}</td>
  </tr>`

const renderNoticeHtml = (tone: EmailNoticeTone, items: string[], title?: string): string => {
  const { background, accent } = NoticeTones[tone]
  const titleHtml = title
    ? `<p style="margin: 0 0 8px; font-family: ${EmailFonts.heading}; font-size: 15px; font-weight: 800; color: ${EmailColors.ink};">${escapeHtml(title)}</p>`
    : ''
  const itemsHtml = items
    .map((item) => `<p style="margin: 6px 0 0; font-family: ${EmailFonts.body}; font-size: 14px; line-height: 1.6; color: ${EmailColors.textGray};">${formatInlineHtml(item)}</p>`)
    .join('')

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 8px 0 24px;">
    <tr>
      <td style="background-color: ${background}; border-left: 4px solid ${accent}; border-radius: 14px; padding: 18px 20px;">${titleHtml}${itemsHtml}</td>
    </tr>
  </table>`
}

export const renderBlockHtml = (block: EmailBlock): string => {
  switch (block.type) {
    case 'paragraph':
      return `<p style="${paragraphStyle}">${formatInlineHtml(block.text)}</p>`
    case 'heading':
      return `<h2 style="margin: 28px 0 12px; font-family: ${EmailFonts.heading}; font-size: 19px; font-weight: 800; letter-spacing: -0.4px; line-height: 1.3; color: ${EmailColors.ink};">${escapeHtml(block.text)}</h2>`
    case 'button':
      return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 28px 0;">
    <tr>
      <td align="center" bgcolor="${EmailColors.flashYellow}" style="background-color: ${EmailColors.flashYellow}; border-radius: 14px;">
        <a href="${escapeHtml(block.url)}" target="_blank" style="display: inline-block; padding: 16px 30px; font-family: ${EmailFonts.heading}; font-size: 16px; font-weight: 800; letter-spacing: -0.3px; color: ${EmailColors.ink}; text-decoration: none; border-radius: 14px;">${escapeHtml(block.label)} &rarr;</a>
      </td>
    </tr>
  </table>`
    case 'details':
      return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 8px 0 24px;">
    <tr>
      <td style="background-color: ${EmailColors.paper}; border: 1px solid ${EmailColors.border}; border-radius: 16px; padding: 8px 20px;">
        ${block.title ? `<p style="margin: 12px 0 4px; font-family: ${EmailFonts.body}; font-size: 12px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: ${EmailColors.mutedGray};">${escapeHtml(block.title)}</p>` : ''}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${block.items.map(renderDetailRowHtml).join('')}</table>
      </td>
    </tr>
  </table>`
    case 'notice':
      return renderNoticeHtml(block.tone, block.items, block.title)
    case 'fallbackLink':
      return `<p style="margin: 0 0 16px; font-family: ${EmailFonts.body}; font-size: 13px; line-height: 1.6; color: ${EmailColors.mutedGray};">${formatInlineHtml(block.text)}<br><a href="${escapeHtml(block.url)}" target="_blank" style="color: ${EmailColors.ink}; text-decoration: underline; word-break: break-all;">${escapeHtml(block.url)}</a></p>`
    case 'divider':
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;"><tr><td style="border-top: 1px solid ${EmailColors.border}; font-size: 0; line-height: 0;">&nbsp;</td></tr></table>`
  }
}

export const renderBlockText = (block: EmailBlock): string => {
  switch (block.type) {
    case 'paragraph':
      return formatInlineText(block.text)
    case 'heading':
      return block.text.toUpperCase()
    case 'button':
      return `${block.label}: ${block.url}`
    case 'details':
      return [block.title, ...block.items.map((item) => `- ${item.label}: ${item.value}`)].filter(Boolean).join('\n')
    case 'notice':
      return [block.title, ...block.items.map((item) => `- ${formatInlineText(item)}`)].filter(Boolean).join('\n')
    case 'fallbackLink':
      return `${formatInlineText(block.text)}\n${block.url}`
    case 'divider':
      return '---'
  }
}

export const emailBlocks = {
  paragraph: (text: string): EmailBlock => ({ type: 'paragraph', text }),
  heading: (text: string): EmailBlock => ({ type: 'heading', text }),
  button: (label: string, url: string): EmailBlock => ({ type: 'button', label, url }),
  details: (items: EmailDetailItem[], title?: string): EmailBlock => ({ type: 'details', items, title }),
  notice: (tone: EmailNoticeTone, items: string[], title?: string): EmailBlock => ({ type: 'notice', tone, items, title }),
  fallbackLink: (text: string, url: string): EmailBlock => ({ type: 'fallbackLink', text, url }),
  divider: (): EmailBlock => ({ type: 'divider' })
}
