import { useState } from 'react'
import { Button } from 'antd'
import { useSSEChat } from '@/hooks/useSSEChat'
import { useChatStore } from '@/stores/chatStore'
import type { ChatMessage, FilmConfigContent } from '@/types/message'
import type { FilmConfig } from '@/types/chat'

interface Props {
  message: ChatMessage
}

export default function FilmConfigMessage({ message }: Props) {
  const { currentConversationId } = useChatStore()
  const { sendMessage } = useSSEChat()

  const content = (message.content as unknown as FilmConfigContent) ?? { options: [] }
  const options = content.options ?? []

  const [config, setConfig] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    for (const opt of options) {
      if (opt.selected_value) {
        initial[opt.key] = opt.selected_value
      }
    }
    return initial
  })

  const [submitted, setSubmitted] = useState(() =>
    options.length > 0 && options.every((opt) => opt.selected_value != null)
  )

  const allSelected =
    options.length > 0 && options.every((opt) => config[opt.key])

  const handleSelect = (key: string, value: string) => {
    if (submitted) return
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const handleConfirm = async () => {
    if (!allSelected || !currentConversationId) return
    setSubmitted(true)
    await sendMessage(
      '已配置影片参数',
      currentConversationId,
      null,
      undefined,
      config as FilmConfig
    )
  }

  if (submitted) {
    return (
      <div className="max-w-md rounded-2xl bg-gray-50 p-5 border border-gray-100">
        <div className="text-sm font-medium text-gray-800 mb-3">影片配置已确认</div>
        <div className="space-y-2">
          {options.map((opt) => {
            const selectedItem = opt.options.find((item) => item.value === config[opt.key])
            return (
              <div key={opt.key} className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{opt.label}</span>
                <span className="font-medium text-gray-800">
                  {selectedItem?.label ?? config[opt.key] ?? '-'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (options.length === 0) {
    return <div className="text-sm text-gray-500">影片配置数据异常</div>
  }

  return (
    <div className="max-w-md rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
      <div className="text-sm text-gray-800 mb-4">
        请先配置影片生成参数，再选择风格。
      </div>

      <div className="space-y-5">
        {options.map((opt) => {
          const selectedValue = config[opt.key]
          return (
            <div key={opt.key}>
              <div className="text-xs font-medium text-gray-500 mb-2">
                {opt.label}
              </div>
              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(opt.options.length, 3)}, minmax(0, 1fr))`,
                }}
              >
                {opt.options.map((item) => {
                  const selected = selectedValue === item.value
                  return (
                    <button
                      key={item.value}
                      onClick={() => handleSelect(opt.key, item.value)}
                      className={`rounded-lg border px-3 py-2 text-sm transition ${
                        selected
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}

        <Button
          type="primary"
          block
          disabled={!allSelected}
          onClick={handleConfirm}
          className="!bg-indigo-600 !border-indigo-600"
        >
          确认并继续
        </Button>
      </div>
    </div>
  )
}
