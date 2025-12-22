import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useMonitorStore, MonitorData } from '../store/monitorStore'
import { fetchOutletStatus } from '../utils/api'
import { getVersionInfo } from '../utils/version'
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined'
import PlayArrowOutlined from '@mui/icons-material/PlayArrowOutlined'
import PauseOutlined from '@mui/icons-material/PauseOutlined'
import DeleteOutlined from '@mui/icons-material/DeleteOutlined'
import RefreshOutlined from '@mui/icons-material/RefreshOutlined'
import ScheduleOutlined from '@mui/icons-material/ScheduleOutlined'
import CheckOutlined from '@mui/icons-material/CheckOutlined'

interface OutletMonitorViewProps {
  onBack: () => void
}

const OutletMonitorView: React.FC<OutletMonitorViewProps> = ({ onBack }) => {
  const {
    currentTarget,
    monitorHistory,
    pollInterval,
    isMonitoring,
    addMonitorData,
    clearHistory,
    setPollInterval,
    setMonitoring,
    setLastPollTime
  } = useMonitorStore()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showIntervalMenu, setShowIntervalMenu] = useState(false)
  const pollTimerRef = useRef<number | null>(null)
  const versionInfo = getVersionInfo()

  // 防休眠：Wake Lock + WebAudio 静音保活
  const wakeLockRef = useRef<{ release?: () => Promise<void> } | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const audioStartedRef = useRef(false)

  const requestWakeLock = useCallback(async () => {
    try {
      // Wake Lock API - 保持屏幕常亮
      if ('wakeLock' in navigator && document.visibilityState === 'visible') {
        wakeLockRef.current = await navigator.wakeLock.request('screen')
      }
    } catch {
      // 忽略不支持或被拒绝
    }
  }, [])

  const startSilentAudio = useCallback(async () => {
    if (audioStartedRef.current) return
    try {
      // @ts-expect-error - webkitAudioContext 是旧版浏览器的前缀
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      gain.gain.value = 0 // 静音
      osc.connect(gain).connect(ctx.destination)
      osc.start()
      audioCtxRef.current = ctx
      audioStartedRef.current = true
    } catch {
      // 可能需要用户手势触发，稍后在交互时再尝试
    }
  }, [])

  // 进入页面即尝试防休眠；可见性变化时重试；离开时清理
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock().catch(() => {})
      } else {
        // 页面不可见时释放，避免系统警告
        try { wakeLockRef.current?.release?.() } catch { /* noop */ }
      }
    }

    requestWakeLock().catch(() => {})
    startSilentAudio().catch(() => {})
    document.addEventListener('visibilitychange', handleVisibility)

    const resumeOnGesture = () => {
      if (!audioStartedRef.current) {
        startSilentAudio().catch(() => {})
      }
      requestWakeLock().catch(() => {})
    }
    document.addEventListener('click', resumeOnGesture)
    document.addEventListener('touchstart', resumeOnGesture)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      document.removeEventListener('click', resumeOnGesture)
      document.removeEventListener('touchstart', resumeOnGesture)
      try { wakeLockRef.current?.release?.() } catch { /* noop */ }
      try { audioCtxRef.current?.close?.() } catch { /* noop */ }
    }
  }, [requestWakeLock, startSilentAudio])

  // 获取插座状态并记录数据
  const fetchAndRecordData = async () => {
    if (!currentTarget) return

    setIsLoading(true)
    setError(null)

    try {
      const status = await fetchOutletStatus(currentTarget.outlet.outletNo)
      
      if (status && status.outlet) {
        // 解析功率信息（支持 W 和 kW 两种单位）
        const powerStr = status.powerFee?.billingPower || '0W'
        const powerMatch = powerStr.match(/(\d+\.?\d*)\s*(kW|W)/i)
        let power = 0
        if (powerMatch) {
          const value = parseFloat(powerMatch[1])
          const unit = powerMatch[2].toLowerCase()
          // 统一转换为 W（瓦特）
          power = unit === 'kw' ? value * 1000 : value
        }

        const data: MonitorData = {
          timestamp: Date.now(),
          power: power,
          fee: status.usedfee || 0,
          duration: status.usedmin || 0
        }

        addMonitorData(data)
        setLastPollTime(Date.now())
      } else {
        setError('无法获取插座状态')
      }
    } catch (err) {
      console.error('Failed to fetch outlet status:', err)
      setError('获取数据失败')
    } finally {
      setIsLoading(false)
    }
  }

  // 启动/停止监视
  useEffect(() => {
    if (isMonitoring && currentTarget) {
      // 立即获取一次数据
      fetchAndRecordData()

      // 设置定时轮询
      pollTimerRef.current = setInterval(() => {
        fetchAndRecordData()
      }, pollInterval * 1000)

      return () => {
        if (pollTimerRef.current) {
          clearInterval(pollTimerRef.current)
        }
      }
    } else {
      // 停止轮询
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMonitoring, pollInterval, currentTarget])

  // 组件卸载时停止监视
  useEffect(() => {
    return () => {
      setMonitoring(false)
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleStartStop = () => {
    setMonitoring(!isMonitoring)
  }

  const handleClearHistory = () => {
    if (window.confirm('确定要清空历史数据吗？')) {
      clearHistory()
    }
  }

  const handleIntervalChange = (newInterval: number) => {
    setPollInterval(newInterval)
    // 如果正在监视，重启定时器
    if (isMonitoring) {
      setMonitoring(false)
      setTimeout(() => setMonitoring(true), 100)
    }
  }

  if (!currentTarget) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          未选择监视对象
        </p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          返回地图
        </button>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="返回"
          >
            <ArrowBackOutlined />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 truncate">
              {currentTarget.stationName}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              插座 {currentTarget.outletName}
            </p>
          </div>
        </div>

        {/* 控制按钮 - 四个图标按钮居中一排，吸附顶部 */}
        <div className="sticky top-2 z-30 mx-auto w-fit flex items-center justify-center flex-wrap gap-2 md:gap-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-2 shadow-md">
          <button
            onClick={handleStartStop}
            title={isMonitoring ? '停止监视' : '开始监视'}
            className={`flex items-center justify-center h-10 md:h-11 w-11 md:w-12 rounded-xl transition-colors ${
              isMonitoring
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isMonitoring ? (
              <PauseOutlined className="w-5 h-5" />
            ) : (
              <PlayArrowOutlined className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={() => fetchAndRecordData()}
            disabled={isLoading}
            title="刷新"
            className="flex items-center justify-center h-10 md:h-11 w-11 md:w-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors disabled:opacity-50"
          >
            <RefreshOutlined className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleClearHistory}
            disabled={monitorHistory.length === 0}
            title="清空数据"
            className="flex items-center justify-center h-10 md:h-11 w-11 md:w-12 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 bg-transparent"
          >
            <DeleteOutlined className="w-5 h-5" />
          </button>
          {/* 间隔按钮 + 弹出选择 */}
          <div className="relative">
            <button
              onClick={() => setShowIntervalMenu(v => !v)}
              title="轮询间隔"
              className="flex items-center justify-center h-10 md:h-11 w-11 md:w-12 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors bg-transparent"
            >
              <ScheduleOutlined className="w-5 h-5" />
            </button>
            {showIntervalMenu && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 z-20 min-w-[140px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden">
                <ul role="listbox" className="py-1 text-sm text-gray-800 dark:text-gray-200">
                  {versionInfo.isDevelopment && (
                    <li>
                      <button
                        onClick={() => { handleIntervalChange(5); setShowIntervalMenu(false) }}
                        className={`w-full flex items-center justify-between px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${pollInterval===5 ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                      >
                        <span>5秒 (仅开发)</span>
                        {pollInterval===5 && <CheckOutlined className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                      </button>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={() => { handleIntervalChange(300); setShowIntervalMenu(false) }}
                      className={`w-full flex items-center justify-between px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${pollInterval===300 ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                    >
                      <span>5分钟</span>
                      {pollInterval===300 && <CheckOutlined className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => { handleIntervalChange(600); setShowIntervalMenu(false) }}
                      className={`w-full flex items-center justify-between px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${pollInterval===600 ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                    >
                      <span>10分钟</span>
                      {pollInterval===600 && <CheckOutlined className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => { handleIntervalChange(1800); setShowIntervalMenu(false) }}
                      className={`w-full flex items-center justify-between px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${pollInterval===1800 ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                    >
                      <span>30分钟</span>
                      {pollInterval===1800 && <CheckOutlined className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="flex-1 p-4 overflow-auto relative">
        {/* 错误提示 - 浮动在图表区域顶部 */}
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 max-w-md w-full px-4 pointer-events-none">
            <div className="p-3 bg-red-100 dark:bg-red-900/95 text-red-700 dark:text-red-400 rounded-lg text-sm shadow-lg backdrop-blur-md border border-red-200 dark:border-red-800 flex items-center gap-2 pointer-events-auto">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="flex-1">{error}</span>
            </div>
          </div>
        )}
        
        <PowerChart data={monitorHistory} />
      </div>

      {/* 数据统计 */}
      <DataStats data={monitorHistory} />
    </div>
  )
}

// 功率图表组件
const PowerChart: React.FC<{ data: MonitorData[] }> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 设置画布尺寸
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height
    const padding = { top: 40, right: 40, bottom: 60, left: 60 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // 清空画布
    ctx.clearRect(0, 0, width, height)

    // 获取功率值范围
    const maxPower = Math.max(...data.map(d => d.power), 1)
    const minPower = 0 // 固定从 0 开始，便于对比
    const powerRange = maxPower || 1

    // 绘制背景网格
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('color-scheme') === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.1)'
    ctx.lineWidth = 1

    // 水平网格线
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(padding.left + chartWidth, y)
      ctx.stroke()
    }

    // 垂直网格线
    const gridCount = Math.min(data.length - 1, 10)
    for (let i = 0; i <= gridCount; i++) {
      const x = padding.left + (chartWidth / gridCount) * i
      ctx.beginPath()
      ctx.moveTo(x, padding.top)
      ctx.lineTo(x, padding.top + chartHeight)
      ctx.stroke()
    }

    // 绘制坐标轴
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('color-scheme') === 'dark'
      ? 'rgba(255, 255, 255, 0.3)'
      : 'rgba(0, 0, 0, 0.3)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(padding.left, padding.top)
    ctx.lineTo(padding.left, padding.top + chartHeight)
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight)
    ctx.stroke()

    // 绘制Y轴标签
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('color-scheme') === 'dark'
      ? '#9CA3AF'
      : '#4B5563'
    ctx.font = '12px Inter, sans-serif'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    
    for (let i = 0; i <= 5; i++) {
      const value = maxPower - (powerRange / 5) * i
      const y = padding.top + (chartHeight / 5) * i
      ctx.fillText(`${value.toFixed(0)} W`, padding.left - 10, y)
    }

    // 绘制X轴标签（时间）- 基于真实时间戳
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    
    const minTime = data[0].timestamp
    const maxTime = data[data.length - 1].timestamp
    const timeRange = maxTime - minTime || 1
    
    // 选择合适数量的标签
    const labelCount = Math.min(data.length, 6)
    if (labelCount > 0) {
      for (let i = 0; i < labelCount; i++) {
        const dataIndex = labelCount > 1 
          ? Math.floor((data.length - 1) * (i / (labelCount - 1)))
          : 0
        
        if (dataIndex >= 0 && dataIndex < data.length) {
          const point = data[dataIndex]
          const timeOffset = point.timestamp - minTime
          const x = padding.left + (timeOffset / timeRange) * chartWidth
          
          const time = new Date(point.timestamp)
          const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`
          ctx.fillText(timeStr, x, padding.top + chartHeight + 10)
        }
      }
    }

    // 绘制功率曲线 - 基于真实时间戳
    if (data.length > 1) {
      const minTime = data[0].timestamp
      const maxTime = data[data.length - 1].timestamp
      const timeRange = maxTime - minTime || 1
      
      ctx.strokeStyle = '#3B82F6'
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      // 创建渐变填充
      const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight)
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)')
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)')

      // 绘制填充区域
      ctx.beginPath()
      data.forEach((point, index) => {
        const timeOffset = point.timestamp - minTime
        const x = padding.left + (timeOffset / timeRange) * chartWidth
        const y = padding.top + chartHeight - ((point.power - minPower) / powerRange) * chartHeight
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight)
      ctx.lineTo(padding.left, padding.top + chartHeight)
      ctx.closePath()
      ctx.fillStyle = gradient
      ctx.fill()

      // 绘制线条
      ctx.beginPath()
      data.forEach((point, index) => {
        const timeOffset = point.timestamp - minTime
        const x = padding.left + (timeOffset / timeRange) * chartWidth
        const y = padding.top + chartHeight - ((point.power - minPower) / powerRange) * chartHeight
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()

      // 绘制数据点
      ctx.fillStyle = '#3B82F6'
      data.forEach((point) => {
        const timeOffset = point.timestamp - minTime
        const x = padding.left + (timeOffset / timeRange) * chartWidth
        const y = padding.top + chartHeight - ((point.power - minPower) / powerRange) * chartHeight
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    // 绘制图表标题
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('color-scheme') === 'dark'
      ? '#E5E7EB'
      : '#1F2937'
    ctx.font = 'bold 16px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText('充电功率变化曲线', width / 2, 10)

  }, [data])

  if (data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">
          暂无数据，请开始监视或手动刷新
        </p>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ minHeight: '300px' }}
      />
    </div>
  )
}

// 数据统计组件
const DataStats: React.FC<{ data: MonitorData[] }> = ({ data }) => {
  if (data.length === 0) return null

  const latestData = data[data.length - 1]
  if (!latestData) return null
  
  // 计算功率统计
  const avgPower = data.reduce((sum, d) => sum + d.power, 0) / data.length
  const maxPower = Math.max(...data.map(d => d.power))
  
  // 使用梯形法则计算总电量（度数）
  const calculateEnergy = () => {
    if (data.length < 2) return 0
    
    let totalEnergy = 0 // kWh
    
    for (let i = 1; i < data.length; i++) {
      const timeDiff = (data[i].timestamp - data[i - 1].timestamp) / (1000 * 60 * 60) // 转换为小时
      const avgPowerInterval = (data[i].power + data[i - 1].power) / 2 // 梯形法则：取平均功率（W）
      totalEnergy += (avgPowerInterval / 1000) * timeDiff // 转换为 kWh
    }
    
    return totalEnergy
  }
  
  const totalEnergy = calculateEnergy()
  
  // 计算监视时长（从第一次采样到最后一次采样）
  const monitorDuration = data.length >= 2 
    ? Math.round((latestData.timestamp - data[0].timestamp) / (1000 * 60)) // 转换为分钟
    : 0

  // 电量自适应显示（Wh 或 kWh）
  const formatEnergy = (energyKWh: number) => {
    if (energyKWh < 1) {
      // 小于 1 kWh 时显示为 Wh
      return `${(energyKWh * 1000).toFixed(0)} Wh`
    } else {
      return `${energyKWh.toFixed(2)} kWh`
    }
  }

  // 单价自适应显示（元/Wh 或 元/kWh）
  const formatUnitPrice = (totalFee: number, energyKWh: number) => {
    if (energyKWh <= 0) return ''
    const pricePerKWh = totalFee / energyKWh
    if (energyKWh < 1) {
      // 小于 1 kWh 时显示为 元/Wh
      return `¥${(pricePerKWh / 1000).toFixed(4)}/Wh`
    } else {
      return `¥${pricePerKWh.toFixed(2)}/kWh`
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 功率统计 - 整合到一个卡片 */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">功率</div>
          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {latestData.power.toFixed(0)} W
              </span>
            </div>
            <div className="flex items-baseline justify-between text-xs text-gray-600 dark:text-gray-300">
              <span>平均 {avgPower.toFixed(0)} W</span>
              <span className="text-gray-400 dark:text-gray-500">|</span>
              <span>峰值 {maxPower.toFixed(0)} W</span>
            </div>
          </div>
        </div>

        {/* 总电量 - 计算得出 */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-3 rounded-lg border border-green-200/50 dark:border-green-700/50">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">总电量</div>
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            {formatEnergy(totalEnergy)}
          </div>
        </div>

        {/* 充电时长 */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-3 rounded-lg border border-purple-200/50 dark:border-purple-700/50">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">时长</div>
          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {latestData.duration} 分钟
              </span>
            </div>
            <div className="flex items-baseline justify-between text-xs text-gray-600 dark:text-gray-300">
              <span className="font-semibold">监视 {monitorDuration} 分钟</span>
            </div>
          </div>
        </div>

        {/* 累计费用 */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-3 rounded-lg border border-orange-200/50 dark:border-orange-700/50">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">费用</div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold text-orange-600 dark:text-orange-400">¥{latestData.fee.toFixed(2)}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{formatUnitPrice(latestData.fee, totalEnergy)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OutletMonitorView

