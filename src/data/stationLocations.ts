/**
 * 硬编码的充电桩位置数据
 * 用于覆盖API返回的不准确位置信息
 */

export interface HardcodedStationLocation {
  stationId: number
  stationName: string
  latitude: number
  longitude: number
  address?: string
  note?: string // 添加位置的原因备注
}

// 硬编码的充电桩位置数据
// 这些位置会优先于API返回的位置使用
export const HARDCODED_STATION_LOCATIONS: HardcodedStationLocation[] = [
  // 示例数据 - 请根据实际情况替换
  {
    stationId: 1001,
    stationName: "清水河校区充电站",
    latitude: 30.754365,
    longitude: 103.936107,
    address: "四川省成都市高新区清水河校区",
    note: "精确定位到停车场入口"
  },
  {
    stationId: 1002,
    stationName: "天府广场充电站",
    latitude: 30.656956,
    longitude: 104.065752,
    address: "四川省成都市锦江区天府广场",
    note: "位于地下停车场B2层"
  }
  // 添加更多精确位置...
  // 可以根据实际使用情况不断补充
]

/**
 * 根据充电桩ID查找硬编码位置
 */
export function getHardcodedLocationById(stationId: number): HardcodedStationLocation | null {
  return HARDCODED_STATION_LOCATIONS.find(location => location.stationId === stationId) || null
}

/**
 * 根据充电桩名称模糊匹配硬编码位置
 * 用于当ID不匹配时的备用匹配方案
 */
export function getHardcodedLocationByName(stationName: string): HardcodedStationLocation | null {
  const normalizedName = stationName.toLowerCase().replace(/\s+/g, '')
  
  return HARDCODED_STATION_LOCATIONS.find(location => {
    const normalizedLocationName = location.stationName.toLowerCase().replace(/\s+/g, '')
    return normalizedLocationName.includes(normalizedName) || normalizedName.includes(normalizedLocationName)
  }) || null
}

/**
 * 获取所有硬编码位置的统计信息
 */
export function getHardcodedLocationsStats() {
  return {
    total: HARDCODED_STATION_LOCATIONS.length,
    locations: HARDCODED_STATION_LOCATIONS.map(loc => ({
      id: loc.stationId,
      name: loc.stationName,
      coordinates: [loc.latitude, loc.longitude],
      hasNote: !!loc.note
    }))
  }
}
