import { Empty, Input } from 'antd'
import { FileText } from 'lucide-react'
import { useWorkspaceStore } from '@/stores/workspaceStore'

export default function ScriptPanel() {
  const { script } = useWorkspaceStore()
  const isEditing = false

  if (!script) {
    return (
      <Empty
        description="暂无剧本"
        className="py-12"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    )
  }

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
        <FileText size={18} className="text-amber-600" />
        <h3 className="font-semibold text-gray-800">{script.title}</h3>
      </div>

      {isEditing ? (
        <Input.TextArea
          value={script.content || ''}
          rows={20}
          className="flex-1 !text-sm font-mono leading-relaxed"
        />
      ) : (
        <div className="flex-1 overflow-y-auto">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-mono bg-gray-50 p-4 rounded-xl">
            {script.content || '暂无内容'}
          </pre>
        </div>
      )}
    </div>
  )
}
