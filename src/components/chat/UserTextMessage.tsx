import type { ChatMessage, AssetReference } from '@/types/message'

interface Props {
  message: ChatMessage
}

export default function UserTextMessage({ message }: Props) {
  const refs = (message.content as { references?: AssetReference[] } | null)?.references

  const renderTextWithBadges = (text: string) => {
    // 将 【type:name】 替换为美观的徽章
    const parts: React.ReactNode[] = []
    const regex = /【([^:【】]+):([^【】]+)】/g
    let lastIndex = 0
    let match

    while ((match = regex.exec(text)) !== null) {
      const [fullMatch, type, name] = match
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index))
      }
      const typeLabel = type === 'character' ? '角色' : type === 'scene' ? '场景' : type
      parts.push(
        <span
          key={`${match.index}`}
          className="inline-flex items-center bg-indigo-400/30 text-white text-[11px] px-1.5 py-0.5 rounded mx-0.5 align-middle"
        >
          {typeLabel}:{name}
        </span>
      )
      lastIndex = match.index + fullMatch.length
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex))
    }

    return parts.length > 0 ? parts : text
  }

  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
        <p className="text-sm whitespace-pre-wrap leading-relaxed">
          {renderTextWithBadges(message.text || '')}
        </p>
        {refs && refs.length > 0 && (
          <div className="mt-2 pt-2 border-t border-white/20 flex flex-wrap gap-1.5">
            {refs.map(ref => {
              const typeLabel = ref.type === 'character' ? '角色' : ref.type === 'scene' ? '场景' : ref.type
              return (
                <span
                  key={`${ref.type}:${ref.uid}`}
                  className="inline-flex items-center gap-1 bg-white/15 text-white/90 text-[10px] px-1.5 py-0.5 rounded"
                >
                  <span>{ref.source === 'asset_library' ? '📚' : '📁'}</span>
                  <span>{typeLabel}:{ref.name}</span>
                </span>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
