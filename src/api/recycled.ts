import { get, post, del } from './client'
import type { Drama } from '@/types/drama'

export interface RecycledDrama extends Drama {
  deleted_at?: string
}

export const recycledApi = {
  listDramas: (params?: { skip?: number; limit?: number }) =>
    get<RecycledDrama[]>('/recycled/dramas', params),

  restoreDrama: (id: string) =>
    post<{ restored: boolean }>(`/recycled/dramas/${id}/restore`),

  deleteDrama: (id: string) =>
    del<{ deleted: boolean }>(`/recycled/dramas/${id}`),

  listCharacters: (params?: { skip?: number; limit?: number }) =>
    get<{ items: unknown[] }>('/recycled/characters', params),

  restoreCharacter: (uid: string) =>
    post<{ restored: boolean }>(`/recycled/characters/${uid}/restore`),

  deleteCharacter: (uid: string) =>
    del<{ deleted: boolean }>(`/recycled/characters/${uid}`),

  listScenes: (params?: { skip?: number; limit?: number }) =>
    get<{ items: unknown[] }>('/recycled/scenes', params),

  restoreScene: (uid: string) =>
    post<{ restored: boolean }>(`/recycled/scenes/${uid}/restore`),

  deleteScene: (uid: string) =>
    del<{ deleted: boolean }>(`/recycled/scenes/${uid}`),
}
