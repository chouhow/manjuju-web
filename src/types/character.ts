export interface Character {
  uid: string
  drama_uid: string
  name: string
  portrait_prompt?: string
  concept_prompt?: string
  background?: string
  portrait_image_url?: string
  concept_image_url?: string
  is_asset?: boolean
  created_at?: string
  updated_at?: string
}
