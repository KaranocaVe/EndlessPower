import React, { useState, useEffect } from 'react'
import { useSettingsStore } from '../store/settingsStore'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  // 从store获取设置状态
  const {
    autoRefresh,
    showUnavailableStations,
    refreshInterval,
    setAutoRefresh,
    setShowUnavailableStations,
    setRefreshInterval,
    resetSettings
  } = useSettingsStore()
  
  // 动画状态
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
    }
  }, [isOpen])

  if (!isOpen) return null

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
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full overflow-hidden flex flex-col transform transition-all duration-300 ease-out ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        style={{
          maxWidth: '480px',
          maxHeight: '90vh'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">设置</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="关闭设置"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content - 可滚动区域 */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* 基础设置示例 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">基础设置</h3>
            
            {/* 示例设置项 - 自动刷新 */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  自动刷新
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  定期自动更新充电桩状态
                </p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  id="auto-refresh"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
                <label
                  htmlFor="auto-refresh"
                  className={`block w-10 h-6 rounded-full cursor-pointer transition-colors ${
                    autoRefresh 
                      ? 'bg-blue-500' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span 
                    className={`block w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      autoRefresh 
                        ? 'transform translate-x-5 translate-y-1' 
                        : 'transform translate-x-1 translate-y-1'
                    }`}
                  ></span>
                </label>
              </div>
            </div>

            {/* 显示无可用插座的充电桩 */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  显示无可用插座的充电桩
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  在地图上显示没有可用插座的充电桩
                </p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  id="show-unavailable-stations"
                  checked={showUnavailableStations}
                  onChange={(e) => setShowUnavailableStations(e.target.checked)}
                />
                <label
                  htmlFor="show-unavailable-stations"
                  className={`block w-10 h-6 rounded-full cursor-pointer transition-colors ${
                    showUnavailableStations 
                      ? 'bg-blue-500' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span 
                    className={`block w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      showUnavailableStations 
                        ? 'transform translate-x-5 translate-y-1' 
                        : 'transform translate-x-1 translate-y-1'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
          </div>


          {/* 数据设置 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">数据设置</h3>
            
            {/* 刷新间隔 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                刷新间隔（秒）
              </label>
              <select 
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="15">15 秒</option>
                <option value="30">30 秒</option>
                <option value="60">1 分钟</option>
                <option value="300">5 分钟</option>
              </select>
            </div>
          </div>

          {/* 关于信息 */}
          <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">关于</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p>
                <span className="font-medium">版本:</span> 1.0.0
              </p>
              <p>
                <span className="font-medium">数据来源:</span> 闪开来电充电桩API
              </p>
              <p>
                <span className="font-medium">地图服务:</span> 高德地图
              </p>
            </div>
            
            {/* 重置按钮 */}
            <button 
              onClick={() => {
                resetSettings()
                // 显示重置完成的反馈
                console.log('设置已重置为默认值')
              }}
              className="w-full mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              重置所有设置
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel
