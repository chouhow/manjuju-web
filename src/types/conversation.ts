export interface Conversation {
  id: string
  user_id?: string
  drama_id?: string
  title?: string
  status: 'active' | 'closed'
  created_at?: string
  updated_at?: string
}

export interface ConversationCreate {
  title?: string
}
