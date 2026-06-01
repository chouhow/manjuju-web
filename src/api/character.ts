import { get, post, put, del } from './client'
import type { Character } from '@/types/character'

export const characterApi = {
  list: (dramaId: string) =>
    get<Character[]>(`/dramas/${dramaId}/characters`),

  create: (dramaId: string, data: Partial<Character>) =>
    post<Character>(`/dramas/${dramaId}/characters`, data),

  getById: (dramaId: string, uid: string) =>
    get<Character>(`/dramas/${dramaId}/characters/${uid}`),

  update: (dramaId: string, uid: string, data: Partial<Character>) =>
    put<Character>(`/dramas/${dramaId}/characters/${uid}`, data),

  delete: (dramaId: string, uid: string) =>
    del<{ deleted: boolean }>(`/dramas/${dramaId}/characters/${uid}`),

  getPortraitHistory: (dramaId: string) =>
    get<unknown[]>(`/dramas/${dramaId}/characters/portrait-history`),

  restorePortrait: (dramaId: string, historyId: string) =>
    post<{ restored: boolean }>(
      `/dramas/${dramaId}/characters/portrait-history/restore`,
      { history_id: historyId }
    ),

  getConceptHistory: (dramaId: string) =>
    get<unknown[]>(`/dramas/${dramaId}/characters/concept-history`),

  restoreConcept: (dramaId: string, historyId: string) =>
    post<{ restored: boolean }>(
      `/dramas/${dramaId}/characters/concept-history/restore`,
      { history_id: historyId }
    ),
}
