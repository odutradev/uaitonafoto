import { CssBaseline, ThemeProvider } from '@mui/material'
import { RouterProvider } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { createRoot } from 'react-dom/client'
import { StrictMode, useMemo } from 'react'

import { initCacheAndVersionManager } from '@utils/cacheManager'
import { getToastContainerConfig } from '@config/toastConfig'
import useSystemStore from '@stores/system'
import { getAppTheme } from '@theme'
import appRouter from '@/router'

initCacheAndVersionManager()

const App = () => {
  const { themeMode } = useSystemStore((state) => state.system)

  const currentTheme = useMemo(() => getAppTheme(themeMode), [themeMode])
  const toastConfig = useMemo(() => getToastContainerConfig(themeMode), [themeMode])

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <ToastContainer {...toastConfig} />
      <RouterProvider router={appRouter} />
    </ThemeProvider>
  )
}

const rootElement = document.getElementById('root')

if (!rootElement) throw new Error('Root not found')

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)