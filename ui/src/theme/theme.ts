import { createTheme } from '@mui/material/styles'

import type { Theme } from '@mui/material/styles'

export const getAppTheme = (mode: 'light' | 'dark'): Theme =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#7189ff',
        light: '#a3b5ff',
        dark: '#3d54c7'
      },
      secondary: {
        main: '#624cab',
        light: '#9885d6',
        dark: '#4a3b82'
      },
      background: {
        default: mode === 'light' ? '#fafafa' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e'
      },
      text: {
        primary: mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : '#ffffff',
        secondary: mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.7)'
      }
    },
    typography: {
      fontFamily: ['Montserrat', 'Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'].join(','),
      h1: {
        lineHeight: 1.1,
        fontWeight: 700,
        fontSize: '3.2em'
      },
      h6: {
        fontWeight: 500,
        fontSize: '1em'
      }
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background-color 0.3s ease, color 0.3s ease'
          }
        }
      },
      MuiInputBase: {
        styleOverrides: {
          input: {
            borderRadius: 'inherit',
            caretColor: mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : '#ffffff',
            '&:-webkit-autofill': {
              WebkitTextFillColor: mode === 'light' ? 'rgba(0, 0, 0, 0.87) !important' : '#ffffff !important',
              WebkitBoxShadow: mode === 'light' ? '0 0 0 100px #ffffff inset !important' : '0 0 0 100px #1e1e1e inset !important'
            }
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            transition: 'border-color 0.25s, background-color 0.25s, color 0.25s',
            textTransform: 'none',
            padding: '0.6em 1.2em',
            borderRadius: '8px',
            fontWeight: 500,
            fontSize: '1em',
            '&:hover': {
              borderColor: '#a3b5ff'
            },
            '&:focus-visible': {
              outline: '4px auto -webkit-focus-ring-color'
            }
          }
        }
      }
    }
  })