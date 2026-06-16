import { useRef, useCallback, useState } from 'react'
import { streamSSE } from '@/utils/sseParser'
import { chatApi } from '@/api/chat'
import { useChatStore } from '@/stores/chatStore'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import type { SSEMessage, AssetReference, SelectedOption } from '@/types/message'
import type { SelectedStyle } from '@/types/style'
import type { FilmConfig } from '@/types/chat'

export function useSSEChat() {
  const [isLoading, setIsLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const { messages, appendMessage, setIsStreaming } = useChatStore()
  const { updateCharacters, updateScenes, updateScript, updateStoryboard } =
    useWorkspaceStore()

  const handleWorkspaceMessage = useCallback(
    (msg: SSEMessage) => {
      if (!msg.content) return
      switch (msg.msg_type) {
        case 'workspace_character':
          updateCharacters(msg.content as never)
          break
        case 'workspace_scene':
          updateScenes(msg.content as never)
          break
        case 'workspace_script':
          updateScript(msg.content as never)
          break
        case 'workspace_storyboard':
          updateStoryboard(msg.content as never)
          break
      }
    },
    [updateCharacters, updateScenes, updateScript, updateStoryboard]
  )

  const sendMessage = useCallback(
    async (
      userInput: string,
      conversationId: string,
      style?: SelectedStyle | null,
      references?: AssetReference[],
      filmConfig?: FilmConfig | null,
      selectedOption?: SelectedOption | null
    ) => {
      if ((!userInput.trim() && !references?.length) || isLoading) return

      setIsLoading(true)
      setIsStreaming(true)
      abortRef.current = new AbortController()

      try {
        // 若用户未显式选择 option，但有可选项存在，则发送禁用信号
        let finalSelectedOption = selectedOption
        if (!finalSelectedOption) {
          const latestOptions = [...messages]
            .reverse()
            .find(
              (m) =>
                m.msg_type === 'options' &&
                m.component_id != null &&
                m.content?.selectable === true
            )
          if (latestOptions) {
            finalSelectedOption = {
              component_id: latestOptions.component_id!,
              selected_index: null,
            }
          }
        }

        const response = await chatApi.streamChat({
          user_input: userInput,
          conversation_id: conversationId,
          style: style || undefined,
          references: references && references.length > 0 ? references : undefined,
          film_config: filmConfig || undefined,
          selected_option: finalSelectedOption || undefined,
        })

        for await (const msg of streamSSE(response)) {
          if (msg.sender === 'workspace') {
            handleWorkspaceMessage(msg)
          } else {
            appendMessage(msg)
          }
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          appendMessage({
            sender: 'ai',
            msg_type: 'error',
            text: (error as Error).message || '发送消息失败',
            content: null,
            component_id: Date.now(),
          })
        }
      } finally {
        setIsLoading(false)
        setIsStreaming(false)
        abortRef.current = null
      }
    },
    [isLoading, appendMessage, setIsStreaming, handleWorkspaceMessage]
  )

  const stop = useCallback(async (conversationId: string) => {
    abortRef.current?.abort()
    try {
      await chatApi.stop(conversationId)
    } catch {
      // ignore
    }
    setIsLoading(false)
    setIsStreaming(false)
  }, [setIsStreaming])

  return { sendMessage, stop, isLoading }
}
