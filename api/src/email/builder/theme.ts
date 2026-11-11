export const BrandName = 'uaiToNaFoto'

export const EmailColors = {
  flashYellow: '#FFCF1F',
  yellowSoft: '#FFF5CC',
  yellowDark: '#B88F00',
  ink: '#17140F',
  paper: '#FBF8F1',
  sand: '#F5F0E4',
  border: '#E7E1D2',
  textGray: '#5E584C',
  mutedGray: '#8A8374',
  white: '#FFFFFF',
  successSoft: '#E5F8EC',
  success: '#1E9E56',
  dangerSoft: '#FFECEA',
  danger: '#D93A30'
} as const

export const EmailFonts = {
  heading: "'Bricolage Grotesque', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  body: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
} as const

export const EmailFontsUrl = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=DM+Sans:wght@400;500;700&display=swap'

export const NoticeTones = {
  info: { background: EmailColors.sand, accent: EmailColors.ink },
  warning: { background: EmailColors.yellowSoft, accent: EmailColors.flashYellow },
  success: { background: EmailColors.successSoft, accent: EmailColors.success },
  danger: { background: EmailColors.dangerSoft, accent: EmailColors.danger }
} as const
