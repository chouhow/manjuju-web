import { useState } from 'react'
import { Radio } from 'antd'
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
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!content?.styles?.length) return null

  const handleSelect = async (uid: string) => {
    if (!currentConversationId || isSubmitting) return
    const style = content.styles.find((s) => s.uid === uid)
    if (!style) return

    setIsSubmitting(true)
    setSelectedUid(uid)

    const selectedStyle: SelectedStyle = {
      style_type: 'system',
      style_uid: style.uid,
      style_name: style.name,
      image_url: style.image_url,
    }

    useChatStore.getState().setSelectedStyle(selectedStyle)
    setConfirmed(true)

    try {
      await sendMessage(`我选择风格：${style.name}`, currentConversationId, selectedStyle)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (confirmed) {
    const style = content.styles.find((s) => s.uid === selectedUid)
    return (
      <div className="flex gap-3">
        <div className="shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
          <Check size={16} className="text-purple-600" />
        </div>
        <div className="max-w-[80%]">
          <div className="bg-purple-50 border border-purple-200 rounded-2xl rounded-tl-sm px-4 py-3">
            <div className="text-sm font-medium text-purple-800 mb-2">
              已选择风格：<strong>{style?.name}</strong>
            </div>
            <Radio.Group value={selectedUid} disabled className="w-full">
              <div className="grid grid-cols-2 gap-3">
                {content.styles.map((s) => (
                  <div
                    key={s.uid}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                      selectedUid === s.uid
                        ? 'border-purple-500 shadow-md'
                        : 'border-transparent opacity-60'
                    }`}
                  >
                    <Radio value={s.uid} className="absolute top-2 left-2 z-10">
                      <span className="sr-only">{s.name}</span>
                    </Radio>
                    {s.image_url ? (
                      <img
                        src={s.image_url}
                        alt={s.name}
                        className="w-full h-24 object-cover"
                      />
                    ) : (
                      <div className="w-full h-24 bg-purple-100 flex items-center justify-center">
                        <Palette size={24} className="text-purple-300" />
                      </div>
                    )}
                    <div className="p-2 bg-white">
                      <div className="text-xs font-medium text-gray-700 truncate">
                        {s.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Radio.Group>
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
          <div className="grid grid-cols-2 gap-3">
            {content.styles.map((style) => (
              <div
                key={style.uid}
                className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                  isSubmitting ? 'opacity-50 pointer-events-none' : ''
                } ${
                  selectedUid === style.uid
                    ? 'border-purple-500 shadow-md'
                    : 'border-transparent hover:border-purple-200'
                }`}
                onClick={() => handleSelect(style.uid)}
              >
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
        </div>
      </div>
    </div>
  )
}
