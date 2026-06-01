import { create } from 'zustand'
import type { Character } from '@/types/character'
import type { Scene } from '@/types/scene'
import type { Script } from '@/types/script'
import type { Storyboard } from '@/types/storyboard'
import type {
  WorkspaceCharacterContent,
  WorkspaceSceneContent,
  WorkspaceStoryboardContent,
  WorkspaceScriptContent,
} from '@/types/message'

interface WorkspaceState {
  characters: Character[]
  scenes: Scene[]
  script: Script | null
  storyboards: Storyboard[]
  activeTab: 'characters' | 'scenes' | 'script' | 'storyboards'

  setCharacters: (characters: Character[]) => void
  updateCharacters: (content: WorkspaceCharacterContent) => void
  setScenes: (scenes: Scene[]) => void
  updateScenes: (content: WorkspaceSceneContent) => void
  setScript: (script: Script | null) => void
  updateScript: (content: WorkspaceScriptContent) => void
  setStoryboards: (storyboards: Storyboard[]) => void
  updateStoryboard: (content: WorkspaceStoryboardContent) => void
  setActiveTab: (tab: WorkspaceState['activeTab']) => void
  reset: () => void
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  characters: [],
  scenes: [],
  script: null,
  storyboards: [],
  activeTab: 'characters',

  setCharacters: (characters) => set({ characters }),

  updateCharacters: (content) => {
    const { characters } = get()
    const incoming = content.characters || []
    const updated = [...characters]

    for (const inc of incoming) {
      const idx = updated.findIndex((c) => c.name === inc.name)
      if (idx >= 0) {
        updated[idx] = { ...updated[idx], ...inc }
      } else {
        updated.push(inc as Character)
      }
    }
    set({ characters: updated })
  },

  setScenes: (scenes) => set({ scenes }),

  updateScenes: (content) => {
    const { scenes } = get()
    const incoming = content.scenes || []
    const updated = [...scenes]

    for (const inc of incoming) {
      const idx = updated.findIndex((s) => s.name === inc.name)
      if (idx >= 0) {
        updated[idx] = { ...updated[idx], ...inc }
      } else {
        updated.push(inc as Scene)
      }
    }
    set({ scenes: updated })
  },

  setScript: (script) => set({ script }),

  updateScript: (content) => {
    const { script } = get()
    if (script) {
      set({
        script: {
          ...script,
          title: content.title || script.title,
        },
      })
    }
  },

  setStoryboards: (storyboards) => set({ storyboards }),

  updateStoryboard: (content) => {
    const { storyboards } = get()
    const idx = storyboards.findIndex((s) => s.sequence === content.storyboard_id)
    if (idx >= 0) {
      const updated = [...storyboards]
      updated[idx] = {
        ...updated[idx],
        ...(content as unknown as Partial<Storyboard>),
      }
      set({ storyboards: updated })
    }
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  reset: () =>
    set({
      characters: [],
      scenes: [],
      script: null,
      storyboards: [],
      activeTab: 'characters',
    }),
}))
