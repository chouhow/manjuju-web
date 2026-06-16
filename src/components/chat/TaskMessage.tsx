import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import type { ChatMessage } from '@/types/message'
import type { TaskContent } from '@/types/message'

interface Props {
  message: ChatMessage
}

export default function TaskMessage({ message }: Props) {
  const content = message.content as TaskContent | null
  const status = content?.status || 'in_progress'

  const statusConfig = {
    in_progress: {
      icon: <Loader2 size={18} className="animate-spin text-blue-500" />,
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
    },
    completed: {
      icon: <CheckCircle2 size={18} className="text-green-500" />,
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
    },
    failed: {
      icon: <XCircle size={18} className="text-red-500" />,
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
    },
    cancelled: {
      icon: <XCircle size={18} className="text-gray-500" />,
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-700',
    },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.in_progress

  return (
    <div className="flex gap-3">
      <div className="shrink-0 w-8" />
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${config.bg} ${config.border}`}
      >
        {config.icon}
        <span className={`text-sm font-medium ${config.text}`}>
          {content?.title}
        </span>
        {status === 'in_progress' && (
          <span className="text-xs text-blue-400">进行中...</span>
        )}
        {status === 'completed' && (
          <span className="text-xs text-green-500">已完成</span>
        )}
      </div>
    </div>
  )
}
