import type { BoxProps } from '@mui/material'

export type LogoSize = 'small' | 'medium' | 'large' | number
export type LogoVariant = 'light' | 'dark' | 'auto'

export interface LogoDimensions {
  symbolSize: number | string | Record<string, number | string>
  fontSize: number | string | Record<string, number | string>
  gap: number | string | Record<string, number | string>
}

export interface LogoProps extends BoxProps {
  size?: LogoSize
  variant?: LogoVariant
  symbolOnly?: boolean
}
