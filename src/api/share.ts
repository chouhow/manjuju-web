import { get, post, del } from './client'
import type { SharePreview, ShareOut } from '@/types/share'

export const shareApi = {
  preview: (shareToken: string) =>
    get<SharePreview>(`/shares/${shareToken}/read`),

  stream: (shareToken: string, signal?: AbortSignal) =>
    fetch(`/api/shares/${shareToken}/stream`, { signal }),

  status: (shareToken: string) =>
    get<{ running: boolean }>(`/shares/${shareToken}/status`),

  create: (dramaId: string, expiresInDays?: number | null) =>
    post<ShareOut>(`/dramas/${dramaId}/shares`, { expires_in_days: expiresInDays }),

  list: (dramaId: string) =>
    get<ShareOut[]>(`/dramas/${dramaId}/shares`),

  revoke: (shareId: string) =>
    del<{ revoked: boolean }>(`/shares/${shareId}`),
}
