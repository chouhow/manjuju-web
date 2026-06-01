import { useState } from 'react'
import { Tabs, Button } from 'antd'
import {
  Users,
  Mountain,
  FileText,
  Clapperboard,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import CharacterPanel from './CharacterPanel'
import ScenePanel from './ScenePanel'
import ScriptPanel from './ScriptPanel'
import StoryboardPanel from './StoryboardPanel'

export default function WorkspacePanel() {
  const [collapsed, setCollapsed] = useState(false)
  const { activeTab, setActiveTab } = useWorkspaceStore()

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

  if (collapsed) {
    return (
      <div className="w-10 bg-white border-l border-gray-200 flex flex-col items-center py-4">
        <Button
          type="text"
          size="small"
          icon={<ChevronLeft size={16} />}
          onClick={() => setCollapsed(false)}
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
