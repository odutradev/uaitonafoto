const VERSION_STORAGE_KEY = 'uaitonafoto_app_version'

export const clearBrowserCaches = async (): Promise<void> => {
  try {
    if ('caches' in window) {
      const keys = await window.caches.keys()
      await Promise.all(keys.map((key) => window.caches.delete(key)))
    }

    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations()
      await Promise.all(registrations.map((registration) => registration.unregister()))
    }
  } catch {
    // Falha silenciosa em navegadores com restrições de sandbox
  }
}

export const initCacheAndVersionManager = (): void => {
  const currentVersion = import.meta.env.VITE_APP_VERSION

  if (currentVersion) {
    const storedVersion = localStorage.getItem(VERSION_STORAGE_KEY)

    if (storedVersion && storedVersion !== currentVersion) {
      localStorage.setItem(VERSION_STORAGE_KEY, currentVersion)
      clearBrowserCaches().catch(() => {})
    } else if (!storedVersion) {
      localStorage.setItem(VERSION_STORAGE_KEY, currentVersion)
    }
  }

  // Intercepta falhas de dynamic import quando novos bundles são implantados
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault()
    clearBrowserCaches().finally(() => {
      window.location.reload()
    })
  })
}
