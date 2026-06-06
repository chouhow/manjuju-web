import { useState } from 'react'
import { Empty, Card, Modal, Descriptions, Image, message, Tooltip } from 'antd'
import { ImageOff, Plus, RefreshCw } from 'lucide-react'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { post } from '@/api/client'
import type { Scene } from '@/types/scene'

export default function ScenePanel() {
  const { scenes, updateScenes } = useWorkspaceStore()
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null)
  const [actionSet, setActionSet] = useState<Set<string>>(new Set())

  const handleAddToAsset = async (e: React.MouseEvent, scene: Scene) => {
    e.stopPropagation()
    if (!scene.uid || actionSet.has(scene.uid)) return
    setActionSet(prev => new Set(prev).add(scene.uid))
    try {
      await post('/assets/scenes', { source_uid: scene.uid })
      message.success(`场景「${scene.name}」已添加到资产库`)
      updateScenes({
        scenes: [{ name: scene.name, is_asset: true } as Scene],
      })
    } catch (err: any) {
      message.error(err.message || '添加失败')
    } finally {
      setActionSet(prev => {
        const next = new Set(prev)
        next.delete(scene.uid!)
        return next
      })
    }
  }

  const handleSyncToAsset = async (e: React.MouseEvent, scene: Scene) => {
    e.stopPropagation()
    if (!scene.uid || actionSet.has(scene.uid)) return
    setActionSet(prev => new Set(prev).add(scene.uid))
    try {
      await post('/assets/scenes/sync', { source_uid: scene.uid })
      message.success(`场景「${scene.name}」已同步到资产库`)
    } catch (err: any) {
      message.error(err.message || '同步失败')
    } finally {
      setActionSet(prev => {
        const next = new Set(prev)
        next.delete(scene.uid!)
        return next
      })
    }
  }

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
          className="!rounded-xl hover:shadow-md transition-shadow cursor-pointer group relative"
          onClick={() => setSelectedScene(scene)}
          cover={
            scene.image_url ? (
              <div className="h-28 bg-gray-100 relative">
                <img
                  src={scene.image_url}
                  alt={scene.name}
                  className="w-full h-full object-cover rounded-t-xl"
                />
                {scene.is_asset ? (
                  <Tooltip title="同步到资产库">
                    <button
                      onClick={(e) => handleSyncToAsset(e, scene)}
                      disabled={actionSet.has(scene.uid!)}
                      className="absolute top-2 right-2 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    >
                      <RefreshCw size={12} className="text-emerald-600" />
                    </button>
                  </Tooltip>
                ) : (
                  <Tooltip title="添加到资产库">
                    <button
                      onClick={(e) => handleAddToAsset(e, scene)}
                      disabled={actionSet.has(scene.uid!)}
                      className="absolute top-2 right-2 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    >
                      <Plus size={14} className="text-emerald-600" />
                    </button>
                  </Tooltip>
                )}
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
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800">{scene.name}</span>
                {scene.is_asset ? (
                  <Tooltip title="同步到资产库">
                    <button
                      onClick={(e) => handleSyncToAsset(e, scene)}
                      disabled={actionSet.has(scene.uid!)}
                      className="w-6 h-6 rounded-full bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    >
                      <RefreshCw size={10} className="text-emerald-600" />
                    </button>
                  </Tooltip>
                ) : (
                  !scene.image_url && (
                    <Tooltip title="添加到资产库">
                      <button
                        onClick={(e) => handleAddToAsset(e, scene)}
                        disabled={actionSet.has(scene.uid!)}
                        className="w-6 h-6 rounded-full bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                      >
                        <Plus size={12} className="text-emerald-600" />
                      </button>
                    </Tooltip>
                  )
                )}
              </div>
              {scene.description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {scene.description}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}

      <Modal
        open={!!selectedScene}
        onCancel={() => setSelectedScene(null)}
        footer={null}
        title={selectedScene?.name}
        width={640}
      >
        <div className="space-y-4">
          {(selectedScene?.image_url || selectedScene?.multi_view_image_url) && (
            <div className="flex gap-3">
              {selectedScene.image_url && (
                <Image
                  src={selectedScene.image_url}
                  alt={`${selectedScene.name} 场景图`}
                  className="rounded-lg"
                  style={{ maxHeight: 240, objectFit: 'cover' }}
                />
              )}
              {selectedScene.multi_view_image_url && (
                <Image
                  src={selectedScene.multi_view_image_url}
                  alt={`${selectedScene.name} 多视角图`}
                  className="rounded-lg"
                  style={{ maxHeight: 240, objectFit: 'cover' }}
                />
              )}
            </div>
          )}
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="名称">{selectedScene?.name}</Descriptions.Item>
            <Descriptions.Item label="描述">{selectedScene?.description || '-'}</Descriptions.Item>
            <Descriptions.Item label="提示词">{selectedScene?.prompt || '-'}</Descriptions.Item>
            <Descriptions.Item label="资产">
              {selectedScene?.is_asset ? '是' : '否'}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">{selectedScene?.created_at || '-'}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{selectedScene?.updated_at || '-'}</Descriptions.Item>
          </Descriptions>
        </div>
      </Modal>
    </div>
  )
}
