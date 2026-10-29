import { createTheme } from '@mui/material/styles'

import type { Theme } from '@mui/material/styles'

export const brandColors = {
  amareloFlash: '#FFCF1F',
  tinta: '#17140F',
  papel: '#FBF8F1',
  areia: '#EFE9DA',
  areiaDark: '#E4DDCB',
  bordaClara: '#E7E1D2',
  cinzaTexto: '#5E584C',
  darkBg: '#12100C',
  darkPaper: '#1E1A14',
  darkSurface: '#28231B',
  darkBorder: '#383227',
  darkTextPrimary: '#FBF8F1',
  darkTextSecondary: '#ABA392'
} as const

export const getAppTheme = (mode: 'light' | 'dark'): Theme => {
  const isLight = mode === 'light'

  return createTheme({
    palette: {
      mode,
      primary: {
        main: brandColors.amareloFlash,
        light: '#FFE266',
        dark: '#E0B200',
        contrastText: brandColors.tinta
      },
      secondary: {
        main: isLight ? brandColors.tinta : brandColors.amareloFlash,
        light: isLight ? brandColors.darkPaper : '#FFE266',
        dark: isLight ? '#0D0B08' : '#E0B200',
        contrastText: isLight ? brandColors.papel : brandColors.tinta
      },
      background: {
        default: isLight ? brandColors.papel : brandColors.darkBg,
        paper: isLight ? '#FFFFFF' : brandColors.darkPaper
      },
      text: {
        primary: isLight ? brandColors.tinta : brandColors.darkTextPrimary,
        secondary: isLight ? brandColors.cinzaTexto : brandColors.darkTextSecondary
      },
      divider: isLight ? brandColors.bordaClara : brandColors.darkBorder
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
            scrollbarColor: 'rgba(255, 207, 31, 0.45) transparent'
          },
          body: {
            backgroundColor: isLight ? brandColors.papel : brandColors.darkBg,
            color: isLight ? brandColors.tinta : brandColors.darkTextPrimary,
            transition: 'background-color 0.3s ease, color 0.3s ease'
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
            backgroundColor: brandColors.amareloFlash,
            color: brandColors.tinta,
            '&:hover': {
              backgroundColor: '#F5C30A'
            }
          },
          containedSecondary: {
            backgroundColor: isLight ? brandColors.tinta : brandColors.amareloFlash,
            color: isLight ? brandColors.papel : brandColors.tinta,
            '&:hover': {
              backgroundColor: isLight ? brandColors.darkPaper : '#FFE266'
            }
          },
          outlined: {
            borderColor: isLight ? brandColors.tinta : brandColors.bordaClara,
            borderWidth: '1.5px',
            color: isLight ? brandColors.tinta : brandColors.darkTextPrimary,
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
            border: `1px solid ${isLight ? brandColors.bordaClara : brandColors.darkBorder}`,
            backgroundColor: isLight ? '#FFFFFF' : brandColors.darkPaper,
            color: isLight ? brandColors.tinta : brandColors.darkTextPrimary,
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
            border: `1px solid ${isLight ? brandColors.bordaClara : brandColors.darkBorder}`,
            backgroundColor: isLight ? '#FFFFFF' : brandColors.darkPaper,
            color: isLight ? brandColors.tinta : brandColors.darkTextPrimary
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            backgroundColor: isLight ? '#FFFFFF' : brandColors.darkPaper,
            color: isLight ? brandColors.tinta : brandColors.darkTextPrimary,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isLight ? brandColors.bordaClara : brandColors.darkBorder
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isLight ? brandColors.tinta : brandColors.amareloFlash
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: isLight ? brandColors.tinta : brandColors.amareloFlash,
              borderWidth: '2px'
            }
          },
          input: {
            '&:-webkit-autofill': {
              WebkitBoxShadow: `0 0 0 100px ${isLight ? '#FFFFFF' : brandColors.darkPaper} inset`,
              WebkitTextFillColor: isLight ? brandColors.tinta : brandColors.darkTextPrimary,
              caretColor: isLight ? brandColors.tinta : brandColors.darkTextPrimary,
              borderRadius: 'inherit'
            }
          }
        }
      }
    }
  })
}
