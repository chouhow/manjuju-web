import { useEffect, useState, useCallback } from 'react'
import { Modal, Tabs, Button, Spin, Empty } from 'antd'
import { Palette, Sparkles, User } from 'lucide-react'
import { styleApi } from '@/api/style'
import type { Style, SelectedStyle } from '@/types/style'

interface StylePickerModalProps {
  open: boolean
  onClose: () => void
  onSelect: (style: SelectedStyle) => void
}

export default function StylePickerModal({ open, onClose, onSelect }: StylePickerModalProps) {
  const [styles, setStyles] = useState<Style[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('system')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [stylesRes, catRes] = await Promise.all([
        styleApi.list(),
        styleApi.getCategories(),
      ])
      setStyles(stylesRes.styles)
      setCategories(catRes.categories || [])
    } catch (error) {
      console.error('加载风格列表失败', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) {
      loadData()
    }
  }, [open, loadData])

  const filteredStyles = styles
    .filter((s) => s.style_type === activeTab)
    .filter((s) =>
      selectedCategory === 'all' ? true : s.category === selectedCategory
    )

  const handleSelect = (style: Style) => {
    const selected: SelectedStyle = {
      style_type: style.style_type,
      style_uid: style.uid,
      style_name: style.name,
      image_url: style.image_url,
    }
    onSelect(selected)
    onClose()
  }

  const tabItems = [
    {
      key: 'system',
      label: (
        <span className="flex items-center gap-1.5">
          <Sparkles size={14} />
          系统预设
        </span>
      ),
    },
    {
      key: 'custom',
      label: (
        <span className="flex items-center gap-1.5">
          <User size={14} />
          我的风格
        </span>
      ),
    },
  ]

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <div className="flex items-center gap-2">
          <Palette size={20} className="text-indigo-600" />
          <span>选择风格</span>
        </div>
      }
      width={800}
    >
      <div className="max-h-[60vh] overflow-auto -mx-6 -my-2 px-6 py-2">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key)
            setSelectedCategory('all')
          }}
          items={tabItems}
          className="mb-4"
        />

        {activeTab === 'system' && categories.length > 0 && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Button
              size="small"
              type={selectedCategory === 'all' ? 'primary' : 'default'}
              onClick={() => setSelectedCategory('all')}
            >
              全部
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                size="small"
                type={selectedCategory === cat ? 'primary' : 'default'}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : filteredStyles.length === 0 ? (
          <Empty description="暂无风格" className="py-20" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredStyles.map((style) => (
              <div
                key={style.uid}
                className="cursor-pointer group rounded-xl overflow-hidden border border-gray-200 hover:border-indigo-400 hover:shadow-md transition-all bg-white"
                onClick={() => handleSelect(style)}
              >
                <div className="h-32 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
                  {style.image_url ? (
                    <img
                      src={style.image_url}
                      alt={style.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <Palette size={32} className="text-indigo-200" />
                  )}
                </div>
                <div className="p-2">
                  <div className="text-sm font-medium text-gray-800 truncate text-center">
                    {style.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}
