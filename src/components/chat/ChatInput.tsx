import { useState, useRef, KeyboardEvent } from 'react'
import { Button, Upload, Tooltip } from 'antd'
import { Send, Paperclip, Image as ImageIcon, Square, Loader2 } from 'lucide-react'
import { useChatStore } from '@/stores/chatStore'
import { conversationApi } from '@/api/conversation'

interface Props {
  onSend: (text: string) => void
  onStop: () => void
  isLoading: boolean
  isStreaming: boolean
}

export default function ChatInput({ onSend, onStop, isLoading, isStreaming }: Props) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { currentConversationId } = useChatStore()

  const handleSend = () => {
    if (!text.trim() || isLoading) return
    onSend(text.trim())
    setText('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (isStreaming) {
        onStop()
      } else {
        handleSend()
      }
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    // 自动调整高度
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
  }

  const handleFileUpload = async (file: File) => {
    if (!currentConversationId) return false
    try {
      await conversationApi.uploadFile(currentConversationId, file)
      return false // 阻止默认上传行为
    } catch {
      return false
    }
  }

  const handleImageUpload = async (file: File) => {
    if (!currentConversationId) return false
    try {
      await conversationApi.uploadImage(currentConversationId, file)
      return false
    } catch {
      return false
    }
  }

  return (
    <div className="border-t border-gray-200 bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="输入消息... (Shift+Enter换行, Enter发送)"
            className="w-full resize-none outline-none text-gray-700 bg-transparent min-h-[24px] max-h-[200px]"
            rows={1}
            disabled={isLoading}
          />

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <Upload
                beforeUpload={handleFileUpload}
                showUploadList={false}
                accept=".txt,.md,.pdf,.docx"
              >
                <Tooltip title="上传文件">
                  <Button
                    type="text"
                    size="small"
                    icon={<Paperclip size={18} className="text-gray-500" />}
                    className="!text-gray-500 hover:!text-indigo-600"
                  />
                </Tooltip>
              </Upload>

              <Upload
                beforeUpload={handleImageUpload}
                showUploadList={false}
                accept="image/*"
              >
                <Tooltip title="上传图片">
                  <Button
                    type="text"
                    size="small"
                    icon={<ImageIcon size={18} className="text-gray-500" />}
                    className="!text-gray-500 hover:!text-indigo-600"
                  />
                </Tooltip>
              </Upload>
            </div>

            {isStreaming ? (
              <Button
                danger
                size="small"
                icon={<Square size={14} />}
                onClick={onStop}
              >
                停止
              </Button>
            ) : (
              <Button
                type="primary"
                size="small"
                icon={isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                onClick={handleSend}
                disabled={!text.trim() || isLoading}
                className="!rounded-lg"
              >
                发送
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
