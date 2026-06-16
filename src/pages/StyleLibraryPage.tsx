import { useEffect, useState, useCallback } from 'react'
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Select,
  AutoComplete,
  Tabs,
  Empty,
  Spin,
  message,
  Badge,
  Popconfirm,
  Upload,
  Image,
  Tag,
  Divider,
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
  X,
  FileText,
} from 'lucide-react'
import { styleApi } from '@/api/style'
import type { Style, StyleExample } from '@/types/style'
import AppHeader from '@/components/common/AppHeader'
import AppSidebar from '@/components/common/AppSidebar'

export default function StyleLibraryPage() {
  const [styles, setStyles] = useState<Style[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('system')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingStyle, setEditingStyle] = useState<Style | null>(null)
  const [creatingType, setCreatingType] = useState<'system' | 'custom'>('custom')
  const [form] = Form.useForm()
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  const [examples, setExamples] = useState<StyleExample[]>([])
  const [examplesLoading, setExamplesLoading] = useState(false)
  const [addingExample, setAddingExample] = useState(false)
  const [exampleForm] = Form.useForm()
  const [exampleImageFile, setExampleImageFile] = useState<File | null>(null)
  const [examplePreviewUrl, setExamplePreviewUrl] = useState<string>('')

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

  const filteredStyles = styles
    .filter((s) => s.style_type === activeTab)
    .filter((s) =>
      selectedCategory === 'all' ? true : s.category === selectedCategory
    )

  const handleCreate = async (values: {
    name: string
    category?: string
    description?: string
  }) => {
    try {
      await styleApi.create({
        name: values.name,
        category: creatingType === 'system' ? values.category : undefined,
        description: creatingType === 'system' ? values.description : undefined,
        style_type: creatingType,
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
        category:
          editingStyle.style_type === 'system' ? values.category : undefined,
        description:
          editingStyle.style_type === 'system' ? values.description : undefined,
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
    setCreatingType(activeTab as 'system' | 'custom')
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
    loadExamples(style.uid)
    setModalOpen(true)
  }

  const loadExamples = useCallback(async (styleUid: string) => {
    setExamplesLoading(true)
    try {
      const res = await styleApi.getExamples(styleUid)
      setExamples(res.examples || [])
    } catch (error) {
      message.error((error as Error).message)
    } finally {
      setExamplesLoading(false)
    }
  }, [])

  const handleAddExample = async () => {
    if (!editingStyle) return
    try {
      const values = await exampleForm.validateFields()
      setAddingExample(true)
      await styleApi.addExample(editingStyle.uid, {
        example_type: values.example_type,
        prompt_example: values.prompt_example,
        example_image: exampleImageFile || undefined,
      })
      message.success('示例添加成功')
      exampleForm.resetFields()
      setExampleImageFile(null)
      setExamplePreviewUrl('')
      loadExamples(editingStyle.uid)
    } catch (error) {
      if ((error as Error).message) {
        message.error((error as Error).message)
      }
    } finally {
      setAddingExample(false)
    }
  }

  const handleDeleteExample = async (exampleId: string) => {
    if (!editingStyle) return
    try {
      await styleApi.deleteExample(editingStyle.uid, exampleId)
      message.success('示例已删除')
      loadExamples(editingStyle.uid)
    } catch (error) {
      message.error((error as Error).message)
    }
  }

  const handleExampleUpload = (file: File) => {
    setExampleImageFile(file)
    setExamplePreviewUrl(URL.createObjectURL(file))
    return false
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

  const isSystemView = activeTab === 'system'
  const editingIsSystem = editingStyle?.style_type === 'system'

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
                  {isSystemView
                    ? '浏览系统预设风格，选择喜欢的复制到自定义库'
                    : '管理你的自定义风格库'}
                </p>
              </div>
              <Button
                type="primary"
                icon={<Plus size={16} />}
                size="large"
                onClick={openCreateModal}
              >
                {isSystemView ? '新建系统预设' : '新建风格'}
              </Button>
            </div>

            <Tabs
              activeKey={activeTab}
              onChange={(key) => {
                setActiveTab(key)
                setSelectedCategory('all')
              }}
              items={tabItems}
              className="mb-4"
            />

            {/* 系统预设页才显示分类筛选 */}
            {isSystemView && categories.length > 0 && (
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
              <Empty
                description={
                  isSystemView
                    ? '暂无系统预设风格，点击右上角创建'
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
                        isSystem={style.style_type === 'system'}
                        onEdit={() => openEditModal(style)}
                        onCopy={() => handleCopy(style)}
                        onDelete={() => handleDelete(style.uid)}
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
        title={
          editingStyle
            ? editingIsSystem
              ? '编辑风格示例'
              : '编辑风格'
            : creatingType === 'system'
            ? '新建系统预设'
            : '新建自定义风格'
        }
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false)
          setEditingStyle(null)
          setUploadFile(null)
          setPreviewUrl('')
          form.resetFields()
          setExamples([])
          exampleForm.resetFields()
          setExampleImageFile(null)
          setExamplePreviewUrl('')
        }}
        onOk={() => form.submit()}
        destroyOnHidden
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
            <Input placeholder="例如：复古彩光" disabled={editingIsSystem} />
          </Form.Item>

          {/* 系统风格（编辑或新建）才显示分类和描述 */}
          {(editingIsSystem || (!editingStyle && creatingType === 'system')) && (
            <>
              <Form.Item name="category" label="分类">
                <AutoComplete
                  placeholder="选择或输入分类"
                  allowClear
                  options={categories.map((c) => ({ label: c, value: c }))}
                  filterOption={(inputValue, option) =>
                    option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                  disabled={editingIsSystem}
                />
              </Form.Item>

              <Form.Item name="description" label="风格描述 / Prompt">
                <Input.TextArea
                  rows={4}
                  placeholder="描述风格特征，或输入实际的 prompt..."
                  disabled={editingIsSystem}
                />
              </Form.Item>
            </>
          )}

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

          {editingStyle && (
            <>
              <Divider style={{ margin: '16px 0' }} />

              <div className="mb-2 flex items-center gap-2">
                <FileText size={16} className="text-indigo-500" />
                <span className="font-medium text-gray-700">风格示例</span>
              </div>

              {examplesLoading ? (
                <div className="flex justify-center py-4">
                  <Spin size="small" />
                </div>
              ) : examples.length === 0 ? (
                <Empty
                  description="暂无示例"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  className="py-2"
                />
              ) : (
                <div className="space-y-2 mb-4 max-h-64 overflow-y-auto pr-1">
                  {examples.map((ex) => (
                    <div
                      key={ex.id}
                      className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg"
                    >
                      {ex.image_url && (
                        <Image
                          src={ex.image_url}
                          alt="示例"
                          className="w-16 h-16 rounded object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <Tag
                          className={`!text-xs !px-1.5 !py-0 !border-0 !font-semibold ${
                            ex.example_type === 'character'
                              ? '!bg-blue-100 !text-blue-700'
                              : '!bg-emerald-100 !text-emerald-700'
                          }`}
                        >
                          {ex.example_type === 'character' ? '角色' : '场景'}
                        </Tag>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-3">
                          {ex.prompt_example}
                        </p>
                      </div>
                      <Popconfirm
                        title="确认删除？"
                        description="此操作不可恢复"
                        onConfirm={() => handleDeleteExample(ex.id)}
                        okText="删除"
                        cancelText="取消"
                        okButtonProps={{ danger: true }}
                      >
                        <Button
                          type="text"
                          danger
                          icon={<X size={14} />}
                          className="flex-shrink-0"
                        />
                      </Popconfirm>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                <div className="text-xs font-medium text-indigo-700 mb-2">
                  添加新示例
                </div>
                <Form
                  form={exampleForm}
                  layout="vertical"
                  className="!mb-0"
                >
                  <Form.Item
                    name="example_type"
                    label="类型"
                    rules={[{ required: true, message: '请选择类型' }]}
                    className="!mb-2"
                  >
                    <Select
                      placeholder="选择类型"
                      options={[
                        { label: '角色', value: 'character' },
                        { label: '场景', value: 'scene' },
                      ]}
                      style={{ width: 120 }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="prompt_example"
                    label="提示词"
                    className="!mb-2"
                  >
                    <Input.TextArea
                      rows={2}
                      placeholder="输入该风格对应的提示词示例..."
                    />
                  </Form.Item>
                  <Form.Item label="示例图片" className="!mb-2">
                    <Upload
                      beforeUpload={handleExampleUpload}
                      showUploadList={false}
                      accept="image/*"
                    >
                      <Button icon={<ImageIcon size={14} />} size="small">
                        选择图片
                      </Button>
                    </Upload>
                    {examplePreviewUrl && (
                      <div className="mt-2">
                        <Image
                          src={examplePreviewUrl}
                          alt="预览"
                          className="rounded-lg"
                          style={{ maxHeight: 120, objectFit: 'cover' }}
                        />
                      </div>
                    )}
                  </Form.Item>
                  <Button
                    type="primary"
                    size="small"
                    onClick={handleAddExample}
                    loading={addingExample}
                    icon={<Plus size={14} />}
                  >
                    添加示例
                  </Button>
                </Form>
              </div>
            </>
          )}
        </Form>
      </Modal>
    </div>
  )
}

// ===== 风格卡片组件 =====

interface StyleCardProps {
  style: Style
  isSystem: boolean
  onEdit: () => void
  onCopy: () => void
  onDelete: () => void
}

function StyleCard({ style, isSystem, onEdit, onCopy, onDelete }: StyleCardProps) {
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
              count={isSystem ? '系统' : '自定义'}
              style={{
                backgroundColor: isSystem ? '#4f46e5' : '#10b981',
              }}
            />
          </div>
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
            {isSystem ? (
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
            ) : (
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
            )}
          </div>
        </div>
      }
    >
      <div>
        <h3 className="font-semibold text-gray-800 truncate">{style.name}</h3>

        {/* 只有系统风格显示分类和描述 */}
        {isSystem && style.category && (
          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full mt-1 inline-block">
            {style.category}
          </span>
        )}
        {isSystem && style.description && (
          <p className="text-xs text-gray-400 mt-2 line-clamp-2">
            {style.description}
          </p>
        )}
        {style.examples && style.examples.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-medium text-gray-600">
              示例 {style.examples.length} 个
            </span>
            {style.examples.slice(0, 3).map((ex, i) => (
              <Tag
                key={i}
                className={`!text-xs !px-1.5 !py-0 !border-0 !font-semibold ${
                  ex.example_type === 'character'
                    ? '!bg-blue-100 !text-blue-700'
                    : '!bg-emerald-100 !text-emerald-700'
                }`}
              >
                {ex.example_type === 'character' ? '角色' : '场景'}
              </Tag>
            ))}
            {style.examples.length > 3 && (
              <Tag className="!text-xs !px-1.5 !py-0 !border-0 !bg-gray-100 !text-gray-600 !font-semibold">
                +{style.examples.length - 3}
              </Tag>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
