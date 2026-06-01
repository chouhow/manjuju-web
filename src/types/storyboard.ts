export interface Storyboard {
  id: number
  drama_id: string
  sequence: number
  content?: string
  character_names?: string[]
  scene_name?: string
  characters?: Record<string, unknown>
  scene?: Record<string, unknown>
  total_storyboard_url?: string
  storyboard_images?: string[]
  video_url?: string
  created_at?: string
  updated_at?: string
}
