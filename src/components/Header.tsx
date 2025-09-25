import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import LocationDebugPanel from './LocationDebugPanel'
import { useStationStore } from '../store/stationStore'
import { useThemeStore } from '../store/themeStore'
import { IS_DEV } from '../config/environment'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

interface HeaderProps {
  currentView: 'map' | 'favorites'
  onViewChange: (view: 'map' | 'favorites') => void
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showInstallButton, setShowInstallButton] = useState(false)
  const [showLocationDebug, setShowLocationDebug] = useState(false)
  const { isUsingSimulatedData, setSimulatedData } = useStationStore()
  const { theme, isDark, toggleTheme, applyTheme } = useThemeStore()
  
  const { stations } = useStationStore()

  useEffect(() => {
    console.log('🔍 PWA Header: 初始化安装检测')
    
    // 检查是否已经安装
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const hasStandalone = 'standalone' in window.navigator
    const isAndroidApp = document.referrer.includes('android-app://')
    
    console.log('📱 PWA Header 检测结果:', {
      isStandalone,
      hasStandalone,
      isAndroidApp,
      userAgent: navigator.userAgent
    })
    
    if (isStandalone || hasStandalone || isAndroidApp) {
      console.log('✅ PWA Header: 应用已安装')
      setIsInstalled(true)
      return
    }

    // 监听安装事件
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('🎯 PWA Header: 收到beforeinstallprompt事件', e)
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallButton(true)
    }

    const handleAppInstalled = () => {
      console.log('🎉 PWA Header: 应用安装完成')
      setIsInstalled(true)
      setShowInstallButton(false)
      setDeferredPrompt(null)
    }

    // 监听 API 降级到模拟数据事件
    const handleApiFallback = () => {
      console.log('⚠️ PWA Header: API 降级到模拟数据')
      setSimulatedData(true)
    }

    // 监听系统主题变化
    const handleSystemThemeChange = (_e: MediaQueryListEvent) => {
      if (theme === 'auto') {
        applyTheme()
      }
    }

    console.log('👂 PWA Header: 开始监听安装事件')
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('api-fallback-to-simulation', handleApiFallback)
    
    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', handleSystemThemeChange)

    // 调试：检查当前状态
    setTimeout(() => {
      console.log('🔎 PWA Header 5秒后状态检查:', {
        deferredPrompt: !!deferredPrompt,
        showInstallButton,
        isInstalled,
        serviceWorkerRegistered: 'serviceWorker' in navigator
      })
    }, 5000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('api-fallback-to-simulation', handleApiFallback)
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [theme, applyTheme, setSimulatedData]) // eslint-disable-line react-hooks/exhaustive-deps

  // 初始化主题
  useEffect(() => {
    applyTheme()
  }, [applyTheme])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
        setShowInstallButton(false)
      }
      
      setDeferredPrompt(null)
    } catch (error) {
      console.error('Error during installation:', error)
    }
  }

  return (
    <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg z-[1100] border-b border-gray-200/50 dark:border-gray-700/50">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
            <span className="hidden sm:inline">EndlessPower 闪开来电充电桩查询</span>
            <span className="sm:hidden">EndlessPower</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* PWA 安装按钮 */}
          {!isInstalled && showInstallButton && deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs md:text-sm font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              title="安装应用到桌面"
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" 
                />
              </svg>
              <span className="hidden sm:inline">安装应用</span>
              <span className="sm:hidden">安装</span>
            </button>
          )}
          
          {/* 已安装状态指示 */}
          {isInstalled && (
            <div className="flex items-center space-x-1 px-2 py-1.5 bg-green-100 text-green-700 text-xs md:text-sm font-medium rounded-lg">
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <span className="hidden sm:inline">已安装</span>
            </div>
          )}
          
          {/* API 状态指示 */}
          {isUsingSimulatedData && (
            <div className="flex items-center space-x-1 px-2 py-1.5 bg-amber-100 text-amber-700 text-xs md:text-sm font-medium rounded-lg">
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
              <span className="hidden sm:inline">模拟数据</span>
              <span className="sm:hidden">模拟</span>
            </div>
          )}
          
          {/* 主题切换按钮 */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
            title={isDark ? '切换到亮色模式' : '切换到暗色模式'}
          >
            {isDark ? (
              // 太阳图标 (亮色模式)
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              // 月亮图标 (暗色模式)
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          
          {/* GitHub 链接 */}
          <a
            href="https://github.com/jasonmumiao/EndlessPower"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md group"
            title="GitHub 仓库"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
          
          {/* 开发调试按钮 - 仅在开发环境显示 */}
          {IS_DEV && (
            <div className="flex space-x-1">
              <button
                onClick={() => {
                  console.log('🔧 PWA 调试信息:', {
                    isInstalled,
                    showInstallButton,
                    hasDeferredPrompt: !!deferredPrompt,
                    userAgent: navigator.userAgent,
                    isStandalone: window.matchMedia('(display-mode: standalone)').matches,
                    hasServiceWorker: 'serviceWorker' in navigator,
                    manifestPresent: !!document.querySelector('link[rel="manifest"]'),
                    httpsOrLocalhost: location.protocol === 'https:' || location.hostname === 'localhost'
                  })
                  alert('PWA调试信息已输出到控制台，请按F12查看Console')
                }}
                className="px-2 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300 transition-colors"
                title="PWA调试信息"
              >
                🔧
              </button>
              
              <button
                onClick={() => setShowLocationDebug(true)}
                className="px-2 py-1.5 bg-blue-200 text-blue-700 text-xs rounded-lg hover:bg-blue-300 transition-colors"
                title="位置调试面板"
              >
                🗺️
              </button>
            </div>
          )}
          
          {/* 导航按钮 */}
          <div className="flex space-x-1 bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl shadow-sm">
            <button
              onClick={() => onViewChange('map')}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200',
                currentView === 'map'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/70 dark:hover:bg-gray-700/70'
              )}
            >
              地图
            </button>
            
            <button
              onClick={() => onViewChange('favorites')}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200',
                currentView === 'favorites'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/70 dark:hover:bg-gray-700/70'
              )}
            >
              收藏
            </button>
          </div>
        </div>
      </nav>
      
      {/* 位置调试面板 */}
      {showLocationDebug && (
        <LocationDebugPanel
          stations={stations}
          onClose={() => setShowLocationDebug(false)}
        />
      )}
    </header>
  )
}

export default Header
