import { Empty, Card } from 'antd'
import { ImageOff } from 'lucide-react'
import { useWorkspaceStore } from '@/stores/workspaceStore'

export default function ScenePanel() {
  const { scenes } = useWorkspaceStore()

  if (scenes.length === 0) {
    return (
      <Empty
        description="暂无场景"
        className="py-12"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    )
  }

  return (
    <div className="p-4 space-y-3 overflow-y-auto h-full">
      {scenes.map((scene, index) => (
        <Card
          key={scene.uid || index}
          size="small"
          className="!rounded-xl hover:shadow-md transition-shadow cursor-pointer"
          cover={
            scene.image_url ? (
              <div className="h-28 bg-gray-100">
                <img
                  src={scene.image_url}
                  alt={scene.name}
                  className="w-full h-full object-cover rounded-t-xl"
                />
              </div>
            ) : null
          }
        >
          <div className="flex items-start gap-3">
            {!scene.image_url && (
              <div className="shrink-0 w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                <ImageOff size={20} className="text-emerald-600" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-gray-800">{scene.name}</span>
              {scene.description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {scene.description}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
