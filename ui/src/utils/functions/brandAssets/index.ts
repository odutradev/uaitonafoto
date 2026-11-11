import { brandColors } from '@styles/theme'

export type LogoType = 'horizontal' | 'vertical' | 'symbol' | 'wordmark' | 'favicon'
export type LogoColorScheme = 'light' | 'dark' | 'yellow' | 'mono-black' | 'mono-white'
export type LogoBackgroundOption = 'transparent' | 'paper' | 'dark' | 'yellow' | 'sand' | 'white' | 'black'
export type AspectRatioOption = 'original' | '1:1' | '16:9' | '9:16' | '4:5'

export interface ColorDefinition {
  frameColor: string
  dotColor: string
  textColor: string
}

export const colorSchemes: Record<LogoColorScheme, ColorDefinition & { name: string; description: string }> = {
  light: {
    name: 'Padrão Claro (Tinta + Amarelo Flash)',
    description: 'Versão principal para fundos claros ou transparentes.',
    frameColor: brandColors.ink,
    dotColor: brandColors.flashYellow,
    textColor: brandColors.ink
  },
  dark: {
    name: 'Padrão Escuro (Amarelo Flash + Tinta)',
    description: 'Versão de alto contraste para fundos escuros ou noturnos.',
    frameColor: brandColors.flashYellow,
    dotColor: brandColors.ink,
    textColor: brandColors.flashYellow
  },
  yellow: {
    name: 'Amarelo Flash Monocromático',
    description: 'Tudo em Amarelo Flash com recorte em tinta.',
    frameColor: brandColors.flashYellow,
    dotColor: brandColors.ink,
    textColor: brandColors.flashYellow
  },
  'mono-black': {
    name: 'Monocromático Preto',
    description: '100% Tinta/Preto para impressões econômicas, notas e carimbos.',
    frameColor: brandColors.ink,
    dotColor: '#FFFFFF',
    textColor: brandColors.ink
  },
  'mono-white': {
    name: 'Monocromático Branco',
    description: '100% Branco para sobreposição de fotos, vídeos e estampas.',
    frameColor: '#FFFFFF',
    dotColor: brandColors.ink,
    textColor: '#FFFFFF'
  }
}

export const backgroundColors: Record<LogoBackgroundOption, { name: string; hex: string | null }> = {
  transparent: { name: 'Transparente', hex: null },
  paper: { name: 'Papel (#FBF8F1)', hex: brandColors.paper },
  dark: { name: 'Tinta (#17140F)', hex: brandColors.ink },
  yellow: { name: 'Amarelo Flash (#FFCF1F)', hex: brandColors.flashYellow },
  sand: { name: 'Areia (#EFE9DA)', hex: brandColors.sand },
  white: { name: 'Branco Puro (#FFFFFF)', hex: '#FFFFFF' },
  black: { name: 'Preto Puro (#000000)', hex: '#000000' }
}

export interface SvgOptions {
  type: LogoType
  colorScheme: LogoColorScheme
  backgroundColor?: LogoBackgroundOption
  aspectRatio?: AspectRatioOption
}

/**
 * Retorna o SVG cru como string com dimensões adequadas e opções configuradas
 */
export const getLogoSvgString = ({
  type,
  colorScheme,
  backgroundColor = 'transparent',
  aspectRatio = 'original'
}: SvgOptions): string => {
  const scheme = colorSchemes[colorScheme]
  const bgHex = backgroundColors[backgroundColor].hex

  let baseWidth = 320
  let baseHeight = 64
  let innerGraphic = ''

  if (type === 'horizontal') {
    baseWidth = 320
    baseHeight = 64
    innerGraphic = `
      <g>
        <rect x="4" y="4" width="56" height="56" rx="17" fill="${scheme.frameColor}" />
        <circle cx="37.5" cy="27.5" r="11" fill="${scheme.dotColor}" />
      </g>
      <text x="74" y="44" font-family="'Bricolage Grotesque', system-ui, -apple-system, sans-serif" font-size="34" font-weight="800" letter-spacing="-0.04em" fill="${scheme.textColor}">uaiToNaFoto</text>
    `
  } else if (type === 'vertical') {
    baseWidth = 280
    baseHeight = 180
    innerGraphic = `
      <g transform="translate(90, 16)">
        <rect x="4" y="4" width="92" height="92" rx="28" fill="${scheme.frameColor}" />
        <circle cx="59" cy="42" r="18" fill="${scheme.dotColor}" />
      </g>
      <text x="140" y="152" text-anchor="middle" font-family="'Bricolage Grotesque', system-ui, -apple-system, sans-serif" font-size="32" font-weight="800" letter-spacing="-0.04em" fill="${scheme.textColor}">uaiToNaFoto</text>
    `
  } else if (type === 'symbol') {
    baseWidth = 100
    baseHeight = 100
    innerGraphic = `
      <rect x="4" y="4" width="92" height="92" rx="28" fill="${scheme.frameColor}" />
      <circle cx="59" cy="42" r="18" fill="${scheme.dotColor}" />
    `
  } else if (type === 'wordmark') {
    baseWidth = 260
    baseHeight = 56
    innerGraphic = `
      <text x="10" y="42" font-family="'Bricolage Grotesque', system-ui, -apple-system, sans-serif" font-size="36" font-weight="800" letter-spacing="-0.04em" fill="${scheme.textColor}">uaiToNaFoto</text>
    `
  } else if (type === 'favicon') {
    baseWidth = 64
    baseHeight = 64
    innerGraphic = `
      <rect x="3" y="3" width="58" height="58" rx="18" fill="${scheme.frameColor}" />
      <circle cx="37" cy="27" r="11.5" fill="${scheme.dotColor}" />
    `
  }

  // Se a proporção for diferente de original, calculamos o viewBox expandido
  let finalWidth = baseWidth
  let finalHeight = baseHeight
  let padX = 0
  let padY = 0

  if (aspectRatio === '1:1') {
    const side = Math.max(baseWidth, baseHeight) * 1.3
    finalWidth = side
    finalHeight = side
    padX = (finalWidth - baseWidth) / 2
    padY = (finalHeight - baseHeight) / 2
  } else if (aspectRatio === '16:9') {
    const targetRatio = 16 / 9
    finalWidth = Math.max(baseWidth * 1.3, baseHeight * 1.3 * targetRatio)
    finalHeight = finalWidth / targetRatio
    padX = (finalWidth - baseWidth) / 2
    padY = (finalHeight - baseHeight) / 2
  } else if (aspectRatio === '9:16') {
    const targetRatio = 9 / 16
    finalHeight = Math.max(baseHeight * 1.4, (baseWidth * 1.4) / targetRatio)
    finalWidth = finalHeight * targetRatio
    padX = (finalWidth - baseWidth) / 2
    padY = (finalHeight - baseHeight) / 2
  } else if (aspectRatio === '4:5') {
    const targetRatio = 4 / 5
    finalHeight = Math.max(baseHeight * 1.35, (baseWidth * 1.35) / targetRatio)
    finalWidth = finalHeight * targetRatio
    padX = (finalWidth - baseWidth) / 2
    padY = (finalHeight - baseHeight) / 2
  }

  const bgRect = bgHex ? `<rect width="100%" height="100%" fill="${bgHex}" />` : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.round(finalWidth)} ${Math.round(finalHeight)}" width="${Math.round(finalWidth)}" height="${Math.round(finalHeight)}">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@800&amp;display=swap');
    </style>
  </defs>
  ${bgRect}
  <g transform="translate(${Math.round(padX)}, ${Math.round(padY)})">
    ${innerGraphic}
  </g>
</svg>`.trim()
}

/**
 * Realiza o download de um SVG diretamente no navegador
 */
export const downloadLogoSvg = (options: SvgOptions, fileName?: string): void => {
  const svgContent = getLogoSvgString(options)
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const ratioSuffix = options.aspectRatio && options.aspectRatio !== 'original' ? `-${options.aspectRatio.replace(':', 'x')}` : ''
  const defaultName = `uaitonafoto-${options.type}-${options.colorScheme}${ratioSuffix}.svg`
  a.href = url
  a.download = fileName || defaultName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Copia o SVG para a área de transferência
 */
export const copyLogoSvgToClipboard = async (options: SvgOptions): Promise<boolean> => {
  try {
    const svgContent = getLogoSvgString(options)
    await navigator.clipboard.writeText(svgContent)
    return true
  } catch {
    return false
  }
}

/**
 * Renderiza o SVG em um Canvas em alta resolução e baixa como PNG
 */
export const downloadLogoPng = (
  options: SvgOptions,
  targetWidth: number = 1024,
  fileName?: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const svgString = getLogoSvgString(options)
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const img = new Image()

      img.onload = () => {
        const aspect = img.height / img.width
        const width = targetWidth
        const height = Math.round(width * aspect)

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          URL.revokeObjectURL(url)
          reject(new Error('Canvas context could not be created'))
          return
        }

        // Se houver fundo, preenche
        const bgHex = backgroundColors[options.backgroundColor || 'transparent'].hex
        if (bgHex) {
          ctx.fillStyle = bgHex
          ctx.fillRect(0, 0, width, height)
        }

        ctx.drawImage(img, 0, 0, width, height)
        URL.revokeObjectURL(url)

        canvas.toBlob((pngBlob) => {
          if (!pngBlob) {
            reject(new Error('Failed to create PNG blob'))
            return
          }
          const pngUrl = URL.createObjectURL(pngBlob)
          const a = document.createElement('a')
          const defaultName = `uaitonafoto-${options.type}-${options.colorScheme}-${width}x${height}.png`
          a.href = pngUrl
          a.download = fileName || defaultName
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(pngUrl)
          resolve()
        }, 'image/png')
      }

      img.onerror = (err) => {
        URL.revokeObjectURL(url)
        reject(err)
      }

      img.src = url
    } catch (err) {
      reject(err)
    }
  })
}
