import { STORAGE_KEYS } from './constants'

export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },

  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value))
  },

  remove(key: string): void {
    localStorage.removeItem(key)
  },

  clear(): void {
    localStorage.clear()
  },
}

export const getToken = (): string | null => storage.get(STORAGE_KEYS.TOKEN)
export const setToken = (token: string) => storage.set(STORAGE_KEYS.TOKEN, token)
export const removeToken = () => storage.remove(STORAGE_KEYS.TOKEN)
