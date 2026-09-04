import { expect, test } from '@playwright/test'

test('falls back to simulated stations when the upstream request fails', async ({ page }) => {
  await page.route('https://wemp.issks.com/device/v1/near/station', async (route) => {
    await route.abort('timedout')
  })

  await page.goto('/')

  await expect(page.getByRole('searchbox', { name: '搜索充电站' })).toHaveAttribute(
    'placeholder',
    '搜索充电站（模拟数据）…'
  )
  await expect(page.locator('button.station-marker')).toHaveCount(2)
  await expect(page.getByRole('button', { name: '清水河校区充电站（模拟）' })).toBeVisible()
})
