import React, { useState, useEffect } from 'react'
import { Station, Outlet, OutletStatus } from '../types/station'
import { fetchStationOutlets, fetchOutletStatus } from '../utils/api'
import { useFavoritesStore } from '../store/favoritesStore'
import { useErrorStore } from '../store/errorStore'
import LoadingSpinner from './LoadingSpinner'

interface FavoriteStationCardProps {
  station: Station
  refreshTrigger?: number
}

const FavoriteStationCard: React.FC<FavoriteStationCardProps> = ({ 
  station, 
  refreshTrigger 
}) => {
  const [outlets, setOutlets] = useState<Outlet[]>([])
  const [outletStatuses, setOutletStatuses] = useState<(OutletStatus | null)[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [summary, setSummary] = useState({
    total: 0,
    available: 0,
    occupied: 0
  })

  const { removeFavorite } = useFavoritesStore()
  const { showError } = useErrorStore()

  useEffect(() => {
    const loadStationData = async () => {
      setIsLoading(true)
      
      try {
        const stationOutlets = await fetchStationOutlets(station.stationId)
        setOutlets(stationOutlets)

        if (stationOutlets.length > 0) {
          const statuses = await Promise.all(
            stationOutlets.map(outlet => fetchOutletStatus(outlet.outletNo))
          )
          setOutletStatuses(statuses)

          // 计算摘要信息
          const availableCount = statuses.filter(
            s => s?.outlet?.iCurrentChargingRecordId === 0
          ).length
          
          setSummary({
            total: stationOutlets.length,
            available: availableCount,
            occupied: stationOutlets.length - availableCount
          })
        } else {
          setSummary({ total: 0, available: 0, occupied: 0 })
        }
      } catch (error) {
        console.error('Failed to load station data:', error)
        showError('加载充电站数据失败')
      }
      
      setIsLoading(false)
    }

    loadStationData()
  }, [station.stationId, refreshTrigger, showError])


  const handleRemoveFavorite = () => {
    removeFavorite(station.stationId)
  }

  const renderOutletCard = (outlet: Outlet, status: OutletStatus | null) => {
    const isAvailable = status?.outlet?.iCurrentChargingRecordId === 0
    const serial = `插座 ${outlet.vOutletName?.replace('插座', '') || outlet.outletNo || 'N/A'}`
    
    if (!status || !status.outlet) {
      return (
        <div key={outlet.outletId} className="bg-gray-100 rounded-lg p-3 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-500">{serial}</h4>
          <p className="text-xs text-red-500 mt-1">数据加载失败</p>
        </div>
      )
    }

    const cardClasses = isAvailable 
      ? 'bg-green-50 border-green-200' 
      : 'bg-blue-50 border-blue-200'
    
    const statusBadge = isAvailable ? (
      <span className="text-xs font-bold py-0.5 px-2 rounded-full bg-green-100 text-green-800">
        可用
      </span>
    ) : (
      <span className="text-xs font-bold py-0.5 px-2 rounded-full bg-blue-100 text-blue-800">
        占用
      </span>
    )

    return (
      <div key={outlet.outletId} className={`rounded-lg p-3 border transition-all ${cardClasses}`}>
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-semibold text-gray-800">{serial}</h4>
          {statusBadge}
        </div>
        
        {isAvailable ? (
          <p className="text-xs text-green-700 font-medium">空闲中</p>
        ) : (
          <div className="text-xs space-y-1 text-gray-600">
            <p><span className="font-medium">已充:</span> {status.usedmin || 0}分钟</p>
            <p><span className="font-medium">消费:</span> {status.usedfee?.toFixed(2) || '0.00'}元</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
              {station.stationName}
            </h2>
            <p className="text-sm text-gray-600 mt-1 truncate">
              {station.address}
            </p>
          </div>
          
          <button
            onClick={handleRemoveFavorite}
            className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-colors ml-2"
            title="移除收藏"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" 
                clipRule="evenodd" 
              />
            </svg>
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-2 text-center text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-semibold text-lg text-gray-800">{summary.total}</p>
            <p className="text-xs">总插座</p>
          </div>
          <div>
            <p className="font-semibold text-lg text-green-600">{summary.available}</p>
            <p className="text-xs">可用</p>
          </div>
          <div>
            <p className="font-semibold text-lg text-blue-600">{summary.occupied}</p>
            <p className="text-xs">占用</p>
          </div>
        </div>

        {/* Outlets Grid */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner text="加载中..." />
            </div>
          ) : outlets.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-4">
              该充电站暂无插座信息。
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {outlets
                .sort((a, b) => a.outletSerialNo - b.outletSerialNo)
                .map((outlet, index) => renderOutletCard(outlet, outletStatuses[index]))
              }
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FavoriteStationCard
