# EndlessPower React 版本

这是使用 React + TypeScript + Vite + Tailwind CSS 重构的充电桩地图查询应用。

## 功能特点

- 🗺️ **交互式地图**: 使用 Leaflet 显示充电桩位置
- 🔍 **智能搜索**: 按名称或地址搜索充电桩
- ⭐ **收藏功能**: 收藏常用充电桩（最多4个）
- 📍 **定位服务**: 自动获取用户位置并显示附近充电桩
- 📱 **响应式设计**: 支持手机、平板和桌面设备
- ⚡ **实时状态**: 显示充电桩插座可用状态
- 💾 **数据持久化**: 收藏和充电桩数据本地存储

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **地图**: Leaflet + React-Leaflet
- **状态管理**: Zustand
- **API 代理**: CORS Proxy
- **图标**: Heroicons

## 开始使用

### 1. 安装依赖

```bash
npm install
```

### 2. 开发模式

```bash
npm run dev
```

应用将在 http://localhost:3000 启动

### 3. 构建生产版本

```bash
npm run build
```

### 4. 预览生产版本

```bash
npm run preview
```

## 项目结构

```
src/
├── components/          # React 组件
│   ├── Header.tsx      # 导航头部
│   ├── MapView.tsx     # 地图视图
│   ├── FavoritesView.tsx   # 收藏视图
│   ├── SearchBar.tsx   # 搜索栏
│   ├── StationDetailPanel.tsx  # 充电桩详情面板
│   ├── FavoriteStationCard.tsx # 收藏卡片
│   ├── LoadingSpinner.tsx      # 加载指示器
│   ├── ErrorOverlay.tsx        # 错误提示
│   └── Footer.tsx      # 页脚
├── store/              # 状态管理
│   ├── stationStore.ts # 充电桩数据状态
│   ├── favoritesStore.ts   # 收藏状态
│   └── errorStore.ts   # 错误状态
├── types/              # TypeScript 类型定义
│   └── station.ts      # 充电桩相关类型
├── utils/              # 工具函数
│   └── api.ts          # API 调用和数据处理
├── App.tsx             # 主应用组件
├── main.tsx            # 应用入口
└── index.css           # 全局样式
```

## 核心功能

### 地图功能
- 显示附近充电桩
- 点击标记查看详情
- 搜索充电桩
- 用户定位
- 手动刷新数据

### 收藏功能
- 最多收藏4个充电桩
- 查看收藏充电桩的实时状态
- 管理收藏列表

### 数据管理
- 使用 Zustand 进行状态管理
- 本地存储收藏和充电桩数据
- 防抖刷新机制

## API 接口

应用使用以下 API：

- 获取附近充电桩: `POST /device/v1/near/station`
- 获取充电桩插座: `GET /charge/v1/outlet/station/outlets/{stationId}`
- 获取插座状态: `GET /charge/v1/charging/outlet/{outletNo}`

所有 API 请求通过 CORS 代理服务器处理。

## 浏览器支持

- Chrome 70+
- Firefox 70+
- Safari 12+
- Edge 79+

## 开发说明

### 添加新组件
1. 在 `src/components/` 创建组件文件
2. 使用 TypeScript 定义 props 类型
3. 应用 Tailwind CSS 样式

### 状态管理
- 使用 Zustand 创建轻量级状态存储
- 支持持久化的状态会自动保存到 localStorage
- 通过 hooks 在组件中使用状态

### 样式指南
- 使用 Tailwind CSS 实用类
- 遵循响应式设计原则
- 保持组件样式一致性

## 部署

### 静态部署
构建后的 `dist` 目录可直接部署到任何静态文件服务器：
- Vercel
- Netlify
- GitHub Pages
- 阿里云OSS
- 腾讯云COS

### 环境变量
目前无需特殊环境变量配置，所有 API 端点都硬编码在代码中。

## 许可证

MIT License
