import type { ChatMessage } from '@/types/message'

interface Props {
  message: ChatMessage
}

export default function UserTextMessage({ message }: Props) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
      </div>
    </div>
  )
}
