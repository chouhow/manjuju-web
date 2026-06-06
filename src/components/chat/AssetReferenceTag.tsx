import type { AssetReference } from '@/types/message'
import { X, Library } from 'lucide-react'

interface Props {
  reference: AssetReference
  onRemove: () => void
}

export default function AssetReferenceTag({ reference, onRemove }: Props) {
  const typeLabel = reference.type === 'character' ? '角色' : reference.type === 'scene' ? '场景' : reference.type
  const sourceIcon = reference.source === 'asset_library' ? '📚' : '📁'

  return (
    <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full border border-indigo-100">
      <span className="text-[10px]">{sourceIcon}</span>
      <span className="opacity-70">{typeLabel}:</span>
      <span className="font-medium truncate max-w-[120px]">{reference.name}</span>
      <button
        onClick={onRemove}
        className="ml-0.5 hover:text-indigo-900 p-0.5 rounded-full hover:bg-indigo-100 transition-colors"
        type="button"
      >
        <X size={12} />
      </button>
    </span>
  )
}
