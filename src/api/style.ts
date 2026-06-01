import { get, post, put, del } from './client'
import type { Style } from '@/types/style'

export const styleApi = {
  list: (params?: { style_type?: string }) => get<Style[]>('/styles', params),

  getCategories: () => get<string[]>('/style/categories'),

  getById: (uid: string) => get<Style>(`/styles/${uid}`),

  create: (data: Partial<Style>) => post<Style>('/styles', data),

  update: (uid: string, data: Partial<Style>) => put<Style>(`/styles/${uid}`, data),

  delete: (uid: string) => del<{ deleted: boolean }>(`/styles/${uid}`),
}
