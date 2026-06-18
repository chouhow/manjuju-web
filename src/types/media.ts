export type MediaSource = 'character' | 'scene' | 'storyboard'
export type MediaType = 'image' | 'video'

export interface MediaItem {
  media_type: MediaType
  source: MediaSource
  source_id: string
  source_name: string
  url: string
  label: string
  created_at: string
  updated_at: string
}

export interface MediaListResponse {
  items: MediaItem[]
  total: number
  image_count: number
  video_count: number
}
