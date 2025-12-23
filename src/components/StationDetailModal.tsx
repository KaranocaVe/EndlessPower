import { useEffect, useMemo, useState } from 'react'
import { Button, Modal } from '@heroui/react'
import type { Outlet, OutletStatus, Station } from '../types/station'
import { fetchOutletStatus, fetchStationOutlets } from '../utils/api'
import { useFavoritesStore } from '../store/favoritesStore'
import { useErrorStore } from '../store/errorStore'
import { useMonitorStore } from '../store/monitorStore'
import LoadingSpinner from './LoadingSpinner'
import { HeartIcon, QrCodeIcon } from './icons'

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
            <div style={{ width: 44, height: 4, borderRadius: 999, margin: '10px auto 2px', background: 'rgba(148, 163, 184, 0.35)' }} aria-hidden="true" />
            <Modal.Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingTop: 6, paddingBottom: 12 }}>
              <div style={{ minWidth: 0 }}>
                <Modal.Heading>{station?.stationName ?? '充电站'}</Modal.Heading>
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{station?.address ?? ''}</div>
              </div>
              <Modal.CloseTrigger aria-label="关闭" />
            </Modal.Header>
            <Modal.Body style={{ display: 'grid', gap: 14 }}>
              {station && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <Button variant={stationIsFavorite ? 'primary' : 'secondary'} onPress={handleToggleFavorite} aria-label={stationIsFavorite ? '已收藏' : '收藏'}>
                    <HeartIcon size={18} />
                  </Button>
                  <Button
                    variant="secondary"
                    aria-label="微信扫一扫"
                    onPress={() => {
                      try {
                        window.location.href = 'weixin://scanqrcode'
                      } catch {
                        // ignore
                      }
                    }}
                  >
                    <QrCodeIcon size={18} />
                  </Button>
                </div>
              )}

              <div style={{ display: 'flex', gap: 16, fontSize: 14 }}>
                <span>总插座 <strong>{outletSummary.total}</strong></span>
                <span style={{ color: 'var(--success)' }}>可用 <strong>{outletSummary.available}</strong></span>
                <span style={{ color: 'var(--danger)' }}>占用 <strong>{outletSummary.occupied}</strong></span>
              </div>

              {loading ? (
                <div style={{ padding: '12px 0' }}>
                  <LoadingSpinner label="加载插座信息…" />
                </div>
              ) : sortedOutlets.length === 0 ? (
                <div style={{ padding: '12px 0', opacity: 0.8 }}>该充电站暂无插座信息。</div>
              ) : (
                <>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>点击插座卡片进入监控</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }} data-testid="outlet-grid">
                    {sortedOutlets.map((outlet) => {
                      const status = statusByOutletNo[outlet.outletNo] ?? null
                      const available = isOutletAvailable(status)
                      const name =
                        status?.outlet?.vOutletName?.replace('插座', '').trim() ||
                        outlet.vOutletName?.replace('插座', '').trim() ||
                        outlet.outletSerialNo?.toString() ||
                        outlet.outletNo

                      const label = `插座 ${name}`
                      const cardStyle: React.CSSProperties = {
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                        padding: 14,
                        borderRadius: 14,
                        border: `1px solid ${available ? 'var(--ep-success-border)' : 'var(--ep-danger-border)'}`,
                        background: available ? 'var(--ep-success-soft)' : 'var(--ep-danger-soft)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        minHeight: 72
                      }
                      return (
                        <button
                          key={outlet.outletId}
                          type="button"
                          style={cardStyle}
                          onClick={() => handleMonitorOutlet(outlet, label)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                            <div style={{ fontWeight: 650, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
                            <div style={{
                              padding: '4px 8px',
                              borderRadius: 999,
                              fontSize: 12,
                              fontWeight: 700,
                              whiteSpace: 'nowrap',
                              background: available ? 'var(--ep-success-soft)' : 'var(--ep-danger-soft)',
                              color: available ? 'var(--success)' : 'var(--danger)'
                            }}>
                              {available ? '可用' : '占用'}
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 12 }}>
                            {!status ? (
                              <span style={{ opacity: 0.8 }}>状态未知</span>
                            ) : available ? (
                              <span style={{ opacity: 0.8 }}>空闲中</span>
                            ) : (
                              <>
                                <span style={{ opacity: 0.9, fontVariantNumeric: 'tabular-nums' }}>{status.powerFee?.billingPower ?? '未知'}</span>
                                <span style={{ opacity: 0.9, fontVariantNumeric: 'tabular-nums' }}>¥{(status.usedfee ?? 0).toFixed(2)}</span>
                                <span style={{ opacity: 0.9, fontVariantNumeric: 'tabular-nums' }}>{status.usedmin ?? 0} 分钟</span>
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
