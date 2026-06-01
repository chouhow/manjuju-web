export interface Drama {
  drama_id: string
  user_id: string
  title: string
  description?: string
  thumbnail_url?: string
  status: 'draft' | 'in_progress' | 'completed'
  conversation_id?: string
  is_favorite?: boolean
  source_drama_id?: string
  created_at: string
  updated_at: string
  result_video_url?: string
}

export interface DramaCreate {
  title?: string
  description?: string
  thumbnail_url?: string
}

export interface DramaUpdate {
  title?: string
  description?: string
  thumbnail_url?: string
  status?: string
}
