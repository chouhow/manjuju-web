import { useState } from 'react'
import { Button } from 'antd'
import { useSSEChat } from '@/hooks/useSSEChat'
import { useChatStore } from '@/stores/chatStore'
import type { FilmConfig } from '@/types/chat'

interface Props {
  message: {
    component_id: number | null
  }
}

const LENGTH_OPTIONS: { label: string; value: FilmConfig['film_length'] }[] = [
  { label: '短视频', value: '<=120s' },
  { label: '长视频', value: '>120s' },
]

const RATIO_OPTIONS: { label: string; value: FilmConfig['film_ratio'] }[] = [
  { label: '横版 16:9', value: '16:9' },
  { label: '竖版 9:16', value: '9:16' },
]

const LANGUAGE_OPTIONS: { label: string; value: FilmConfig['dialogue_language'] }[] = [
  { label: '中文', value: 'zh' },
  { label: '英文', value: 'en' },
]

export default function FilmConfigRequestMessage({ message: _message }: Props) {
  const { currentConversationId } = useChatStore()
  const { sendMessage } = useSSEChat()
  const [config, setConfig] = useState<FilmConfig>({})
  const [submitted, setSubmitted] = useState(false)

  const canSubmit = config.film_length && config.film_ratio && config.dialogue_language

  const handleConfirm = async () => {
    if (!canSubmit || !currentConversationId) return
    setSubmitted(true)
    await sendMessage('已配置影片参数', currentConversationId, null, undefined, config)
  }

  if (submitted) {
    return (
      <div className="inline-block rounded-2xl bg-gray-100 px-4 py-2 text-sm text-gray-500">
        信息已确认
      </div>
    )
  }

  return (
    <div className="max-w-md rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
      <div className="text-sm text-gray-800 mb-4">请先配置影片生成参数，再选择风格。</div>

      <div className="space-y-5">
        <div>
          <div className="text-xs font-medium text-gray-500 mb-2">影片长度</div>
          <div className="grid grid-cols-2 gap-2">
            {LENGTH_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setConfig((prev) => ({ ...prev, film_length: opt.value }))}
                className={`rounded-lg border px-3 py-2 text-sm transition ${
                  config.film_length === opt.value
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium text-gray-500 mb-2">影片比例</div>
          <div className="grid grid-cols-2 gap-2">
            {RATIO_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setConfig((prev) => ({ ...prev, film_ratio: opt.value }))}
                className={`rounded-lg border px-3 py-2 text-sm transition ${
                  config.film_ratio === opt.value
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium text-gray-500 mb-2">对白语言</div>
          <div className="grid grid-cols-2 gap-2">
            {LANGUAGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setConfig((prev) => ({ ...prev, dialogue_language: opt.value }))}
                className={`rounded-lg border px-3 py-2 text-sm transition ${
                  config.dialogue_language === opt.value
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <Button
          type="primary"
          block
          disabled={!canSubmit}
          onClick={handleConfirm}
          className="!bg-indigo-600 !border-indigo-600"
        >
          确认并继续
        </Button>
      </div>
    </div>
  )
}
