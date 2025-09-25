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
  const [isExpanded, setIsExpanded] = useState(false)
  const [summary, setSummary] = useState({
    total: 0,
    available: 0,
    occupied: 0
  })

  const { removeFavorite, pinFavorite, unpinFavorite, isPinned } = useFavoritesStore()
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

  const handleTogglePin = () => {
    if (isPinned(station.stationId)) {
      unpinFavorite(station.stationId)
    } else {
      pinFavorite(station.stationId)
    }
  }

  const renderOutletCard = (outlet: Outlet, status: OutletStatus | null) => {
    const isAvailable = status?.outlet?.iCurrentChargingRecordId === 0
    // 优先使用状态API中的插座名称，这是最准确的名称
    const outletName = status?.outlet?.vOutletName?.replace('插座', '') 
      || outlet.vOutletName?.replace('插座', '') 
      || outlet.outletNo 
      || 'N/A'
    const serial = `插座 ${outletName.length > 10 ? outletName.substring(0, 10) + '...' : outletName}`
    
    if (!status || !status.outlet) {
      return (
        <div key={outlet.outletId} className="bg-gray-100 dark:bg-gray-700 rounded-xl p-3 border border-gray-200 dark:border-gray-600 h-20">
          <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 truncate" title={`插座 ${outletName}`}>{serial}</h4>
          <p className="text-xs text-red-500 dark:text-red-400 mt-1">数据加载失败</p>
        </div>
      )
    }

    const cardClasses = isAvailable 
      ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700' 
      : 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700'
    
    const statusBadge = isAvailable ? (
      <span className="text-xs font-bold py-1 px-2.5 rounded-full bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200">
        可用
      </span>
    ) : (
      <span className="text-xs font-bold py-1 px-2.5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
        占用中
      </span>
    )

    return (
      <div key={outlet.outletId} className={`rounded-xl p-3 border transition-all h-20 ${cardClasses}`}>
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate mr-2" title={`插座 ${outletName}`}>{serial}</h4>
          {statusBadge}
        </div>
        
        {isAvailable ? (
          <div className="mt-2 text-center">
            <p className="text-xs text-green-700 dark:text-green-400 font-semibold">空闲中</p>
          </div>
        ) : (
          <div className="mt-1 text-xs flex justify-between text-gray-600 dark:text-gray-300">
            <span><span className="font-medium">已充:</span> {status.usedmin || 0}分钟</span>
            <span><span className="font-medium">消费:</span> {status.usedfee?.toFixed(2) || '0.00'}元</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
                {station.stationName}
              </h2>
              {isPinned(station.stationId) && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  置顶
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 truncate">
              {station.address}
            </p>
          </div>
          
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={handleTogglePin}
              className={`p-1.5 rounded-full transition-colors ${
                isPinned(station.stationId)
                  ? 'text-yellow-500 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30'
                  : 'text-gray-400 dark:text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30'
              }`}
              title={isPinned(station.stationId) ? '取消置顶' : '置顶'}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill={isPinned(station.stationId) ? 'currentColor' : 'none'}
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
                />
              </svg>
            </button>
            
            <button
              onClick={handleRemoveFavorite}
              className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
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
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-2 text-center text-sm text-gray-600 dark:text-gray-300 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <p className="font-semibold text-lg text-gray-800 dark:text-gray-200">{summary.total}</p>
            <p className="text-xs">总插座</p>
          </div>
          <div>
            <p className="font-semibold text-lg text-green-600 dark:text-green-400">{summary.available}</p>
            <p className="text-xs">可用</p>
          </div>
          <div>
            <p className="font-semibold text-lg text-blue-600 dark:text-blue-400">{summary.occupied}</p>
            <p className="text-xs">占用</p>
          </div>
        </div>

        {/* 展开/收起按钮 */}
        {outlets.length > 0 && (
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            >
              {isExpanded ? (
                <>
                  <span>收起详情</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                  </svg>
                </>
              ) : (
                <>
                  <span>展开详情</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}

        {/* Outlets Grid */}
        {isExpanded && (
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner text="加载中..." />
              </div>
            ) : outlets.length === 0 ? (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
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
        )}
      </div>
    </div>
  )
}

export default FavoriteStationCard
