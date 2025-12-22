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
    "stationId": 40167,
    "stationName": "电子科大清水河校区学子餐厅辅道2号电站",
    "latitude": 30.752716133588663,
    "longitude": 103.93466591835023,
    "note": "校准自API位置 (原位置: 30.752764, 103.934365)"
  },
  {
    "stationId": 51641,
    "stationName": "电子科大清水河校区商业街5号电站",
    "latitude": 30.756754483557398,
    "longitude": 103.92989695072175,
    "note": "校准自API位置 (原位置: 30.756806, 103.929779)"
  },
  {
    "stationId": 54456,
    "stationName": "电子科大清水河紫荆餐厅充电桩",
    "latitude": 30.754458730034106,
    "longitude": 103.92991304397584,
    "note": "校准自API位置 (原位置: 30.754681, 103.930202)"
  },
  {
    "stationId": 54457,
    "stationName": "电子科大清水河校区朝阳餐厅3号充电桩",
    "latitude": 30.7559154795806,
    "longitude": 103.93383443355562,
    "note": "校准自API位置 (原位置: 30.756138, 103.933523)"
  },
  {
    "stationId": 54468,
    "stationName": "电子科大清水河校区学子餐厅辅道4号电站",
    "latitude": 30.752540950190927,
    "longitude": 103.93450498580934,
    "note": "校准自API位置 (原位置: 30.752989, 103.934698)"
  },
  {
    "stationId": 56922,
    "stationName": "电子科大清水河校区商业街4号电站",
    "latitude": 30.756662285675745,
    "longitude": 103.93028855323793,
    "note": "校准自API位置 (原位置: 30.756434, 103.929673)"
  },
  {
    "stationId": 56924,
    "stationName": "电子科大清水河校区商业街2号电站",
    "latitude": 30.756934269172643,
    "longitude": 103.92991304397584,
    "note": "校准自API位置 (原位置: 30.757162, 103.929862)"
  },
  {
    "stationId": 56929,
    "stationName": "电子科大清水河校区商业街3号电站",
    "latitude": 30.757086395200254,
    "longitude": 103.93029928207399,
    "note": "校准自API位置 (原位置: 30.757195, 103.929425)"
  },
  {
    "stationId": 56934,
    "stationName": "电子科大清水河校区商业街1号电站",
    "latitude": 30.7564225707703,
    "longitude": 103.93023490905762,
    "note": "校准自API位置 (原位置: 30.756594, 103.930017)"
  },
  {
    "stationId": 56937,
    "stationName": "电子科大清水河校区学子餐厅辅路1号电站",
    "latitude": 30.75264237219689,
    "longitude": 103.93494486808778,
    "note": "校准自API位置 (原位置: 30.753171, 103.934234)"
  },
  {
    "stationId": 58931,
    "stationName": "电子科大清水河校区朝阳餐厅1号充电桩",
    "latitude": 30.755814061022182,
    "longitude": 103.93392026424408,
    "note": "校准自API位置 (原位置: 30.755892, 103.934455)"
  },
  {
    "stationId": 67922,
    "stationName": "电子科大清水河校区学子餐厅9号充电桩",
    "latitude": 30.752568610748604,
    "longitude": 103.9346766471863,
    "note": "校准自API位置 (原位置: 30.752707, 103.934882)"
  },
  {
    "stationId": 67924,
    "stationName": "电子科大清水河校区学子餐厅5号充电桩",
    "latitude": 30.752245903748065,
    "longitude": 103.93461227416994,
    "note": "校准自API位置 (原位置: 30.752345, 103.934965)"
  },
  {
    "stationId": 67929,
    "stationName": "电子科大清水河校区光电学院2号充电桩",
    "latitude": 30.75360126588288,
    "longitude": 103.9269518852234,
    "note": "校准自API位置 (原位置: 30.753133, 103.921445)"
  },
  {
    "stationId": 67938,
    "stationName": "电子科大清水河校区光电学院1号充电桩",
    "latitude": 30.753804107554398,
    "longitude": 103.92676949501039,
    "note": "校准自API位置 (原位置: 30.753908, 103.920659)"
  },
  {
    "stationId": 67951,
    "stationName": "电子科大清水河校区商业街6号电站",
    "latitude": 30.7568236319107,
    "longitude": 103.93040120601654,
    "note": "校准自API位置 (原位置: 30.756867, 103.930202)"
  },
  {
    "stationId": 67985,
    "stationName": "电子科大清水河校区光电学院3号电站",
    "latitude": 30.75341686399253,
    "longitude": 103.92718791961671,
    "note": "校准自API位置 (原位置: 30.752750, 103.921674)"
  },
  {
    "stationId": 73096,
    "stationName": "电子科大清水河校区学子餐厅6号充电桩",
    "latitude": 30.75282677557037,
    "longitude": 103.93505215644838,
    "note": "校准自API位置 (原位置: 30.752722, 103.933984)"
  },
  {
    "stationId": 73262,
    "stationName": "电子科大清水河校区学子餐厅7号充电桩",
    "latitude": 30.752384206880713,
    "longitude": 103.93492341041566,
    "note": "校准自API位置 (原位置: 30.753027, 103.935026)"
  },
  {
    "stationId": 73264,
    "stationName": "电子科大清水河校区学子餐厅8号充电桩",
    "latitude": 30.752734573927775,
    "longitude": 103.93489122390748,
    "note": "校准自API位置 (原位置: 30.752491, 103.934523)"
  },
  {
    "stationId": 73266,
    "stationName": "电子科大清水河校区硕丰十组团充电桩",
    "latitude": 30.75441263000515,
    "longitude": 103.93727302551271,
    "note": "校准自API位置 (原位置: 30.751707, 103.935771)"
  },
  {
    "stationId": 73844,
    "stationName": "硕丰四组团3号充电桩",
    "latitude": 30.755187107562335,
    "longitude": 103.93483757972719,
    "note": "校准自API位置 (原位置: 30.755145, 103.935013)"
  },
  {
    "stationId": 74631,
    "stationName": "清水河校区众创空间2号充电桩",
    "latitude": 30.744011899356774,
    "longitude": 103.9323377609253,
    "note": "校准自API位置 (原位置: 30.744556, 103.924938)"
  },
  {
    "stationId": 74677,
    "stationName": "电子科大清水河校区主楼C 区停车场1号充电桩",
    "latitude": 30.746722836312998,
    "longitude": 103.92879724502563,
    "note": "校准自API位置 (原位置: 30.745911, 103.928712)"
  },
  {
    "stationId": 74685,
    "stationName": "电子科大清水河校区紫荆餐厅2号充电桩",
    "latitude": 30.754569370013566,
    "longitude": 103.92967700958253,
    "note": "校准自API位置 (原位置: 30.754984, 103.930030)"
  },
  {
    "stationId": 74704,
    "stationName": "电子科大清水河校区众创空间1号充电桩",
    "latitude": 30.744546716089985,
    "longitude": 103.93276691436769,
    "note": "校准自API位置 (原位置: 30.744033, 103.932388)"
  },
  {
    "stationId": 74709,
    "stationName": "电子科大清水河校区朝阳餐厅2号充电桩",
    "latitude": 30.755814061022182,
    "longitude": 103.93366277217866,
    "note": "校准自API位置 (原位置: 30.755930, 103.933860)"
  },
  {
    "stationId": 74719,
    "stationName": "电子科大清水河校区主楼C 区停车场3号充电桩",
    "latitude": 30.746317122711844,
    "longitude": 103.92905473709108,
    "note": "校准自API位置 (原位置: 30.745915, 103.929068)"
  },
  {
    "stationId": 74746,
    "stationName": "电子科大清水河校区主楼C 区停车场2号充电桩",
    "latitude": 30.746298681143916,
    "longitude": 103.92849683761597,
    "note": "校准自API位置 (原位置: 30.745579, 103.928665)"
  },
  {
    "stationId": 88939,
    "stationName": "电子科大清水河校区商业街9号电站",
    "latitude": 30.75685129123811,
    "longitude": 103.92995595932008,
    "note": "校准自API位置 (原位置: 30.757284, 103.930281)"
  },
  {
    "stationId": 117895,
    "stationName": "数学科学学院6号充电桩",
    "latitude": 30.748474761785815,
    "longitude": 103.92218828201294,
    "note": "校准自API位置 (原位置: 30.754737, 103.929463)"
  },
  {
    "stationId": 117910,
    "stationName": "数学科学学院7号充电桩",
    "latitude": 30.748244247096885,
    "longitude": 103.9226281642914,
    "note": "校准自API位置 (原位置: 30.754367, 103.929478)"
  },
  {
    "stationId": 120161,
    "stationName": "电子科大清水河校区商业街7号电站",
    "latitude": 30.756795972575322,
    "longitude": 103.93022418022156,
    "note": "校准自API位置 (原位置: 30.756198, 103.929449)"
  },
  {
    "stationId": 120170,
    "stationName": "电子科大清水河校区商业街8号电站",
    "latitude": 30.756703774733413,
    "longitude": 103.93004715442657,
    "note": "校准自API位置 (原位置: 30.757584, 103.930218)"
  },
  {
    "stationId": 135601,
    "stationName": "硕丰十组团7号充电桩",
    "latitude": 30.754984268804233,
    "longitude": 103.93725156784059,
    "note": "校准自API位置 (原位置: 30.755083, 103.934682)"
  },
  {
    "stationId": 135638,
    "stationName": "硕丰四组团1号充电桩",
    "latitude": 30.75496121891831,
    "longitude": 103.93497169017793,
    "note": "校准自API位置 (原位置: 30.755014, 103.935341)"
  },
  {
    "stationId": 135646,
    "stationName": "硕丰十组团6号充电桩",
    "latitude": 30.754781429618813,
    "longitude": 103.93727302551271,
    "note": "校准自API位置 (原位置: 30.755060, 103.935819)"
  },
  {
    "stationId": 137020,
    "stationName": "清水河朝阳餐厅3－1充电桩",
    "latitude": 30.755615833531333,
    "longitude": 103.93373787403108,
    "note": "校准自API位置 (原位置: 30.755829, 103.934157)"
  },
  {
    "stationId": 137026,
    "stationName": "清水河朝阳餐厅1－1充电桩",
    "latitude": 30.75565732303993,
    "longitude": 103.9341723918915,
    "note": "校准自API位置 (原位置: 30.755652, 103.933533)"
  },
  {
    "stationId": 137034,
    "stationName": "清水河朝阳餐厅6－1充电桩",
    "latitude": 30.755717252298574,
    "longitude": 103.93386662006378,
    "note": "校准自API位置 (原位置: 30.756331, 103.933964)"
  },
  {
    "stationId": 137062,
    "stationName": "清水河朝阳餐厅5－1充电桩",
    "latitude": 30.7559154795806,
    "longitude": 103.93410801887514,
    "note": "校准自API位置 (原位置: 30.755868, 103.933228)"
  },
  {
    "stationId": 137075,
    "stationName": "硕丰四组团2号充电桩",
    "latitude": 30.7550764682927,
    "longitude": 103.93490731716156,
    "note": "校准自API位置 (原位置: 30.755369, 103.935509)"
  },
  {
    "stationId": 137084,
    "stationName": "清水河朝阳餐厅2－1号充电桩",
    "latitude": 30.755592783796605,
    "longitude": 103.93393099308015,
    "note": "校准自API位置 (原位置: 30.755524, 103.933968)"
  },
  {
    "stationId": 137119,
    "stationName": "清水河朝阳餐厅4－1充电桩",
    "latitude": 30.755758741763458,
    "longitude": 103.93403828144075,
    "note": "校准自API位置 (原位置: 30.755279, 103.933649)"
  },
  {
    "stationId": 164685,
    "stationName": "数学科学学院5号充电桩",
    "latitude": 30.748769819782563,
    "longitude": 103.92248868942262,
    "note": "校准自API位置 (原位置: 30.755157, 103.929316)"
  },
  {
    "stationId": 164698,
    "stationName": "数学科学学院4号充电桩",
    "latitude": 30.748474761785815,
    "longitude": 103.92257452011108,
    "note": "校准自API位置 (原位置: 30.754216, 103.929207)"
  },
  {
    "stationId": 164702,
    "stationName": "数学科学学院1号充电桩",
    "latitude": 30.74817048227991,
    "longitude": 103.92315387725831,
    "note": "校准自API位置 (原位置: 30.748739, 103.922976)"
  },
  {
    "stationId": 164722,
    "stationName": "经管3-1",
    "latitude": 30.750872081844282,
    "longitude": 103.92489194869997,
    "note": "校准自API位置 (原位置: 30.757008, 103.930972)"
  },
  {
    "stationId": 164998,
    "stationName": "清水河商业街9-1充电桩",
    "latitude": 30.756943488938752,
    "longitude": 103.93014371395113,
    "note": "校准自API位置 (原位置: 30.763105, 103.936217)"
  },
  {
    "stationId": 165000,
    "stationName": "清水河商业街商业街10-1充电桩",
    "latitude": 30.756892780214308,
    "longitude": 103.93029391765596,
    "note": "校准自API位置 (原位置: 30.762858, 103.935984)"
  },
  {
    "stationId": 165008,
    "stationName": "清水河商业街8-1充电桩",
    "latitude": 30.757058735940397,
    "longitude": 103.9301759004593,
    "note": "校准自API位置 (原位置: 30.762490, 103.936015)"
  },
  {
    "stationId": 172650,
    "stationName": "清水河商业街7-1充电桩",
    "latitude": 30.756865120898826,
    "longitude": 103.92980575561525,
    "note": "校准自API位置 (原位置: 30.763440, 103.936270)"
  },
  {
    "stationId": 172654,
    "stationName": "经管2-1",
    "latitude": 30.750733776539924,
    "longitude": 103.92507433891298,
    "note": "校准自API位置 (原位置: 30.756923, 103.931325)"
  },
  {
    "stationId": 172658,
    "stationName": "经管1-1",
    "latitude": 30.750577030288206,
    "longitude": 103.92535328865051,
    "note": "校准自API位置 (原位置: 30.756712, 103.930776)"
  },
  {
    "stationId": 172669,
    "stationName": "数学科学学院3号充电桩",
    "latitude": 30.74868683481234,
    "longitude": 103.9219629764557,
    "note": "校准自API位置 (原位置: 30.754646, 103.929167)"
  },
  {
    "stationId": 172927,
    "stationName": "硕丰十组团1号充电桩",
    "latitude": 30.753767227282264,
    "longitude": 103.93740177154542,
    "note": "校准自API位置 (原位置: 30.754666, 103.935591)"
  },
  {
    "stationId": 172931,
    "stationName": "硕丰十组团5号充电桩",
    "latitude": 30.754597029988563,
    "longitude": 103.93730521202089,
    "note": "校准自API位置 (原位置: 30.755423, 103.934810)"
  },
  {
    "stationId": 172973,
    "stationName": "硕丰十组团3号充电桩",
    "latitude": 30.7542558897416,
    "longitude": 103.93734812736513,
    "note": "校准自API位置 (原位置: 30.753744, 103.937889)"
  },
  {
    "stationId": 172979,
    "stationName": "硕丰十组团2号充电桩",
    "latitude": 30.753997728751333,
    "longitude": 103.93740177154542,
    "note": "校准自API位置 (原位置: 30.753495, 103.938095)"
  },
  {
    "stationId": 177972,
    "stationName": "成电国际创新中心D区1号充电桩",
    "latitude": 30.747110106792636,
    "longitude": 103.92424821853639,
    "note": "校准自API位置 (原位置: 30.746686, 103.923952)"
  },
  {
    "stationId": 177975,
    "stationName": "成电国际创新中心D区5号充电桩",
    "latitude": 30.746815043711276,
    "longitude": 103.92391562461853,
    "note": "校准自API位置 (原位置: 30.746362, 103.924546)"
  },
  {
    "stationId": 177977,
    "stationName": "成电国际创新中心D区6号充电桩",
    "latitude": 30.746519979726028,
    "longitude": 103.92438769340517,
    "note": "校准自API位置 (原位置: 30.746804, 103.924643)"
  },
  {
    "stationId": 231328,
    "stationName": "电子科大清水河校区学子餐厅辅路3号电站",
    "latitude": 30.7523657664745,
    "longitude": 103.93444061279297,
    "note": "校准自API位置 (原位置: 30.758929, 103.940901)"
  },
  {
    "stationId": 252117,
    "stationName": "集成电路与系统工程系5号充电桩",
    "latitude": 30.746197252457186,
    "longitude": 103.92267107963563,
    "note": "校准自API位置 (原位置: 30.758301, 103.936982)"
  },
  {
    "stationId": 252339,
    "stationName": "清水河商业街新增5-1充电桩",
    "latitude": 30.756542428297628,
    "longitude": 103.92982721328737,
    "note": "校准自API位置 (原位置: 30.762731, 103.936281)"
  },
  {
    "stationId": 252348,
    "stationName": "清水河商业街3-1充电桩",
    "latitude": 30.756837461575383,
    "longitude": 103.93009543418886,
    "note": "校准自API位置 (原位置: 30.762154, 103.936235)"
  },
  {
    "stationId": 252403,
    "stationName": "清水河商业街2-1充电桩",
    "latitude": 30.756722214308862,
    "longitude": 103.93034756183626,
    "note": "校准自API位置 (原位置: 30.762334, 103.936618)"
  },
  {
    "stationId": 252411,
    "stationName": "硕丰七组团2号充电桩",
    "latitude": 30.75717859267579,
    "longitude": 103.93169403076173,
    "note": "校准自API位置 (原位置: 30.763824, 103.938168)"
  },
  {
    "stationId": 252437,
    "stationName": "清水河商业街1-1号充电桩",
    "latitude": 30.756957318586238,
    "longitude": 103.93050849437715,
    "note": "校准自API位置 (原位置: 30.763197, 103.935918)"
  },
  {
    "stationId": 252463,
    "stationName": "清水河商业街6-1充电桩",
    "latitude": 30.75694809882145,
    "longitude": 103.93035829067232,
    "note": "校准自API位置 (原位置: 30.761869, 103.936522)"
  },
  {
    "stationId": 252470,
    "stationName": "硕丰七组团1号充电桩",
    "latitude": 30.7570633458176,
    "longitude": 103.93152773380281,
    "note": "校准自API位置 (原位置: 30.763852, 103.937831)"
  },
  {
    "stationId": 252479,
    "stationName": "集成电路与系统系1号充电桩",
    "latitude": 30.746335564276233,
    "longitude": 103.92182350158691,
    "note": "校准自API位置 (原位置: 30.758603, 103.937064)"
  },
  {
    "stationId": 252484,
    "stationName": "集成电路与系统工程系4换充电桩",
    "latitude": 30.746178810866308,
    "longitude": 103.92208099365236,
    "note": "校准自API位置 (原位置: 30.758708, 103.936702)"
  },
  {
    "stationId": 252486,
    "stationName": "集成电路与系统系3号充电桩",
    "latitude": 30.746022057201248,
    "longitude": 103.92225265502931,
    "note": "校准自API位置 (原位置: 30.758043, 103.937337)"
  },
  {
    "stationId": 252490,
    "stationName": "集成电路与系统工程系6号充电桩",
    "latitude": 30.746372447394457,
    "longitude": 103.92227411270143,
    "note": "校准自API位置 (原位置: 30.753113, 103.930587)"
  },
  {
    "stationId": 252755,
    "stationName": "清水河商业街4-1充电桩",
    "latitude": 30.757031076672575,
    "longitude": 103.93002033233644,
    "note": "校准自API位置 (原位置: 30.763251, 103.936555)"
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
