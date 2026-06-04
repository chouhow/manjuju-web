import { useState } from 'react'
import { Empty, Card, Badge, Modal, Descriptions, Image } from 'antd'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import type { Storyboard } from '@/types/storyboard'

export default function StoryboardPanel() {
  const { storyboards } = useWorkspaceStore()
  const [selectedSb, setSelectedSb] = useState<Storyboard | null>(null)

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
          onClick={() => setSelectedSb(sb)}
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

      <Modal
        open={!!selectedSb}
        onCancel={() => setSelectedSb(null)}
        footer={null}
        title={`分镜 #${selectedSb?.sequence}`}
        width={680}
      >
        <div className="space-y-4">
          {selectedSb?.video_url && (
            <video
              src={selectedSb.video_url}
              controls
              className="w-full rounded-lg"
              style={{ maxHeight: 320 }}
            />
          )}
          {selectedSb?.storyboard_images && selectedSb.storyboard_images.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {selectedSb.storyboard_images.map((img, idx) => (
                <Image
                  key={idx}
                  src={img}
                  alt={`分镜图 ${idx + 1}`}
                  className="h-32 rounded-lg object-cover"
                />
              ))}
            </div>
          )}
          {selectedSb?.total_storyboard_url && (
            <Image
              src={selectedSb.total_storyboard_url}
              alt="完整分镜图"
              className="rounded-lg"
              style={{ maxHeight: 320, objectFit: 'cover' }}
            />
          )}
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="序号">{selectedSb?.sequence}</Descriptions.Item>
            <Descriptions.Item label="内容">{selectedSb?.content || '-'}</Descriptions.Item>
            <Descriptions.Item label="角色">
              {selectedSb?.character_names?.length
                ? selectedSb.character_names.join(', ')
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="场景">{selectedSb?.scene_name || '-'}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{selectedSb?.created_at || '-'}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{selectedSb?.updated_at || '-'}</Descriptions.Item>
          </Descriptions>
        </div>
      </Modal>
    </div>
  )
}
