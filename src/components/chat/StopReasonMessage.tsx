import { CheckCircle2 } from 'lucide-react'
import type { ChatMessage } from '@/types/message'

interface Props {
  message: ChatMessage
}

export default function StopReasonMessage({ message }: Props) {
  const reason = message.content?.reason as string

  const reasonText = {
    completed: '任务已完成',
    cancelled: '已停止生成',
    error: '生成出错',
  }

  return (
    <div className="flex justify-center my-2">
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-full text-xs text-green-600">
        <CheckCircle2 size={12} />
        <span>{reasonText[reason as keyof typeof reasonText] || '已结束'}</span>
      </div>
    </div>
  )
}
