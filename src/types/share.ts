import type { Character } from './character'
import type { Scene } from './scene'
import type { Script } from './script'
import type { Storyboard } from './storyboard'
import type { ChatMessage } from './message'

export interface SharePreviewDrama {
  drama_id: string
  title: string
  description?: string
  thumbnail_url?: string
  status: string
  result_video_url?: string
  created_at?: string
}

export interface SharePreview {
  drama: SharePreviewDrama
  characters: Character[]
  scenes: Scene[]
  script: Script | null
  storyboards: Storyboard[]
  messages: ChatMessage[]
}

export interface ShareOut {
  share_id: string
  drama_id: string
  share_token: string
  share_url?: string
  permission: string
  expires_at?: string
  is_active: boolean
  access_count: number
  fork_count: number
  created_at: string
}
