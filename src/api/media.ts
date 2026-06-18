import { get } from './client'
import type { MediaListResponse, MediaSource, MediaType } from '@/types/media'

export const mediaApi = {
  list: (
    dramaId: string,
    params?: {
      media_type?: 'all' | MediaType
      source?: 'all' | MediaSource
    }
  ) => get<MediaListResponse>(`/dramas/${dramaId}/media`, params),
}
