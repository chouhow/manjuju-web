import { get, post } from './client'
import type { SelectedStyle } from '@/types/style'

export interface ChatRequest {
  user_input: string
  conversation_id: string
  style?: SelectedStyle
}

export const chatApi = {
  streamChat: (data: ChatRequest) => {
    return fetch('/api/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  },

  getStatus: (conversationId: string) =>
    get<{ running: boolean }>(`/chat/status/${conversationId}`),

  stop: (conversationId: string) =>
    post<{ stopped: boolean }>(`/chat/stop/${conversationId}`),
}
