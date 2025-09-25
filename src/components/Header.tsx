import React from 'react'
import clsx from 'clsx'

interface HeaderProps {
  currentView: 'map' | 'favorites'
  onViewChange: (view: 'map' | 'favorites') => void
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm z-[1100] border-b border-gray-200">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">
          EndlessPower 闪开来电充电桩查询
        </h1>
        
        <div className="flex space-x-1 bg-gray-200/80 p-1 rounded-lg">
          <button
            onClick={() => onViewChange('map')}
            className={clsx(
              'px-4 py-1.5 rounded-md text-sm font-semibold transition-all',
              currentView === 'map'
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
            )}
          >
            地图
          </button>
          
          <button
            onClick={() => onViewChange('favorites')}
            className={clsx(
              'px-4 py-1.5 rounded-md text-sm font-semibold transition-all',
              currentView === 'favorites'
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
            )}
          >
            收藏
          </button>
        </div>
      </nav>
    </header>
  )
}

export default Header
