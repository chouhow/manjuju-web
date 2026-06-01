import { useState } from 'react'
import { Button } from 'antd'
import { Check } from 'lucide-react'
import { useChatStore } from '@/stores/chatStore'
import { useSSEChat } from '@/hooks/useSSEChat'
import type { ChatMessage } from '@/types/message'
import type { OptionsContent } from '@/types/message'

interface Props {
  message: ChatMessage
}

export default function OptionsMessage({ message }: Props) {
  const content = message.content as OptionsContent | null
  const { currentConversationId } = useChatStore()
  const { sendMessage } = useSSEChat()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    content?.selected_index ?? null
  )

  if (!content?.items?.length) return null

  const isSelectable = content.selectable !== false && selectedIndex === null

  const handleSelect = async (index: number, item: string) => {
    if (!isSelectable || !currentConversationId) return
    setSelectedIndex(index)
    await sendMessage(item, currentConversationId)
  }

  return (
    <div className="flex gap-3">
      <div className="shrink-0 w-8" />
      <div className="max-w-[80%] space-y-2">
        {content.items.map((item, index) => (
          <Button
            key={index}
            type={selectedIndex === index ? 'primary' : 'default'}
            disabled={!isSelectable && selectedIndex !== index}
            onClick={() => handleSelect(index, item)}
            className={`!rounded-xl !h-auto !py-2.5 !px-4 text-left !justify-start w-full ${
              selectedIndex === index
                ? ''
                : 'hover:!border-indigo-300 hover:!text-indigo-600'
            }`}
          >
            <div className="flex items-center gap-2">
              {selectedIndex === index && <Check size={16} />}
              <span>{item}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}
