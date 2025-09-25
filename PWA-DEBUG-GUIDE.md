# PWA 安装引导调试指南

## 🚨 问题：看不到安装引导

如果您在页眉看不到PWA安装按钮，请按照以下步骤进行诊断：

## 🔍 第一步：检查浏览器支持

### 支持PWA安装的浏览器
- ✅ **Chrome 67+** (桌面/移动)
- ✅ **Edge 79+** (桌面/移动)
- ✅ **Samsung Internet** (移动)
- ✅ **Opera 54+** (桌面)
- ❌ **Safari** (不支持程序化安装)
- ❌ **Firefox** (部分支持，默认关闭)

### 快速检查方法
1. 使用 **Chrome 或 Edge** 浏览器
2. 访问：http://localhost:3000 (开发服务器)
3. 查看页眉右侧是否有 🔧 调试按钮

## 🔧 第二步：使用调试功能

### 在开发环境中
1. 访问 http://localhost:3000
2. 在页眉右侧找到 🔧 按钮
3. 点击按钮查看PWA调试信息
4. 按 F12 打开控制台查看详细日志

### 预期的控制台输出
```
🔍 PWA Header: 初始化安装检测
📱 PWA Header 检测结果: {...}
👂 PWA Header: 开始监听安装事件
🎯 PWA Header: 收到beforeinstallprompt事件 (如果支持)
```

## 🛠️ 第三步：检查PWA要求

### 必需条件检查清单
- [ ] **HTTPS 或 localhost**: 必须在安全环境下
- [ ] **Web App Manifest**: manifest文件存在且正确
- [ ] **Service Worker**: 已注册且正常工作
- [ ] **图标**: 至少一个192x192的图标

### 手动检查方法

#### 1. 检查 Manifest
```javascript
// 在控制台中运行
console.log('Manifest:', document.querySelector('link[rel="manifest"]'))
```

#### 2. 检查 Service Worker
```javascript
// 在控制台中运行
console.log('ServiceWorker:', 'serviceWorker' in navigator)
navigator.serviceWorker.getRegistrations().then(console.log)
```

#### 3. 检查 HTTPS
```javascript
// 在控制台中运行
console.log('Protocol:', location.protocol)
console.log('HTTPS or localhost:', location.protocol === 'https:' || location.hostname === 'localhost')
```

## 📱 第四步：浏览器特定检查

### Chrome/Edge 桌面版
1. 打开开发者工具 (F12)
2. 转到 **Application** 标签
3. 查看左侧 **Manifest** 部分
4. 检查是否有错误或警告

### Chrome 移动版
1. 在 Chrome 中访问应用
2. 查看地址栏是否有"添加到主屏幕"图标
3. 或者在页眉查看是否有安装按钮

### 测试beforeinstallprompt事件
```javascript
// 在控制台中手动监听事件
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('✅ beforeinstallprompt 事件触发!', e)
})
```

## 🎯 第五步：常见问题解决

### 问题1: 应用被检测为已安装
**症状**: 显示绿色"已安装"徽章
**解决**: 检查是否在standalone模式下访问
```javascript
console.log('Standalone mode:', window.matchMedia('(display-mode: standalone)').matches)
```

### 问题2: beforeinstallprompt事件不触发
**原因**: 
- 浏览器不支持
- PWA要求未满足
- 用户之前拒绝过安装

**解决**: 
1. 检查浏览器版本
2. 验证manifest和Service Worker
3. 清除浏览器数据重新测试

### 问题3: Safari浏览器
**说明**: Safari不支持程序化安装提示
**替代方案**: 用户需要手动使用"添加到主屏幕"

### 问题4: Firefox浏览器
**说明**: Firefox默认禁用PWA安装
**解决**: 在地址栏输入 `about:config`，启用 `dom.webnotifications.serviceworker.enabled`

## 🚀 第六步：强制测试方法

### 方法1: 清除浏览器数据
1. 打开开发者工具
2. 右键刷新按钮
3. 选择"清空缓存并硬性重新加载"

### 方法2: 隐身模式测试
1. 打开Chrome隐身窗口
2. 访问应用URL
3. 查看是否显示安装提示

### 方法3: 模拟移动设备
1. 打开开发者工具
2. 点击设备图标切换到移动模式
3. 刷新页面测试

## 📋 调试信息收集

如果问题仍然存在，请收集以下信息：

### 基础信息
- 操作系统：
- 浏览器版本：
- 访问URL：

### 控制台输出
```
请复制粘贴控制台中的PWA相关日志
```

### 开发者工具检查
1. Application → Manifest (是否有错误)
2. Application → Service Workers (注册状态)
3. Network → 刷新页面 (是否有404错误)

## 🎯 预期的正常状态

### 开发环境 (http://localhost:3000)
```
页眉显示: [EndlessPower] [🔧] [📥 安装应用] [地图|收藏]
```

### 生产环境 (HTTPS)
```
页眉显示: [EndlessPower] [📥 安装应用] [地图|收藏]
```

### 不支持的浏览器
```
页眉显示: [EndlessPower] [地图|收藏]
```

## 💡 临时解决方案

如果PWA安装引导仍然不工作，用户可以：

### Chrome/Edge 用户
1. 地址栏右侧查找安装图标
2. 浏览器菜单 → "安装 EndlessPower"

### 移动设备用户
1. 浏览器菜单 → "添加到主屏幕"
2. 或分享按钮 → "添加到主屏幕"

---

**需要帮助？** 
请提供调试信息输出结果，我们会进一步协助您解决问题。
