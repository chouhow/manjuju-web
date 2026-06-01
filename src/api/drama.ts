import { get, post, put, del } from './client'
import type { Drama, DramaCreate, DramaUpdate } from '@/types/drama'

export const dramaApi = {
  list: (params?: { skip?: number; limit?: number }) =>
    get<Drama[]>('/dramas', params),

  recent: (params?: { limit?: number }) =>
    get<Drama[]>('/dramas/recent', params),

  search: (keyword: string, params?: { skip?: number; limit?: number }) =>
    get<Drama[]>('/dramas/search', { keyword, ...params }),

  create: (data: DramaCreate) => post<Drama>('/dramas', data),

  getById: (id: string) => get<Drama>(`/dramas/${id}`),

  update: (id: string, data: DramaUpdate) => put<Drama>(`/dramas/${id}`, data),

  updateTitle: (id: string, title: string) =>
    put<Drama>(`/dramas/${id}/title`, { title }),

  delete: (id: string) => del<{ recycled: boolean }>(`/dramas/${id}`),

  getAll: (id: string) =>
    get<{
      characters: unknown[]
      scenes: unknown[]
      storyboards: unknown[]
      script: unknown
      result_video_url?: string
    }>(`/dramas/${id}/all`),

  // Favorites
  listFavorites: (params?: { skip?: number; limit?: number }) =>
    get<{ items: Drama[]; total: number; skip: number; limit: number }>(
      '/dramas/favorites',
      params
    ),

  addFavorite: (id: string) =>
    post<{ favorited: boolean; favorited_at?: string }>(`/dramas/${id}/favorite`),

  removeFavorite: (id: string) =>
    del<{ favorited: boolean }>(`/dramas/${id}/favorite`),
}
