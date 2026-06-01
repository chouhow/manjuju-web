import { Empty, Card, Badge } from 'antd'
import { UserCircle } from 'lucide-react'
import { useWorkspaceStore } from '@/stores/workspaceStore'

export default function CharacterPanel() {
  const { characters } = useWorkspaceStore()

  if (characters.length === 0) {
    return (
      <Empty
        description="暂无角色"
        className="py-12"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    )
  }

  return (
    <div className="p-4 space-y-3 overflow-y-auto h-full">
      {characters.map((char, index) => (
        <Card
          key={char.uid || index}
          size="small"
          className="!rounded-xl hover:shadow-md transition-shadow cursor-pointer"
          cover={
            char.portrait_image_url || char.concept_image_url ? (
              <div className="h-32 bg-gray-100">
                <img
                  src={char.portrait_image_url || char.concept_image_url}
                  alt={char.name}
                  className="w-full h-full object-cover rounded-t-xl"
                />
              </div>
            ) : null
          }
        >
          <div className="flex items-start gap-3">
            {!char.portrait_image_url && !char.concept_image_url && (
              <div className="shrink-0 w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <UserCircle size={24} className="text-indigo-600" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">{char.name}</span>
                {char.is_asset && (
                  <Badge status="processing" text="资产" className="!text-xs" />
                )}
              </div>
              {char.background && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {char.background}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
