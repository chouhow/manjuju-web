import axios, { AxiosError, AxiosResponse } from 'axios'
import { ApiResponse } from '@/types/api'
import { getToken, removeToken } from '@/utils/storage'

const client = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

client.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response
    if (data.code !== 0) {
      const error = new Error(data.msg || '请求失败')
      ;(error as any).code = data.code
      throw error
    }
    return response
  },
  (error: AxiosError<ApiResponse>) => {
    const response = error.response
    if (response?.status === 401) {
      removeToken()
      window.location.href = '/login'
      return Promise.reject(new Error('登录已过期，请重新登录'))
    }
    const msg = response?.data?.msg || error.message || '网络错误'
    return Promise.reject(new Error(msg))
  }
)

export default client

export function get<T>(url: string, params?: Record<string, unknown>) {
  return client.get<ApiResponse<T>>(url, { params }).then((res) => res.data.data)
}

export function post<T>(url: string, data?: unknown) {
  return client.post<ApiResponse<T>>(url, data).then((res) => res.data.data)
}

export function put<T>(url: string, data?: unknown) {
  return client.put<ApiResponse<T>>(url, data).then((res) => res.data.data)
}

export function del<T>(url: string) {
  return client.delete<ApiResponse<T>>(url).then((res) => res.data.data)
}
