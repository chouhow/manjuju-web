export const APP_NAME = 'Mindevo'

export const API_BASE_URL = (import.meta as unknown as { env: Record<string, string> }).env.VITE_API_BASE_URL || 'http://localhost:8000'
export const WS_URL = (import.meta as unknown as { env: Record<string, string> }).env.VITE_WS_URL || 'ws://localhost:8000'

export const STORAGE_KEYS = {
  TOKEN: 'mindevo_token',
  USER: 'mindevo_user',
} as const
