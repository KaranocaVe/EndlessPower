# 🔧 Cloudflare Workers 开发模式配置指南

## 🎯 概述

现在应用已配置为**默认以开发模式部署**到 Cloudflare Workers，这样您可以在生产环境中也使用调试功能。

## 📁 配置文件

### `wrangler.toml` 环境配置

```toml
# 默认配置
name = "endlesspower"
compatibility_date = "2025-09-25"

[assets]
directory = "./dist"

# 开发环境配置
[env.dev]
name = "endlesspower-dev"
vars = { NODE_ENV = "development" }

# 生产环境配置  
[env.production]
name = "endlesspower"
vars = { NODE_ENV = "production" }
```

### `package.json` 部署脚本

```json
{
  "scripts": {
    "deploy": "npm run build && npx wrangler deploy --env dev",        // 默认：开发模式
    "deploy:dev": "npm run build && npx wrangler deploy --env dev",    // 开发模式
    "deploy:prod": "npm run build && npx wrangler deploy --env production", // 生产模式
    "deploy:preview": "npm run build && npx wrangler deploy --env dev"  // 预览：开发模式
  }
}
```

## 🚀 部署命令

### 开发模式部署（默认）
```bash
# 以下命令都会部署到开发环境
npm run deploy          # 默认开发模式
npm run deploy:dev      # 明确指定开发模式  
npm run deploy:preview  # 预览模式（也是开发）
```

**部署结果**:
- 🌐 **域名**: `https://endlesspower-dev.您的用户名.workers.dev`
- 🔧 **调试功能**: 启用（PWA调试按钮、位置调试面板等）
- 📊 **日志**: 详细的控制台输出
- ⚠️ **模拟数据提示**: 显示在界面上

### 生产模式部署
```bash
npm run deploy:prod
```

**部署结果**:
- 🌐 **域名**: `https://endlesspower.您的用户名.workers.dev`
- 🎯 **优化**: 生产级性能优化
- 🔇 **日志**: 最小化输出
- 🚀 **体验**: 最终用户体验

## 🛠️ 开发模式特性

### 启用的调试功能

**1. PWA 调试按钮** (🔧)
- 显示 PWA 安装状态
- 检查 Service Worker 注册
- 显示设备和浏览器信息

**2. 位置调试面板** (🗺️)  
- 可视化位置合并过程
- 显示硬编码 vs API 位置数据
- 调试位置覆盖逻辑

**3. API 调试日志**
- 详细的 CORS 代理尝试过程
- 位置合并统计信息
- 错误和成功状态日志

**4. 模拟数据指示器**
- 当 API 失败时显示 "模拟数据" 标志
- 搜索框提示 "搜索充电站（模拟数据）"

## 🎯 智能环境检测

应用会自动检测开发环境：

```typescript
// 检测逻辑
const isDevelopment = 
  import.meta.env.DEV ||                              // Vite 开发服务器
  import.meta.env.MODE === 'development' ||           // 构建模式
  window.location.hostname.includes('-dev') ||        // 开发域名
  window.location.hostname.includes('localhost')      // 本地开发
```

## 📊 环境对比

| 特性 | 开发模式 | 生产模式 |
|------|----------|----------|
| 域名 | `*-dev.workers.dev` | `*.workers.dev` |
| 调试按钮 | ✅ 显示 | ❌ 隐藏 |
| 控制台日志 | 🔍 详细 | 🔇 最小 |
| 模拟数据提示 | ⚠️ 显示 | ℹ️ 简化 |
| PWA 调试 | 🔧 启用 | 🚫 禁用 |
| 位置调试 | 🗺️ 启用 | 🚫 禁用 |
| 性能 | 🐌 调试优先 | 🚀 性能优先 |

## 🔄 环境切换

### 临时切换到生产模式
```bash
# 一次性生产部署
npm run deploy:prod
```

### 修改默认模式
如果想要默认使用生产模式，修改 `package.json`:

```json
{
  "scripts": {
    "deploy": "npm run build && npx wrangler deploy --env production"
  }
}
```

## 🔍 验证环境

### 检查当前环境
1. 打开应用 → F12 → Console
2. 查看是否有调试按钮 (🔧 🗺️)
3. 检查域名是否包含 `-dev`

### 调试信息查看
1. 点击 🔧 按钮查看 PWA 状态
2. 点击 🗺️ 按钮查看位置数据
3. 查看 Console 中的详细日志

## 🎉 优势

**开发友好**:
- ✅ 生产环境也能调试
- ✅ 快速问题定位
- ✅ 用户反馈问题时便于诊断

**用户体验**:
- ✅ 模拟数据保证可用性
- ✅ 清晰的状态提示
- ✅ 平滑的降级体验

**运维便利**:
- ✅ 开发/生产环境隔离
- ✅ 一键切换部署模式
- ✅ 智能环境检测

---

**总结**: 现在 `npm run deploy` 默认以开发模式部署，让您在生产环境中也能享受完整的调试功能！🎯
