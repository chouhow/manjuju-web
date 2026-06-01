import { ArrowRightLeft } from 'lucide-react'
import type { ChatMessage } from '@/types/message'
import type { HandoverContent } from '@/types/message'

interface Props {
  message: ChatMessage
}

export default function HandoverMessage({ message }: Props) {
  const content = message.content as HandoverContent | null

  return (
    <div className="flex justify-center my-4">
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-500">
        <ArrowRightLeft size={14} />
        <span>
          <strong className="text-gray-700">@{content?.inviter || 'AI'}</strong>{' '}
          邀请{' '}
          <strong className="text-gray-700">
            @{content?.invitee || '新角色'}
          </strong>{' '}
          加入了群聊
        </span>
      </div>
    </div>
  )
}
