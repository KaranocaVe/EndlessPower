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
  },
  {
    stationId: 1003,
    stationName: "春熙路充电站",
    latitude: 30.661825,
    longitude: 104.081502,
    address: "四川省成都市锦江区春熙路",
    note: "商场东侧停车场"
  },
  {
    stationId: 1004,
    stationName: "双流机场T1充电站",
    latitude: 30.578469,
    longitude: 103.947125,
    address: "四川省成都市双流区双流国际机场T1航站楼",
    note: "T1航站楼停车场3层"
  },
  {
    stationId: 1005,
    stationName: "双流机场T2充电站",
    latitude: 30.572838,
    longitude: 103.948563,
    address: "四川省成都市双流区双流国际机场T2航站楼",
    note: "T2航站楼停车场4层"
  },
  {
    stationId: 1006,
    stationName: "成都东站充电站",
    latitude: 30.613994,
    longitude: 104.176422,
    address: "四川省成都市成华区成都东客站",
    note: "东广场地下停车场"
  },
  {
    stationId: 1007,
    stationName: "IFS国际金融中心充电站",
    latitude: 30.66188,
    longitude: 104.081886,
    address: "四川省成都市锦江区红星路三段IFS",
    note: "地下停车场B3层"
  },
  {
    stationId: 1008,
    stationName: "宽窄巷子充电站",
    latitude: 30.668947,
    longitude: 104.061123,
    address: "四川省成都市青羊区宽窄巷子",
    note: "景区专用停车场"
  },
  {
    stationId: 1009,
    stationName: "锦里古街充电站",
    latitude: 30.642699,
    longitude: 104.044713,
    address: "四川省成都市武侯区锦里古街",
    note: "武侯祠停车场内"
  },
  {
    stationId: 1010,
    stationName: "环球中心充电站",
    latitude: 30.573611,
    longitude: 104.061111,
    address: "四川省成都市武侯区环球中心",
    note: "购物中心地下停车场"
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
