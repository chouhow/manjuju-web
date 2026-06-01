import { useRef, useEffect } from 'react'
import { useChatStore } from '@/stores/chatStore'
import { useDramaStore } from '@/stores/dramaStore'
import { useSSEChat } from '@/hooks/useSSEChat'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { Film, Users, Mountain, Clapperboard } from 'lucide-react'
import ChatMessageList from './ChatMessageList'
import ChatInput from './ChatInput'

export default function ChatContainer() {
  const { messages, currentConversationId, isStreaming } = useChatStore()
  const { currentDrama } = useDramaStore()
  const { characters, scenes, storyboards } = useWorkspaceStore()
  const { sendMessage, stop, isLoading } = useSSEChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text: string) => {
    if (!currentConversationId) return
    await sendMessage(text, currentConversationId)
  }

  const handleStop = () => {
    if (!currentConversationId) return
    stop(currentConversationId)
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 顶部标题栏 */}
      <div className="border-b border-gray-100 px-4 py-3 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3 min-w-0">
          <Film size={20} className="text-indigo-600 shrink-0" />
          <div className="min-w-0">
            <h2 className="font-semibold text-gray-800 truncate">
              {currentDrama?.title || '未命名漫剧'}
            </h2>
            <p className="text-xs text-gray-400 truncate">
              {currentDrama?.description || '暂无描述'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400 shrink-0">
          <span className="flex items-center gap-1">
            <Users size={12} />
            {characters.length}
          </span>
          <span className="flex items-center gap-1">
            <Mountain size={12} />
            {scenes.length}
          </span>
          <span className="flex items-center gap-1">
            <Clapperboard size={12} />
            {storyboards.length}
          </span>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        <ChatMessageList messages={messages} />
        <div ref={messagesEndRef} />
      </div>

      {/* 输入框 */}
      <ChatInput
        onSend={handleSend}
        onStop={handleStop}
        isLoading={isLoading}
        isStreaming={isStreaming}
      />
    </div>
  )
}
