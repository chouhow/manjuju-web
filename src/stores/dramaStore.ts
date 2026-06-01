import { create } from 'zustand'
import type { Drama } from '@/types/drama'

interface DramaState {
  dramas: Drama[]
  currentDrama: Drama | null
  favorites: Drama[]
  isLoading: boolean
  error: string | null

  setDramas: (dramas: Drama[]) => void
  setCurrentDrama: (drama: Drama | null) => void
  addDrama: (drama: Drama) => void
  updateDrama: (drama: Drama) => void
  removeDrama: (dramaId: string) => void
  setFavorites: (favorites: Drama[]) => void
  setLoading: (value: boolean) => void
  setError: (error: string | null) => void
}

export const useDramaStore = create<DramaState>((set, get) => ({
  dramas: [],
  currentDrama: null,
  favorites: [],
  isLoading: false,
  error: null,

  setDramas: (dramas) => set({ dramas }),

  setCurrentDrama: (drama) => set({ currentDrama: drama }),

  addDrama: (drama) => set({ dramas: [drama, ...get().dramas] }),

  updateDrama: (drama) => {
    const dramas = get().dramas.map((d) =>
      d.drama_id === drama.drama_id ? drama : d
    )
    set({ dramas })
    if (get().currentDrama?.drama_id === drama.drama_id) {
      set({ currentDrama: drama })
    }
  },

  removeDrama: (dramaId) =>
    set({ dramas: get().dramas.filter((d) => d.drama_id !== dramaId) }),

  setFavorites: (favorites) => set({ favorites }),

  setLoading: (value) => set({ isLoading: value }),

  setError: (error) => set({ error }),
}))
