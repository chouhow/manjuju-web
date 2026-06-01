import { Link, useNavigate } from 'react-router-dom'
import { Layout, Button, Avatar, Dropdown, Badge } from 'antd'
import {
  Film,
  Settings,
  LogOut,
  User,
  CreditCard,
  Bell,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

const { Header } = Layout

export default function AppHeader() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    {
      key: 'profile',
      icon: <User size={16} />,
      label: '个人中心',
      onClick: () => navigate('/settings'),
    },
    {
      key: 'credits',
      icon: <CreditCard size={16} />,
      label: '积分记录',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogOut size={16} />,
      label: '退出登录',
      danger: true,
      onClick: handleLogout,
    },
  ]

  return (
    <Header className="!bg-white !px-6 flex items-center justify-between shadow-sm z-50 sticky top-0">
      <Link to="/" className="flex items-center gap-2 no-underline">
        <Film className="text-indigo-600" size={28} />
        <span className="text-xl font-bold text-indigo-600">Mindevo</span>
      </Link>

      <div className="flex items-center gap-4">
        <Badge count={0} size="small">
          <Button type="text" icon={<Bell size={20} />} className="text-gray-600" />
        </Badge>

        <Button
          type="text"
          icon={<Settings size={20} />}
          className="text-gray-600"
          onClick={() => navigate('/settings')}
        />

        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors">
            <Avatar className="bg-indigo-600">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </Avatar>
            <span className="text-sm font-medium text-gray-700 hidden md:block">
              {user?.username || '用户'}
            </span>
          </div>
        </Dropdown>
      </div>
    </Header>
  )
}
