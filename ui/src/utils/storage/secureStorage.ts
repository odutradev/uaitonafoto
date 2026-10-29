import CryptoJS from 'crypto-js'

import type { StateStorage } from 'zustand/middleware'

const SECRET_KEY = import.meta.env.VITE_STORAGE_KEY ?? 'ui-fallback-secret-key-2026'

export const secureStorage: StateStorage = {
  getItem: (name: string): string | null => {
    const encryptedValue = localStorage.getItem(name)
    if (!encryptedValue) return null
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY)
      const value = decrypted.toString(CryptoJS.enc.Utf8)
      if (!value) return null
      return value
    } catch {
      return null
    }
  },
  setItem: (name: string, value: string): void => {
    const encryptedValue = CryptoJS.AES.encrypt(value, SECRET_KEY).toString()
    localStorage.setItem(name, encryptedValue)
  },
  removeItem: (name: string): void => {
    localStorage.removeItem(name)
  }
}