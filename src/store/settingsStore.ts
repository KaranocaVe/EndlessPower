import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  // 基础设置
  autoRefresh: boolean
  showUnavailableStations: boolean
  
  // 数据设置
  refreshInterval: number // 秒

  // Actions
  setAutoRefresh: (enabled: boolean) => void
  setShowUnavailableStations: (enabled: boolean) => void
  setRefreshInterval: (interval: number) => void
  resetSettings: () => void
}

const defaultSettings = {
  autoRefresh: true,
  showUnavailableStations: false,
  refreshInterval: 30
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setAutoRefresh: (enabled: boolean) => set({ autoRefresh: enabled }),
      setShowUnavailableStations: (enabled: boolean) => set({ showUnavailableStations: enabled }),
      setRefreshInterval: (interval: number) => set({ refreshInterval: interval }),
      
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'app-settings',
    }
  )
)
