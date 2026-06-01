import { create } from 'zustand'
import type { SSEMessage, ChatMessage } from '@/types/message'
import type { SelectedStyle } from '@/types/style'

interface ChatState {
  messages: ChatMessage[]
  isStreaming: boolean
  inputText: string
  selectedStyle: SelectedStyle | null
  currentConversationId: string | null
  currentDramaId: string | null

  setMessages: (messages: ChatMessage[]) => void
  appendMessage: (msg: SSEMessage) => void
  updateMessage: (componentId: number, updates: Partial<ChatMessage>) => void
  removeMessage: (componentId: number) => void
  clearMessages: () => void
  setIsStreaming: (value: boolean) => void
  setInputText: (text: string) => void
  setSelectedStyle: (style: SelectedStyle | null) => void
  setCurrentConversation: (conversationId: string, dramaId: string) => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isStreaming: false,
  inputText: '',
  selectedStyle: null,
  currentConversationId: null,
  currentDramaId: null,

  setMessages: (messages) => set({ messages }),

  appendMessage: (msg) => {
    const { messages } = get()
    if (msg.component_id !== null && msg.component_id !== undefined) {
      const existingIndex = messages.findIndex(
        (m) => m.component_id === msg.component_id
      )
      if (existingIndex >= 0) {
        // 更新已有消息
        const updated = [...messages]
        updated[existingIndex] = { ...updated[existingIndex], ...msg }
        set({ messages: updated })
        return
      }
    }
    // 新消息
    set({ messages: [...messages, { ...msg, isStreaming: true }] })
  },

  updateMessage: (componentId, updates) => {
    const { messages } = get()
    const index = messages.findIndex((m) => m.component_id === componentId)
    if (index >= 0) {
      const updated = [...messages]
      updated[index] = { ...updated[index], ...updates }
      set({ messages: updated })
    }
  },

  removeMessage: (componentId) => {
    const { messages } = get()
    set({
      messages: messages.filter((m) => m.component_id !== componentId),
    })
  },

  clearMessages: () => set({ messages: [] }),

  setIsStreaming: (value) => set({ isStreaming: value }),

  setInputText: (text) => set({ inputText: text }),

  setSelectedStyle: (style) => set({ selectedStyle: style }),

  setCurrentConversation: (conversationId, dramaId) =>
    set({ currentConversationId: conversationId, currentDramaId: dramaId }),
}))
