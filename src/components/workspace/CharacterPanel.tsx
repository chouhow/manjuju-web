import { useState } from 'react'
import { Empty, Card, Badge, Modal, Descriptions, Image } from 'antd'
import { UserCircle } from 'lucide-react'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import type { Character } from '@/types/character'

export default function CharacterPanel() {
  const { characters } = useWorkspaceStore()
  const [selectedChar, setSelectedChar] = useState<Character | null>(null)

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
          onClick={() => setSelectedChar(char)}
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
