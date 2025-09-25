import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const FAVORITE_LIMIT = 4

interface FavoritesState {
  favoriteIds: number[]
  addFavorite: (stationId: number) => boolean
  removeFavorite: (stationId: number) => void
  isFavorite: (stationId: number) => boolean
  canAddMore: () => boolean
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      
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
        const { favoriteIds } = get()
        set({ favoriteIds: favoriteIds.filter(id => id !== stationId) })
      },
      
      isFavorite: (stationId: number) => {
        return get().favoriteIds.includes(stationId)
      },
      
      canAddMore: () => {
        return get().favoriteIds.length < FAVORITE_LIMIT
      }
    }),
    {
      name: 'favorite-stations',
    }
  )
)
