export const clientDeviceIdKey = 'uaitonafoto:client_device_id'
export const clientDeviceCookieKey = 'uaitonafoto_device_id'

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null
  try {
    const cookies = document.cookie ? document.cookie.split(';') : []
    const prefix = `${name}=`
    for (const cookie of cookies) {
      const trimmed = cookie.trim()
      if (trimmed.startsWith(prefix)) {
        return decodeURIComponent(trimmed.substring(prefix.length))
      }
    }
  } catch {
  }
  return null
}

const setCookie = (name: string, value: string, days = 3650): void => {
  if (typeof document === 'undefined') return
  try {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
  } catch {
  }
}

export const getClientDeviceId = (): string => {
  if (typeof window === 'undefined') return 'server_device'

  try {
    let id = localStorage.getItem(clientDeviceIdKey)

    if (!id) {
      id = getCookie(clientDeviceCookieKey)
      if (id) {
        localStorage.setItem(clientDeviceIdKey, id)
      }
    }

    if (!id) {
      id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `dev_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      localStorage.setItem(clientDeviceIdKey, id)
      setCookie(clientDeviceCookieKey, id)
    } else {
      setCookie(clientDeviceCookieKey, id)
    }

    return id
  } catch {
    return 'browser_device'
  }
}

const hashString = (str: string): string => {
  let h1 = 0xdeadbeef ^ 0
  let h2 = 0x41c64e6d ^ 0
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16)
}

const getCanvasFingerprint = (): string => {
  if (typeof document === 'undefined') return ''
  try {
    const canvas = document.createElement('canvas')
    canvas.width = 200
    canvas.height = 50
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

    ctx.textBaseline = 'top'
    ctx.font = "14px 'Arial', sans-serif"
    ctx.fillStyle = '#f60'
    ctx.fillRect(125, 1, 62, 20)
    ctx.fillStyle = '#069'
    ctx.fillText('uaitonafoto,client:device', 2, 15)
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
    ctx.fillText('uaitonafoto,client:device', 4, 17)

    return canvas.toDataURL()
  } catch {
    return ''
  }
}

let cachedFingerprint: string | null = null

export const getClientFingerprint = (): string => {
  if (cachedFingerprint) return cachedFingerprint
  if (typeof window === 'undefined') return 'unknown_fp'

  try {
    const screenInfo = typeof screen !== 'undefined' ? `${screen.width}x${screen.height}x${screen.colorDepth}` : ''
    const dpr = typeof window.devicePixelRatio === 'number' ? window.devicePixelRatio : 1
    const tz = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : ''
    const lang = typeof navigator !== 'undefined' ? navigator.language : ''
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
    const cores = typeof navigator !== 'undefined' && 'hardwareConcurrency' in navigator ? navigator.hardwareConcurrency : ''
    const touch = typeof navigator !== 'undefined' && 'maxTouchPoints' in navigator ? navigator.maxTouchPoints : ''
    const canvasFp = getCanvasFingerprint()

    const raw = `${ua}|${lang}|${screenInfo}|${dpr}|${tz}|${cores}|${touch}|${canvasFp}`
    cachedFingerprint = `fp_${hashString(raw)}`
    return cachedFingerprint
  } catch {
    return 'fp_fallback'
  }
}

