import { useMemo, useState } from 'react'
import { Button, Card, ListBox, Modal, Radio, RadioGroup, Select, Switch } from '@heroui/react'
import { useSettingsStore } from '../store/settingsStore'
import { useThemeStore } from '../store/themeStore'
import { formatVersionDisplay, getBuildEnv, getShortGitCommit } from '../utils/version'
import ContributorsSection from './ContributorsSection'

type SettingsModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [isClearingCache, setIsClearingCache] = useState(false)
  const [resetFeedback, setResetFeedback] = useState<'idle' | 'done'>('idle')
  const {
    autoRefresh,
    showUnavailableStations,
    chinaCoordFix,
    refreshInterval,
    baseMapStyle,
    setAutoRefresh,
    setShowUnavailableStations,
    setChinaCoordFix,
    setRefreshInterval,
    setBaseMapStyle,
    resetSettings
  } = useSettingsStore()

  const { theme, setTheme } = useThemeStore()

  const envText = useMemo(() => (getBuildEnv() === 'development' ? 'development' : 'production'), [])

  const handleResetAll = () => {
    const ok = window.confirm('将恢复默认设置（包含主题模式与地图/数据设置），是否继续？')
    if (!ok) return
    resetSettings()
    setTheme('auto')
    setResetFeedback('done')
    window.setTimeout(() => setResetFeedback('idle'), 1500)
  }

  const handleClearCache = async () => {
    const ok = window.confirm('将清除离线缓存并重新加载页面（不会清空收藏），是否继续？')
    if (!ok) return
    setIsClearingCache(true)
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations()
        await Promise.all(registrations.map((r) => r.unregister()))
      }
      if ('caches' in window) {
        const keys = await caches.keys()
        await Promise.all(keys.map((k) => caches.delete(k)))
      }
    } finally {
      window.location.reload()
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop variant="blur">
        <Modal.Container placement="center" size="lg" scroll="inside">
          <Modal.Dialog className="ep-settings-dialog">
            <Modal.Header className="ep-modal-header ep-settings-header">
              <div className="ep-settings-heading">
                <Modal.Heading>设置</Modal.Heading>
                <div className="ep-settings-subtitle">外观 · 地图 · 数据</div>
              </div>
              <Modal.CloseTrigger aria-label="关闭" />
            </Modal.Header>

            <Modal.Body className="ep-settings-body">
              <Card className="ep-settings-card">
                <Card.Header className="ep-settings-card-header">
                  <Card.Title>外观</Card.Title>
                </Card.Header>
                <Card.Content className="ep-settings-card-content">
                  <div className="ep-settings-row">
                    <div className="ep-settings-row-text">
                      <div className="ep-settings-row-title">主题模式</div>
                    </div>
                  </div>
                  <RadioGroup
                    value={theme}
                    onChange={(v) => setTheme(v as any)}
                    aria-label="主题模式"
                    orientation="horizontal"
                    className="ep-theme-radio-group"
                  >
                    <Radio value="auto">
                      <Radio.Control>
                        <Radio.Indicator />
                      </Radio.Control>
                      <Radio.Content>跟随系统</Radio.Content>
                    </Radio>
                    <Radio value="light">
                      <Radio.Control>
                        <Radio.Indicator />
                      </Radio.Control>
                      <Radio.Content>亮色</Radio.Content>
                    </Radio>
                    <Radio value="dark">
                      <Radio.Control>
                        <Radio.Indicator />
                      </Radio.Control>
                      <Radio.Content>暗色</Radio.Content>
                    </Radio>
                  </RadioGroup>
                </Card.Content>
              </Card>

              <Card className="ep-settings-card">
                <Card.Header className="ep-settings-card-header">
                  <Card.Title>地图与数据</Card.Title>
                </Card.Header>
                <Card.Content className="ep-settings-card-content">
                  <div className="ep-settings-row ep-settings-row-block">
                    <div className="ep-settings-row-text">
                      <div className="ep-settings-row-title">底图风格（CARTO）</div>
                      <div className="ep-settings-row-sub">默认：亮色 Voyager / 暗色 Dark Matter</div>
                    </div>
                    <Select
                      aria-label="底图风格（CARTO）"
                      selectedKey={baseMapStyle}
                      onSelectionChange={(key) => setBaseMapStyle(String(key) as any)}
                      className="ep-settings-select"
                    >
                      <Select.Trigger aria-label="底图风格（CARTO）">
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox aria-label="底图风格（CARTO）" selectionMode="single">
                          <ListBox.Item id="auto" textValue="自动（推荐）">
                            自动（推荐）
                          </ListBox.Item>
                          <ListBox.Item id="voyager" textValue="Voyager（亮色·更丰富）">
                            Voyager（亮色·更丰富）
                          </ListBox.Item>
                          <ListBox.Item id="positron" textValue="Positron（亮色·极简）">
                            Positron（亮色·极简）
                          </ListBox.Item>
                          <ListBox.Item id="voyager-nolabels" textValue="Voyager（无标注）">
                            Voyager（无标注）
                          </ListBox.Item>
                          <ListBox.Item id="positron-nolabels" textValue="Positron（无标注）">
                            Positron（无标注）
                          </ListBox.Item>
                          <ListBox.Item id="dark-matter" textValue="Dark Matter（暗色）">
                            Dark Matter（暗色）
                          </ListBox.Item>
                          <ListBox.Item id="dark-matter-nolabels" textValue="Dark Matter（无标注）">
                            Dark Matter（无标注）
                          </ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <div className="ep-settings-row">
                    <div className="ep-settings-row-text">
                      <div className="ep-settings-row-title">自动刷新</div>
                      <div className="ep-settings-row-sub">定期更新充电桩状态</div>
                    </div>
                    <Switch aria-label="自动刷新" isSelected={autoRefresh} onChange={setAutoRefresh}>
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                    </Switch>
                  </div>

                  <div className="ep-settings-row">
                    <div className="ep-settings-row-text">
                      <div className="ep-settings-row-title">显示无可用插座的充电桩</div>
                      <div className="ep-settings-row-sub">关闭后仅展示可用充电桩</div>
                    </div>
                    <Switch
                      aria-label="显示无可用插座的充电桩"
                      isSelected={showUnavailableStations}
                      onChange={setShowUnavailableStations}
                    >
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                    </Switch>
                  </div>

                  <div className="ep-settings-row">
                    <div className="ep-settings-row-text">
                      <div className="ep-settings-row-title">中国坐标纠偏</div>
                      <div className="ep-settings-row-sub">将 GCJ-02 转为 WGS84 以匹配 Carto 矢量底图</div>
                    </div>
                    <Switch aria-label="中国坐标纠偏" isSelected={chinaCoordFix} onChange={setChinaCoordFix}>
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                    </Switch>
                  </div>

                  <div className="ep-settings-row ep-settings-row-block">
                    <div className="ep-settings-row-text">
                      <div className="ep-settings-row-title">刷新间隔</div>
                      <div className="ep-settings-row-sub">更短间隔更实时，但更耗流量</div>
                    </div>
                    <Select
                      aria-label="刷新间隔"
                      selectedKey={String(refreshInterval)}
                      onSelectionChange={(key) => {
                        const next = Number(String(key))
                        if (Number.isFinite(next)) setRefreshInterval(next)
                      }}
                      className="ep-settings-select"
                    >
                      <Select.Trigger aria-label="刷新间隔">
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox aria-label="刷新间隔" selectionMode="single">
                          <ListBox.Item id="3" textValue="3 秒">
                            3 秒
                          </ListBox.Item>
                          <ListBox.Item id="5" textValue="5 秒（推荐）">
                            5 秒（推荐）
                          </ListBox.Item>
                          <ListBox.Item id="10" textValue="10 秒">
                            10 秒
                          </ListBox.Item>
                          <ListBox.Item id="15" textValue="15 秒">
                            15 秒
                          </ListBox.Item>
                          <ListBox.Item id="30" textValue="30 秒">
                            30 秒
                          </ListBox.Item>
                          <ListBox.Item id="60" textValue="1 分钟">
                            1 分钟
                          </ListBox.Item>
                          <ListBox.Item id="300" textValue="5 分钟">
                            5 分钟
                          </ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                </Card.Content>
              </Card>

              <Card className="ep-settings-card">
                <Card.Header className="ep-settings-card-header">
                  <Card.Title>关于</Card.Title>
                </Card.Header>
                <Card.Content className="ep-settings-card-content">
                  <div className="ep-settings-about">
                    <div>版本：{formatVersionDisplay()}</div>
                    <div>提交：{getShortGitCommit()}</div>
                    <div>环境：{envText}</div>
                  </div>
                  <div className="ep-settings-links">
                    <a
                      className="ep-settings-link"
                      href="https://github.com/jasonmumiao/EndlessPower"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                    <a
                      className="ep-settings-link"
                      href="http://endlesspower.icu/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      官网
                    </a>
                  </div>
                  {isOpen && <ContributorsSection />}
                </Card.Content>
              </Card>
            </Modal.Body>

            <Modal.Footer className="ep-settings-footer">
              <div className="ep-settings-footer-actions">
                <Button variant="secondary" onPress={handleClearCache} isDisabled={isClearingCache}>
                  {isClearingCache ? '清理中…' : '清除缓存'}
                </Button>
                <Button variant="secondary" onPress={handleResetAll}>
                  {resetFeedback === 'done' ? '已恢复默认' : '恢复默认'}
                </Button>
              </div>
              <Button variant="primary" onPress={onClose}>
                完成
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}
