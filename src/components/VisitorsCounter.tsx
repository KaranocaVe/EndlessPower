import React from 'react'
import { useVisitorsCount } from '../hooks/useVisitorsCount'

const VisitorsCounter: React.FC = () => {
  const { visitorsCount, isConnected } = useVisitorsCount()

  // 如果未连接且没有访问者数据，不显示组件
  if (!isConnected && visitorsCount === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 z-[1000]">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg border border-gray-200/50 dark:border-gray-700/50 flex items-center gap-2 text-sm">
        {/* 连接状态指示器 */}
        <div className="flex items-center gap-1.5">
          <div 
            className={`w-2 h-2 rounded-full ${
              isConnected 
                ? 'bg-green-500 animate-pulse' 
                : 'bg-gray-400'
            }`}
          ></div>
          <span className="text-gray-700 dark:text-gray-200 font-medium">
            {visitorsCount}
          </span>
        </div>
        
        {/* 用户图标 */}
        <svg 
          className="w-4 h-4 text-gray-600 dark:text-gray-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197V9a3 3 0 00-6 0v2m0 0V9a3 3 0 016 0v2m0 0V7a2 2 0 00-4 0v2m4 0V7a2 2 0 00-4 0v2"
          />
        </svg>
        
        {/* 在线文本 */}
        <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
          {isConnected ? '在线' : '离线'}
        </span>
      </div>
    </div>
  )
}

export default VisitorsCounter
