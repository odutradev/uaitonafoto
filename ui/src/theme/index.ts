import { createTheme } from '@mui/material/styles'

import type { Theme } from '@mui/material/styles'

export const brandColors = {
  flashYellow: '#FFCF1F',
  ink: '#17140F',
  paper: '#FBF8F1',
  sand: '#EFE9DA',
  sandDark: '#E4DDCB',
  lightBorder: '#E7E1D2',
  textGray: '#5E584C',
  darkBg: '#12100C',
  darkPaper: '#1E1A14',
  darkSurface: '#28231B',
  darkBorder: '#383227',
  darkTextPrimary: '#FBF8F1',
  darkTextSecondary: '#ABA392'
} as const

export const brandColor = brandColors

export const getAppTheme = (mode: 'light' | 'dark'): Theme => {
  const isLight = mode === 'light'

  return createTheme({
    palette: {
      mode,
      primary: {
        main: brandColors.flashYellow,
        light: '#FFE266',
        dark: '#E0B200',
        contrastText: brandColors.ink
      },
      secondary: {
        main: isLight ? brandColors.ink : brandColors.flashYellow,
        light: isLight ? brandColors.darkPaper : '#FFE266',
        dark: isLight ? '#0D0B08' : '#E0B200',
        contrastText: isLight ? brandColors.paper : brandColors.ink
      },
      background: {
        default: isLight ? brandColors.paper : brandColors.darkBg,
        paper: isLight ? '#FFFFFF' : brandColors.darkPaper
      },
      text: {
        primary: isLight ? brandColors.ink : brandColors.darkTextPrimary,
        secondary: isLight ? brandColors.textGray : brandColors.darkTextSecondary
      },
      divider: isLight ? brandColors.lightBorder : brandColors.darkBorder
    },
    typography: {
      fontFamily: [
        'DM Sans',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        'sans-serif'
      ].join(','),
      h1: {
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 800,
        letterSpacing: '-0.05em',
        lineHeight: 1
      },
      h2: {
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 800,
        letterSpacing: '-0.045em',
        lineHeight: 1.05
      },
      h3: {
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 800,
        letterSpacing: '-0.04em',
        lineHeight: 1.1
      },
      h4: {
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 800,
        letterSpacing: '-0.035em',
        lineHeight: 1.15
      },
      h5: {
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 700,
        letterSpacing: '-0.03em',
        lineHeight: 1.2
      },
      h6: {
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 700,
        letterSpacing: '-0.02em',
        lineHeight: 1.25
      },
      button: {
        fontFamily: "'Bricolage Grotesque', 'DM Sans', sans-serif",
        fontWeight: 800,
        letterSpacing: '-0.02em',
        textTransform: 'none'
      }
    },
    shape: {
      borderRadius: 16
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255, 207, 31, 0.45) transparent',
            overflowX: 'hidden',
            width: '100%',
            maxWidth: '100%'
          },
          body: {
            backgroundColor: isLight ? brandColors.paper : brandColors.darkBg,
            color: isLight ? brandColors.ink : brandColors.darkTextPrimary,
            transition: 'background-color 0.3s ease, color 0.3s ease',
            overflowX: 'hidden',
            width: '100%',
            maxWidth: '100%'
          },
          '#root': {
            overflowX: 'hidden',
            width: '100%',
            maxWidth: '100%',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
          },
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-track': {
            backgroundColor: 'transparent'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 207, 31, 0.45)',
            borderRadius: '9999px',
            transition: 'background-color 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 207, 31, 0.75)'
            },
            '&:active': {
              backgroundColor: 'rgba(255, 207, 31, 0.9)'
            }
          },
          '*::-webkit-scrollbar-corner': {
            backgroundColor: 'transparent'
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '9999px',
            padding: '10px 24px',
            fontSize: '1rem',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none'
            }
          },
          containedPrimary: {
            backgroundColor: brandColors.flashYellow,
            color: brandColors.ink,
            '&:hover': {
              backgroundColor: '#F5C30A'
            }
          },
          containedSecondary: {
            backgroundColor: isLight ? brandColors.ink : brandColors.flashYellow,
            color: isLight ? brandColors.paper : brandColors.ink,
            '&:hover': {
              backgroundColor: isLight ? brandColors.darkPaper : '#FFE266'
            }
          },
          outlined: {
            borderColor: isLight ? brandColors.ink : brandColors.lightBorder,
            borderWidth: '1.5px',
            color: isLight ? brandColors.ink : brandColors.darkTextPrimary,
            '&:hover': {
              borderWidth: '1.5px',
              backgroundColor: isLight ? 'rgba(23, 20, 15, 0.04)' : 'rgba(255, 207, 31, 0.08)'
            }
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            border: `1px solid ${isLight ? brandColors.lightBorder : brandColors.darkBorder}`,
            backgroundColor: isLight ? '#FFFFFF' : brandColors.darkPaper,
            color: isLight ? brandColors.ink : brandColors.darkTextPrimary,
            boxShadow: isLight
              ? '0 1px 3px rgba(23, 20, 15, 0.05), 0 10px 25px -5px rgba(23, 20, 15, 0.04)'
              : '0 4px 20px rgba(0, 0, 0, 0.4)'
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 24,
            border: `1px solid ${isLight ? brandColors.lightBorder : brandColors.darkBorder}`,
            backgroundColor: isLight ? '#FFFFFF' : brandColors.darkPaper,
            color: isLight ? brandColors.ink : brandColors.darkTextPrimary
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            backgroundColor: isLight ? '#FFFFFF' : brandColors.darkPaper,
            color: isLight ? brandColors.ink : brandColors.darkTextPrimary,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isLight ? brandColors.lightBorder : brandColors.darkBorder
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isLight ? brandColors.ink : brandColors.flashYellow
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: isLight ? brandColors.ink : brandColors.flashYellow,
              borderWidth: '2px'
            }
          },
          input: {
            '&:-webkit-autofill': {
              WebkitBoxShadow: `0 0 0 100px ${isLight ? '#FFFFFF' : brandColors.darkPaper} inset`,
              WebkitTextFillColor: isLight ? brandColors.ink : brandColors.darkTextPrimary,
              caretColor: isLight ? brandColors.ink : brandColors.darkTextPrimary,
              borderRadius: 'inherit'
            }
          }
        }
      }
    }
  })
}

