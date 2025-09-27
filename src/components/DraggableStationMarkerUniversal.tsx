import React, { useMemo, useRef } from 'react'
import { Marker, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import { Station } from '../types/station'
import { getColorForAvailability } from '../utils/api'

interface DraggableStationMarkerUniversalProps {
  station: Station
  onDragEnd: (stationId: number, lat: number, lng: number) => void
  isDragMode: boolean
  position: [number, number]
  isCalibrated: boolean
  onClick?: () => void
}

const DraggableStationMarkerUniversal: React.FC<DraggableStationMarkerUniversalProps> = ({
  station,
  onDragEnd,
  isDragMode,
  position,
  isCalibrated,
  onClick
}) => {
  const markerRef = useRef<L.Marker>(null)

  // 获取充电站标记颜色
  const getStationMarkerColor = (station: Station) => {
    if (!station.freeNum || !station.switchType || station.switchType === 0) {
      return '#9ca3af' // gray for unknown status
    }
    
    const ratio = station.freeNum / station.switchType
    return getColorForAvailability(ratio)
  }

  // 创建可拖拽标记图标
  const createDraggableIcon = useMemo(() => {
    const baseColor = getStationMarkerColor(station)
    const isDraggable = isDragMode
    const size = isDraggable ? 28 : 20
    const borderWidth = isDraggable ? 4 : 3
    
    return L.divIcon({
      className: 'draggable-station-marker-universal',
      html: `
        <div style="
          background-color: ${baseColor}; 
          width: ${size}px; 
          height: ${size}px; 
          border-radius: 50%; 
          border: ${borderWidth}px solid ${isDraggable ? '#f59e0b' : 'white'}; 
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          cursor: ${isDraggable ? 'move' : 'pointer'};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${isDraggable ? '14px' : '10px'};
          color: white;
          font-weight: bold;
          position: relative;
        ">
          ${isDraggable ? '↕' : (isCalibrated ? '✓' : '')}
          ${isCalibrated && !isDraggable ? `
            <div style="
              position: absolute;
              top: -2px;
              right: -2px;
              width: 8px;
              height: 8px;
              background-color: #10b981;
              border-radius: 50%;
              border: 1px solid white;
            "></div>
          ` : ''}
        </div>
      `,
      iconSize: [size + borderWidth * 2, size + borderWidth * 2],
      iconAnchor: [(size + borderWidth * 2) / 2, (size + borderWidth * 2) / 2]
    })
  }, [station, isDragMode, isCalibrated])

  const eventHandlers = useMemo(() => ({
    dragend: () => {
      const marker = markerRef.current
      if (marker) {
        const latLng = marker.getLatLng()
        onDragEnd(station.stationId, latLng.lat, latLng.lng)
      }
    },
    click: () => {
      if (!isDragMode && onClick) {
        onClick()
      }
    }
  }), [station.stationId, onDragEnd, isDragMode, onClick])

  return (
    <Marker
      ref={markerRef}
      position={position}
      icon={createDraggableIcon}
      draggable={isDragMode}
      eventHandlers={eventHandlers}
    >
      <Tooltip
        permanent={false}
        direction="top"
        offset={[0, -15]}
        className="universal-station-tooltip"
      >
        <div className="text-center">
          <div className="font-medium">{station.stationName}</div>
          <div className="text-xs opacity-75">
            ID: {station.stationId} 
            {station.freeNum !== undefined && station.switchType && (
              <span> • {station.freeNum}/{station.switchType}</span>
            )}
          </div>
          {isCalibrated && (
            <div className="text-xs text-green-600 font-medium">
              ✓ 已校准
            </div>
          )}
          {isDragMode && (
            <div className="text-xs text-amber-600 font-medium mt-1">
              拖拽调整位置
            </div>
          )}
        </div>
      </Tooltip>
    </Marker>
  )
}

export default DraggableStationMarkerUniversal
