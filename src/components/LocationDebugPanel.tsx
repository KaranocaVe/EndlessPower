import React, { useState } from 'react'
import { Station } from '../types/station'
import { mergeStationsLocations, debugLocationMerge } from '../utils/locationMerger'
import { getHardcodedLocationsStats } from '../data/stationLocations'

interface LocationDebugPanelProps {
  stations: Station[]
  onClose: () => void
}

const LocationDebugPanel: React.FC<LocationDebugPanelProps> = ({ stations, onClose }) => {
  const [showDetails, setShowDetails] = useState(false)
  
  // 获取硬编码位置统计
  const hardcodedStats = getHardcodedLocationsStats()
  
  // 分析当前充电桩的位置使用情况
  const mergeResults = mergeStationsLocations(stations)
  const locationStats = debugLocationMerge(mergeResults, false)

  const handleExportData = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      hardcodedLocations: hardcodedStats,
      currentStations: locationStats,
      details: mergeResults.map(result => ({
        stationId: result.station.stationId,
        stationName: result.station.stationName,
        isHardcoded: result.isHardcoded,
        matchType: result.matchType,
        currentLocation: {
          latitude: result.station.latitude,
          longitude: result.station.longitude
        },
        originalLocation: result.originalLocation,
        hardcodedLocation: result.hardcodedLocation
      }))
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `station-locations-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div 
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-[2000]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '16px'
      }}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full overflow-hidden flex flex-col"
        style={{ 
          maxWidth: '672px', 
          maxHeight: '90vh',
          margin: 'auto'
        }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              位置调试面板
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* 概览统计 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">硬编码位置库</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{hardcodedStats.total}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">个精确位置</p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">使用硬编码位置</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {locationStats.hardcoded}/{locationStats.total}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                {((locationStats.hardcoded / locationStats.total) * 100).toFixed(1)}% 覆盖率
              </p>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">使用API位置</h3>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{locationStats.apiOnly}</p>
              <p className="text-sm text-orange-600 dark:text-orange-400">
                {((locationStats.apiOnly / locationStats.total) * 100).toFixed(1)}% 需要API
              </p>
            </div>
          </div>

          {/* 匹配类型统计 */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">匹配方式分析</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">ID 精确匹配</p>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{locationStats.idMatches} 个</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">名称模糊匹配</p>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{locationStats.nameMatches} 个</p>
              </div>
            </div>
          </div>

          {/* 详细列表 */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">充电桩位置详情</h3>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                {showDetails ? '隐藏详情' : '显示详情'}
              </button>
            </div>
            
            {showDetails && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {locationStats.details.map((detail) => (
                  <div 
                    key={detail.stationId} 
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 dark:text-gray-200 truncate">
                        {detail.stationName}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">ID: {detail.stationId}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {detail.isHardcoded ? (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded text-xs font-medium">
                          硬编码 ({detail.matchType})
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200 rounded text-xs font-medium">
                          API
                        </span>
                      )}
                      
                      {detail.distanceKm && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          距离差: {detail.distanceKm.toFixed(2)}km
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex space-x-3">
            <button
              onClick={() => {
                debugLocationMerge(mergeResults, true)
                alert('详细调试信息已输出到控制台，请按F12查看')
              }}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              输出详细日志
            </button>
            
            <button
              onClick={handleExportData}
              className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
            >
              导出数据
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocationDebugPanel