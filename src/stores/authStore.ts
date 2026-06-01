import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '@/api/auth'
import { setToken, removeToken } from '@/utils/storage'
import type { User, LoginData, RegisterData, TokenData } from '@/types/api'

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login: (data: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  fetchProfile: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const result: TokenData = await authApi.login(data)
          setToken(result.access_token)
          set({ token: result.access_token, isAuthenticated: true })
          await get().fetchProfile()
        } catch (error) {
          set({ error: (error as Error).message, isAuthenticated: false })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null })
        try {
          await authApi.register(data)
        } catch (error) {
          set({ error: (error as Error).message })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      logout: () => {
        removeToken()
        set({ token: null, user: null, isAuthenticated: false, error: null })
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
    }),
    {
      name: 'mindevo-auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
