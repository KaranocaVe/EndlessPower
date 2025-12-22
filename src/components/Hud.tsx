import type { ReactNode } from 'react'
import { Tabs } from '@heroui/react'
import { HeartIcon, MapIcon, SettingsIcon } from './icons'

export type HudView = 'map' | 'favorites' | 'monitor'

type HudProps = {
  currentView: HudView
  onViewChange: (view: HudView) => void
  onOpenSettings: () => void
  isHidden?: boolean
  children?: ReactNode
}

export default function Hud({ currentView, onViewChange, onOpenSettings, isHidden, children }: HudProps) {
  const hidden = Boolean(isHidden)
  return (
    <>
      <div className={`ep-hud ${hidden ? 'is-hidden' : ''}`} aria-hidden={hidden ? 'true' : undefined}>
        {children}
      </div>

      <nav className={`ep-tabbar ${hidden ? 'is-hidden' : ''}`} aria-label="主导航" aria-hidden={hidden ? 'true' : undefined}>
        <Tabs
          selectedKey={currentView}
          onSelectionChange={(key) => {
            const next = String(key)
            if (next === 'settings') {
              onOpenSettings()
              return
            }
            onViewChange(next as HudView)
          }}
          hideSeparator
          aria-label="主导航"
          className="ep-tabbar-tabs"
        >
          <Tabs.List className="ep-tabbar-tabs-list">
            <Tabs.Tab id="map" className="ep-tabbar-tab">
              <Tabs.Indicator />
              <span className="ep-tabbar-icon" aria-hidden="true">
                <MapIcon size={22} />
              </span>
              <span className="ep-tabbar-label">地图</span>
            </Tabs.Tab>

            <Tabs.Tab id="favorites" className="ep-tabbar-tab">
              <Tabs.Indicator />
              <span className="ep-tabbar-icon" aria-hidden="true">
                <HeartIcon size={22} />
              </span>
              <span className="ep-tabbar-label">收藏</span>
            </Tabs.Tab>

            <Tabs.Tab id="settings" className="ep-tabbar-tab">
              <Tabs.Indicator />
              <span className="ep-tabbar-icon" aria-hidden="true">
                <SettingsIcon size={22} />
              </span>
              <span className="ep-tabbar-label">设置</span>
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </nav>
    </>
  )
}
