export interface StyleExample {
  id: string
  style_id: string
  style_name: string
  example_type: 'character' | 'scene'
  prompt_example: string
  image_url?: string
  priority: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Style {
  uid: string
  name: string
  description?: string
  category?: string
  style_type: 'system' | 'custom' | 'upload' | 'text'
  user_id?: string
  drama_id?: string
  image_url?: string
  is_active?: boolean
  created_at?: string
  examples?: StyleExample[]
}

export interface SelectedStyle {
  style_type: 'system' | 'custom' | 'upload' | 'text'
  style_uid?: string
  style_name?: string
  style_text?: string
  style_prompt?: string
  image_url?: string
}
