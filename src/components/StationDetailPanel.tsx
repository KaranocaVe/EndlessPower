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
        if (import.meta.env.DEV) console.error('Failed to load station details:', error)
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
    // 优先使用状态API中的插座名称，这是最准确的名称
    const outletName = status?.outlet?.vOutletName?.replace('插座', '') 
      || outlet.vOutletName?.replace('插座', '') 
      || outlet.outletNo 
      || 'N/A'
    
    // 智能截断：保留尾部不同信息，省略前面相同部分
    const formatOutletName = (name: string) => {
      if (name.length <= 8) return `插座 ${name}`
      // 如果名称很长，显示前3个字符...后4个字符
      if (name.length > 12) {
        return `插座 ${name.substring(0, 3)}...${name.slice(-4)}`
      }
      return `插座 ${name}`
    }
    const serial = formatOutletName(outletName)
    
    if (!status || !status.outlet) {
      return (
        <div key={outlet.outletId} className="bg-gray-100 dark:bg-gray-700 rounded-xl p-3 border border-gray-200 dark:border-gray-600 h-28">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 truncate" title={`插座 ${outletName}`}>{serial}</h3>
          <p className="text-xs text-red-500 dark:text-red-400 mt-1">数据加载失败</p>
        </div>
      )
    }

    const cardClasses = isAvailable 
      ? 'bg-green-50/80 dark:bg-green-900/30 border-green-200 dark:border-green-700' 
      : 'bg-blue-50/80 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700'
    
    const statusBadge = isAvailable ? (
      <span className="text-xs font-bold py-1 px-2.5 rounded-full bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 whitespace-nowrap flex-shrink-0">
        可用
      </span>
    ) : (
      <span className="text-xs font-bold py-1 px-2.5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 whitespace-nowrap flex-shrink-0">
        占用中
      </span>
    )

    const formatTime = (timeStr: string) => {
      if (!timeStr || timeStr === '未知') return '未知'
      // 只显示时间部分，去掉日期
      const timePart = timeStr.split(' ')[1]
      return timePart ? timePart.substring(0, 5) : timeStr // 只显示HH:MM
    }

    const details = isAvailable ? (
      <div className="mt-2 text-center">
        <p className="text-xs font-semibold text-green-700 dark:text-green-400">空闲中</p>
      </div>
    ) : (
      <div className="mt-1 text-xs space-y-0.5 text-gray-600 dark:text-gray-300">
        <div className="flex justify-between">
          <span><strong>已充:</strong> {status.usedmin || 0}分钟</span>
          <span><strong>消费:</strong> {status.usedfee?.toFixed(2) || '0.00'}元</span>
        </div>
        <div className="flex justify-between">
          <span><strong>功率:</strong> {status.powerFee?.billingPower || '未知'}</span>
          <span><strong>开始:</strong> {formatTime(status.chargingBeginTime || '未知')}</span>
        </div>
      </div>
    )

    return (
      <div key={outlet.outletId} className={`rounded-xl p-3 border transition-all h-28 ${cardClasses}`}>
        <div className="flex justify-between items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate flex-1 min-w-0" title={`插座 ${outletName}`}>{serial}</h3>
          {statusBadge}
        </div>
        {details}
      </div>
    )
  }

  if (!station) return null

  return (
    <div 
      className={`fixed inset-0 bg-black/40 z-[1200] transition-all duration-300 ${
        station ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div className={`w-full max-w-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ${
        station ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`} style={{ maxHeight: '80vh' }}>
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/30 dark:to-indigo-900/30">
        <div className="flex justify-between items-center">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
              {station.stationName}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 truncate mt-1">
              {station.address}
            </p>
          </div>
          
          <div className="flex items-center space-x-1 ml-4">
            <button
              onClick={handleFavoriteToggle}
              className={`p-2 rounded-full transition-colors ${
                isFavorite(station.stationId)
                  ? 'text-yellow-400 hover:text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                  : 'text-gray-400 dark:text-gray-500 hover:text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
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
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-full hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-200"
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
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <LoadingSpinner />
          </div>
        ) : outlets.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            该充电站暂无插座信息。
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
    </div>
  )
}

export default StationDetailPanel
