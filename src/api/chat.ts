import { get, post } from './client'
import { getToken } from '@/utils/storage'
import type { SelectedStyle } from '@/types/style'
import type { AssetReference } from '@/types/message'

export interface ChatRequest {
  user_input: string
  conversation_id: string
  style?: SelectedStyle
  references?: AssetReference[]
}

export const chatApi = {
  streamChat: (data: ChatRequest) => {
    const token = getToken()
    return fetch('/api/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    })
  },

  getStatus: (conversationId: string) =>
    get<{ running: boolean }>(`/chat/status/${conversationId}`),

  stop: (conversationId: string) =>
    post<{ stopped: boolean }>(`/chat/stop/${conversationId}`),
}
