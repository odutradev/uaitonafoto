import { useEffect, useRef, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { logoAnimationKeyframes } from './animations'
import {
  baseSvgStyles,
  getDotAnimationStyles,
  getFrameAnimationStyles,
  getLogoContainerStyles,
  getLogoDimensions,
  getLogoTextStyles,
  getSvgAnimationStyles,
  getSymbolColors,
  resolveAnimation
} from './styles'
import type { LogoProps } from './types'

const REVEAL_WORDS = [
  { text: 'uai', delay: '300ms' },
  { text: 'To', delay: '420ms' },
  { text: 'Na', delay: '540ms' },
  { text: 'Foto', delay: '660ms' }
]

const Logo = ({
  size = 'medium',
  variant = 'auto',
  display = 'both',
  symbolOnly = false,
  textOnly = false,
  wordmarkOnly = false,
  animation,
  loading,
  play = true,
  interactive = true,
  sx,
  ...rest
}: LogoProps) => {
  const theme = useTheme()
  const isDark = variant === 'auto' ? theme.palette.mode === 'dark' : variant === 'dark'
  const dimensions = getLogoDimensions(size)
  const anim = resolveAnimation(animation, loading)
  const colors = getSymbolColors(isDark)

  const effectiveDisplay = symbolOnly
    ? 'symbol'
    : textOnly || wordmarkOnly
      ? 'text'
      : display

  const showSymbol = effectiveDisplay === 'both' || effectiveDisplay === 'symbol'
  const showText = effectiveDisplay === 'both' || effectiveDisplay === 'text' || effectiveDisplay === 'wordmark'

  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 })
  const symbolRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (anim !== 'eye' || !interactive) return

    const handlePointerMove = (e: PointerEvent) => {
      if (!symbolRef.current) return
      const rect = symbolRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const dx = e.clientX - centerX
      const dy = e.clientY - centerY
      const dist = Math.hypot(dx, dy) || 1
      const MAX_OFFSET = 18
      const strength = Math.min(dist / 120, 1) * MAX_OFFSET
      setEyeOffset({
        x: (dx / dist) * strength,
        y: (dy / dist) * strength
      })
    }

    window.addEventListener('pointermove', handlePointerMove)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [anim, interactive])

  const renderSymbolContent = () => {
    if (anim === 'dots') {
      return (
        <svg
          ref={symbolRef}
          role="img"
          aria-label="Carregando"
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          fill="none"
          className="uai-logo-sym uai-logo-animated"
          style={baseSvgStyles}
        >
          <circle
            cx="20"
            cy="58"
            r="13"
            fill={colors.circleFill}
            style={{
              animation: 'uai-hop 900ms cubic-bezier(.65, 0, .35, 1) infinite',
              animationDelay: '0ms'
            }}
          />
          <circle
            cx="50"
            cy="58"
            r="13"
            fill={colors.circleFill}
            style={{
              animation: 'uai-hop 900ms cubic-bezier(.65, 0, .35, 1) infinite',
              animationDelay: '120ms'
            }}
          />
          <circle
            cx="80"
            cy="58"
            r="13"
            fill={colors.circleFill}
            style={{
              animation: 'uai-hop 900ms cubic-bezier(.65, 0, .35, 1) infinite',
              animationDelay: '240ms'
            }}
          />
        </svg>
      )
    }

    if (anim === 'draw') {
      return (
        <svg
          ref={symbolRef}
          role="img"
          aria-label="Carregando"
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          fill="none"
          className="uai-logo-sym uai-logo-animated"
          style={baseSvgStyles}
        >
          <rect
            x="6"
            y="6"
            width="88"
            height="88"
            rx="27"
            pathLength={100}
            fill="none"
            stroke={colors.drawStroke}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={100}
            style={{ animation: 'uai-draw 1.8s cubic-bezier(.65, 0, .35, 1) infinite' }}
          />
          <circle
            cx="59"
            cy="42"
            r="16"
            fill={colors.drawDotFill}
            style={{ animation: 'uai-draw-dot 1.8s cubic-bezier(.34, 1.56, .64, 1) infinite' }}
          />
        </svg>
      )
    }

    if (anim === 'orbit') {
      return (
        <svg
          ref={symbolRef}
          role="img"
          aria-label="Carregando"
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          fill="none"
          className="uai-logo-sym uai-logo-animated"
          style={baseSvgStyles}
        >
          <rect x="4" y="4" width="92" height="92" rx="28" fill={colors.rectFill} />
          <g
            className="uai-orbit-group"
            style={{ animation: 'uai-spin 1.1s linear infinite' }}
          >
            <circle cx="50" cy="27" r="13" fill={colors.circleFill} />
          </g>
        </svg>
      )
    }

    return (
      <svg
        ref={symbolRef}
        role="img"
        aria-label="Símbolo uai to na foto"
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        className="uai-logo-sym uai-logo-animated"
        style={{ ...baseSvgStyles, ...getSvgAnimationStyles(anim) }}
      >
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          rx="28"
          fill={colors.rectFill}
          style={getFrameAnimationStyles(anim, play)}
        />
        {anim === 'flash' && (
          <circle
            cx="59"
            cy="42"
            r="18"
            fill={colors.burstFill}
            style={{ animation: 'uai-flash-burst 2.8s cubic-bezier(.16, 1, .3, 1) infinite' }}
          />
        )}
        {anim === 'live' && (
          <circle
            cx="59"
            cy="42"
            r="18"
            fill="none"
            stroke={colors.ringStroke}
            strokeWidth={4}
            style={{ animation: 'uai-live-ring 1.6s cubic-bezier(.16, 1, .3, 1) infinite' }}
          />
        )}
        <circle
          cx={anim === 'eye' ? 50 : 59}
          cy={anim === 'eye' ? 50 : 42}
          r="18"
          fill={colors.circleFill}
          className={anim === 'morph' ? 'uai-morph-dot' : undefined}
          style={
            anim === 'eye'
              ? {
                  transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                  transition: 'transform 200ms cubic-bezier(.16, 1, .3, 1)'
                }
              : getDotAnimationStyles(anim, play)
          }
        />
      </svg>
    )
  }

  return (
    <Box
      sx={[
        getLogoContainerStyles(isDark, showSymbol && showText ? dimensions.gap : 0),
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
      {...rest}
    >
      <style href="uai-logo-keyframes" precedence="default">
        {logoAnimationKeyframes}
      </style>

      {showSymbol && (
        <Box
          sx={{
            width: dimensions.symbolSize,
            height: dimensions.symbolSize,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          {renderSymbolContent()}
        </Box>
      )}

      {showText && (
        <Typography
          component="span"
          sx={getLogoTextStyles(dimensions.fontSize, anim === 'reveal')}
        >
          {anim === 'reveal' ? (
            REVEAL_WORDS.map((w, i) => (
              <Box
                key={i}
                component="span"
                sx={{
                  display: 'inline-block',
                  animation: play
                    ? 'uai-word-up 500ms cubic-bezier(.16, 1, .3, 1) both, uai-cap-highlight 900ms ease both'
                    : 'none',
                  animationDelay: play ? `${w.delay}, ${w.delay}` : '0ms'
                }}
              >
                {w.text}
              </Box>
            ))
          ) : (
            'uaiToNaFoto'
          )}
        </Typography>
      )}
    </Box>
  )
}

export default Logo
