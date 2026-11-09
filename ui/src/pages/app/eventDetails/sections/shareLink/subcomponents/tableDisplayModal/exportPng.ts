import type { EventItem } from '@actions/events/types'
import { downloadBlob } from '@/utils/download'
import type { TableDisplayConfig } from './types'
import { TEMPLATE_THEMES } from './templates/styles'

interface ExportPngParams {
  event: EventItem
  guestUrl: string
  config: TableDisplayConfig
}

export async function exportTableDisplayPng({
  event,
  guestUrl,
  config
}: ExportPngParams): Promise<void> {
  const width = 1240
  const height = 1754
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Não foi possível obter o contexto 2D do Canvas')
  }

  const theme = TEMPLATE_THEMES[config.template]

  if (config.template === 'corporate') {
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, '#0F172A')
    gradient.addColorStop(1, '#1E293B')
    ctx.fillStyle = gradient
  } else {
    ctx.fillStyle = theme.background
  }
  ctx.fillRect(0, 0, width, height)

  if (config.template === 'wedding') {
    ctx.strokeStyle = '#D4C3AC'
    ctx.lineWidth = 4
    ctx.strokeRect(36, 36, width - 72, height - 72)

    ctx.strokeStyle = '#E6DCCD'
    ctx.lineWidth = 2
    ctx.strokeRect(48, 48, width - 96, height - 96)
  } else if (config.template === 'modern') {
    ctx.strokeStyle = '#17140F'
    ctx.lineWidth = 14
    ctx.strokeRect(20, 20, width - 40, height - 40)
  } else if (config.template === 'corporate') {
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)'
    ctx.lineWidth = 4
    ctx.strokeRect(32, 32, width - 64, height - 64)
  }

  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'

  let currentY = 120

  if (config.template === 'modern') {
    ctx.fillStyle = '#17140F'
    const pillW = 320
    const pillH = 50
    drawRoundedRect(ctx, width / 2 - pillW / 2, currentY, pillW, pillH, 25)
    ctx.fill()

    ctx.fillStyle = '#FFCF1F'
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif'
    ctx.fillText('📷  FOTOS AO VIVO NO TELÃO', width / 2, currentY + 14)
    currentY += 80
  } else if (config.template === 'corporate') {
    ctx.fillStyle = '#38BDF8'
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif'
    ctx.letterSpacing = '3px'
    ctx.fillText('GALERIA INTERATIVA OFICIAL', width / 2, currentY)
    ctx.letterSpacing = '0px'
    currentY += 60
  } else {
    currentY += 20
  }

  const titleText = (config.title || event.name || 'Nome do Evento').trim()
  ctx.fillStyle = theme.color
  ctx.font =
    config.template === 'wedding'
      ? 'bold 64px "Playfair Display", Georgia, serif'
      : 'bold 68px system-ui, -apple-system, sans-serif'

  const titleLines = wrapText(ctx, titleText, width - 200)
  titleLines.forEach((line) => {
    ctx.fillText(line, width / 2, currentY)
    currentY += 76
  })

  if (config.subtitle?.trim()) {
    ctx.fillStyle = theme.secondaryColor
    ctx.font =
      config.template === 'wedding'
        ? 'italic 36px Georgia, serif'
        : '500 36px system-ui, -apple-system, sans-serif'
    const subtitleLines = wrapText(ctx, config.subtitle.trim(), width - 240)
    subtitleLines.forEach((line) => {
      ctx.fillText(line, width / 2, currentY + 10)
      currentY += 48
    })
  }

  const qrBoxSize = 540
  const qrBoxY = Math.max(currentY + 40, 520)
  const qrBoxX = (width - qrBoxSize) / 2

  ctx.fillStyle = '#FFFFFF'
  if (config.template === 'modern') {
    ctx.fillStyle = '#17140F'
    drawRoundedRect(ctx, qrBoxX + 10, qrBoxY + 10, qrBoxSize, qrBoxSize, 36)
    ctx.fill()
    ctx.fillStyle = '#FFFFFF'
    drawRoundedRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 36)
    ctx.fill()
  } else {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)'
    ctx.shadowBlur = 30
    ctx.shadowOffsetY = 10
    drawRoundedRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 32)
    ctx.fill()
    ctx.shadowColor = 'transparent'
  }

  const qrSize = 460
  const qrImage = await loadQrCodeImage(guestUrl, qrSize)
  ctx.drawImage(
    qrImage,
    qrBoxX + (qrBoxSize - qrSize) / 2,
    qrBoxY + (qrBoxSize - qrSize) / 2,
    qrSize,
    qrSize
  )

  let nextSectionY = qrBoxY + qrBoxSize + 30
  if (config.showPin && event.settings.pinEnabled && event.settings.pin) {
    const pinBadgeW = 420
    const pinBadgeH = 64
    const pinBadgeX = (width - pinBadgeW) / 2
    const pinBadgeY = nextSectionY

    ctx.fillStyle = theme.pinBg
    drawRoundedRect(ctx, pinBadgeX, pinBadgeY, pinBadgeW, pinBadgeH, 32)
    ctx.fill()

    if (theme.pinBorder) {
      ctx.strokeStyle = theme.borderColor || '#000000'
      ctx.lineWidth = 3
      drawRoundedRect(ctx, pinBadgeX, pinBadgeY, pinBadgeW, pinBadgeH, 32)
      ctx.stroke()
    }

    ctx.fillStyle = theme.pinColor
    ctx.font = 'bold 30px system-ui, -apple-system, sans-serif'
    ctx.fillText(`🔒 PIN: ${event.settings.pin}`, width / 2, pinBadgeY + 16)

    nextSectionY += pinBadgeH + 30
  }

  if (config.showSteps) {
    const stepsBoxW = width - 220
    const stepsBoxH = 210
    const stepsBoxX = (width - stepsBoxW) / 2
    const stepsBoxY = Math.max(nextSectionY + 10, height - 390)

    ctx.fillStyle = theme.stepBg
    drawRoundedRect(ctx, stepsBoxX, stepsBoxY, stepsBoxW, stepsBoxH, 24)
    ctx.fill()

    const steps = [
      '1. Aponte a câmera para o QR Code',
      '2. Escolha e envie suas fotos (sem baixar app)',
      '3. Veja suas fotos ao vivo no telão do evento!'
    ]

    ctx.textAlign = 'left'
    ctx.fillStyle = theme.stepTextColor
    ctx.font = '600 32px system-ui, -apple-system, sans-serif'

    steps.forEach((step, idx) => {
      const stepY = stepsBoxY + 30 + idx * 58
      ctx.fillStyle = theme.stepNumberBg
      ctx.beginPath()
      ctx.arc(stepsBoxX + 50, stepY + 16, 20, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = theme.stepNumberColor
      ctx.font = 'bold 24px system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(String(idx + 1), stepsBoxX + 50, stepY + 4)

      ctx.textAlign = 'left'
      ctx.fillStyle = theme.stepTextColor
      ctx.font = '600 30px system-ui, -apple-system, sans-serif'
      ctx.fillText(step.replace(/^[0-9]\.\s*/, ''), stepsBoxX + 88, stepY + 3)
    })
  }

  if (config.showBranding) {
    const footerY = height - 90
    ctx.strokeStyle = theme.borderColor
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(100, footerY)
    ctx.lineTo(width - 100, footerY)
    ctx.stroke()

    ctx.fillStyle = theme.secondaryColor
    ctx.font = '600 26px system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('uai to na foto • fotos ao vivo', 100, footerY + 24)

    const agencyName = event.customization?.agencyName?.trim()
    ctx.textAlign = 'right'
    ctx.fillText(agencyName || 'uaitonafoto.com', width - 100, footerY + 24)
  }

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/png')
  )

  if (!blob) {
    throw new Error('Erro ao gerar arquivo PNG a partir do canvas')
  }

  const safeEventName = (event.name || 'evento')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  const filename = `display-mesa-${safeEventName}-${config.template}.png`

  downloadBlob(blob, filename)
}

function loadQrCodeImage(url: string, size: number): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const container = document.createElement('div')
    container.style.position = 'fixed'
    container.style.left = '-9999px'
    document.body.appendChild(container)

    const svgElem = document.querySelector('.table-display-card svg')
    let svgData = ''

    if (svgElem) {
      svgData = new XMLSerializer().serializeToString(svgElem)
    } else {
      svgData = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#fff"/></svg>`
    }

    if (container.parentNode) {
      container.parentNode.removeChild(container)
    }

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(e)
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`
  })
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = words[0] || ''

  for (let i = 1; i < words.length; i++) {
    const word = words[i]
    const testLine = `${currentLine} ${word}`
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}
