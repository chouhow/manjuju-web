import { get, post, put, del } from './client'
import type { Script } from '@/types/script'

export const scriptApi = {
  get: (dramaId: string) =>
    get<{ script: Script }>(`/dramas/${dramaId}/script`).then((res) => res.script),

  getHistory: (dramaId: string) =>
    get<unknown[]>(`/dramas/${dramaId}/scripts/history`),

  create: (dramaId: string, data: { title: string; content?: string }) =>
    post<Script>(`/dramas/${dramaId}/script`, data),

  update: (dramaId: string, data: { title?: string; content?: string }) =>
    put<Script>(`/dramas/${dramaId}/script`, data),

  delete: (dramaId: string) =>
    del<{ deleted: boolean }>(`/dramas/${dramaId}/script`),

  updateContent: (uid: string, content: string) =>
    put<Script>(`/scripts/${uid}/content`, { content }),
}
