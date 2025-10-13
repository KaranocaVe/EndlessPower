# EndlessPower - 充电桩实时查询地图

<div align="center">

**[endlesspower.icu](http://endlesspower.icu/)**

现代化 PWA 应用，解决闪开来电充电桩位置不准、重叠显示等问题

![PWA](https://img.shields.io/badge/PWA-Ready-blue) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-orange)

</div>

## ✨ 核心功能

### 地图显示
- 自动获取用户位置，加载附近充电桩
- 防重叠算法：坐标相同的充电桩智能偏移
- 状态色彩区分：绿色（可用）、橙色（部分可用）、红色（不可用）
- 硬编码位置覆盖：修正 API 不准确数据

### 实时监控
- 点击任意插座进入监控页面
- 实时功率曲线图，支持自定义轮询间隔（5 分钟 ~ 30 分钟）
- 自动计算充电电量（kWh）和单价
- 防休眠机制：Wake Lock API + 静音音频保活

### 搜索与收藏
- 模糊搜索：支持充电站名称和地址
- 一键收藏常用充电站
- 本地持久化存储

### PWA 体验
- 可安装到桌面，支持离线使用
- 夜间模式（亮色/暗色/跟随系统）
- 响应式设计，适配手机/平板/桌面
- 多 CORS 代理容错，API 失败时降级到模拟数据

## 🚀 技术栈

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** - 样式
- **Zustand** - 状态管理
- **React-Leaflet** - 地图
- **Vite PWA Plugin** + **Workbox** - PWA 支持
- **Cloudflare Workers** - 边缘部署 + Durable Objects 实时计数
- **Canvas API** - 功率曲线绘制
- **Wake Lock API** - 防休眠

## 🌐 在线访问

**[endlesspower.icu](http://endlesspower.icu/)**

支持安装为桌面应用（PWA）

## 🛠️ 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build

# 部署到 Cloudflare Workers
npm run deploy        # 开发环境
npm run deploy:prod   # 生产环境
```

## 📊 项目结构

```
src/
├── components/          # React 组件
│   ├── MapView.tsx     # 地图视图
│   ├── OutletMonitorView.tsx  # 插座监控页
│   ├── StationDetailPanel.tsx # 充电桩详情
│   └── ...
├── store/              # Zustand 状态管理
│   ├── stationStore.ts
│   ├── monitorStore.ts
│   └── ...
├── utils/              # 工具函数
│   ├── api.ts          # API 调用 + CORS 代理
│   └── locationMerger.ts # 位置数据合并
├── data/               
│   └── stationLocations.ts # 硬编码位置覆盖
└── worker/             # Cloudflare Workers
    └── index.ts        # Durable Objects 实时计数
```

## 📄 开源协议

MIT License

---

<div align="center">

[在线体验](http://endlesspower.icu/) • [GitHub](https://github.com/jasonmumiao/EndlessPower) • [Issues](https://github.com/jasonmumiao/EndlessPower/issues)

</div>
