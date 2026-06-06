import { useState } from 'react'
import { Empty, Card, Badge, Modal, Descriptions, Image, message, Tooltip } from 'antd'
import { UserCircle, Plus, RefreshCw } from 'lucide-react'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { post } from '@/api/client'
import type { Character } from '@/types/character'

export default function CharacterPanel() {
  const { characters, updateCharacters } = useWorkspaceStore()
  const [selectedChar, setSelectedChar] = useState<Character | null>(null)
  const [actionSet, setActionSet] = useState<Set<string>>(new Set())

  const handleAddToAsset = async (e: React.MouseEvent, char: Character) => {
    e.stopPropagation()
    if (!char.uid || actionSet.has(char.uid)) return
    setActionSet(prev => new Set(prev).add(char.uid))
    try {
      await post('/assets/characters', { source_uid: char.uid })
      message.success(`角色「${char.name}」已添加到资产库`)
      updateCharacters({
        characters: [{ name: char.name, is_asset: true } as Character],
      })
    } catch (err: any) {
      message.error(err.message || '添加失败')
    } finally {
      setActionSet(prev => {
        const next = new Set(prev)
        next.delete(char.uid!)
        return next
      })
    }
  }

  const handleSyncToAsset = async (e: React.MouseEvent, char: Character) => {
    e.stopPropagation()
    if (!char.uid || actionSet.has(char.uid)) return
    setActionSet(prev => new Set(prev).add(char.uid))
    try {
      await post('/assets/characters/sync', { source_uid: char.uid })
      message.success(`角色「${char.name}」已同步到资产库`)
    } catch (err: any) {
      message.error(err.message || '同步失败')
    } finally {
      setActionSet(prev => {
        const next = new Set(prev)
        next.delete(char.uid!)
        return next
      })
    }
  }

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
          className="!rounded-xl hover:shadow-md transition-shadow cursor-pointer group relative"
          onClick={() => setSelectedChar(char)}
          cover={
            char.portrait_image_url || char.concept_image_url ? (
              <div className="h-32 bg-gray-100 relative">
                <img
                  src={char.portrait_image_url || char.concept_image_url}
                  alt={char.name}
                  className="w-full h-full object-cover rounded-t-xl"
                />
                {char.is_asset ? (
                  <Tooltip title="同步到资产库">
                    <button
                      onClick={(e) => handleSyncToAsset(e, char)}
                      disabled={actionSet.has(char.uid!)}
                      className="absolute top-2 right-2 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    >
                      <RefreshCw size={12} className="text-indigo-600" />
                    </button>
                  </Tooltip>
                ) : (
                  <Tooltip title="添加到资产库">
                    <button
                      onClick={(e) => handleAddToAsset(e, char)}
                      disabled={actionSet.has(char.uid!)}
                      className="absolute top-2 right-2 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    >
                      <Plus size={14} className="text-indigo-600" />
                    </button>
                  </Tooltip>
                )}
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">{char.name}</span>
                  {char.is_asset && (
                    <Badge status="processing" text="资产" className="!text-xs" />
                  )}
                </div>
                {char.is_asset ? (
                  <Tooltip title="同步到资产库">
                    <button
                      onClick={(e) => handleSyncToAsset(e, char)}
                      disabled={actionSet.has(char.uid!)}
                      className="w-6 h-6 rounded-full bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    >
                      <RefreshCw size={10} className="text-indigo-600" />
                    </button>
                  </Tooltip>
                ) : (
                  !(char.portrait_image_url || char.concept_image_url) && (
                    <Tooltip title="添加到资产库">
                      <button
                        onClick={(e) => handleAddToAsset(e, char)}
                        disabled={actionSet.has(char.uid!)}
                        className="w-6 h-6 rounded-full bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                      >
                        <Plus size={12} className="text-indigo-600" />
                      </button>
                    </Tooltip>
                  )
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

      <Modal
        open={!!selectedChar}
        onCancel={() => setSelectedChar(null)}
        footer={null}
        title={selectedChar?.name}
        width={640}
      >
        <div className="space-y-4">
          {(selectedChar?.portrait_image_url || selectedChar?.concept_image_url) && (
            <div className="flex gap-3">
              {selectedChar.portrait_image_url && (
                <Image
                  src={selectedChar.portrait_image_url}
                  alt={`${selectedChar.name} 肖像`}
                  className="rounded-lg"
                  style={{ maxHeight: 240, objectFit: 'cover' }}
                />
              )}
              {selectedChar.concept_image_url && (
                <Image
                  src={selectedChar.concept_image_url}
                  alt={`${selectedChar.name} 概念图`}
                  className="rounded-lg"
                  style={{ maxHeight: 240, objectFit: 'cover' }}
                />
              )}
            </div>
          )}
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="名称">{selectedChar?.name}</Descriptions.Item>
            <Descriptions.Item label="背景">{selectedChar?.background || '-'}</Descriptions.Item>
            <Descriptions.Item label="肖像提示词">{selectedChar?.portrait_prompt || '-'}</Descriptions.Item>
            <Descriptions.Item label="概念提示词">{selectedChar?.concept_prompt || '-'}</Descriptions.Item>
            <Descriptions.Item label="资产">
              {selectedChar?.is_asset ? '是' : '否'}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">{selectedChar?.created_at || '-'}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{selectedChar?.updated_at || '-'}</Descriptions.Item>
          </Descriptions>
        </div>
      </Modal>
    </div>
  )
}
