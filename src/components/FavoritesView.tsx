import { useMemo, useState } from 'react'
import { Button } from '@heroui/react'
import { useFavoritesStore } from '../store/favoritesStore'
import { useStationStore } from '../store/stationStore'
import type { Station } from '../types/station'
import FavoriteStationCard from './FavoriteStationCard'

type FavoritesViewProps = {
  onOpenMap?: () => void
}

const REFRESH_COOLDOWN = 15_000

export default function FavoritesView({ onOpenMap }: FavoritesViewProps) {
  const [lastRefresh, setLastRefresh] = useState(0)
  const { favoriteIds, isPinned } = useFavoritesStore()
  const { stations } = useStationStore()

  const favoriteStations = useMemo(() => {
    const found = favoriteIds
      .map((id) => stations.find((s) => s.stationId === id))
      .filter(Boolean) as Station[]

    return found.sort((a, b) => {
      const aPinned = isPinned(a.stationId)
      const bPinned = isPinned(b.stationId)
      if (aPinned && !bPinned) return -1
      if (!aPinned && bPinned) return 1
      return 0
    })
  }, [favoriteIds, isPinned, stations])

  const canRefresh = Date.now() - lastRefresh >= REFRESH_COOLDOWN

  return (
    <div className="ep-fav-view" data-testid="favorites-view">
      <div className="ep-page-inner">
        <div className="ep-fav-header">
          <div className="ep-fav-title">
            <div className="ep-fav-title-main">我的收藏</div>
            <div className="ep-fav-title-sub">{favoriteStations.length > 0 ? `${favoriteStations.length} 个充电站` : '还没有收藏'}</div>
          </div>
          <div className="ep-fav-header-actions">
            {onOpenMap && (
              <Button variant="secondary" onPress={onOpenMap}>
                去地图
              </Button>
            )}
            <Button variant="primary" onPress={() => canRefresh && setLastRefresh(Date.now())} isDisabled={!canRefresh}>
              刷新
            </Button>
          </div>
        </div>

        {favoriteStations.length === 0 ? (
          <div className="ep-fav-empty">
            <div className="ep-fav-empty-title">还没有收藏的充电桩</div>
            <div className="ep-fav-empty-sub">在地图上点选充电桩，然后点击“收藏”。</div>
          </div>
        ) : (
          <div className="ep-fav-grid">
            {favoriteStations.map((station) => (
              <FavoriteStationCard key={station.stationId} station={station} refreshTrigger={lastRefresh} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
