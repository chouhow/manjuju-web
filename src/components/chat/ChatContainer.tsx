import { useRef, useEffect, useState } from 'react'
import { Button } from 'antd'
import { useChatStore } from '@/stores/chatStore'
import { useDramaStore } from '@/stores/dramaStore'
import { useSSEChat } from '@/hooks/useSSEChat'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { Film, Users, Mountain, Clapperboard, Share2 } from 'lucide-react'
import type { AssetReference } from '@/types/message'
import type { SelectedStyle } from '@/types/style'
import ChatMessageList from './ChatMessageList'
import ChatInput from './ChatInput'
import ShareModal from '@/components/share/ShareModal'

interface ChatContainerProps {
  readOnly?: boolean
}

export default function ChatContainer({ readOnly }: ChatContainerProps) {
  const { messages, currentConversationId, isStreaming } = useChatStore()
  const { currentDrama } = useDramaStore()
  const { characters, scenes, storyboards } = useWorkspaceStore()
  const { sendMessage, stop, isLoading } = useSSEChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState<SelectedStyle | null>(null)

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text: string, references?: AssetReference[]) => {
    if (!currentConversationId) return
    await sendMessage(text, currentConversationId, selectedStyle, references)
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
          {!readOnly && currentDrama?.drama_id && (
            <Button
              type="text"
              size="small"
              icon={<Share2 size={14} />}
              className="text-gray-400 hover:text-indigo-600 ml-1"
              onClick={() => setShareModalOpen(true)}
            >
              分享
            </Button>
          )}
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        <ChatMessageList messages={messages} />
        <div ref={messagesEndRef} />
      </div>

      {/* 输入框 */}
      {!readOnly && (
        <ChatInput
          onSend={handleSend}
          onStop={handleStop}
          isLoading={isLoading}
          isStreaming={isStreaming}
          selectedStyle={selectedStyle}
          onStyleChange={setSelectedStyle}
        />
      )}

      {currentDrama?.drama_id && (
        <ShareModal
          dramaId={currentDrama.drama_id}
          open={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
        />
      )}
    </div>
  )
}
