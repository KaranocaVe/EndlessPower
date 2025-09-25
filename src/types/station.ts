export interface Station {
  stationId: number
  stationName: string
  address: string
  latitude: number
  longitude: number
  freeNum?: number
  switchType?: number
}

export interface Outlet {
  outletId: number
  outletNo: string
  outletSerialNo: number
  vOutletName: string
  iCurrentChargingRecordId: number
}

export interface OutletStatus {
  outlet: Outlet
  usedmin?: number
  usedfee?: number
  powerFee?: {
    billingPower: string
  }
  chargingBeginTime?: string
}

export interface ApiResponse<T> {
  code: string
  msg?: string
  data: T
}

export interface NearStationsRequest {
  page: number
  pageSize: number
  scale: number
  latitude: number
  longitude: number
  userLatitude: number
  userLongitude: number
}

export interface NearStationsResponse {
  elecStationData: Station[]
}
