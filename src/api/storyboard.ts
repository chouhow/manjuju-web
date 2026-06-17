import { get, post, put, del } from './client'
import type { Storyboard } from '@/types/storyboard'

export const storyboardApi = {
  list: (dramaId: string) =>
    get<{ storyboards: Storyboard[] }>(`/dramas/${dramaId}/storyboards`).then(
      (res) => res.storyboards
    ),

  create: (dramaId: string, data: Partial<Storyboard>) =>
    post<Storyboard>(`/dramas/${dramaId}/storyboards`, data),

  getById: (dramaId: string, sid: number) =>
    get<Storyboard>(`/dramas/${dramaId}/storyboards/${sid}`),

  update: (dramaId: string, sid: number, data: Partial<Storyboard>) =>
    put<Storyboard>(`/dramas/${dramaId}/storyboards/${sid}`, data),

  delete: (dramaId: string, sid: number) =>
    del<{ deleted: boolean }>(`/dramas/${dramaId}/storyboards/${sid}`),

  getHistory: (dramaId: string, sid: number) =>
    get<unknown[]>(`/dramas/${dramaId}/storyboards/${sid}/history`),

  restore: (dramaId: string, sid: number, historyId: string) =>
    post<{ restored: boolean }>(
      `/dramas/${dramaId}/storyboards/${sid}/history/restore`,
      { history_id: historyId }
    ),

  restoreImage: (dramaId: string, sid: number, historyId: string) =>
    post<{ restored: boolean }>(
      `/dramas/${dramaId}/storyboards/${sid}/history/restore-image`,
      { history_id: historyId }
    ),

  restoreVideo: (dramaId: string, sid: number, historyId: string) =>
    post<{ restored: boolean }>(
      `/dramas/${dramaId}/storyboards/${sid}/history/restore-video`,
      { history_id: historyId }
    ),

  backfill: (dramaId: string, sid: number) =>
    post<{ backfilled: boolean }>(
      `/dramas/${dramaId}/storyboards/${sid}/history/backfill`
    ),
}
