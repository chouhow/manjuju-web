import { useState, useCallback, useMemo } from 'react'
import { Modal, Tabs, Button, Spin, Empty, Image, Badge } from 'antd'
import { Images, User, Mountain, Clapperboard, Film } from 'lucide-react'
import { mediaApi } from '@/api/media'
import type { MediaItem, MediaSource, MediaType } from '@/types/media'

interface Props {
  dramaId: string
  open: boolean
  onClose: () => void
}

type SourceFilter = 'all' | MediaSource
type TypeFilter = 'all' | MediaType

const SOURCE_TABS: { key: SourceFilter; label: string; icon: React.ReactNode }[] = [
  { key: 'all', label: '全部', icon: <Images size={14} /> },
  { key: 'character', label: '角色', icon: <User size={14} /> },
  { key: 'scene', label: '场景', icon: <Mountain size={14} /> },
  { key: 'storyboard', label: '分镜', icon: <Clapperboard size={14} /> },
]

const TYPE_FILTERS: { key: TypeFilter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'image', label: '图片' },
  { key: 'video', label: '视频' },
]

const SOURCE_LABEL_MAP: Record<MediaSource, string> = {
  character: '角色',
  scene: '场景',
  storyboard: '分镜',
}

export default function ProjectMediaModal({ dramaId, open, onClose }: Props) {
  const [items, setItems] = useState<MediaItem[]>([])
  const [total, setTotal] = useState(0)
  const [imageCount, setImageCount] = useState(0)
  const [videoCount, setVideoCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [activeSource, setActiveSource] = useState<SourceFilter>('all')
  const [activeType, setActiveType] = useState<TypeFilter>('all')

  const loadMedia = useCallback(async () => {
    setLoading(true)
    try {
      const res = await mediaApi.list(dramaId)
      setItems(res.items || [])
      setTotal(res.total || 0)
      setImageCount(res.image_count || 0)
      setVideoCount(res.video_count || 0)
    } catch {
      setItems([])
      setTotal(0)
      setImageCount(0)
      setVideoCount(0)
    } finally {
      setLoading(false)
    }
  }, [dramaId])


  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const sourceMatch = activeSource === 'all' || item.source === activeSource
      const typeMatch = activeType === 'all' || item.media_type === activeType
      return sourceMatch && typeMatch
    })
  }, [items, activeSource, activeType])

  const formatTime = (time?: string) => {
    if (!time) return '-'
    return time.replace('T', ' ').slice(0, 16)
  }

  const renderMediaCard = (item: MediaItem) => {
    const isVideo = item.media_type === 'video'

    return (
      <div
        key={`${item.source}:${item.source_id}:${item.url}`}
        className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow"
      >
        <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
          {isVideo ? (
            <video
              src={item.url}
              controls
              className="w-full h-full object-cover"
              preload="metadata"
            />
          ) : (
            <Image
              src={item.url}
              alt={item.source_name}
              className="w-full h-full object-cover"
              preview={{ mask: '预览' }}
            />
          )}
        </div>
        <div className="p-3 space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge
              color={item.source === 'character' ? 'blue' : item.source === 'scene' ? 'green' : 'purple'}
            />
            <span className="text-xs text-gray-500">{SOURCE_LABEL_MAP[item.source]}</span>
            <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
              {item.label}
            </span>
          </div>
          <p className="font-medium text-sm text-gray-800 truncate">{item.source_name}</p>
          <p className="text-xs text-gray-400">{formatTime(item.updated_at)}</p>
        </div>
      </div>
    )
  }

  const tabItems = SOURCE_TABS.map((tab) => ({
    key: tab.key,
    label: (
      <span className="flex items-center gap-1.5">
        {tab.icon}
        {tab.label}
      </span>
    ),
    children: (
      <Spin spinning={loading}>
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              {TYPE_FILTERS.map((filter) => (
                <Button
                  key={filter.key}
                  size="small"
                  type={activeType === filter.key ? 'primary' : 'default'}
                  onClick={() => setActiveType(filter.key)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
            <div className="text-xs text-gray-500">
              共 <span className="font-medium text-gray-700">{total}</span> 个资源
              <span className="mx-2">|</span>
              图片 {imageCount}
              <span className="mx-2">|</span>
              视频 {videoCount}
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <Empty description="暂无资源" image={Empty.PRESENTED_IMAGE_SIMPLE} className="py-12" />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto p-1">
              {filteredItems.map(renderMediaCard)}
            </div>
          )}
        </div>
      </Spin>
    ),
  }))

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <Film size={20} className="text-indigo-600" />
          <span>项目资源</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={860}
      destroyOnHidden
      afterOpenChange={(isOpen) => {
        if (isOpen) {
          loadMedia()
          setActiveSource('all')
          setActiveType('all')
        }
      }}
    >
      <Tabs
        activeKey={activeSource}
        onChange={(key) => {
          setActiveSource(key as SourceFilter)
          setActiveType('all')
        }}
        items={tabItems}
      />
    </Modal>
  )
}
