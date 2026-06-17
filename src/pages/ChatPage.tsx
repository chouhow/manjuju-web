import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Spin, message } from 'antd'
import { dramaApi } from '@/api/drama'
import { shareApi } from '@/api/share'
import { conversationApi } from '@/api/conversation'
import { useDramaStore } from '@/stores/dramaStore'
import { useChatStore } from '@/stores/chatStore'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { streamSSE } from '@/utils/sseParser'
import { refreshWorkspace } from '@/utils/refreshWorkspace'
import type { SSEMessage } from '@/types/message'
import AppHeader from '@/components/common/AppHeader'
import AppSidebar from '@/components/common/AppSidebar'
import ChatContainer from '@/components/chat/ChatContainer'
import WorkspacePanel from '@/components/workspace/WorkspacePanel'

export default function ChatPage() {
  const { dramaId, conversationId } = useParams<{
    dramaId: string
    conversationId: string
  }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const shareToken = searchParams.get('shareToken')
  const isReadOnly = Boolean(shareToken)

  const { dramas, setDramas, setCurrentDrama } = useDramaStore()
  const { setCurrentConversation, setMessages, clearMessages, appendMessage } = useChatStore()
  const {
    reset: resetWorkspace,
    setCharacters,
    setScenes,
    setScript,
    setStoryboards,
  } = useWorkspaceStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!dramaId) return
    loadDramaData()
    return () => {
      clearMessages()
      resetWorkspace()
    }
  }, [dramaId, conversationId, shareToken])

  // 分享预览模式：建立实时 SSE 订阅
  useEffect(() => {
    if (!isReadOnly || !shareToken) return

    let active = true
    let abortCtrl: AbortController | null = null

    const handleWorkspaceMessage = (msg: SSEMessage) => {
      const dramaId = useDramaStore.getState().currentDrama?.drama_id
      if (!dramaId) return
      refreshWorkspace(dramaId, msg.msg_type)
    }

    const connect = async () => {
      while (active) {
        abortCtrl = new AbortController()
        try {
          const response = await shareApi.stream(shareToken, abortCtrl.signal)
          for await (const msg of streamSSE(response)) {
            if (!active) break
            if (msg.sender === 'workspace') {
              handleWorkspaceMessage(msg)
            } else {
              appendMessage(msg)
            }
          }
        } catch {
          // 连接断开或被取消，继续重连
        } finally {
          abortCtrl = null
        }

        if (!active) break
        // 收到 [DONE] 或连接断开，延迟后自动重连
        await new Promise((r) => setTimeout(r, 500))
      }
    }

    connect()

    return () => {
      active = false
      abortCtrl?.abort()
    }
  }, [isReadOnly, shareToken])

  const loadDramaData = async () => {
    setIsLoading(true)
    try {
      if (isReadOnly && shareToken) {
        // 分享预览模式：通过 shareToken 加载只读数据
        const preview = await shareApi.preview(shareToken)

        setCurrentDrama({
          ...preview.drama,
          user_id: '',
          updated_at: preview.drama.created_at || '',
        } as never)

        setMessages(
          preview.messages.map((m) => ({ ...m, isStreaming: false }))
        )
        setCharacters(preview.characters as never[])
        setScenes(preview.scenes as never[])
        setScript(preview.script as never)
        setStoryboards(preview.storyboards as never[])
        return
      }

      // 加载漫剧列表（用于侧边栏）
      if (dramas.length === 0) {
        const dramaList = await dramaApi.list()
        setDramas(dramaList)
      }

      // 获取漫剧详情
      const drama = await dramaApi.getById(dramaId!)
      setCurrentDrama(drama)

      // 确定会话ID
      let convId = conversationId
      if (!convId && drama.conversation_id) {
        convId = drama.conversation_id
        // 重定向到包含conversationId的URL
        navigate(`/dramas/${dramaId}/chat/${convId}`, { replace: true })
        return
      }

      if (!convId) {
        // 创建新会话
        const conv = await conversationApi.create({})
        convId = conv.id
        navigate(`/dramas/${dramaId}/chat/${convId}`, { replace: true })
        return
      }

      setCurrentConversation(convId, dramaId!)

      // 加载历史消息
      const history = await conversationApi.getHistory(convId)
      setMessages(history.messages.map((m) => ({ ...m, isStreaming: false })))

      // 加载完整工作区数据
      const allData = await dramaApi.getAll(dramaId!)
      setCharacters(allData.characters as never[])
      setScenes(allData.scenes as never[])
      setScript(allData.script as never)
      setStoryboards(allData.storyboards as never[])
    } catch (error) {
      message.error((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <div className="flex-1 flex items-center justify-center">
          <Spin size="large" description="加载中..." />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
        {!isReadOnly && <AppSidebar />}
        <div className="flex-1 flex flex-col min-w-0">
          <ChatContainer readOnly={isReadOnly} />
        </div>
        <WorkspacePanel />
      </div>
    </div>
  )
}
