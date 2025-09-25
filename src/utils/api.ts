import { 
  Station, 
  Outlet, 
  OutletStatus, 
  ApiResponse, 
  NearStationsRequest,
  NearStationsResponse 
} from '../types/station'

const JITTER_AMOUNT = 0.0004

// CORS代理和基础API函数
async function fetchAPI<T>(url: string, options: RequestInit = {}): Promise<T | null> {
  try {
    const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url)
    const response = await fetch(proxyUrl, options)
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }
    
    const data: ApiResponse<T> = await response.json()
    
    if (data.code !== "1") {
      throw new Error(data.msg || 'API error')
    }
    
    return data.data
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error)
    throw error
  }
}

// 获取附近充电站
export async function fetchNearStations(
  lat = 30.754736739439924, 
  lng = 103.92946279311207
): Promise<Station[]> {
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
  
  return data?.elecStationData || []
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
