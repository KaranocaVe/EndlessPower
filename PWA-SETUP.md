# PWA 设置指南

## 完成 PWA 图标设置

应用已经配置好了 PWA 功能，但需要生成实际的图标文件。请按照以下步骤完成设置：

### 方法一：使用提供的图标生成器

1. 打开浏览器访问项目中的图标生成器：
   ```
   scripts/generate-icons.html
   ```

2. 点击对应按钮生成图标：
   - 点击 "Generate 192x192" 下载 `pwa-192x192.png`
   - 点击 "Generate 512x512" 下载 `pwa-512x512.png`
   - 点击 "Generate Apple Touch Icon" 下载 `apple-touch-icon.png`

3. 将下载的图标文件放到 `public/` 目录下

### 方法二：使用在线工具

1. 访问 PWA 图标生成器网站（如 https://www.pwabuilder.com/imageGenerator）

2. 上传您的品牌 Logo（建议 512x512 或更大）

3. 下载生成的图标包

4. 将以下文件复制到 `public/` 目录：
   - `pwa-192x192.png`
   - `pwa-512x512.png`
   - `apple-touch-icon.png` (180x180)

### 方法三：手动创建

如果您有设计软件，可以基于 `public/icon.svg` 创建：

- **192x192 PNG**: 用于 PWA 安装提示
- **512x512 PNG**: 用于应用启动画面和高分辨率显示
- **180x180 PNG**: 用于 iOS 设备的主屏幕图标

## 测试 PWA 功能

### 开发环境测试

1. 启动开发服务器：
   ```bash
   npm run dev
   ```

2. 打开浏览器访问 `http://localhost:3000`

3. 检查 PWA 功能：
   - 查看是否出现安装提示
   - 测试离线功能（关闭网络）
   - 检查 Service Worker 注册状态

### 生产环境测试

1. 构建应用：
   ```bash
   npm run build
   ```

2. 预览构建结果：
   ```bash
   npm run preview
   ```

3. 使用浏览器的 PWA 检查工具：
   - Chrome: 开发者工具 → Application → Manifest
   - Firefox: 开发者工具 → Application → Manifest

## PWA 功能验证清单

- [ ] ✅ Web App Manifest 已配置
- [ ] ✅ Service Worker 已注册
- [ ] ✅ 离线页面可访问
- [ ] ⚠️  PWA 图标已生成并放置
- [ ] ✅ 安装提示组件已实现
- [ ] ✅ 更新提示组件已实现
- [ ] ✅ 缓存策略已配置

## 部署注意事项

1. **HTTPS 要求**: PWA 必须在 HTTPS 环境下运行（localhost 除外）

2. **图标路径**: 确保图标文件正确部署到服务器根目录

3. **缓存更新**: 更新应用时，Service Worker 会自动提示用户刷新

4. **域名绑定**: manifest.json 中的 scope 应该匹配实际部署域名

## 常见问题

### Q: 安装提示不显示？
A: 检查浏览器是否支持 PWA，确保在 HTTPS 环境下访问

### Q: 离线功能不工作？
A: 检查 Service Worker 是否正确注册，查看控制台错误信息

### Q: 图标显示不正确？
A: 确保图标文件路径正确，格式为 PNG，尺寸符合要求

### Q: iOS 设备无法安装？
A: iOS 需要使用 Safari 的"添加到主屏幕"功能，确保设置了正确的 meta 标签

## 进阶配置

### 自定义安装提示时机

修改 `src/components/PWAInstallPrompt.tsx` 中的逻辑来控制何时显示安装提示。

### 推送通知

要启用推送通知，需要：
1. 配置 Firebase Cloud Messaging 或其他推送服务
2. 在 Service Worker 中添加推送事件监听
3. 请求用户授权通知权限

### 后台同步

可以配置后台同步来在网络恢复时自动同步数据：
```javascript
// 在 Service Worker 中
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});
```
