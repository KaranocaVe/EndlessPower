import { create } from 'zustand'

interface ErrorState {
  error: string | null
  showError: (message: string) => void
  clearError: () => void
}

export const useErrorStore = create<ErrorState>((set) => ({
  error: null,
  showError: (message: string) => set({ error: message }),
  clearError: () => set({ error: null }),
}))
