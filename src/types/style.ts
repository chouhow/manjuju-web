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
}

export interface SelectedStyle {
  style_type: 'system' | 'custom' | 'upload' | 'text'
  style_uid?: string
  style_name?: string
  style_text?: string
  style_prompt?: string
  image_url?: string
}
