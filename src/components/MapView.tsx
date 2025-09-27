import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Tooltip, useMapEvents } from 'react-leaflet'
import { useSEO } from '../hooks/useSEO'
import L from 'leaflet'
import { Station } from '../types/station'
import { useStationStore } from '../store/stationStore'
import { useThemeStore } from '../store/themeStore'
import { useSettingsStore } from '../store/settingsStore'
import { getColorForAvailability } from '../utils/api'
import { getVersionInfo } from '../utils/version'
import { HardcodedStationLocation, HARDCODED_STATION_LOCATIONS } from '../data/stationLocations'
import SearchBar from './SearchBar'
import StationDetailPanel from './StationDetailPanel'
import LoadingSpinner from './LoadingSpinner'
import DevPanel from './DevPanel'
import DraggableStationMarkerUniversal from './DraggableStationMarkerUniversal'
import RefreshOutlined from '@mui/icons-material/RefreshOutlined'
import QrCodeScannerOutlined from '@mui/icons-material/QrCodeScannerOutlined'
import DeveloperModeOutlined from '@mui/icons-material/DeveloperModeOutlined'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

const MAP_CENTER: [number, number] = [30.754365, 103.936107]

const MapView: React.FC = () => {
  // SEO优化
  useSEO('home')
  
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const mapRef = useRef<L.Map | null>(null)
  
  // 开发模式相关状态
  const [isDevMode, setIsDevMode] = useState(false)
  const [isDragMode, setIsDragMode] = useState(false)
  const [isCoordMode, setIsCoordMode] = useState(false)
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null)
  const [hardcodedStations, setHardcodedStations] = useState<HardcodedStationLocation[]>(HARDCODED_STATION_LOCATIONS)
  const [showMapModal, setShowMapModal] = useState(false)
  
  // 记录用户校准的位置 (stationId -> {lat, lng})
  const [calibratedPositions, setCalibratedPositions] = useState<Record<number, { lat: number; lng: number }>>({})
  
  const versionInfo = getVersionInfo()
  
  const { 
    getFilteredStations, 
    isLoading, 
    refreshStations, 
    canRefresh,
    setUserLocation: setStoreUserLocation 
  } = useStationStore()
  
  const { isDark } = useThemeStore()
  const { showUnavailableStations, autoRefresh, refreshInterval } = useSettingsStore()
  
  const stations = getFilteredStations()

  useEffect(() => {
    // 尝试获取用户位置
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const location: [number, number] = [latitude, longitude]
          setUserLocation(location)
          setStoreUserLocation(location)
          
          // 将地图中心移动到用户位置
          if (mapRef.current) {
            mapRef.current.setView(location, 16)
          }
        },
        (error) => {
          if (import.meta.env.DEV) console.warn('Failed to get user location:', error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      )
    }
  }, [setStoreUserLocation])

  // 自动刷新功能
  useEffect(() => {
    if (!autoRefresh) return

    const intervalId = setInterval(async () => {
      if (canRefresh()) {
        const lat = userLocation?.[0]
        const lng = userLocation?.[1]
        await refreshStations(lat, lng)
      }
    }, refreshInterval * 1000) // 转换为毫秒

    return () => clearInterval(intervalId)
  }, [autoRefresh, refreshInterval, userLocation, canRefresh, refreshStations])

  const createMarkerIcon = (color: string) => {
    return L.divIcon({
      className: 'leaflet-div-icon',
      html: `<div class="map-marker" style="background-color: ${color};"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    })
  }

  const createUserLocationIcon = () => {
    return L.divIcon({
      className: 'user-location-marker',
      html: '<div style="background-color: #3B82F6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>',
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    })
  }

  const handleRefresh = async () => {
    if (!canRefresh()) return
    
    // 如果支持地理位置且未在定位中，先获取用户位置
    if (navigator.geolocation && !isLocating) {
      setIsLocating(true)
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            const location: [number, number] = [latitude, longitude]
            
            setUserLocation(location)
            setStoreUserLocation(location)
            
            // 移动地图到用户位置
            if (mapRef.current) {
              mapRef.current.setView(location, 16)
            }
            
            // 刷新该位置的充电站
            await refreshStations(latitude, longitude)
          } catch {
            // 如果刷新失败，使用原有位置或默认位置
            const lat = userLocation?.[0]
            const lng = userLocation?.[1]
            await refreshStations(lat, lng)
          } finally {
            setIsLocating(false)
          }
        },
        async (_error) => {
          setIsLocating(false)
          // 定位失败时，使用原有位置刷新，不显示错误（静默处理）
          const lat = userLocation?.[0]
          const lng = userLocation?.[1]
          await refreshStations(lat, lng)
        },
        {
          enableHighAccuracy: true,
          timeout: 5000, // 减少超时时间
          maximumAge: 60000
        }
      )
    } else {
      // 不支持定位或正在定位中，直接刷新
      const lat = userLocation?.[0]
      const lng = userLocation?.[1]
      await refreshStations(lat, lng)
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

  // 开发模式相关函数
  const handleToggleDevMode = useCallback(() => {
    setIsDevMode(prev => !prev)
    if (isDevMode) {
      // 关闭开发模式时重置所有状态
      setIsDragMode(false)
      setIsCoordMode(false)
      setSelectedCoords(null)
    }
  }, [isDevMode])

  const handleToggleDragMode = useCallback(() => {
    setIsDragMode(prev => !prev)
    if (isCoordMode) {
      setIsCoordMode(false)
    }
  }, [isCoordMode])

  const handleToggleCoordMode = useCallback(() => {
    setIsCoordMode(prev => !prev)
    if (isDragMode) {
      setIsDragMode(false)
    }
  }, [isDragMode])

  const handleToggleMapModal = useCallback(() => {
    setShowMapModal(prev => !prev)
  }, [])

  const handleClearCoords = useCallback(() => {
    setSelectedCoords(null)
  }, [])

  // 处理充电站位置校准（包括API和硬编码的充电站）
  const handleUpdateStation = useCallback((stationId: number, latitude: number, longitude: number) => {
    // 检查是否是硬编码充电站
    const isHardcoded = hardcodedStations.some(station => station.stationId === stationId)
    
    if (isHardcoded) {
      // 更新硬编码充电站
      setHardcodedStations(prev => 
        prev.map(station => 
          station.stationId === stationId 
            ? { ...station, latitude, longitude }
            : station
        )
      )
    } else {
      // 记录API充电站的校准位置
      setCalibratedPositions(prev => ({
        ...prev,
        [stationId]: { lat: latitude, lng: longitude }
      }))
    }
  }, [hardcodedStations])

  // 获取充电站的实际显示位置（优先使用校准位置）
  const getStationPosition = useCallback((station: Station): [number, number] => {
    const calibrated = calibratedPositions[station.stationId]
    if (calibrated) {
      return [calibrated.lat, calibrated.lng]
    }
    return [station.latitude, station.longitude]
  }, [calibratedPositions])

  // 检查充电站是否被校准过
  const isStationCalibrated = useCallback((stationId: number): boolean => {
    return stationId in calibratedPositions || hardcodedStations.some(s => s.stationId === stationId)
  }, [calibratedPositions, hardcodedStations])

  const handleAddStation = useCallback((newStation: Omit<HardcodedStationLocation, 'stationId'>) => {
    const maxId = Math.max(...hardcodedStations.map(s => s.stationId), 0)
    const stationWithId: HardcodedStationLocation = {
      ...newStation,
      stationId: maxId + 1
    }
    setHardcodedStations(prev => [...prev, stationWithId])
  }, [hardcodedStations])

  // 地图点击事件处理组件
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        if (isCoordMode) {
          const { lat, lng } = e.latlng
          setSelectedCoords([lat, lng])
        }
      }
    })
    return null
  }

  const getStationMarkerColor = (station: Station) => {
    if (!station.freeNum || !station.switchType || station.switchType === 0) {
      return '#9ca3af' // gray for unknown status
    }
    
    const ratio = station.freeNum / station.switchType
    return getColorForAvailability(ratio)
  }

  // 判断充电桩是否有可用插座
  const hasAvailableOutlets = (station: Station) => {
    return station.freeNum && station.freeNum > 0
  }


  // 根据设置过滤充电桩 - 使用 useMemo 确保响应式更新
  const displayStations = useMemo(() => {
    if (showUnavailableStations) {
      return stations // 显示所有充电桩
    } else {
      return stations.filter(hasAvailableOutlets) // 只显示有可用插座的充电桩
    }
  }, [stations, showUnavailableStations])

  // 处理搜索框选择充电桩
  const handleStationSelectFromSearch = (station: Station) => {
    // 定位地图到选择的充电桩
    if (mapRef.current) {
      mapRef.current.setView([station.latitude, station.longitude], 18, {
        animate: true,
        duration: 1
      })
    }
    // 可选：同时打开该充电桩的详情面板
    setSelectedStation(station)
  }

  return (
    <div className="w-full h-full relative">
      <SearchBar onStationSelect={handleStationSelectFromSearch} />
      
      {/* Map Container */}
      <MapContainer
        center={userLocation || MAP_CENTER}
        zoom={16}
        className="w-full h-full"
        zoomControl={false}
        attributionControl={false}
        ref={mapRef}
      >
        <TileLayer
          url="https://wprd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}"
          subdomains={['1', '2', '3', '4']}
          attribution="&copy; 高德地图"
        />
        
        {/* 地图点击事件处理 */}
        <MapClickHandler />
        
        {/* Station Markers - 在开发模式下使用可拖拽标记，普通模式下使用常规标记 */}
        {isDevMode ? (
          // 开发模式：所有充电站都可拖拽
          displayStations.map((station) => (
            <DraggableStationMarkerUniversal
              key={station.stationId}
              station={station}
              position={getStationPosition(station)}
              onDragEnd={handleUpdateStation}
              isDragMode={isDragMode}
              isCalibrated={isStationCalibrated(station.stationId)}
              onClick={() => setSelectedStation(station)}
            />
          ))
        ) : (
          // 普通模式：使用常规标记
          displayStations.map((station) => (
            <Marker
              key={station.stationId}
              position={getStationPosition(station)}
              icon={createMarkerIcon(getStationMarkerColor(station))}
              eventHandlers={{
                click: () => setSelectedStation(station)
              }}
            >
              <Tooltip
                permanent={false}
                direction="top"
                offset={[0, -12]}
                className="station-tooltip"
              >
                {station.stationName}
              </Tooltip>
            </Marker>
          ))
        )}
        
        {/* 硬编码充电站标记 (开发模式且不在显示列表中) */}
        {isDevMode && hardcodedStations
          .filter(hardStation => !displayStations.some(station => station.stationId === hardStation.stationId))
          .map((station) => (
          <DraggableStationMarkerUniversal
            key={`hardcoded-${station.stationId}`}
            station={{
              stationId: station.stationId,
              stationName: station.stationName,
              latitude: station.latitude,
              longitude: station.longitude,
              address: station.address || '',
              freeNum: 0,
              switchType: 1
            }}
            position={[station.latitude, station.longitude]}
            onDragEnd={handleUpdateStation}
            isDragMode={isDragMode}
            isCalibrated={true}
          />
        ))}
        
        {/* 选中坐标标记 */}
        {selectedCoords && (
          <Marker
            position={selectedCoords}
            icon={L.divIcon({
              className: 'selected-coords-marker',
              html: `
                <div style="
                  background-color: #ef4444; 
                  width: 20px; 
                  height: 20px; 
                  border-radius: 50%; 
                  border: 3px solid white; 
                  box-shadow: 0 2px 10px rgba(0,0,0,0.4);
                  animation: pulse 2s infinite;
                "></div>
              `,
              iconSize: [26, 26],
              iconAnchor: [13, 13]
            })}
          >
            <Tooltip permanent={true} direction="top" offset={[0, -15]}>
              <div className="text-center">
                <div className="font-medium text-red-600">选中坐标</div>
                <div className="text-xs">
                  {selectedCoords[0].toFixed(6)}, {selectedCoords[1].toFixed(6)}
                </div>
              </div>
            </Tooltip>
          </Marker>
        )}
        
        {/* User Location Marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={createUserLocationIcon()}
          />
        )}
      </MapContainer>

      {/* 暗色模式覆盖层 */}
      {isDark && (
        <div 
          className="absolute inset-0 pointer-events-none z-[401] transition-opacity duration-300"
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            mixBlendMode: 'multiply'
          }}
        />
      )}

      {/* Control Buttons - 响应式布局优化 + PWA沉浸式支持 */}
      <div className="absolute left-1/2 transform -translate-x-1/2 md:bottom-6 md:right-6 md:left-auto md:transform-none z-[999] flex gap-2 md:gap-3 bg-white/10 dark:bg-gray-900/10 backdrop-blur-sm rounded-full p-2 md:p-0 md:bg-transparent md:backdrop-blur-none ios-safe-bottom" style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        {/* 开发模式按钮 (仅在开发环境显示) */}
        {versionInfo.isDevelopment && (
          <button
            onClick={handleToggleDevMode}
            className={`p-4 md:p-3 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all min-w-[60px] min-h-[60px] md:min-w-[56px] md:min-h-[56px] flex items-center justify-center ${
              isDevMode
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            aria-label={isDevMode ? "关闭开发模式" : "开启开发模式"}
            type="button"
          >
            <DeveloperModeOutlined className="h-6 w-6" />
          </button>
        )}

        <button
          onClick={handleWeChatScan}
          className="bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 p-4 md:p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105 active:scale-95 transition-all min-w-[60px] min-h-[60px] md:min-w-[56px] md:min-h-[56px] flex items-center justify-center"
          aria-label="微信扫一扫"
          type="button"
        >
          <QrCodeScannerOutlined className="h-6 w-6" />
        </button>

        {/* 查看地图按钮 */}
        <button
          onClick={handleToggleMapModal}
          className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 p-4 md:p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105 active:scale-95 transition-all min-w-[60px] min-h-[60px] md:min-w-[56px] md:min-h-[56px] flex items-center justify-center"
          aria-label="查看校园地图"
          type="button"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </button>

        <button
          onClick={handleRefresh}
          disabled={isLoading || isLocating}
          className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-4 md:p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 min-w-[60px] min-h-[60px] md:min-w-[56px] md:min-h-[56px] flex items-center justify-center"
          aria-label={isLoading || isLocating ? "刷新中..." : "刷新并定位"}
          type="button"
        >
          <RefreshOutlined className="h-6 w-6" />
        </button>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[999] bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg shadow-xl backdrop-blur-sm">
          <LoadingSpinner text="刷新状态..." />
        </div>
      )}

      {/* Station Detail Panel */}
      <StationDetailPanel
        station={selectedStation}
        onClose={() => setSelectedStation(null)}
      />

      {/* 开发者面板 */}
      {versionInfo.isDevelopment && (
        <DevPanel
          isOpen={isDevMode}
          onClose={() => setIsDevMode(false)}
          isDragMode={isDragMode}
          onToggleDragMode={handleToggleDragMode}
          isCoordMode={isCoordMode}
          onToggleCoordMode={handleToggleCoordMode}
          selectedCoords={selectedCoords}
          onClearCoords={handleClearCoords}
          stations={hardcodedStations}
          calibratedPositions={calibratedPositions}
          allStations={stations.map(s => ({
            stationId: s.stationId,
            stationName: s.stationName,
            latitude: s.latitude,
            longitude: s.longitude
          }))}
          onUpdateStation={handleUpdateStation}
          onAddStation={handleAddStation}
        />
      )}

      {/* 地图模态框 */}
      {showMapModal && (
        <div 
          className="fixed inset-0 z-[2000] bg-black bg-opacity-75 flex items-center justify-center p-4"
          onClick={() => setShowMapModal(false)}
        >
          <div 
            className="relative w-full max-w-4xl max-h-[85vh] bg-black rounded-lg shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowMapModal(false)}
              className="absolute top-4 right-4 z-[2001] bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
              aria-label="关闭地图"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <TransformWrapper
              initialScale={1}
              minScale={1}
              maxScale={5}
              centerOnInit={true}
              limitToBounds={false}
              panning={{ disabled: false }}
              pinch={{ disabled: false }}
              doubleClick={{ disabled: false, mode: "zoomIn" }}
              wheel={{ disabled: false }}
              smooth={true}
            >
              <TransformComponent
                wrapperClass="w-full flex items-center justify-center"
                contentClass="w-full flex items-center justify-center"
              >
                <img 
                  src="/map.jpg" 
                  alt="校园地图" 
                  className="max-w-full max-h-[85vh] object-contain select-none"
                  draggable={false}
                />
              </TransformComponent>
            </TransformWrapper>
          </div>
        </div>
      )}

    </div>
  )
}

export default MapView