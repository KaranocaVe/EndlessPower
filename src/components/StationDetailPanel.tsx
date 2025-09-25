import React, { useState, useEffect } from 'react'
import { Station, Outlet, OutletStatus } from '../types/station'
import { fetchStationOutlets, fetchOutletStatus } from '../utils/api'
import { useFavoritesStore } from '../store/favoritesStore'
import { useErrorStore } from '../store/errorStore'
import LoadingSpinner from './LoadingSpinner'

interface StationDetailPanelProps {
  station: Station | null
  onClose: () => void
}

const StationDetailPanel: React.FC<StationDetailPanelProps> = ({ station, onClose }) => {
  const [outlets, setOutlets] = useState<Outlet[]>([])
  const [outletStatuses, setOutletStatuses] = useState<(OutletStatus | null)[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const { isFavorite, addFavorite, removeFavorite, canAddMore } = useFavoritesStore()
  const { showError } = useErrorStore()

  useEffect(() => {
    if (!station) {
      setOutlets([])
      setOutletStatuses([])
      return
    }

    const loadStationDetails = async () => {
      setIsLoading(true)
      
      try {
        const stationOutlets = await fetchStationOutlets(station.stationId)
        setOutlets(stationOutlets)
        
        if (stationOutlets.length > 0) {
          const statuses = await Promise.all(
            stationOutlets.map(outlet => fetchOutletStatus(outlet.outletNo))
          )
          setOutletStatuses(statuses)
        }
      } catch (error) {
        console.error('Failed to load station details:', error)
        showError('加载充电站详情失败')
      }
      
      setIsLoading(false)
    }

    loadStationDetails()
  }, [station, showError])


  const handleFavoriteToggle = () => {
    if (!station) return
    
    if (isFavorite(station.stationId)) {
      removeFavorite(station.stationId)
    } else {
      if (!canAddMore()) {
        showError('收藏夹已满，请先移除一些站点。')
        return
      }
      addFavorite(station.stationId)
    }
  }

  const renderOutletCard = (outlet: Outlet, status: OutletStatus | null) => {
    const isAvailable = status?.outlet?.iCurrentChargingRecordId === 0
    const serial = `插座 ${outlet.vOutletName.replace('插座', '') || 'N/A'}`
    
    if (!status || !status.outlet) {
      return (
        <div key={outlet.outletId} className="bg-gray-100 rounded-xl p-4 border border-gray-200">
          <h3 className="text-base font-semibold text-gray-500">{serial}</h3>
          <p className="text-sm text-red-500 mt-2">数据加载失败</p>
        </div>
      )
    }

    const cardClasses = isAvailable 
      ? 'bg-green-50/80 border-green-200' 
      : 'bg-blue-50/80 border-blue-200'
    
    const statusBadge = isAvailable ? (
      <span className="text-xs font-bold py-1 px-2.5 rounded-full bg-green-100 text-green-800">
        可用
      </span>
    ) : (
      <span className="text-xs font-bold py-1 px-2.5 rounded-full bg-blue-100 text-blue-800">
        占用中
      </span>
    )

    const details = isAvailable ? (
      <div className="mt-3 text-center">
        <p className="font-semibold text-green-700">空闲中</p>
      </div>
    ) : (
      <div className="mt-2 text-sm space-y-1.5 text-gray-600">
        <p><strong>已充:</strong> {status.usedmin || 0}分钟</p>
        <p><strong>消费:</strong> {status.usedfee?.toFixed(2) || '0.00'}元</p>
        <p><strong>功率:</strong> {status.powerFee?.billingPower || '未知'}</p>
        <p className="text-xs truncate pt-1">
          <strong>开始:</strong> {status.chargingBeginTime || '未知'}
        </p>
      </div>
    )

    return (
      <div key={outlet.outletId} className={`rounded-xl p-4 border transition-all ${cardClasses}`}>
        <div className="flex justify-between items-center">
          <h3 className="text-base font-semibold text-gray-800">{serial}</h3>
          {statusBadge}
        </div>
        {details}
      </div>
    )
  }

  if (!station) return null

  return (
    <div className={`fixed bottom-4 right-4 w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl z-[1200] transition-all duration-300 ${
      station ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-full opacity-0 pointer-events-none'
    }`}>
      {/* Header */}
      <div className="p-5 border-b border-gray-200/60 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
        <div className="flex justify-between items-center">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
              {station.stationName}
            </h2>
            <p className="text-sm text-gray-600 truncate mt-1">
              {station.address}
            </p>
          </div>
          
          <div className="flex items-center space-x-1 ml-4">
            <button
              onClick={handleFavoriteToggle}
              className={`p-2 rounded-full transition-colors ${
                isFavorite(station.stationId)
                  ? 'text-yellow-400 hover:text-yellow-500 hover:bg-yellow-100'
                  : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-100'
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill={isFavorite(station.stationId) ? 'currentColor' : 'none'}
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
                />
              </svg>
            </button>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-white/60 transition-all duration-200"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 h-72 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <LoadingSpinner />
          </div>
        ) : outlets.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            该充电站暂无插座信息。
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {outlets
              .sort((a, b) => a.outletSerialNo - b.outletSerialNo)
              .map((outlet, index) => (
                <div key={outlet.outletId}>
                  {renderOutletCard(outlet, outletStatuses[index])}
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  )
}

export default StationDetailPanel
