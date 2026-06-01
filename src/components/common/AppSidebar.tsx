import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { Menu, Button } from 'antd'
import {
  Home,
  Film,
  Heart,
  Trash2,
  Plus,
  MessageSquare,
} from 'lucide-react'
import { useDramaStore } from '@/stores/dramaStore'
import { useState } from 'react'
import DramaCreateModal from '@/components/drama/DramaCreateModal'

export default function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { dramaId } = useParams()
  const { dramas } = useDramaStore()
  const [createOpen, setCreateOpen] = useState(false)

  const mainMenuItems = [
    {
      key: '/',
      icon: <Home size={18} />,
      label: '首页',
    },
    {
      key: '/dramas',
      icon: <Film size={18} />,
      label: '我的漫剧',
    },
    {
      key: '/favorites',
      icon: <Heart size={18} />,
      label: '收藏',
    },
    {
      key: '/recycled',
      icon: <Trash2 size={18} />,
      label: '回收站',
    },
  ]

  // 确定当前选中的菜单项
  const getSelectedKey = () => {
    if (location.pathname === '/') return ['/']
    if (location.pathname.startsWith('/dramas/') || location.pathname.startsWith('/recycled')) {
      return [location.pathname.split('/').slice(0, 2).join('/')]
    }
    return [location.pathname]
  }

  return (
    <div className="w-60 h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4">
        <Button
          type="primary"
          icon={<Plus size={16} />}
          block
          size="large"
          className="!rounded-xl"
          onClick={() => setCreateOpen(true)}
        >
          新建漫剧
        </Button>
      </div>

      <Menu
        mode="inline"
        selectedKeys={getSelectedKey()}
        items={mainMenuItems}
        onClick={({ key }) => navigate(key)}
        className="!border-r-0"
      />

      {dramas.length > 0 && (
        <div className="mt-4 px-4 flex-1 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            最近项目
          </div>
          <div className="space-y-1">
            {dramas.slice(0, 8).map((drama) => (
              <div
                key={drama.drama_id}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors text-sm ${
                  dramaId === drama.drama_id
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() =>
                  navigate(`/dramas/${drama.drama_id}`)
                }
              >
                <MessageSquare size={14} className={`shrink-0 ${dramaId === drama.drama_id ? 'text-indigo-500' : 'text-gray-400'}`} />
                <span className="truncate">{drama.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <DramaCreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  )
}
