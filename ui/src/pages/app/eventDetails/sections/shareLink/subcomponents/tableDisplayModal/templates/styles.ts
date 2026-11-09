import type { SxProps, Theme } from '@mui/material'
import type { TableDisplayTemplateId } from '../types'

export interface TemplateTheme {
  background: string
  color: string
  secondaryColor: string
  accentColor: string
  borderColor: string
  qrBackground: string
  pinBg: string
  pinColor: string
  pinBorder?: string
  stepBg: string
  stepNumberBg: string
  stepNumberColor: string
  stepTextColor: string
  badgeBorder?: string
  cardBorder?: string
  fontFamily: string
  titleFont: string
}

export const TEMPLATE_THEMES: Record<TableDisplayTemplateId, TemplateTheme> = {
  wedding: {
    background: '#FAF7F2',
    color: '#2B2623',
    secondaryColor: '#6E675F',
    accentColor: '#9E7D47',
    borderColor: '#DFD5C6',
    qrBackground: '#FFFFFF',
    pinBg: '#F3ECE0',
    pinColor: '#2B2623',
    pinBorder: '1px solid #D4C3AC',
    stepBg: '#FFFFFF',
    stepNumberBg: '#9E7D47',
    stepNumberColor: '#FFFFFF',
    stepTextColor: '#4A433D',
    cardBorder: '1px solid #E6DCCD',
    fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    titleFont: '"Playfair Display", "Georgia", "Times New Roman", serif'
  },
  modern: {
    background: '#FFCF1F',
    color: '#17140F',
    secondaryColor: '#363023',
    accentColor: '#17140F',
    borderColor: '#17140F',
    qrBackground: '#FFFFFF',
    pinBg: '#17140F',
    pinColor: '#FFCF1F',
    pinBorder: '2px solid #17140F',
    stepBg: 'rgba(255, 255, 255, 0.65)',
    stepNumberBg: '#17140F',
    stepNumberColor: '#FFCF1F',
    stepTextColor: '#17140F',
    cardBorder: '2px solid #17140F',
    fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    titleFont: '"DM Sans", "Bricolage Grotesque", -apple-system, sans-serif'
  },
  corporate: {
    background: 'linear-gradient(175deg, #0F172A 0%, #1E293B 100%)',
    color: '#F8FAFC',
    secondaryColor: '#94A3B8',
    accentColor: '#38BDF8',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    qrBackground: '#FFFFFF',
    pinBg: 'rgba(56, 189, 248, 0.12)',
    pinColor: '#38BDF8',
    pinBorder: '1px solid rgba(56, 189, 248, 0.4)',
    stepBg: 'rgba(255, 255, 255, 0.05)',
    stepNumberBg: '#38BDF8',
    stepNumberColor: '#0F172A',
    stepTextColor: '#E2E8F0',
    cardBorder: '1px solid rgba(255, 255, 255, 0.12)',
    fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    titleFont: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  }
}

export const cardContainerStyles = (theme: TemplateTheme): SxProps<Theme> => ({
  background: theme.background,
  color: theme.color,
  fontFamily: theme.fontFamily,
  border: theme.cardBorder || 'none',
  borderRadius: '16px',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  position: 'relative',
  overflow: 'hidden',
  userSelect: 'none',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
})
