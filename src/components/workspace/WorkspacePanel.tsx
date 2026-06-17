import { useState } from 'react'
import { Tabs, Button, message } from 'antd'
import {
  Users,
  Mountain,
  FileText,
  Clapperboard,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from 'lucide-react'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { useDramaStore } from '@/stores/dramaStore'
import { refreshWorkspace } from '@/utils/refreshWorkspace'
import CharacterPanel from './CharacterPanel'
import ScenePanel from './ScenePanel'
import ScriptPanel from './ScriptPanel'
import StoryboardPanel from './StoryboardPanel'

export default function WorkspacePanel() {
  const [collapsed, setCollapsed] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const { activeTab, setActiveTab } = useWorkspaceStore()
  const { currentDrama } = useDramaStore()

  const tabItems = [
    {
      key: 'characters',
      label: (
        <span className="flex items-center gap-1.5">
          <Users size={14} />
          <span>角色</span>
        </span>
      ),
      children: <CharacterPanel />,
    },
    {
      key: 'scenes',
      label: (
        <span className="flex items-center gap-1.5">
          <Mountain size={14} />
          <span>场景</span>
        </span>
      ),
      children: <ScenePanel />,
    },
    {
      key: 'script',
      label: (
        <span className="flex items-center gap-1.5">
          <FileText size={14} />
          <span>剧本</span>
        </span>
      ),
      children: <ScriptPanel />,
    },
    {
      key: 'storyboards',
      label: (
        <span className="flex items-center gap-1.5">
          <Clapperboard size={14} />
          <span>分镜</span>
        </span>
      ),
      children: <StoryboardPanel />,
    },
  ]

  const handleRefresh = async () => {
    const dramaId = currentDrama?.drama_id
    if (!dramaId || refreshing) return
    setRefreshing(true)
    try {
      await refreshWorkspace(dramaId, 'workspace_all')
      message.success('工作区数据已刷新')
    } catch (error) {
      message.error((error as Error).message || '刷新失败')
    } finally {
      setRefreshing(false)
    }
  }

  if (collapsed) {
    return (
      <div className="w-10 bg-white border-l border-gray-200 flex flex-col items-center py-4 gap-2">
        <Button
          type="text"
          size="small"
          icon={<ChevronLeft size={16} />}
          onClick={() => setCollapsed(false)}
        />
        <Button
          type="text"
          size="small"
          loading={refreshing}
          icon={<RefreshCw size={16} />}
          onClick={handleRefresh}
        />
      </div>
    )
  }

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col relative">
      <Button
        type="text"
        size="small"
        className="absolute top-2 right-2 z-10"
        icon={<ChevronRight size={16} />}
        onClick={() => setCollapsed(true)}
      />
      <Button
        type="text"
        size="small"
        loading={refreshing}
        className="absolute top-2 left-2 z-10"
        icon={<RefreshCw size={16} />}
        onClick={handleRefresh}
      />
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as typeof activeTab)}
        items={tabItems}
        className="flex-1"
        tabBarStyle={{ padding: '0 16px', margin: 0 }}
      />
    </div>
  )
}
