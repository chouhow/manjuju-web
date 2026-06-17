import { get, post, put, del } from './client'
import type { Scene } from '@/types/scene'

export const sceneApi = {
  list: (dramaId: string) =>
    get<{ scenes: Scene[] }>(`/dramas/${dramaId}/scenes`).then((res) => res.scenes),

  create: (dramaId: string, data: Partial<Scene>) =>
    post<Scene>(`/dramas/${dramaId}/scenes`, data),

  getById: (dramaId: string, uid: string) =>
    get<Scene>(`/dramas/${dramaId}/scenes/${uid}`),

  update: (dramaId: string, uid: string, data: Partial<Scene>) =>
    put<Scene>(`/dramas/${dramaId}/scenes/${uid}`, data),

  delete: (dramaId: string, uid: string) =>
    del<{ deleted: boolean }>(`/dramas/${dramaId}/scenes/${uid}`),

  getImageHistory: (dramaId: string) =>
    get<unknown[]>(`/dramas/${dramaId}/scenes/image-history`),

  restoreImage: (dramaId: string, historyId: string) =>
    post<{ restored: boolean }>(
      `/dramas/${dramaId}/scenes/image-history/restore`,
      { history_id: historyId }
    ),

  getMultiViewHistory: (dramaId: string) =>
    get<unknown[]>(`/dramas/${dramaId}/scenes/multi-view-history`),

  restoreMultiView: (dramaId: string, historyId: string) =>
    post<{ restored: boolean }>(
      `/dramas/${dramaId}/scenes/multi-view-history/restore`,
      { history_id: historyId }
    ),
}
