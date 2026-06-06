import { useState, useEffect, useCallback } from 'react'
import { Modal, Tabs, Input, Empty, Spin } from 'antd'
import { Search, User, Mountain } from 'lucide-react'
import { get } from '@/api/client'
import type { AssetReference } from '@/types/message'

interface Props {
  open: boolean
  onClose: () => void
  onSelect: (refs: AssetReference[]) => void
}

interface AssetItem {
  asset_uid: string
  name: string
  background?: string
  description?: string
  portrait_image_url?: string
  concept_image_url?: string
  image_url?: string
  multi_view_image_url?: string
}

export default function AssetReferencePicker({ open, onClose, onSelect }: Props) {
  const [activeTab, setActiveTab] = useState('character')
  const [search, setSearch] = useState('')
  const [characters, setCharacters] = useState<AssetItem[]>([])
  const [scenes, setScenes] = useState<AssetItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [selectedItems, setSelectedItems] = useState<Map<string, AssetReference>>(new Map())

  const fetchAssets = useCallback(async () => {
    setLoading(true)
    try {
      const [charRes, sceneRes] = await Promise.all([
        get<{ items: AssetItem[] }>('/assets/characters', { limit: 100 }),
        get<{ items: AssetItem[] }>('/assets/scenes', { limit: 100 }),
      ])
      setCharacters(charRes.items || [])
      setScenes(sceneRes.items || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) {
      fetchAssets()
      setSelected(new Set())
      setSelectedItems(new Map())
      setSearch('')
    }
  }, [open, fetchAssets])

  const toggleSelect = (item: AssetItem, type: 'character' | 'scene') => {
    const key = `${type}:${item.asset_uid}`
    const next = new Set(selected)
    const nextItems = new Map(selectedItems)
    if (next.has(key)) {
      next.delete(key)
      nextItems.delete(key)
    } else {
      next.add(key)
      const ref: AssetReference = {
        type,
        source: 'asset_library',
        uid: item.asset_uid,
        name: item.name,
        url: type === 'character'
          ? (item.portrait_image_url || item.concept_image_url)
          : (item.image_url || item.multi_view_image_url),
        summary: type === 'character' ? item.background : item.description,
      }
      nextItems.set(key, ref)
    }
    setSelected(next)
    setSelectedItems(nextItems)
  }

  const handleConfirm = () => {
    onSelect(Array.from(selectedItems.values()))
    onClose()
  }

  const filteredCharacters = characters.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )
  const filteredScenes = scenes.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  const renderAssetCard = (item: AssetItem, type: 'character' | 'scene') => {
    const key = `${type}:${item.asset_uid}`
    const isSelected = selected.has(key)
    const imageUrl = type === 'character'
      ? (item.concept_image_url || item.portrait_image_url)
      : (item.image_url || item.multi_view_image_url)

    return (
      <div
        key={key}
        onClick={() => toggleSelect(item, type)}
        className={`
          relative cursor-pointer rounded-lg border p-3 transition-all
          ${isSelected
            ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
            : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm'
          }
        `}
      >
        {isSelected && (
          <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs">
            ✓
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
            {imageUrl ? (
              <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 text-lg">
                {type === 'character' ? <User size={20} /> : <Mountain size={20} />}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm text-gray-800 truncate">{item.name}</p>
            <p className="text-xs text-gray-400 truncate mt-0.5">
              {type === 'character' ? item.background : item.description || '暂无描述'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Modal
      title="引用资产"
      open={open}
      onCancel={onClose}
      onOk={handleConfirm}
      okText="确认引用"
      cancelText="取消"
      width={600}
      okButtonProps={{ disabled: selected.size === 0 }}
    >
      <div className="mb-4">
        <Input
          prefix={<Search size={16} className="text-gray-400" />}
          placeholder="搜索资产..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane
          tab={<span className="flex items-center gap-1"><User size={14} />角色资产</span>}
          key="character"
        >
          <Spin spinning={loading}>
            {filteredCharacters.length === 0 ? (
              <Empty description="暂无角色资产" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <div className="grid grid-cols-2 gap-3 max-h-[360px] overflow-y-auto p-1">
                {filteredCharacters.map(item => renderAssetCard(item, 'character'))}
              </div>
            )}
          </Spin>
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={<span className="flex items-center gap-1"><Mountain size={14} />场景资产</span>}
          key="scene"
        >
          <Spin spinning={loading}>
            {filteredScenes.length === 0 ? (
              <Empty description="暂无场景资产" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <div className="grid grid-cols-2 gap-3 max-h-[360px] overflow-y-auto p-1">
                {filteredScenes.map(item => renderAssetCard(item, 'scene'))}
              </div>
            )}
          </Spin>
        </Tabs.TabPane>
      </Tabs>

      {selected.size > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">已选择 {selected.size} 个资产</p>
          <div className="flex flex-wrap gap-2">
            {Array.from(selectedItems.values()).map(ref => (
              <span
                key={`${ref.type}:${ref.uid}`}
                className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full"
              >
                {ref.type === 'character' ? '角色' : '场景'}: {ref.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </Modal>
  )
}
