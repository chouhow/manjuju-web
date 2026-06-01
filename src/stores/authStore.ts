import { create } from 'zustand'
import { authApi } from '@/api/auth'
import { setToken, removeToken } from '@/utils/storage'
import type { User, LoginData, RegisterData, TokenData } from '@/types/api'

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null

  login: (data: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  fetchProfile: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const result: TokenData = await authApi.login(data)
      setToken(result.access_token)
      set({ isLoading: false })
      await useAuthStore.getState().fetchProfile()
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null })
    try {
      await authApi.register(data)
      set({ isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  logout: () => {
    removeToken()
    set({ user: null, error: null })
  },

  fetchProfile: async () => {
    try {
      const user = await authApi.getProfile()
      set({ user })
    } catch {
      // 获取失败不阻塞登录流程
    }
  },

  clearError: () => set({ error: null }),
}))
