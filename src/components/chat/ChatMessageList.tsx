import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare } from 'lucide-react'
import { useChatStore } from '@/stores/chatStore'
import type { ChatMessage } from '@/types/message'
import UserTextMessage from './UserTextMessage'
import AITextMessage from './AITextMessage'
import ThinkMessage from './ThinkMessage'
import TaskMessage from './TaskMessage'
import OptionsMessage from './OptionsMessage'
import HandoverMessage from './HandoverMessage'
import StyleMessage from './StyleMessage'
import StyleSelectMessage from './StyleSelectMessage'
import StopReasonMessage from './StopReasonMessage'
import TypingIndicator from './TypingIndicator'

interface Props {
  messages: ChatMessage[]
}

const messageComponents: Record<string, React.FC<{ message: ChatMessage }>> = {
  user_text: UserTextMessage,
  user_file: UserTextMessage,
  ai_text: AITextMessage,
  think: ThinkMessage,
  task: TaskMessage,
  options: OptionsMessage,
  handover: HandoverMessage,
  style: StyleMessage,
  style_select: StyleSelectMessage,
  stop_reason: StopReasonMessage,
}

export default function ChatMessageList({ messages }: Props) {
  const { isStreaming } = useChatStore()

  // 过滤掉不显示在聊天框的消息和重复component_id的消息
  const visibleMessages = messages.filter(
    (msg) => msg.sender !== 'workspace' && msg.msg_type !== 'error'
  )

  if (visibleMessages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400">
        <MessageSquare size={48} className="mb-4 text-gray-300" />
        <p className="text-lg font-medium">开始对话</p>
        <p className="text-sm mt-1">输入消息与 AI 导演交流</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <AnimatePresence initial={false}>
        {visibleMessages.map((message, index) => {
          const Component = messageComponents[message.msg_type]
          if (!Component) {
            return (
              <motion.div
                key={message.component_id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-gray-500 text-sm"
              >
                [{message.msg_type}] {message.text}
              </motion.div>
            )
          }
          return (
            <motion.div
              key={message.component_id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Component message={message} />
            </motion.div>
          )
        })}
      </AnimatePresence>

      {isStreaming && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <TypingIndicator />
        </motion.div>
      )}
    </div>
  )
}
