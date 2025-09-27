import React, { useState, useEffect, useRef } from 'react'
import './StationDetailPanel.css'
import { Station, Outlet, OutletStatus } from '../types/station'
import { fetchStationOutlets, fetchOutletStatus } from '../utils/api'
import { useFavoritesStore } from '../store/favoritesStore'
import { useErrorStore } from '../store/errorStore'
import LoadingSpinner from './LoadingSpinner'
import StarOutlined from '@mui/icons-material/StarOutlined'
import StarBorderOutlined from '@mui/icons-material/StarBorderOutlined'
import QrCodeScannerOutlined from '@mui/icons-material/QrCodeScannerOutlined'

interface StationDetailPanelProps {
  station: Station | null
  onClose: () => void
}

const StationDetailPanel: React.FC<StationDetailPanelProps> = ({ station, onClose }) => {
  const [outlets, setOutlets] = useState<Outlet[]>([])
  const [outletStatuses, setOutletStatuses] = useState<(OutletStatus | null)[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [shouldScrollTitle, setShouldScrollTitle] = useState(false)
  const [shouldScrollAddress, setShouldScrollAddress] = useState(false)
  
  const titleRef = useRef<HTMLHeadingElement>(null)
  const addressRef = useRef<HTMLParagraphElement>(null)
  
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

  // 检测文本是否需要滚动
  useEffect(() => {
    if (!station) return

    const checkOverflow = () => {
      // 检测标题是否溢出
      if (titleRef.current) {
        const isOverflowing = titleRef.current.scrollWidth > titleRef.current.clientWidth
        setShouldScrollTitle(isOverflowing)
      }

      // 检测地址是否溢出  
      if (addressRef.current) {
        const isOverflowing = addressRef.current.scrollWidth > addressRef.current.clientWidth
        setShouldScrollAddress(isOverflowing)
      }
    }

    // 延迟检测，确保DOM已渲染
    const timer = setTimeout(checkOverflow, 100)
    
    return () => clearTimeout(timer)
  }, [station])


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

  const handleWeChatScan = () => {
    try {
      // 尝试打开微信扫一扫
      window.location.href = 'weixin://scanqrcode'
    } catch (error) {
      console.warn('无法打开微信扫一扫，可能是设备不支持或未安装微信', error)
    }
  }

  const renderOutletCard = (outlet: Outlet, status: OutletStatus | null) => {
    const isAvailable = status?.outlet?.iCurrentChargingRecordId === 0
    
    // 优先使用状态API中的插座名称，这是最准确的名称
    let outletName = status?.outlet?.vOutletName?.replace('插座', '').trim()
      || outlet.vOutletName?.replace('插座', '').trim()
      || outlet.outletNo 
      || 'N/A'
    
    // 如果名称为空，使用序号
    if (!outletName || outletName === '') {
      outletName = outlet.outletSerialNo?.toString() || outlet.outletNo || 'N/A'
    }
    
    // 智能提取显示文本 - 避免出现"2.."这样的显示问题
    const extractNumber = (name: string) => {
      // 如果是纯数字，直接返回
      if (/^\d+$/.test(name)) {
        return name
      }
      
      // 如果名称很短（3个字符以内），直接使用
      if (name.length <= 3) {
        return name
      }
      
      // 尝试提取开头的数字
      const numbers = name.match(/^(\d+)/)
      if (numbers && numbers[1]) {
        return numbers[1]
      }
      
      // 如果没有数字，使用插座序号
      return outlet.outletSerialNo?.toString() || name.substring(0, 2) || '?'
    }
    const serial = extractNumber(outletName)
    
    if (!status || !status.outlet) {
      return (
        <div key={outlet.outletId} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-2.5 border border-gray-200/50 dark:border-gray-600/50 h-24 shadow-sm">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate" title={`插座 ${outletName}`}>{serial}</h3>
          </div>
          <p className="text-xs text-red-500 dark:text-red-400">数据加载失败</p>
        </div>
      )
    }

    const cardClasses = isAvailable 
      ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-green-900/20 dark:via-emerald-900/10 dark:to-green-800/20 border-green-200/60 dark:border-green-700/50 shadow-green-100/50 dark:shadow-green-900/20' 
      : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-blue-900/20 dark:via-indigo-900/10 dark:to-blue-800/20 border-blue-200/60 dark:border-blue-700/50 shadow-blue-100/50 dark:shadow-blue-900/20'
    
    const statusBadge = isAvailable ? (
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold shadow-md">
        <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <span>可用</span>
      </div>
    ) : (
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold shadow-md">
        <div className="w-1 h-1 bg-white rounded-full"></div>
        <span>占用中</span>
      </div>
    )

    const formatTime = (timeStr: string) => {
      if (!timeStr || timeStr === '未知') return '未知'
      // 只显示时间部分，去掉日期
      const timePart = timeStr.split(' ')[1]
      return timePart ? timePart.substring(0, 5) : timeStr // 只显示HH:MM
    }

    const details = isAvailable ? (
      <div className="text-center">
        <p className="text-xs font-semibold text-green-700 dark:text-green-400">空闲中</p>
      </div>
    ) : (
      <div className="space-y-1">
        {/* 主要信息：时间和费用 */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{status.usedmin || 0}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">分钟</span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-xs text-gray-500 dark:text-gray-400">¥</span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">{status.usedfee?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
        {/* 次要信息：功率和开始时间 */}
        <div className="flex items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-medium truncate flex-1">{status.powerFee?.billingPower || '未知'}</span>
          <span className="flex-shrink-0">{formatTime(status.chargingBeginTime || '未知')}</span>
        </div>
      </div>
    )

    return (
      <div key={outlet.outletId} className={`rounded-xl p-2.5 border transition-all duration-300 h-24 shadow-md hover:shadow-lg ${cardClasses}`}>
        <div className="flex justify-between items-center gap-1.5 mb-1.5">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <div className="flex-1 min-w-0 overflow-hidden relative">
              <div 
                className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                  isAvailable 
                    ? 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-700/50' 
                    : 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700/50'
                }`}
                title={`插座 ${outletName}`}
              >
                <span className={`text-sm font-bold ${
                  isAvailable 
                    ? 'text-green-700 dark:text-green-300' 
                    : 'text-blue-700 dark:text-blue-300'
                }`}>
                  {serial}
                </span>
              </div>
            </div>
          </div>
          {statusBadge}
        </div>
        {details}
      </div>
    )
  }

  // ESC键关闭和焦点管理
  useEffect(() => {
    if (station) {
      document.body.style.overflow = 'hidden'
      
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }
      document.addEventListener('keydown', handleEscape)
      
      return () => {
        document.body.style.overflow = 'unset'
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [station, onClose])

  if (!station) return null

  return (
    <div 
      className={`fixed inset-0 bg-black/40 z-[1200] transition-all duration-300 ${
        station ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="station-title"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div className={`w-full max-w-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 flex flex-col ${
        station ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`} style={{ maxHeight: 'calc(85vh - 80px)' }}>
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/30 dark:to-indigo-900/30">
        <div className="flex justify-between items-center">
          <div className="flex-1 min-w-0">
            <div className="overflow-hidden">
              <h2 
                ref={titleRef}
                id="station-title"
                className={`text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent whitespace-nowrap ${
                  shouldScrollTitle ? 'animate-marquee-scroll' : ''
                }`}
                title={station.stationName}
                onMouseEnter={(e) => {
                  if (shouldScrollTitle) {
                    e.currentTarget.style.animationPlayState = 'paused'
                  }
                }}
                onMouseLeave={(e) => {
                  if (shouldScrollTitle) {
                    e.currentTarget.style.animationPlayState = 'running'
                  }
                }}
              >
                {station.stationName}
              </h2>
            </div>
            <div className="overflow-hidden mt-1">
              <p 
                ref={addressRef}
                className={`text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap ${
                  shouldScrollAddress ? 'animate-marquee-scroll' : ''
                }`}
                title={station.address}
                onMouseEnter={(e) => {
                  if (shouldScrollAddress) {
                    e.currentTarget.style.animationPlayState = 'paused'
                  }
                }}
                onMouseLeave={(e) => {
                  if (shouldScrollAddress) {
                    e.currentTarget.style.animationPlayState = 'running'
                  }
                }}
              >
                {station.address}
              </p>
            </div>
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
      
      {/* Bottom Action Buttons - Outside the card */}
      <div className="mt-4 flex justify-center gap-3" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        <button
          onClick={handleWeChatScan}
          className="bg-green-500 text-white hover:bg-green-600 p-4 rounded-full shadow-lg transition-all duration-200 min-w-[56px] min-h-[56px] flex items-center justify-center hover:scale-105 active:scale-95"
          aria-label="微信扫一扫"
          type="button"
        >
          <QrCodeScannerOutlined className="h-6 w-6" />
        </button>
        
        <button
          onClick={handleFavoriteToggle}
          className={`p-4 rounded-full shadow-lg transition-all duration-200 min-w-[56px] min-h-[56px] flex items-center justify-center hover:scale-105 active:scale-95 ${
            isFavorite(station.stationId)
              ? 'bg-yellow-400 text-white hover:bg-yellow-500'
              : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 hover:text-yellow-500'
          }`}
          aria-label={isFavorite(station.stationId) ? '取消收藏' : '添加收藏'}
          type="button"
        >
          {isFavorite(station.stationId) ? (
            <StarOutlined className="h-6 w-6" />
          ) : (
            <StarBorderOutlined className="h-6 w-6" />
          )}
        </button>
        
        <button
          onClick={onClose}
          className="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 p-4 rounded-full shadow-lg transition-all duration-200 min-w-[56px] min-h-[56px] flex items-center justify-center hover:scale-105 active:scale-95"
          aria-label="关闭充电站详情"
          type="button"
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
  )
}

export default StationDetailPanel
