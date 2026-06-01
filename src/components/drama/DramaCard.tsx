import { Card, Badge, Dropdown } from 'antd'
import { motion } from 'framer-motion'
import {
  MoreVertical,
  MessageSquare,
  Heart,
  Clock,
} from 'lucide-react'
import type { Drama } from '@/types/drama'
import { formatDate } from '@/utils/format'

interface Props {
  drama: Drama
  onClick?: () => void
}

export default function DramaCard({ drama, onClick }: Props) {
  const statusMap = {
    draft: { color: 'default' as const, text: '草稿' },
    in_progress: { color: 'processing' as const, text: '进行中' },
    completed: { color: 'success' as const, text: '已完成' },
  }

  const status = statusMap[drama.status] || statusMap.draft

  const menuItems = [
    {
      key: 'chat',
      label: '进入聊天',
      icon: <MessageSquare size={14} />,
    },
    {
      key: 'favorite',
      label: drama.is_favorite ? '取消收藏' : '收藏',
      icon: <Heart size={14} />,
    },
  ]

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card
        hoverable
        className="!rounded-xl overflow-hidden cursor-pointer group"
        onClick={onClick}
        bodyStyle={{ padding: '16px' }}
        cover={
          <div className="h-40 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
            {drama.thumbnail_url ? (
              <img
                src={drama.thumbnail_url}
                alt={drama.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <MessageSquare size={48} className="text-indigo-300" />
            )}
            <div className="absolute top-2 right-2">
              <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                <button
                  className="p-1.5 rounded-lg bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical size={16} className="text-gray-600" />
                </button>
              </Dropdown>
            </div>
          </div>
        }
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 truncate mb-1">
              {drama.title}
            </h3>
            <p className="text-sm text-gray-500 truncate mb-2">
              {drama.description || '暂无描述'}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <Badge status={status.color} text={status.text} />
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {formatDate(drama.updated_at)}
              </span>
            </div>
          </div>
          {drama.is_favorite && (
            <Heart size={16} className="text-red-500 shrink-0 ml-2" fill="currentColor" />
          )}
        </div>
      </Card>
    </motion.div>
  )
}
