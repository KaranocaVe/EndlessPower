import { useState, useEffect } from 'react'
import Header from './components/Header'
import MapView from './components/MapView'
import FavoritesView from './components/FavoritesView'
import ErrorOverlay from './components/ErrorOverlay'
import PWAUpdatePrompt from './components/PWAUpdatePrompt'
import { useStationStore } from './store/stationStore'
import { useErrorStore } from './store/errorStore'
import { useThemeStore } from './store/themeStore'

type ViewType = 'map' | 'favorites'

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('map')
  const { initializeStations } = useStationStore()
  const { error } = useErrorStore()
  const { applyTheme } = useThemeStore()

  useEffect(() => {
    initializeStations()
  }, [initializeStations])

  useEffect(() => {
    applyTheme()
  }, [applyTheme])

  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200 flex flex-col h-screen transition-colors duration-300">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-grow relative overflow-hidden">
        {currentView === 'map' ? <MapView /> : <FavoritesView />}
      </main>
      
      {error && <ErrorOverlay />}
      
      {/* PWA Components */}
      {/* PWAInstallPrompt 已集成到 Header 中，这里只保留更新提示 */}
      <PWAUpdatePrompt />
    </div>
  )
}

export default App
