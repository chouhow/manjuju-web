import { useState } from 'react'
import { Brain, ChevronDown } from 'lucide-react'
import type { ChatMessage } from '@/types/message'

interface Props {
  message: ChatMessage
}

export default function ThinkMessage({ message }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex gap-3">
      <div className="shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
        <Brain size={16} className="text-gray-500" />
      </div>
      <div className="max-w-[80%]">
        <div
          className="bg-gray-50 border border-gray-200 rounded-xl rounded-tl-sm px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Brain size={14} />
            <span className="font-medium">思考过程</span>
            <ChevronDown
              size={14}
              className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
          {isOpen && (
            <div className="mt-2 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
