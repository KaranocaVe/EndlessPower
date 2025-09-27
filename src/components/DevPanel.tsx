import React, { useState, useCallback } from 'react'
import { HardcodedStationLocation } from '../data/stationLocations'
import { getVersionInfo } from '../utils/version'
import CloseOutlined from '@mui/icons-material/CloseOutlined'
import DragIndicatorOutlined from '@mui/icons-material/DragIndicatorOutlined'
import MyLocationOutlined from '@mui/icons-material/MyLocationOutlined'
import DownloadOutlined from '@mui/icons-material/DownloadOutlined'
import AddLocationOutlined from '@mui/icons-material/AddLocationOutlined'
import ContentCopyOutlined from '@mui/icons-material/ContentCopyOutlined'

export interface DevPanelProps {
  isOpen: boolean
  onClose: () => void
  isDragMode: boolean
  onToggleDragMode: () => void
  isCoordMode: boolean
  onToggleCoordMode: () => void
  selectedCoords: [number, number] | null
  onClearCoords: () => void
  stations: HardcodedStationLocation[]
  calibratedPositions: Record<number, { lat: number; lng: number }>
  allStations: Array<{ stationId: number; stationName: string; latitude: number; longitude: number }>
  onUpdateStation: (stationId: number, latitude: number, longitude: number) => void
  onAddStation: (station: Omit<HardcodedStationLocation, 'stationId'>) => void
}

const DevPanel: React.FC<DevPanelProps> = ({
  isOpen,
  onClose,
  isDragMode,
  onToggleDragMode,
  isCoordMode,
  onToggleCoordMode,
  selectedCoords,
  onClearCoords,
  stations,
  calibratedPositions,
  allStations,
  onUpdateStation: _onUpdateStation,
  onAddStation
}) => {
  const [newStationForm, setNewStationForm] = useState({
    stationName: '',
    address: '',
    note: ''
  })
  const [showAddForm, setShowAddForm] = useState(false)

  const versionInfo = getVersionInfo()

  const handleExportJSON = useCallback(() => {
    // 合并硬编码充电站和校准位置
    const exportData: Array<{
      stationId: number
      stationName: string
      latitude: number
      longitude: number
      address?: string
      note?: string
    }> = []

    // 添加硬编码充电站
    stations.forEach(station => {
      exportData.push({
        stationId: station.stationId,
        stationName: station.stationName,
        latitude: station.latitude,
        longitude: station.longitude,
        address: station.address,
        note: station.note
      })
    })

    // 添加API充电站的校准位置
    Object.entries(calibratedPositions).forEach(([stationIdStr, position]) => {
      const stationId = parseInt(stationIdStr)
      const station = allStations.find(s => s.stationId === stationId)
      
      if (station && !stations.some(s => s.stationId === stationId)) {
        exportData.push({
          stationId: station.stationId,
          stationName: station.stationName,
          latitude: position.lat,
          longitude: position.lng,
          note: `校准自API位置 (原位置: ${station.latitude.toFixed(6)}, ${station.longitude.toFixed(6)})`
        })
      }
    })

    // 按ID排序
    exportData.sort((a, b) => a.stationId - b.stationId)

    const jsonString = JSON.stringify(exportData, null, 2)
    
    // 复制到剪贴板
    navigator.clipboard.writeText(jsonString).then(() => {
      alert(`已导出 ${exportData.length} 个充电站的校准位置到剪贴板`)
    }).catch(() => {
      // 创建一个临时的textarea来复制文本
      const textarea = document.createElement('textarea')
      textarea.value = jsonString
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      alert(`已导出 ${exportData.length} 个充电站的校准位置到剪贴板`)
    })
  }, [stations, calibratedPositions, allStations])

  const handleAddStation = useCallback(() => {
    if (!selectedCoords || !newStationForm.stationName.trim()) {
      alert('请先选择坐标并填写充电站名称')
      return
    }

    const newStation: Omit<HardcodedStationLocation, 'stationId'> = {
      stationName: newStationForm.stationName.trim(),
      latitude: selectedCoords[0],
      longitude: selectedCoords[1],
      address: newStationForm.address.trim() || undefined,
      note: newStationForm.note.trim() || undefined
    }

    onAddStation(newStation)
    
    // 重置表单
    setNewStationForm({ stationName: '', address: '', note: '' })
    setShowAddForm(false)
    onClearCoords()
  }, [selectedCoords, newStationForm, onAddStation, onClearCoords])

  if (!isOpen) return null

  return (
    <div 
      className="fixed top-4 right-4 w-80 bg-white dark:bg-gray-900 shadow-2xl z-[1001] rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300"
      style={{ maxHeight: 'calc(100vh - 2rem)' }}
    >
      {/* 滚动容器 */}
      <div className="overflow-y-auto dev-panel-scrollbar" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              开发者工具
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {versionInfo.isDevelopment ? 'Development Mode' : 'Production Mode'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="关闭开发者面板"
          >
            <CloseOutlined className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* 工具按钮区域 */}
        <div className="p-4 space-y-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            地图工具
          </h3>
          
          {/* 拖拽模式 */}
          <button
            onClick={onToggleDragMode}
            className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
              isDragMode
                ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300'
                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <DragIndicatorOutlined className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">拖拽模式</div>
              <div className="text-xs opacity-75">
                {isDragMode ? '已启用 - 可拖拽充电站位置' : '点击启用拖拽充电站位置'}
              </div>
            </div>
          </button>

          {/* 坐标获取模式 */}
          <button
            onClick={onToggleCoordMode}
            className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
              isCoordMode
                ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-300'
                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <MyLocationOutlined className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">坐标获取</div>
              <div className="text-xs opacity-75">
                {isCoordMode ? '已启用 - 点击地图获取坐标' : '点击启用坐标获取模式'}
              </div>
            </div>
          </button>

        </div>


        {/* 坐标显示区域 */}
        {selectedCoords && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              选中的坐标
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <div className="font-mono text-sm text-gray-900 dark:text-gray-100">
                纬度: {selectedCoords[0].toFixed(6)}
              </div>
              <div className="font-mono text-sm text-gray-900 dark:text-gray-100">
                经度: {selectedCoords[1].toFixed(6)}
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    const coordsText = `[${selectedCoords[0].toFixed(6)}, ${selectedCoords[1].toFixed(6)}]`
                    navigator.clipboard.writeText(coordsText)
                    alert('坐标已复制到剪贴板')
                  }}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                >
                  <ContentCopyOutlined sx={{ fontSize: 14 }} />
                  复制
                </button>
                <button
                  onClick={onClearCoords}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  清除
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 添加新充电站 */}
        {selectedCoords && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="w-full flex items-center gap-2 p-2 bg-green-50 border border-green-200 text-green-700 rounded-lg hover:bg-green-100 dark:bg-green-950 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900"
            >
              <AddLocationOutlined className="h-4 w-4" />
              {showAddForm ? '取消添加' : '在此坐标添加充电站'}
            </button>

            {showAddForm && (
              <div className="mt-3 space-y-3">
                <input
                  type="text"
                  placeholder="充电站名称 *"
                  value={newStationForm.stationName}
                  onChange={(e) => setNewStationForm(prev => ({ ...prev, stationName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                />
                <input
                  type="text"
                  placeholder="地址"
                  value={newStationForm.address}
                  onChange={(e) => setNewStationForm(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                />
                <input
                  type="text"
                  placeholder="备注"
                  value={newStationForm.note}
                  onChange={(e) => setNewStationForm(prev => ({ ...prev, note: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                />
                <button
                  onClick={handleAddStation}
                  disabled={!newStationForm.stationName.trim()}
                  className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  添加充电站
                </button>
              </div>
            )}
          </div>
        )}

        {/* 导出功能 */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleExportJSON}
            className="w-full flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <DownloadOutlined className="h-5 w-5" />
            导出JSON数据
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            将复制到剪贴板，可直接粘贴到 stationLocations.ts
          </p>
        </div>

        {/* 校准统计 */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            位置校准统计
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
              <div className="text-blue-700 dark:text-blue-300 font-medium">硬编码</div>
              <div className="text-blue-900 dark:text-blue-100 text-lg font-bold">{stations.length}</div>
            </div>
            <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
              <div className="text-green-700 dark:text-green-300 font-medium">API校准</div>
              <div className="text-green-900 dark:text-green-100 text-lg font-bold">{Object.keys(calibratedPositions).length}</div>
            </div>
          </div>
        </div>

        {/* 校准位置列表 */}
        {Object.keys(calibratedPositions).length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              API校准位置 ({Object.keys(calibratedPositions).length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto dev-panel-scrollbar">
              {Object.entries(calibratedPositions).map(([stationIdStr, position]) => {
                const stationId = parseInt(stationIdStr)
                const station = allStations.find(s => s.stationId === stationId)
                return (
                  <div
                    key={stationId}
                    className="p-3 bg-green-50 dark:bg-green-900 rounded-lg text-sm"
                  >
                    <div className="font-medium text-green-900 dark:text-green-100">
                      {station?.stationName || `充电站 ${stationId}`}
                    </div>
                    <div className="text-green-700 dark:text-green-300 font-mono text-xs">
                      校准: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
                    </div>
                    {station && (
                      <div className="text-green-600 dark:text-green-400 font-mono text-xs opacity-75">
                        原位置: {station.latitude.toFixed(6)}, {station.longitude.toFixed(6)}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 硬编码充电站列表 */}
        {stations.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              硬编码充电站 ({stations.length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto dev-panel-scrollbar">
              {stations.map((station) => (
                <div
                  key={station.stationId}
                  className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg text-sm"
                >
                  <div className="font-medium text-blue-900 dark:text-blue-100">
                    {station.stationName}
                  </div>
                  <div className="text-blue-700 dark:text-blue-300 font-mono text-xs">
                    {station.latitude.toFixed(6)}, {station.longitude.toFixed(6)}
                  </div>
                  {station.note && (
                    <div className="text-blue-600 dark:text-blue-400 text-xs mt-1">
                      {station.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 版本信息 */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
          <div>版本: {versionInfo.version}</div>
          <div>构建: {versionInfo.gitCommit.substring(0, 7)}</div>
          <div>环境: {versionInfo.environment}</div>
        </div>
      </div>
    </div>
  )
}

export default DevPanel







