import { Empty, Card, Badge } from 'antd'
import { useWorkspaceStore } from '@/stores/workspaceStore'

export default function StoryboardPanel() {
  const { storyboards } = useWorkspaceStore()

  if (storyboards.length === 0) {
    return (
      <Empty
        description="暂不分镜"
        className="py-12"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    )
  }

  return (
    <div className="p-4 space-y-3 overflow-y-auto h-full">
      {storyboards.map((sb) => (
        <Card
          key={sb.id}
          size="small"
          className="!rounded-xl hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-start gap-3">
            <div className="shrink-0">
              <Badge
                count={sb.sequence}
                className="!bg-indigo-600"
                style={{ fontSize: '12px', minWidth: '24px', height: '24px' }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-800 text-sm">
                {sb.content || `分镜 #${sb.sequence}`}
              </div>
              {sb.character_names && sb.character_names.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {sb.character_names.map((name) => (
                    <span
                      key={name}
                      className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              )}
              {sb.scene_name && (
                <div className="text-xs text-gray-400 mt-1">
                  场景: {sb.scene_name}
                </div>
              )}
              {sb.video_url && (
                <div className="mt-2">
                  <video
                    src={sb.video_url}
                    className="w-full rounded-lg max-h-32 object-cover"
                    controls
                  />
                </div>
              )}
              {sb.storyboard_images && sb.storyboard_images.length > 0 && (
                <div className="flex gap-2 mt-2 overflow-x-auto">
                  {sb.storyboard_images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`分镜图 ${idx + 1}`}
                      className="h-20 rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
