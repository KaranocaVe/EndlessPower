import { useState, useEffect } from 'react'
import Header from './components/Header'
import MapView from './components/MapView'
import FavoritesView from './components/FavoritesView'
import ErrorOverlay from './components/ErrorOverlay'
import Footer from './components/Footer'
import PWAUpdatePrompt from './components/PWAUpdatePrompt'
import { useStationStore } from './store/stationStore'
import { useErrorStore } from './store/errorStore'

type ViewType = 'map' | 'favorites'

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('map')
  const { initializeStations } = useStationStore()
  const { error } = useErrorStore()

  useEffect(() => {
    initializeStations()
  }, [initializeStations])

  return (
    <div className="bg-gray-100 text-gray-800 flex flex-col h-screen">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-grow relative">
        {currentView === 'map' ? <MapView /> : <FavoritesView />}
      </main>

      <Footer />
      
      {error && <ErrorOverlay />}
      
      {/* PWA Components */}
      {/* PWAInstallPrompt 已集成到 Header 中，这里只保留更新提示 */}
      <PWAUpdatePrompt />
    </div>
  )
}

export default App
