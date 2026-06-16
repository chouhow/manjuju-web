import {
  Bot,
  User,
  Mountain,
  LayoutGrid,
  FileText,
  Palette,
} from 'lucide-react'
import type { MessageRole } from '@/types/message'

interface AgentRoleLabelProps {
  role?: MessageRole | string | null
  showIcon?: boolean
  size?: 'xs' | 'sm'
  className?: string
}

const roleMeta: Record<
  string,
  {
    label: string
    icon: React.ElementType
    colorClass: string
    bgClass: string
  }
> = {
  director: {
    label: '导演',
    icon: Bot,
    colorClass: 'text-indigo-600',
    bgClass: 'bg-indigo-50',
  },
  character: {
    label: '角色',
    icon: User,
    colorClass: 'text-rose-600',
    bgClass: 'bg-rose-50',
  },
  scene: {
    label: '场景',
    icon: Mountain,
    colorClass: 'text-emerald-600',
    bgClass: 'bg-emerald-50',
  },
  storyboard: {
    label: '分镜',
    icon: LayoutGrid,
    colorClass: 'text-amber-600',
    bgClass: 'bg-amber-50',
  },
  script: {
    label: '剧本',
    icon: FileText,
    colorClass: 'text-blue-600',
    bgClass: 'bg-blue-50',
  },
  style: {
    label: '风格',
    icon: Palette,
    colorClass: 'text-purple-600',
    bgClass: 'bg-purple-50',
  },
}

export default function AgentRoleLabel({
  role,
  showIcon = true,
  size = 'xs',
  className = '',
}: AgentRoleLabelProps) {
  const meta = roleMeta[role || '']
  if (!meta) return null

  const Icon = meta.icon
  const textSize = size === 'xs' ? 'text-[11px]' : 'text-xs'
  const iconSize = size === 'xs' ? 10 : 12

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${meta.bgClass} ${meta.colorClass} ${textSize} ${className}`}
      style={{ padding: size === 'xs' ? '2px 6px' : '4px 8px' }}
    >
      {showIcon && <Icon size={iconSize} />}
      {meta.label}
    </span>
  )
}
