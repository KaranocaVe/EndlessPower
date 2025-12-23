import { chromium } from 'playwright';

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 390, height: 844 }
});
const page = await context.newPage();

await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

// 点击设置
try {
  await page.click('[id="settings"]', { timeout: 5000 });
} catch {
  await page.click('text=设置', { timeout: 5000 });
}
await page.waitForTimeout(1500);
await page.screenshot({ path: '/tmp/settings-1.png' });
console.log('Settings screenshot 1 saved');

// 尝试滚动
await page.evaluate(() => {
  const body = document.querySelector('.ep-settings-body');
  if (body) {
    body.scrollTop = 500;
    console.log('Scrolled body to 500');
  }
  const dialog = document.querySelector('.ep-settings-dialog');
  if (dialog) {
    dialog.scrollTop = 500;
    console.log('Scrolled dialog to 500');
  }
});
await page.waitForTimeout(500);
await page.screenshot({ path: '/tmp/settings-2.png' });
console.log('Settings screenshot 2 saved');

await browser.close();
