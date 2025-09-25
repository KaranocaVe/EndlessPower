import { 
  Station, 
  Outlet, 
  OutletStatus, 
  ApiResponse, 
  NearStationsRequest,
  NearStationsResponse 
} from '../types/station'
import { 
  mergeStationsLocations, 
  extractMergedStations, 
  debugLocationMerge 
} from './locationMerger'

const JITTER_AMOUNT = 0.0004

// CORS代理列表（按优先级排序）
const CORS_PROXIES = [
  'https://api.allorigins.win/get?url=',
  'https://proxy.cors.sh/',
  'https://corsproxy.io/?'
]

// CORS代理和基础API函数
async function fetchAPI<T>(url: string, options: RequestInit = {}): Promise<T | null> {
  let lastError: Error | null = null
  
  // 尝试每个代理服务
  for (const proxy of CORS_PROXIES) {
    try {
      console.log(`🔄 尝试代理: ${proxy}`)
      let response: Response
      
      if (proxy.includes('allorigins.win')) {
        // AllOrigins 需要特殊处理
        const proxyUrl = `${proxy}${encodeURIComponent(url)}`
        response = await fetch(proxyUrl, { ...options })
        
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`)
        }
        
        const result = await response.json()
        if (result.status?.http_code !== 200) {
          throw new Error(`Proxy error: ${result.status?.http_code}`)
        }
        
        const data: ApiResponse<T> = JSON.parse(result.contents)
        if (data.code !== "1") {
          throw new Error(data.msg || 'API error')
        }
        
        console.log(`✅ 代理成功: ${proxy}`)
        return data.data
      } else {
        // 其他代理服务的标准处理
        const proxyUrl = `${proxy}${encodeURIComponent(url)}`
        response = await fetch(proxyUrl, { ...options })
        
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`)
        }
        
        const data: ApiResponse<T> = await response.json()
        if (data.code !== "1") {
          throw new Error(data.msg || 'API error')
        }
        
        console.log(`✅ 代理成功: ${proxy}`)
        return data.data
      }
    } catch (error) {
      console.warn(`❌ 代理失败: ${proxy}`, error)
      lastError = error as Error
      continue
    }
  }
  
  // 所有代理都失败了
  console.error(`💥 所有CORS代理都失败了，最后错误:`, lastError)
  throw lastError || new Error('所有CORS代理服务都不可用')
}

// 获取附近充电站
export async function fetchNearStations(
  lat = 30.754736739439924, 
  lng = 103.92946279311207
): Promise<Station[]> {
  console.log('🔍 开始获取附近充电站...', { lat, lng })
  
  const url = 'https://wemp.issks.com/device/v1/near/station'
  
  const body: NearStationsRequest = {
    page: 1,
    pageSize: 200,
    scale: 3,
    latitude: lat,
    longitude: lng,
    userLatitude: lat,
    userLongitude: lng
  }
  
  const data = await fetchAPI<NearStationsResponse>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    body: JSON.stringify(body)
  })
  
  const apiStations = data?.elecStationData || []
  console.log(`📡 API返回 ${apiStations.length} 个充电站`)
  
  // 合并硬编码位置信息
  const mergeResults = mergeStationsLocations(apiStations)
  const mergedStations = extractMergedStations(mergeResults)
  
  // 打印位置合并统计信息
  const stats = debugLocationMerge(mergeResults, false)
  console.log(`🗺️ 位置合并完成: ${stats.hardcoded}/${stats.total} 使用硬编码位置`)
  
  return mergedStations
}

// 获取充电站插座信息
export async function fetchStationOutlets(stationId: number): Promise<Outlet[]> {
  const url = `https://wemp.issks.com/charge/v1/outlet/station/outlets/${stationId}`
  const data = await fetchAPI<Outlet[]>(url)
  return data || []
}

// 获取插座状态
export async function fetchOutletStatus(outletNo: string): Promise<OutletStatus | null> {
  const url = `https://wemp.issks.com/charge/v1/charging/outlet/${outletNo}`
  return await fetchAPI<OutletStatus>(url)
}

// 应用坐标抖动以避免重叠
export function applyJitter(stations: Station[]): Station[] {
  const newStations: Station[] = []
  const occupiedCoords = new Set<string>()
  
  const distanceSq = (p1: { lat: number; lng: number }, p2: { lat: number; lng: number }) => 
    (p1.lat - p2.lat) ** 2 + (p1.lng - p2.lng) ** 2
  
  const minDistanceSq = (0.0003) ** 2
  
  stations.forEach(station => {
    let newLat = station.latitude
    let newLng = station.longitude
    let attempts = 0
    
    while (attempts < 100) {
      let collision = false
      
      for (const coord of occupiedCoords) {
        const existing = JSON.parse(coord)
        if (distanceSq({ lat: newLat, lng: newLng }, existing) < minDistanceSq) {
          collision = true
          newLat += (Math.random() - 0.5) * JITTER_AMOUNT
          newLng += (Math.random() - 0.5) * JITTER_AMOUNT
          break
        }
      }
      
      if (!collision) break
      attempts++
    }
    
    occupiedCoords.add(JSON.stringify({ lat: newLat, lng: newLng }))
    
    newStations.push({
      ...station,
      latitude: newLat,
      longitude: newLng
    })
  })
  
  return newStations
}

// 根据可用性获取颜色
export function getColorForAvailability(ratio: number): string {
  if (ratio < 0 || isNaN(ratio)) return '#9ca3af' // gray
  if (ratio === 0) return '#b91c1c' // red
  
  const hue = ratio * 120
  const lightness = 45 + (ratio * 15)
  const saturation = 75 + (ratio * 20)
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}
