import { post, get } from './client'
import type { LoginData, RegisterData, TokenData, User } from '@/types/api'

export const authApi = {
  login: (data: LoginData) => post<TokenData>('/auth/login', data),
  register: (data: RegisterData) => post<User>('/auth/register', data),
  sendLoginCode: (phone: string) =>
    post<{ sent: boolean }>('/auth/send-login-code', { phone }),
  forgotPassword: (email: string) =>
    post<{ sent: boolean }>('/auth/forgot-password', { email }),
  resetPassword: (data: { token: string; new_password: string }) =>
    post<{ success: boolean }>('/auth/reset-password', data),
  changePassword: (data: { old_password: string; new_password: string }) =>
    post<{ success: boolean }>('/auth/change-password', data),
  getProfile: () => get<User>('/auth/profile'),
}
