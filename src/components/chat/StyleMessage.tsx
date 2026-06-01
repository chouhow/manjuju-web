import { Palette } from 'lucide-react'
import type { ChatMessage } from '@/types/message'
import type { StyleContent } from '@/types/message'

interface Props {
  message: ChatMessage
}

export default function StyleMessage({ message }: Props) {
  const content = message.content as StyleContent | null

  return (
    <div className="flex gap-3">
      <div className="shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
        <Palette size={16} className="text-purple-600" />
      </div>
      <div className="max-w-[80%]">
        <div className="bg-purple-50 border border-purple-200 rounded-2xl rounded-tl-sm px-4 py-3">
          <div className="text-sm font-medium text-purple-800 mb-2">
            风格已确认
          </div>
          <div className="flex items-center gap-3">
            {content?.image_url && (
              <img
                src={content.image_url}
                alt={content.style_name || ''}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div>
              <div className="text-sm font-semibold text-gray-800">
                {content?.style_name || '未命名风格'}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                类型: {content?.style_type}
              </div>
              {content?.style_prompt && (
                <div className="text-xs text-gray-400 mt-1 line-clamp-2 max-w-xs">
                  {content.style_prompt}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
