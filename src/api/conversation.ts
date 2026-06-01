import { get, post } from './client'
import type { Conversation, ConversationCreate } from '@/types/conversation'
import type { SSEMessage } from '@/types/message'

export const conversationApi = {
  create: (data: ConversationCreate) =>
    post<Conversation>('/conversations', data),

  getMessages: (id: string, params?: { skip?: number; limit?: number }) =>
    get<{ messages: Array<Conversation & SSEMessage> }>(`/conversations/${id}`, params),

  getHistory: (
    id: string,
    params?: {
      skip?: number
      limit?: number
      msg_type?: string
      sender?: string
      after_component_id?: number
    }
  ) =>
    get<{ total: number; messages: SSEMessage[] }>(
      `/conversations/${id}/messages`,
      params
    ),

  uploadFile: (id: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return post<{
      script_uid: string
      title: string
      content_length: number
      drama_id: string
    }>(`/conversations/${id}/upload`, formData)
  },

  uploadImage: (id: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return post<{
      file_uid: string
      file_url: string
      file_name: string
      file_type: string
      file_size: number
      drama_id: string
    }>(`/conversations/${id}/upload-image`, formData)
  },
}
