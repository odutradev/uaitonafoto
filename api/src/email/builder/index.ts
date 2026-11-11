import { BrandName, EmailColors, EmailFonts, EmailFontsUrl } from '@email/builder/theme'
import { renderBlockHtml, renderBlockText } from '@email/builder/blocks'
import { escapeHtml } from '@email/builder/inline'
import { buildFrontendUrl } from '@email/links'

import type { EmailContent, RenderedEmail } from '@email/builder/types'

const DefaultFooterNote = `Você recebeu este e-mail porque tem uma conta no ${BrandName}.`

const resolveSiteUrl = (): string => buildFrontendUrl()

const renderLogoHtml = (): string => `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td width="36" height="36" bgcolor="${EmailColors.ink}" style="width: 36px; height: 36px; background-color: ${EmailColors.ink}; border-radius: 11px; vertical-align: top;">
        <div style="margin: 8px 0 0 15px; width: 14px; height: 14px; background-color: ${EmailColors.flashYellow}; border-radius: 7px; font-size: 0; line-height: 0;">&nbsp;</div>
      </td>
      <td style="padding-left: 10px; font-family: ${EmailFonts.heading}; font-size: 22px; font-weight: 800; letter-spacing: -0.9px; color: ${EmailColors.ink};">${BrandName}</td>
    </tr>
  </table>`

const renderEyebrowHtml = (eyebrow?: string): string => {
  if (!eyebrow) return ''

  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 18px;">
    <tr>
      <td style="background-color: ${EmailColors.yellowSoft}; border-radius: 999px; padding: 6px 12px; font-family: ${EmailFonts.body}; font-size: 12px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: ${EmailColors.ink};">
        <span style="color: ${EmailColors.yellowDark};">&#9679;</span>&nbsp; ${escapeHtml(eyebrow)}
      </td>
    </tr>
  </table>`
}

const renderFooterHtml = (footerNote: string): string => `
  <p style="margin: 0 0 8px; font-family: ${EmailFonts.body}; font-size: 13px; line-height: 1.6; color: ${EmailColors.mutedGray};">${escapeHtml(footerNote)}</p>
  <p style="margin: 0; font-family: ${EmailFonts.body}; font-size: 13px; line-height: 1.6; color: ${EmailColors.mutedGray};">
    <a href="${escapeHtml(resolveSiteUrl())}" target="_blank" style="color: ${EmailColors.ink}; font-weight: 700; text-decoration: none;">${BrandName}</a> &middot; © ${new Date().getFullYear()}
  </p>`

const renderHtml = ({ preheader, eyebrow, title, blocks, footerNote }: EmailContent): string => `<!DOCTYPE html>
<html lang="pt-BR" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${escapeHtml(title)}</title>
  <link href="${EmailFontsUrl}" rel="stylesheet">
  <style>
    body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-collapse: separate; }
    @media only screen and (max-width: 600px) {
      .uai-card { padding: 32px 24px 28px !important; }
      .uai-title { font-size: 26px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${EmailColors.paper};">
  <div style="display: none; max-height: 0; max-width: 0; overflow: hidden; opacity: 0; mso-hide: all;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${EmailColors.paper}" style="background-color: ${EmailColors.paper};">
    <tr>
      <td align="center" style="padding: 32px 16px 40px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 560px;">
          <tr>
            <td style="padding: 0 4px 20px;">${renderLogoHtml()}</td>
          </tr>
          <tr>
            <td bgcolor="${EmailColors.white}" style="background-color: ${EmailColors.white}; border: 1px solid ${EmailColors.border}; border-radius: 24px; overflow: hidden;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td height="6" bgcolor="${EmailColors.flashYellow}" style="height: 6px; background-color: ${EmailColors.flashYellow}; border-radius: 24px 24px 0 0; font-size: 0; line-height: 0;">&nbsp;</td>
                </tr>
                <tr>
                  <td class="uai-card" style="padding: 40px 40px 32px;">
                    ${renderEyebrowHtml(eyebrow)}
                    <h1 class="uai-title" style="margin: 0 0 20px; font-family: ${EmailFonts.heading}; font-size: 30px; font-weight: 800; letter-spacing: -1.2px; line-height: 1.1; color: ${EmailColors.ink};">${escapeHtml(title)}</h1>
                    ${blocks.map(renderBlockHtml).join('\n')}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 24px 16px 0; text-align: center;">${renderFooterHtml(footerNote ?? DefaultFooterNote)}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

const renderText = ({ title, blocks, footerNote }: EmailContent): string =>
  [BrandName, title, ...blocks.map(renderBlockText), '---', footerNote ?? DefaultFooterNote, resolveSiteUrl()].join('\n\n')

const buildEmail = (content: EmailContent): RenderedEmail => ({
  html: renderHtml(content),
  text: renderText(content)
})

export default buildEmail
