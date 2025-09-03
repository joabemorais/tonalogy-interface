import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  AnalysisState,
  AnalysisHistory,
  ProgressionAnalysisResponse,
  Language,
  Theme
} from '@/types'

// Fallback function for crypto.randomUUID() compatibility
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try {
      return crypto.randomUUID()
    } catch (error) {
      // Fallback if crypto.randomUUID fails
    }
  }
  
  // Fallback implementation for compatibility
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

interface AnalysisStore extends AnalysisState {
  // Actions
  setLoading: (loading: boolean) => void
  setResult: (result: ProgressionAnalysisResponse | null) => void
  setError: (error: string | null) => void
  setVisualization: (visualization: string | null) => void
  clearAnalysis: () => void
}

interface HistoryStore {
  history: AnalysisHistory[]
  favorites: string[]
  
  // Actions
  addToHistory: (analysis: Omit<AnalysisHistory, 'id' | 'timestamp'>) => void
  removeFromHistory: (id: string) => void
  toggleFavorite: (id: string) => void
  clearHistory: () => void
  getRecentAnalyses: (limit?: number) => AnalysisHistory[]
}

interface SettingsStore {
  language: Language
  theme: Theme
  apiUrl: string
  autoSave: boolean
  
  // Actions
  setLanguage: (language: Language) => void
  setTheme: (theme: Theme) => void
  setApiUrl: (url: string) => void
  setAutoSave: (autoSave: boolean) => void
}

// Analysis Store
export const useAnalysisStore = create<AnalysisStore>((set, get) => ({
  isLoading: false,
  result: null,
  error: null,
  visualization: null,

  setLoading: (isLoading) => set({ isLoading }),
  setResult: (result) => set({ result, error: null }),
  setError: (error) => set({ error, result: null }),
  setVisualization: (visualization) => set({ visualization }),
  clearAnalysis: () => set({
    isLoading: false,
    result: null,
    error: null,
    visualization: null
  })
}))

// History Store with persistence
export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      history: [],
      favorites: [],

      addToHistory: (analysis) => {
        const id = generateId()
        const timestamp = new Date()
        const newEntry: AnalysisHistory = {
          ...analysis,
          id,
          timestamp,
          isFavorite: false
        }

        set((state) => ({
          history: [newEntry, ...state.history].slice(0, 100) // Keep only last 100
        }))
      },

      removeFromHistory: (id) => {
        set((state) => ({
          history: state.history.filter(item => item.id !== id),
          favorites: state.favorites.filter(fav => fav !== id)
        }))
      },

      toggleFavorite: (id) => {
        set((state) => {
          const isFavorited = state.favorites.includes(id)
          const newFavorites = isFavorited
            ? state.favorites.filter(fav => fav !== id)
            : [...state.favorites, id]

          const newHistory = state.history.map(item =>
            item.id === id ? { ...item, isFavorite: !isFavorited } : item
          )

          return {
            favorites: newFavorites,
            history: newHistory
          }
        })
      },

      clearHistory: () => set({ history: [], favorites: [] }),

      getRecentAnalyses: (limit = 10) => {
        return get().history
          .sort((a, b) => {
            const timestampA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp)
            const timestampB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp)
            return timestampB.getTime() - timestampA.getTime()
          })
          .slice(0, limit)
      }
    }),
    {
      name: 'tonalogy-history',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        history: state.history,
        favorites: state.favorites
      })
    }
  )
)

// Settings Store with persistence
export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      language: 'en' as Language,
      theme: 'system' as Theme,
      apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://tonalogy-api.onrender.com',
      autoSave: true,

      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      setApiUrl: (apiUrl) => set({ apiUrl }),
      setAutoSave: (autoSave) => set({ autoSave })
    }),
    {
      name: 'tonalogy-settings',
      storage: createJSONStorage(() => localStorage)
    }
  )
)
