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
    {
      "stationId": 1001,
      "stationName": "清水河校区充电站",
      "latitude": 30.754365,
      "longitude": 103.936107,
      "address": "四川省成都市高新区清水河校区",
      "note": "精确定位到停车场入口"
    },
    {
      "stationId": 1002,
      "stationName": "天府广场充电站",
      "latitude": 30.656956,
      "longitude": 104.065752,
      "address": "四川省成都市锦江区天府广场",
      "note": "位于地下停车场B2层"
    },
    {
      "stationId": 67929,
      "stationName": "电子科大清水河校区光电学院2号充电桩",
      "latitude": 30.753785667420086,
      "longitude": 103.92686605453493,
      "note": "校准自API位置 (原位置: 30.753133, 103.921445)"
    },
    {
      "stationId": 67938,
      "stationName": "电子科大清水河校区光电学院1号充电桩",
      "latitude": 30.754265109764162,
      "longitude": 103.92645835876466,
      "note": "校准自API位置 (原位置: 30.753908, 103.920659)"
    },
    {
      "stationId": 67985,
      "stationName": "电子科大清水河校区光电学院3号电站",
      "latitude": 30.753361543356576,
      "longitude": 103.92718791961671,
      "note": "校准自API位置 (原位置: 30.752750, 103.921674)"
    },
    {
      "stationId": 74631,
      "stationName": "清水河校区众创空间2号充电桩",
      "latitude": 30.743366426931274,
      "longitude": 103.9324450492859,
      "note": "校准自API位置 (原位置: 30.744556, 103.924938)"
    },
    {
      "stationId": 164998,
      "stationName": "清水河商业街9-1充电桩",
      "latitude": 30.757473624004096,
      "longitude": 103.93014907836915,
      "note": "校准自API位置 (原位置: 30.763105, 103.936217)"
    },
    {
      "stationId": 165000,
      "stationName": "清水河商业街商业街10-1充电桩",
      "latitude": 30.75743674513751,
      "longitude": 103.93010616302492,
      "note": "校准自API位置 (原位置: 30.762774, 103.936338)"
    },
    {
      "stationId": 165008,
      "stationName": "清水河商业街8-1充电桩",
      "latitude": 30.756662285675745,
      "longitude": 103.92980575561525,
      "note": "校准自API位置 (原位置: 30.762976, 103.936641)"
    },
    {
      "stationId": 172650,
      "stationName": "清水河商业街7-1充电桩",
      "latitude": 30.756514768881487,
      "longitude": 103.92971992492677,
      "note": "校准自API位置 (原位置: 30.763443, 103.936244)"
    },
    {
      "stationId": 231328,
      "stationName": "电子科大清水河校区学子餐厅辅路3号电站",
      "latitude": 30.752384206880713,
      "longitude": 103.93525600433351,
      "note": "校准自API位置 (原位置: 30.758929, 103.940901)"
    },
    {
      "stationId": 252117,
      "stationName": "集成电路与系统工程系5号充电桩",
      "latitude": 30.746261797997448,
      "longitude": 103.92306804656984,
      "note": "校准自API位置 (原位置: 30.758301, 103.936982)"
    },
    {
      "stationId": 252339,
      "stationName": "清水河商业街新增5-1充电桩",
      "latitude": 30.756182855268012,
      "longitude": 103.9296340942383,
      "note": "校准自API位置 (原位置: 30.763105, 103.935787)"
    },
    {
      "stationId": 252348,
      "stationName": "清水河商业街3-1充电桩",
      "latitude": 30.75732610845295,
      "longitude": 103.93057823181152,
      "note": "校准自API位置 (原位置: 30.762460, 103.936696)"
    },
    {
      "stationId": 252403,
      "stationName": "清水河商业街2-1充电桩",
      "latitude": 30.757104834702425,
      "longitude": 103.9294195175171,
      "note": "校准自API位置 (原位置: 30.763314, 103.936627)"
    },
    {
      "stationId": 252411,
      "stationName": "硕丰七组团2号充电桩",
      "latitude": 30.75717859267579,
      "longitude": 103.93216609954835,
      "note": "校准自API位置 (原位置: 30.763824, 103.938168)"
    },
    {
      "stationId": 252437,
      "stationName": "清水河商业街1-1号充电桩",
      "latitude": 30.757547381694923,
      "longitude": 103.93040657043458,
      "note": "校准自API位置 (原位置: 30.763750, 103.935957)"
    },
    {
      "stationId": 252463,
      "stationName": "清水河商业街6-1充电桩",
      "latitude": 30.757067955694573,
      "longitude": 103.92989158630371,
      "note": "校准自API位置 (原位置: 30.762661, 103.935547)"
    },
    {
      "stationId": 252470,
      "stationName": "硕丰七组团1号充电桩",
      "latitude": 30.75732610845295,
      "longitude": 103.93147945404054,
      "note": "校准自API位置 (原位置: 30.763623, 103.937846)"
    },
    {
      "stationId": 252479,
      "stationName": "集成电路与系统系1号充电桩",
      "latitude": 30.746335564276233,
      "longitude": 103.9224672317505,
      "note": "校准自API位置 (原位置: 30.758100, 103.936716)"
    },
    {
      "stationId": 252484,
      "stationName": "集成电路与系统工程系4换充电桩",
      "latitude": 30.745856082454324,
      "longitude": 103.92311096191408,
      "note": "校准自API位置 (原位置: 30.758087, 103.937273)"
    },
    {
      "stationId": 252486,
      "stationName": "集成电路与系统系3号充电桩",
      "latitude": 30.746446213588484,
      "longitude": 103.9224672317505,
      "note": "校准自API位置 (原位置: 30.758657, 103.936907)"
    },
    {
      "stationId": 252755,
      "stationName": "清水河商业街4-1充电桩",
      "latitude": 30.756809802244003,
      "longitude": 103.92937660217287,
      "note": "校准自API位置 (原位置: 30.762491, 103.936199)"
    }

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
