import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Input, Empty, Spin, message, Tabs } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Film } from 'lucide-react'
import { useDramaStore } from '@/stores/dramaStore'
import { dramaApi } from '@/api/drama'
import DramaCard from '@/components/drama/DramaCard'
import AppHeader from '@/components/common/AppHeader'
import AppSidebar from '@/components/common/AppSidebar'

interface Props {
  defaultTab?: 'all' | 'favorites'
}

export default function DramaListPage({ defaultTab = 'all' }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const { dramas, favorites, setDramas, setFavorites, isLoading, setLoading } =
    useDramaStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>(defaultTab)

  useEffect(() => {
    loadDramas()
  }, [])

  const loadDramas = async () => {
    setLoading(true)
    try {
      const [allDramas, favData] = await Promise.all([
        dramaApi.list(),
        dramaApi.listFavorites(),
      ])
      setDramas(allDramas)
      setFavorites(favData.items)
    } catch (error) {
      message.error((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadDramas()
      return
    }
    setLoading(true)
    try {
      const results = await dramaApi.search(searchQuery)
      setDramas(results)
    } catch (error) {
      message.error((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const filteredDramas = activeTab === 'favorites' ? favorites : dramas

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                {location.pathname === '/favorites' ? '我的收藏' : '我的漫剧'}
              </h1>
              <div className="flex items-center gap-3">
                <Input
                  prefix={<Search size={16} className="text-gray-400" />}
                  placeholder="搜索漫剧..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onPressEnter={handleSearch}
                  className="w-64"
                  allowClear
                />
              </div>
            </div>

            <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key as 'all' | 'favorites')} className="mb-4">
              <Tabs.TabPane tab="全部漫剧" key="all" />
              <Tabs.TabPane tab="收藏" key="favorites" />
            </Tabs>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Spin size="large" />
              </div>
            ) : filteredDramas.length === 0 ? (
              <Empty
                image={<Film size={64} className="text-gray-300 mx-auto" />}
                description={
                  activeTab === 'favorites'
                    ? '暂无收藏的漫剧'
                    : '还没有漫剧，点击左侧"新建漫剧"开始创作吧'
                }
                className="py-20"
              />
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                layout
              >
                <AnimatePresence>
                  {filteredDramas.map((drama, index) => (
                    <motion.div
                      key={drama.drama_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <DramaCard
                        drama={drama}
                        onClick={() => navigate(`/dramas/${drama.drama_id}`)}
                      />
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
