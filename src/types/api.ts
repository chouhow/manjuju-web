export interface ApiResponse<T = unknown> {
  code: number
  msg: string
  data: T
}

export interface LoginData {
  username?: string
  email?: string
  phone?: string
  password?: string
  code?: string
}

export interface RegisterData {
  username: string
  email?: string
  phone?: string
  password: string
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
