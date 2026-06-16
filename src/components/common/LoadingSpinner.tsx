import { Spin } from 'antd'
import { Film } from 'lucide-react'

interface Props {
  description?: string
  fullScreen?: boolean
}

export default function LoadingSpinner({ description = '加载中...', fullScreen = false }: Props) {
  const content = (
    <div className="flex flex-col items-center gap-4">
      <Film size={40} className="text-indigo-300 animate-pulse" />
      <Spin size="large" description={description} />
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {content}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-20">
      {content}
    </div>
  )
}
