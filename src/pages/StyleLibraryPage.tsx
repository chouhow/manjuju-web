import { useEffect, useState, useCallback } from 'react'
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tabs,
  Empty,
  Spin,
  message,
  Badge,
  Popconfirm,
  Upload,
  Image,
} from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Palette,
  Trash2,
  Edit3,
  Copy,
  ImageIcon,
  Sparkles,
  User,
} from 'lucide-react'
import { styleApi } from '@/api/style'
import type { Style } from '@/types/style'
import AppHeader from '@/components/common/AppHeader'
import AppSidebar from '@/components/common/AppSidebar'

export default function StyleLibraryPage() {
  const [styles, setStyles] = useState<Style[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('system')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingStyle, setEditingStyle] = useState<Style | null>(null)
  const [form] = Form.useForm()
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')

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
      message.error((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filteredStyles = styles.filter((s) => s.style_type === activeTab)

  const handleCreate = async (values: {
    name: string
    category?: string
    description?: string
  }) => {
    try {
      await styleApi.create({
        name: values.name,
        category: values.category,
        description: values.description,
        style_type: activeTab === 'system' ? 'custom' : activeTab,
        example_image: uploadFile || undefined,
      })
      message.success('风格创建成功')
      setModalOpen(false)
      form.resetFields()
      setUploadFile(null)
      setPreviewUrl('')
      loadData()
    } catch (error) {
      message.error((error as Error).message)
    }
  }

  const handleUpdate = async (values: {
    name: string
    category?: string
    description?: string
  }) => {
    if (!editingStyle) return
    try {
      await styleApi.update(editingStyle.uid, {
        name: values.name,
        category: values.category,
        description: values.description,
        example_image: uploadFile || undefined,
      })
      message.success('风格更新成功')
      setModalOpen(false)
      setEditingStyle(null)
      form.resetFields()
      setUploadFile(null)
      setPreviewUrl('')
      loadData()
    } catch (error) {
      message.error((error as Error).message)
    }
  }

  const handleDelete = async (uid: string) => {
    try {
      await styleApi.delete(uid)
      message.success('风格已删除')
      loadData()
    } catch (error) {
      message.error((error as Error).message)
    }
  }

  const handleCopy = async (style: Style) => {
    try {
      await styleApi.create({
        name: `${style.name} (复制)`,
        category: style.category,
        description: style.description || undefined,
        style_type: 'custom',
        reference_style_uid: style.uid,
      })
      message.success('风格复制成功')
      loadData()
    } catch (error) {
      message.error((error as Error).message)
    }
  }

  const openCreateModal = () => {
    setEditingStyle(null)
    setUploadFile(null)
    setPreviewUrl('')
    form.resetFields()
    setModalOpen(true)
  }

  const openEditModal = (style: Style) => {
    setEditingStyle(style)
    setUploadFile(null)
    setPreviewUrl(style.image_url || '')
    form.setFieldsValue({
      name: style.name,
      category: style.category,
      description: style.description,
    })
    setModalOpen(true)
  }

  const handleUpload = (file: File) => {
    setUploadFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    return false
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Palette size={24} className="text-indigo-600" />
                  风格库
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  管理系统预设风格和自定义风格
                </p>
              </div>
              <Button
                type="primary"
                icon={<Plus size={16} />}
                size="large"
                onClick={openCreateModal}
              >
                新建风格
              </Button>
            </div>

            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              className="mb-6"
            />

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Spin size="large" />
              </div>
            ) : filteredStyles.length === 0 ? (
              <Empty
                description={
                  activeTab === 'system'
                    ? '暂无系统预设风格'
                    : '还没有自定义风格，点击右上角创建'
                }
                className="py-20"
              />
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                layout
              >
                <AnimatePresence>
                  {filteredStyles.map((style, index) => (
                    <motion.div
                      key={style.uid}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <StyleCard
                        style={style}
                        onEdit={() => openEditModal(style)}
                        onCopy={() => handleCopy(style)}
                        onDelete={() => handleDelete(style.uid)}
                        canEdit={activeTab === 'custom'}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* 创建/编辑模态框 */}
      <Modal
        title={editingStyle ? '编辑风格' : '新建风格'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false)
          setEditingStyle(null)
          setUploadFile(null)
          setPreviewUrl('')
          form.resetFields()
        }}
        onOk={() => form.submit()}
        destroyOnClose
        width={560}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingStyle ? handleUpdate : handleCreate}
        >
          <Form.Item
            name="name"
            label="风格名称"
            rules={[{ required: true, message: '请输入风格名称' }]}
          >
            <Input placeholder="例如：复古彩光" />
          </Form.Item>

          <Form.Item name="category" label="分类">
            <Select
              placeholder="选择或输入分类"
              allowClear
              showSearch
              options={categories.map((c) => ({ label: c, value: c }))}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div className="px-3 py-2 border-t">
                    <Input
                      placeholder="输入新分类"
                      size="small"
                      onPressEnter={(e) => {
                        const val = (e.target as HTMLInputElement).value
                        if (val && !categories.includes(val)) {
                          form.setFieldsValue({ category: val })
                        }
                      }}
                    />
                  </div>
                </>
              )}
            />
          </Form.Item>

          <Form.Item name="description" label="风格描述 / Prompt">
            <Input.TextArea
              rows={4}
              placeholder="描述风格特征，或输入实际的 prompt..."
            />
          </Form.Item>

          <Form.Item label="示例图片">
            <Upload
              beforeUpload={handleUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<ImageIcon size={16} />}>选择图片</Button>
            </Upload>
            {previewUrl && (
              <div className="mt-3">
                <Image
                  src={previewUrl}
                  alt="预览"
                  className="rounded-lg"
                  style={{ maxHeight: 200, objectFit: 'cover' }}
                />
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

// ===== 风格卡片组件 =====

interface StyleCardProps {
  style: Style
  onEdit: () => void
  onCopy: () => void
  onDelete: () => void
  canEdit: boolean
}

function StyleCard({ style, onEdit, onCopy, onDelete, canEdit }: StyleCardProps) {
  return (
    <Card
      hoverable
      className="!rounded-xl overflow-hidden group"
      cover={
        <div className="h-44 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
          {style.image_url ? (
            <img
              src={style.image_url}
              alt={style.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <Palette size={48} className="text-indigo-200" />
          )}
          <div className="absolute top-2 left-2">
            <Badge
              count={style.style_type === 'system' ? '系统' : '自定义'}
              style={{
                backgroundColor:
                  style.style_type === 'system' ? '#4f46e5' : '#10b981',
              }}
            />
          </div>
          {canEdit && (
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                type="text"
                size="small"
                icon={<Edit3 size={14} />}
                className="bg-white/80 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
              />
              <Button
                type="text"
                size="small"
                icon={<Copy size={14} />}
                className="bg-white/80 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation()
                  onCopy()
                }}
              />
              <Popconfirm
                title="确认删除？"
                description="此操作不可恢复"
                onConfirm={(e) => {
                  e?.stopPropagation()
                  onDelete()
                }}
                okText="删除"
                cancelText="取消"
                okButtonProps={{ danger: true }}
              >
                <Button
                  type="text"
                  size="small"
                  icon={<Trash2 size={14} />}
                  className="bg-white/80 hover:bg-white text-red-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </Popconfirm>
            </div>
          )}
        </div>
      }
    >
      <div>
        <h3 className="font-semibold text-gray-800 truncate">{style.name}</h3>
        {style.category && (
          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full mt-1 inline-block">
            {style.category}
          </span>
        )}
        {style.description && (
          <p className="text-xs text-gray-400 mt-2 line-clamp-2">
            {style.description}
          </p>
        )}
      </div>
    </Card>
  )
}
