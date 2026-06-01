import { useState } from 'react'
import { Button, Radio } from 'antd'
import { Palette, Check } from 'lucide-react'
import { useChatStore } from '@/stores/chatStore'
import { useSSEChat } from '@/hooks/useSSEChat'
import type { ChatMessage } from '@/types/message'
import type { StyleSelectContent } from '@/types/message'
import type { SelectedStyle } from '@/types/style'

interface Props {
  message: ChatMessage
}

export default function StyleSelectMessage({ message }: Props) {
  const content = message.content as StyleSelectContent | null
  const { currentConversationId } = useChatStore()
  const { sendMessage } = useSSEChat()
  const [selectedUid, setSelectedUid] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  if (!content?.styles?.length) return null

  const handleConfirm = async () => {
    if (!selectedUid || !currentConversationId) return
    const style = content.styles.find((s) => s.uid === selectedUid)
    if (!style) return

    const selectedStyle: SelectedStyle = {
      style_type: 'system',
      style_uid: style.uid,
      style_name: style.name,
      image_url: style.image_url,
    }

    // 设置选中的风格到store
    useChatStore.getState().setSelectedStyle(selectedStyle)
    setConfirmed(true)

    // 发送确认消息
    await sendMessage(`我选择风格：${style.name}`, currentConversationId, selectedStyle)
  }

  if (confirmed) {
    const style = content.styles.find((s) => s.uid === selectedUid)
    return (
      <div className="flex gap-3">
        <div className="shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
          <Check size={16} className="text-purple-600" />
        </div>
        <div className="bg-purple-50 rounded-2xl rounded-tl-sm px-4 py-3">
          <div className="text-sm text-purple-700">
            已选择风格：<strong>{style?.name}</strong>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <div className="shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
        <Palette size={16} className="text-purple-600" />
      </div>
      <div className="max-w-[80%]">
        <div className="bg-purple-50 border border-purple-200 rounded-2xl rounded-tl-sm px-4 py-3">
          <div className="text-sm font-medium text-purple-800 mb-3">
            请选择一个风格
          </div>
          <Radio.Group
            value={selectedUid}
            onChange={(e) => setSelectedUid(e.target.value)}
            className="w-full"
          >
            <div className="grid grid-cols-2 gap-3">
              {content.styles.map((style) => (
                <div
                  key={style.uid}
                  className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    selectedUid === style.uid
                      ? 'border-purple-500 shadow-md'
                      : 'border-transparent hover:border-purple-200'
                  }`}
                  onClick={() => setSelectedUid(style.uid)}
                >
                  <Radio value={style.uid} className="absolute top-2 left-2 z-10">
                    <span className="sr-only">{style.name}</span>
                  </Radio>
                  {style.image_url ? (
                    <img
                      src={style.image_url}
                      alt={style.name}
                      className="w-full h-24 object-cover"
                    />
                  ) : (
                    <div className="w-full h-24 bg-purple-100 flex items-center justify-center">
                      <Palette size={24} className="text-purple-300" />
                    </div>
                  )}
                  <div className="p-2 bg-white">
                    <div className="text-xs font-medium text-gray-700 truncate">
                      {style.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Radio.Group>
          <div className="mt-3 flex justify-end">
            <Button
              type="primary"
              size="small"
              disabled={!selectedUid}
              onClick={handleConfirm}
            >
              确认选择
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
