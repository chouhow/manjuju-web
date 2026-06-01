export interface ApiResponse<T = unknown> {
  code: number
  msg: string
  data: T
}

export interface LoginData {
  email?: string
  phone?: string
  password?: string
  verification_code?: string
}

export interface RegisterData {
  username: string
  phone: string
  email?: string
  password: string
  confirm_password?: string
}

export interface User {
  user_id: string
  username: string
  email?: string
  phone?: string
  role?: string
  is_active?: boolean
  balance?: number
}

export interface TokenData {
  access_token: string
  token_type: string
}
