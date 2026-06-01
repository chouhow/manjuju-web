import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Bot } from 'lucide-react'
import type { ChatMessage } from '@/types/message'

interface Props {
  message: ChatMessage
}

export default function AITextMessage({ message }: Props) {
  return (
    <div className="flex gap-3">
      <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
        <Bot size={18} className="text-indigo-600" />
      </div>
      <div className="max-w-[80%]">
        <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
          <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-headings:my-2">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.text || ''}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}
