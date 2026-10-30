import type { CSSProperties } from 'react'
import type { SxProps, Theme } from '@mui/material'
import { brandColors } from '@theme'
import type {
  LoadingAnimation,
  LogoAnimation,
  LogoDimensions,
  LogoSize
} from './types'

export type ResolvedAnimation =
  | 'none'
  | 'enter'
  | 'flash'
  | 'shutter'
  | 'reveal'
  | 'eye'
  | 'develop'
  | 'live'
  | 'breathe'
  | 'orbit'
  | 'blink'
  | 'dots'
  | 'draw'
  | 'morph'

export const resolveAnimation = (
  animation?: LogoAnimation,
  loading?: boolean | LoadingAnimation
): ResolvedAnimation => {
  if (loading) {
    if (loading === true) return 'orbit'
    const lower = String(loading).toLowerCase()
    if (lower === 'l1' || lower === 'orbit') return 'orbit'
    if (lower === 'l2' || lower === 'blink') return 'blink'
    if (lower === 'l3' || lower === 'dots') return 'dots'
    if (lower === 'l4' || lower === 'draw') return 'draw'
    if (lower === 'l9' || lower === 'morph') return 'morph'
  }

  if (animation !== undefined) {
    if (animation === 1 || animation === 'enter') return 'enter'
    if (animation === 2 || animation === 'flash') return 'flash'
    if (animation === 3 || animation === 'shutter') return 'shutter'
    if (animation === 4 || animation === 'reveal') return 'reveal'
    if (animation === 5 || animation === 'eye') return 'eye'
    if (animation === 6 || animation === 'develop') return 'develop'
    if (animation === 7 || animation === 'live') return 'live'
    if (animation === 8 || animation === 'breathe') return 'breathe'

    const lower = String(animation).toLowerCase()
    if (lower === 'l1' || lower === 'orbit') return 'orbit'
    if (lower === 'l2' || lower === 'blink') return 'blink'
    if (lower === 'l3' || lower === 'dots') return 'dots'
    if (lower === 'l4' || lower === 'draw') return 'draw'
    if (lower === 'l9' || lower === 'morph') return 'morph'
  }

  return 'none'
}

export const getLogoDimensions = (size: LogoSize): LogoDimensions => {
  if (typeof size === 'number') {
    return { symbolSize: size, fontSize: size * 0.85, gap: size * 0.25 }
  }

  switch (size) {
    case 'small':
      return {
        symbolSize: { xs: 24, sm: 28 },
        fontSize: { xs: '1.05rem', sm: '1.25rem' },
        gap: { xs: 0.75, sm: 1 }
      }
    case 'large':
      return {
        symbolSize: { xs: 36, sm: 44, md: 52 },
        fontSize: { xs: '1.625rem', sm: '2.1rem', md: '2.5rem' },
        gap: { xs: 1.25, sm: 1.5, md: 2 }
      }
    case 'medium':
      return {
        symbolSize: { xs: 28, sm: 36 },
        fontSize: { xs: '1.25rem', sm: '1.75rem' },
        gap: { xs: 1, sm: 1.25 }
      }
    default:
      return {
        symbolSize: size,
        fontSize: size,
        gap: 1
      }
  }
}

export const getSymbolColors = (isDark: boolean) => ({
  rectFill: isDark ? brandColors.flashYellow : brandColors.ink,
  circleFill: isDark ? brandColors.ink : brandColors.flashYellow,
  burstFill: '#FFFFFF',
  ringStroke: isDark ? brandColors.ink : brandColors.flashYellow,
  drawStroke: isDark ? brandColors.flashYellow : brandColors.ink,
  drawDotFill: brandColors.flashYellow
})

export const getLogoContainerStyles = (
  isDark: boolean,
  gap: number | string | Record<string, number | string>
): SxProps<Theme> => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap,
  userSelect: 'none',
  textDecoration: 'none',
  color: isDark ? brandColors.flashYellow : brandColors.ink,
  flexShrink: 0
})

export const getLogoTextStyles = (
  fontSize: number | string | Record<string, number | string>,
  isRevealing: boolean = false
): SxProps<Theme> => ({
  fontFamily: "'Bricolage Grotesque', 'Helvetica Neue', Arial, sans-serif",
  fontWeight: 800,
  fontSize,
  letterSpacing: '-0.045em',
  lineHeight: 1,
  color: 'inherit',
  whiteSpace: 'nowrap',
  paddingBottom: '2px',
  display: 'inline-flex',
  overflow: isRevealing ? 'hidden' : 'visible'
})

export const baseSvgStyles: CSSProperties = {
  flexShrink: 0,
  display: 'inline-block',
  verticalAlign: 'middle',
  overflow: 'visible'
}

export const getSvgAnimationStyles = (
  anim: ResolvedAnimation
): CSSProperties => {
  if (anim === 'breathe') {
    return {
      animation: 'uai-breathe 3.2s cubic-bezier(.65, 0, .35, 1) infinite'
    }
  }
  if (anim === 'morph') {
    return {
      animation: 'uai-spin 2.4s cubic-bezier(.65, 0, .35, 1) infinite'
    }
  }
  return {}
}

export const getFrameAnimationStyles = (
  anim: ResolvedAnimation,
  play: boolean
): CSSProperties => {
  if (!play && anim !== 'morph') return {}

  if (anim === 'enter' || anim === 'reveal') {
    return {
      animation: 'uai-enter-frame 600ms cubic-bezier(.34, 1.56, .64, 1) both'
    }
  }
  if (anim === 'shutter') {
    return {
      animation: 'uai-shutter-frame 500ms cubic-bezier(.34, 1.56, .64, 1)'
    }
  }
  if (anim === 'develop') {
    return {
      animation: 'uai-develop-frame 2.2s ease both'
    }
  }
  if (anim === 'morph') {
    return {
      animation: 'uai-morph 2.4s cubic-bezier(.65, 0, .35, 1) infinite'
    }
  }
  return {}
}

export const getDotAnimationStyles = (
  anim: ResolvedAnimation,
  play: boolean
): CSSProperties => {
  if (anim === 'flash') {
    return {
      animation: 'uai-flash-dot 2.8s cubic-bezier(.16, 1, .3, 1) infinite'
    }
  }
  if (anim === 'breathe') {
    return {
      animation: 'uai-dot-float 3.2s cubic-bezier(.65, 0, .35, 1) infinite'
    }
  }
  if (anim === 'blink') {
    return {
      animation: 'uai-blink 1s cubic-bezier(.65, 0, .35, 1) infinite'
    }
  }
  if (anim === 'morph') {
    return {
      animation: 'uai-spin 2.4s cubic-bezier(.65, 0, .35, 1) infinite reverse'
    }
  }

  if (!play) return {}

  if (anim === 'enter') {
    return {
      animation: 'uai-enter-dot 700ms cubic-bezier(.34, 1.56, .64, 1) 250ms both'
    }
  }
  if (anim === 'shutter') {
    return {
      animation: 'uai-shutter-dot 500ms cubic-bezier(.65, 0, .35, 1)'
    }
  }
  if (anim === 'develop') {
    return {
      animation: 'uai-develop-dot 2.2s ease both'
    }
  }
  return {}
}
