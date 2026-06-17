import { useState } from 'react'
import { Button, Modal } from 'antd'
import type { FilmConfig } from '@/types/chat'

interface FilmConfigModalProps {
  open: boolean
  onConfirm: (config: FilmConfig) => void
}

const RATIO_OPTIONS: { label: string; value: FilmConfig['film_ratio'] }[] = [
  { label: '横版 16:9', value: '16:9' },
  { label: '竖版 9:16', value: '9:16' },
]

const LANGUAGE_OPTIONS: { label: string; value: FilmConfig['dialogue_language'] }[] = [
  { label: '中文', value: 'zh' },
  { label: '英文', value: 'en' },
]

const IMAGE_MODEL_OPTIONS: { label: string; value: FilmConfig['image_model'] }[] = [
  { label: 'Gemini', value: 'gemini' },
  { label: 'GPT', value: 'gpt' },
  { label: 'SeeDream', value: 'seedream' },
]

const VIDEO_MODEL_OPTIONS: { label: string; value: FilmConfig['video_model'] }[] = [
  { label: 'Seedance2.0', value: 'seedance' },
  { label: 'Sora2', value: 'sora-2' },
  { label: 'Kling V3', value: 'kling-v3' },
  { label: 'Vidu Q2', value: 'vidu-q2' },
]

export default function FilmConfigModal({ open, onConfirm }: FilmConfigModalProps) {
  const [config, setConfig] = useState<FilmConfig>({})

  const canSubmit = config.film_ratio && config.dialogue_language && config.image_model && config.video_model

  const handleConfirm = () => {
    if (!canSubmit) return
    onConfirm(config as Required<FilmConfig>)
  }

  return (
    <Modal
      open={open}
      title="影片配置"
      footer={null}
      closable={false}
      maskClosable={false}
      centered
      destroyOnClose
    >
      <div className="space-y-6 py-2">
        <div>
          <div className="text-sm font-medium text-gray-700 mb-3">影片比例</div>
          <div className="grid grid-cols-2 gap-3">
            {RATIO_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setConfig((prev) => ({ ...prev, film_ratio: opt.value }))}
                className={`rounded-lg border px-4 py-3 text-sm transition ${
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
          <div className="text-sm font-medium text-gray-700 mb-3">对白语言</div>
          <div className="grid grid-cols-2 gap-3">
            {LANGUAGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setConfig((prev) => ({ ...prev, dialogue_language: opt.value }))}
                className={`rounded-lg border px-4 py-3 text-sm transition ${
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

        <div>
          <div className="text-sm font-medium text-gray-700 mb-3">图片模型</div>
          <div className="grid grid-cols-3 gap-3">
            {IMAGE_MODEL_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setConfig((prev) => ({ ...prev, image_model: opt.value }))}
                className={`rounded-lg border px-4 py-3 text-sm transition ${
                  config.image_model === opt.value
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
          <div className="text-sm font-medium text-gray-700 mb-3">视频模型</div>
          <div className="grid grid-cols-2 gap-3">
            {VIDEO_MODEL_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setConfig((prev) => ({ ...prev, video_model: opt.value }))}
                className={`rounded-lg border px-4 py-3 text-sm transition ${
                  config.video_model === opt.value
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
    </Modal>
  )
}
