import React, { useState, useEffect } from 'react'
import clsx from 'clsx'

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

    console.log('👂 PWA Header: 开始监听安装事件')
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

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
    }
  }, [])

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
    <header className="bg-white/80 backdrop-blur-sm shadow-sm z-[1100] border-b border-gray-200">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl font-bold text-gray-900 truncate">
            <span className="hidden sm:inline">EndlessPower 闪开来电充电桩查询</span>
            <span className="sm:hidden">EndlessPower</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* PWA 安装按钮 */}
          {!isInstalled && showInstallButton && deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="flex items-center space-x-1 px-2 py-1.5 md:px-3 bg-primary text-white text-xs md:text-sm font-medium rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
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
          
          {/* 开发调试按钮 - 仅在开发环境显示 */}
          {process.env.NODE_ENV === 'development' && (
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
          )}
          
          {/* 导航按钮 */}
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
        </div>
      </nav>
    </header>
  )
}

export default Header
