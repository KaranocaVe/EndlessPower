import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const FAVORITE_LIMIT = 4

interface FavoritesState {
  favoriteIds: number[]
  pinnedIds: number[]
  addFavorite: (stationId: number) => boolean
  removeFavorite: (stationId: number) => void
  isFavorite: (stationId: number) => boolean
  canAddMore: () => boolean
  pinFavorite: (stationId: number) => void
  unpinFavorite: (stationId: number) => void
  isPinned: (stationId: number) => boolean
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      pinnedIds: [],
      
      addFavorite: (stationId: number) => {
        const { favoriteIds } = get()
        
        if (favoriteIds.includes(stationId)) {
          return false
        }
        
        if (favoriteIds.length >= FAVORITE_LIMIT) {
          return false
        }
        
        set({ favoriteIds: [...favoriteIds, stationId] })
        return true
      },
      
      removeFavorite: (stationId: number) => {
        const { favoriteIds, pinnedIds } = get()
        set({ 
          favoriteIds: favoriteIds.filter(id => id !== stationId),
          pinnedIds: pinnedIds.filter(id => id !== stationId)
        })
      },
      
      isFavorite: (stationId: number) => {
        return get().favoriteIds.includes(stationId)
      },
      
      canAddMore: () => {
        return get().favoriteIds.length < FAVORITE_LIMIT
      },

      pinFavorite: (stationId: number) => {
        const { favoriteIds, pinnedIds } = get()
        if (favoriteIds.includes(stationId) && !pinnedIds.includes(stationId)) {
          set({ pinnedIds: [...pinnedIds, stationId] })
        }
      },

      unpinFavorite: (stationId: number) => {
        const { pinnedIds } = get()
        set({ pinnedIds: pinnedIds.filter(id => id !== stationId) })
      },

      isPinned: (stationId: number) => {
        return get().pinnedIds.includes(stationId)
      }
    }),
    {
      name: 'favorite-stations',
    }
  )
)
