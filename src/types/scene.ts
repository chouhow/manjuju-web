export interface Scene {
  uid: string
  drama_uid: string
  name: string
  description?: string
  prompt?: string
  image_url?: string
  multi_view_image_url?: string
  is_asset?: boolean
  created_at?: string
  updated_at?: string
}
