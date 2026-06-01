import { useEffect, useState } from 'react'
import { Card, Button, Empty, Spin, message, Tabs, Popconfirm, Badge } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, RotateCcw, Film, Users, Mountain } from 'lucide-react'
import { recycledApi, type RecycledDrama } from '@/api/recycled'
import { formatDate } from '@/utils/format'
import AppHeader from '@/components/common/AppHeader'
import AppSidebar from '@/components/common/AppSidebar'

export default function RecycledPage() {
  const [dramas, setDramas] = useState<RecycledDrama[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dramas')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const dramaList = await recycledApi.listDramas()
      setDramas(dramaList)
    } catch (error) {
      message.error((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestore = async (id: string) => {
    try {
      await recycledApi.restoreDrama(id)
      message.success('已恢复')
      loadData()
    } catch (error) {
      message.error((error as Error).message)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await recycledApi.deleteDrama(id)
      message.success('已彻底删除')
      loadData()
    } catch (error) {
      message.error((error as Error).message)
    }
  }

  const tabItems = [
    {
      key: 'dramas',
      label: (
        <span className="flex items-center gap-1.5">
          <Film size={14} />
          漫剧
        </span>
      ),
    },
    {
      key: 'characters',
      label: (
        <span className="flex items-center gap-1.5">
          <Users size={14} />
          角色
        </span>
      ),
    },
    {
      key: 'scenes',
      label: (
        <span className="flex items-center gap-1.5">
          <Mountain size={14} />
          场景
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
                  <Trash2 size={24} className="text-red-500" />
                  回收站
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  被删除的项目会保留在这里，30天后自动清理
                </p>
              </div>
            </div>

            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              className="mb-4"
            />

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Spin size="large" />
              </div>
            ) : activeTab !== 'dramas' ? (
              <Empty
                description="该功能开发中"
                className="py-20"
              />
            ) : dramas.length === 0 ? (
              <Empty
                description="回收站为空"
                className="py-20"
              />
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                layout
              >
                <AnimatePresence>
                  {dramas.map((drama, index) => (
                    <motion.div
                      key={drama.drama_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card
                        className="!rounded-xl overflow-hidden opacity-70 hover:opacity-100 transition-opacity"
                        cover={
                          <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                            {drama.thumbnail_url ? (
                              <img
                                src={drama.thumbnail_url}
                                alt={drama.title}
                                className="w-full h-full object-cover grayscale"
                              />
                            ) : (
                              <Film size={48} className="text-gray-300" />
                            )}
                            <div className="absolute top-2 left-2">
                              <Badge count="已删除" style={{ backgroundColor: '#ef4444' }} />
                            </div>
                          </div>
                        }
                      >
                        <div>
                          <h3 className="font-semibold text-gray-800 truncate">
                            {drama.title}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">
                            删除于 {drama.deleted_at ? formatDate(drama.deleted_at) : '未知'}
                          </p>
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="small"
                              icon={<RotateCcw size={14} />}
                              onClick={() => handleRestore(drama.drama_id)}
                            >
                              恢复
                            </Button>
                            <Popconfirm
                              title="确认彻底删除？"
                              description="此操作不可恢复"
                              onConfirm={() => handleDelete(drama.drama_id)}
                              okText="删除"
                              cancelText="取消"
                              okButtonProps={{ danger: true }}
                            >
                              <Button
                                size="small"
                                danger
                                icon={<Trash2 size={14} />}
                              >
                                彻底删除
                              </Button>
                            </Popconfirm>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
