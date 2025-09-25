import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'auto'

interface ThemeState {
  theme: Theme
  isDark: boolean
  
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  applyTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'auto',
      isDark: false,
      
      setTheme: (theme: Theme) => {
        set({ theme })
        get().applyTheme()
      },
      
      toggleTheme: () => {
        const { theme } = get()
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        get().setTheme(newTheme)
      },
      
      applyTheme: () => {
        const { theme } = get()
        const root = document.documentElement
        
        let shouldBeDark = false
        
        if (theme === 'auto') {
          // 检查系统偏好
          shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        } else {
          shouldBeDark = theme === 'dark'
        }
        
        if (shouldBeDark) {
          root.classList.add('dark')
          set({ isDark: true })
        } else {
          root.classList.remove('dark')
          set({ isDark: false })
        }
      }
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ theme: state.theme })
    }
  )
)
