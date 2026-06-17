import { characterApi } from '@/api/character'
import { sceneApi } from '@/api/scene'
import { scriptApi } from '@/api/script'
import { storyboardApi } from '@/api/storyboard'
import { dramaApi } from '@/api/drama'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import type { MessageType } from '@/types/message'
import type { Character } from '@/types/character'
import type { Scene } from '@/types/scene'
import type { Script } from '@/types/script'
import type { Storyboard } from '@/types/storyboard'

/**
 * 根据 workspace SSE 消息类型，从后端拉取完整工作区数据并更新 store。
 * 失败时只打日志，不阻断 SSE 流。
 */
export async function refreshWorkspace(dramaId: string, msgType: MessageType) {
  if (!dramaId) return

  const { setCharacters, setScenes, setScript, setStoryboards } =
    useWorkspaceStore.getState()

  try {
    switch (msgType) {
      case 'workspace_character': {
        const characters = await characterApi.list(dramaId)
        setCharacters(characters)
        break
      }
      case 'workspace_scene': {
        const scenes = await sceneApi.list(dramaId)
        setScenes(scenes)
        break
      }
      case 'workspace_script': {
        const script = await scriptApi.get(dramaId)
        setScript(script)
        break
      }
      case 'workspace_storyboard': {
        const storyboards = await storyboardApi.list(dramaId)
        setStoryboards(storyboards)
        break
      }
      case 'workspace_all': {
        const all = await dramaApi.getAll(dramaId)
        setCharacters(all.characters as Character[])
        setScenes(all.scenes as Scene[])
        setScript(all.script as Script | null)
        setStoryboards(all.storyboards as Storyboard[])
        break
      }
      default:
        break
    }
  } catch (error) {
    console.error(`[refreshWorkspace] failed for ${msgType}`, error)
  }
}
