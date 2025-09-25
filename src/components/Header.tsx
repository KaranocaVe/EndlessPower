import React, { useState } from 'react'
import clsx from 'clsx'
import SettingsPanel from './SettingsPanel'

interface HeaderProps {
  currentView: 'map' | 'favorites'
  onViewChange: (view: 'map' | 'favorites') => void
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg z-[1100] border-b border-gray-200/50 dark:border-gray-700/50">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
            <span className="hidden sm:inline">EndlessPower 闪开来电充电桩查询</span>
            <span className="sm:hidden">EndlessPower</span>
          </h1>
        </div>

        {/* 简化的导航按钮组 */}
        <div className="flex items-center space-x-1 bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl shadow-sm">
          {/* 地图按钮 */}
          <button
            onClick={() => onViewChange('map')}
            className={clsx(
              'flex items-center justify-center p-3 rounded-lg transition-all duration-200',
              currentView === 'map'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50'
            )}
            title="地图"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </button>

          {/* 收藏按钮 */}
          <button
            onClick={() => onViewChange('favorites')}
            className={clsx(
              'flex items-center justify-center p-3 rounded-lg transition-all duration-200',
              currentView === 'favorites'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50'
            )}
            title="收藏"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* 设置按钮 */}
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center justify-center p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 transition-all duration-200"
            title="设置"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </nav>

      {/* 设置面板 */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </header>
  )
}

export default Header