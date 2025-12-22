import { useEffect, useMemo, useState } from 'react'
import { Button, Card, Modal } from '@heroui/react'
import type { Outlet, OutletStatus, Station } from '../types/station'
import { fetchOutletStatus, fetchStationOutlets } from '../utils/api'
import { useFavoritesStore } from '../store/favoritesStore'
import { useErrorStore } from '../store/errorStore'
import { useMonitorStore } from '../store/monitorStore'
import LoadingSpinner from './LoadingSpinner'
import { HeartIcon, MonitorIcon, QrCodeIcon } from './icons'

type StationDetailModalProps = {
  station: Station | null
  isOpen: boolean
  onClose: () => void
}

function isOutletAvailable(status: OutletStatus | null) {
  return status?.outlet?.iCurrentChargingRecordId === 0
}

export default function StationDetailModal({ station, isOpen, onClose }: StationDetailModalProps) {
  const [outlets, setOutlets] = useState<Outlet[]>([])
  const [statusByOutletNo, setStatusByOutletNo] = useState<Record<string, OutletStatus | null>>({})
  const [loading, setLoading] = useState(false)

  const { isFavorite, addFavorite, removeFavorite, canAddMore } = useFavoritesStore()
  const { showError } = useErrorStore()
  const { setMonitorTarget } = useMonitorStore()

  useEffect(() => {
    if (!isOpen || !station) return
    const stationId = station.stationId

    let cancelled = false
    async function run() {
      setLoading(true)
      try {
        const stationOutlets = await fetchStationOutlets(stationId)
        if (cancelled) return
        setOutlets(stationOutlets)

        if (stationOutlets.length > 0) {
          const res = await Promise.all(stationOutlets.map((o) => fetchOutletStatus(o.outletNo)))
          if (cancelled) return
          const nextMap: Record<string, OutletStatus | null> = {}
          stationOutlets.forEach((outlet, index) => {
            nextMap[outlet.outletNo] = res[index] ?? null
          })
          setStatusByOutletNo(nextMap)
        } else {
          setStatusByOutletNo({})
        }
      } catch (e) {
        if (!cancelled) showError('加载充电站详情失败')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [isOpen, station, showError])

  const stationIsFavorite = station ? isFavorite(station.stationId) : false

  const outletSummary = useMemo(() => {
    const total = outlets.length
    const available = Object.values(statusByOutletNo).filter((s) => isOutletAvailable(s)).length
    return { total, available, occupied: Math.max(0, total - available) }
  }, [outlets.length, statusByOutletNo])

  const handleToggleFavorite = () => {
    if (!station) return
    if (stationIsFavorite) {
      removeFavorite(station.stationId)
      return
    }
    if (!canAddMore()) {
      showError('收藏夹已满，请先移除一些站点。')
      return
    }
    addFavorite(station.stationId)
  }

  const handleMonitorOutlet = (outlet: Outlet, outletName: string) => {
    if (!station) return
    setMonitorTarget({
      stationId: station.stationId,
      stationName: station.stationName,
      outlet,
      outletName
    })
    window.dispatchEvent(new Event('switchToMonitor'))
    onClose()
  }

  const sortedOutlets = useMemo(() => {
    return [...outlets].sort((a, b) => (a.outletSerialNo ?? 0) - (b.outletSerialNo ?? 0))
  }, [outlets])

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop variant="blur">
        <Modal.Container placement="bottom" size="cover" scroll="inside">
          <Modal.Dialog className="ep-station-dialog">
            <div className="ep-sheet-handle" aria-hidden="true" />
            <Modal.Header className="ep-modal-header ep-station-header">
              <div className="ep-station-title">
                <Modal.Heading>{station?.stationName ?? '充电站'}</Modal.Heading>
                <div className="ep-station-subtitle">{station?.address ?? ''}</div>
              </div>
              <Modal.CloseTrigger aria-label="关闭" />
            </Modal.Header>
            <Modal.Body className="ep-station-body">
              {station && (
                <div className="ep-station-actions">
                  <Button variant={stationIsFavorite ? 'primary' : 'secondary'} onPress={handleToggleFavorite}>
                    <span className="ep-btn-icon" aria-hidden="true">
                      <HeartIcon size={18} />
                    </span>
                    {stationIsFavorite ? '已收藏' : '收藏'}
                  </Button>
                  <Button
                    variant="secondary"
                    onPress={() => {
                      try {
                        window.location.href = 'weixin://scanqrcode'
                      } catch {
                        // ignore
                      }
                    }}
                  >
                    <span className="ep-btn-icon" aria-hidden="true">
                      <QrCodeIcon size={18} />
                    </span>
                    微信扫一扫
                  </Button>
                </div>
              )}

              <div className="ep-station-summary">
                <Card className="ep-station-stat">
                  <Card.Content>
                    <div className="ep-stat-label">总插座</div>
                    <div className="ep-stat-value">{outletSummary.total}</div>
                  </Card.Content>
                </Card>
                <Card className="ep-station-stat is-success">
                  <Card.Content>
                    <div className="ep-stat-label">可用</div>
                    <div className="ep-stat-value is-success">{outletSummary.available}</div>
                  </Card.Content>
                </Card>
                <Card className="ep-station-stat is-busy">
                  <Card.Content>
                    <div className="ep-stat-label">占用</div>
                    <div className="ep-stat-value is-busy">{outletSummary.occupied}</div>
                  </Card.Content>
                </Card>
              </div>

              {loading ? (
                <div className="ep-station-loading">
                  <LoadingSpinner label="加载插座信息…" />
                </div>
              ) : sortedOutlets.length === 0 ? (
                <div className="ep-station-empty">该充电站暂无插座信息。</div>
              ) : (
                <>
                  <div className="ep-station-hint">点击插座卡片进入监控</div>
                  <div className="ep-outlet-grid" data-testid="outlet-grid">
                    {sortedOutlets.map((outlet) => {
                      const status = statusByOutletNo[outlet.outletNo] ?? null
                      const available = isOutletAvailable(status)
                      const name =
                        status?.outlet?.vOutletName?.replace('插座', '').trim() ||
                        outlet.vOutletName?.replace('插座', '').trim() ||
                        outlet.outletSerialNo?.toString() ||
                        outlet.outletNo

                      const label = `插座 ${name}`
                      return (
                        <button
                          key={outlet.outletId}
                          type="button"
                          className={`ep-outlet-card ${available ? 'is-available' : 'is-occupied'}`}
                          data-status={available ? 'available' : 'occupied'}
                          onClick={() => handleMonitorOutlet(outlet, label)}
                        >
                          <span className="ep-outlet-hover" aria-hidden="true">
                            <MonitorIcon size={20} />
                          </span>
                          <div className="ep-outlet-card-top">
                            <div className="ep-outlet-name">{label}</div>
                            <div className={`ep-outlet-badge ${available ? 'is-available' : 'is-occupied'}`}>
                              {available ? '可用' : '占用'}
                            </div>
                          </div>
                          <div className="ep-outlet-card-bottom">
                            {!status ? (
                              <span className="ep-muted">状态未知</span>
                            ) : available ? (
                              <span className="ep-muted">空闲中</span>
                            ) : (
                              <>
                                <span className="ep-kpi">{status.powerFee?.billingPower ?? '未知'}</span>
                                <span className="ep-kpi">¥{(status.usedfee ?? 0).toFixed(2)}</span>
                                <span className="ep-kpi">{status.usedmin ?? 0} 分钟</span>
                              </>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </>
              )}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}
