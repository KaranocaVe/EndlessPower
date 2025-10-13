import { useState, useEffect } from 'react'
import Header from './components/Header'
import MapView from './components/MapView'
import FavoritesView from './components/FavoritesView'
import OutletMonitorView from './components/OutletMonitorView'
import ErrorOverlay from './components/ErrorOverlay'
import PWAUpdatePrompt from './components/PWAUpdatePrompt'
import VersionInfo from './components/VersionInfo'
import { useStationStore } from './store/stationStore'
import { useErrorStore } from './store/errorStore'
import { useThemeStore } from './store/themeStore'

type ViewType = 'map' | 'favorites' | 'monitor'

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('map')
  const { initializeStations } = useStationStore()
  const { error } = useErrorStore()
  const { initializeTheme } = useThemeStore()

  useEffect(() => {
    initializeStations()
  }, [initializeStations])

  useEffect(() => {
    initializeTheme()
  }, [initializeTheme])

  // 监听切换到监视模式的事件
  useEffect(() => {
    const handleSwitchToMonitor = () => {
      setCurrentView('monitor')
    }

    window.addEventListener('switchToMonitor', handleSwitchToMonitor)
    return () => {
      window.removeEventListener('switchToMonitor', handleSwitchToMonitor)
    }
  }, [])

  // 修复移动端视口高度问题
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    
    setVH()
    window.addEventListener('resize', setVH)
    window.addEventListener('orientationchange', setVH)
    
    return () => {
      window.removeEventListener('resize', setVH)
      window.removeEventListener('orientationchange', setVH)
    }
  }, [])

  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200 flex flex-col transition-colors duration-300" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
      {/* 只在非监视模式下显示 Header */}
      {currentView !== 'monitor' && (
        <Header currentView={currentView} onViewChange={setCurrentView} />
      )}
      
      <main className="flex-grow relative overflow-hidden">
        {currentView === 'map' && <MapView />}
        {currentView === 'favorites' && <FavoritesView />}
        {currentView === 'monitor' && <OutletMonitorView onBack={() => setCurrentView('map')} />}
      </main>
      
      {error && <ErrorOverlay />}
      
      {/* PWA Components */}
      {/* PWAInstallPrompt 已集成到 Header 中，这里只保留更新提示 */}
      <PWAUpdatePrompt />
      
      
      {/* 版本信息 (仅开发模式) */}
      <VersionInfo />
    </div>
  )
}

export default App
