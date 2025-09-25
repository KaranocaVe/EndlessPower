# EndlessPower - 现代化充电桩实时查询地图

<div align="center">

**🔗 [立即体验 - endlesspower.icu](http://endlesspower.icu/)**

*一个现代化的 PWA 应用，旨在解决闪开来电寻找可用充电桩的痛点*

![PWA](https://img.shields.io/badge/PWA-Ready-blue) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Vite](https://img.shields.io/badge/Vite-4-blue) ![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-orange)

</div>

## 🌟 项目背景

在使用闪开来电等官方平台时，我们发现其提供的许多充电桩位置有误、多个充电桩在地图上重叠成一个点，且命名混乱，给寻找充电桩带来了极大的不便。本项目通过现代化的技术栈，提供更好的用户体验和数据展示。

## ✨ 核心功能

### 🗺️ **智能地图显示**
- **实时位置获取**: 自动获取用户位置，加载附近充电桩
- **防重叠算法**: 为坐标相同的充电桩添加智能偏移，确保每个桩都可见
- **状态色彩区分**: 绿色（可用）、橙色（部分可用）、红色（不可用）
- **高德地图集成**: 清晰的底图和准确的位置标记

### 🔍 **搜索与筛选**
- **模糊搜索**: 支持充电站名称和地址的模糊匹配
- **实时筛选**: 输入关键词即时筛选地图上的充电桩
- **搜索历史**: 记住常用搜索词（本地存储）

### ⭐ **收藏管理**
- **一键收藏**: 快速收藏常用充电站
- **收藏页面**: 集中管理和查看收藏的充电桩
- **数据持久化**: 收藏信息本地保存，永不丢失

### 🔌 **详细信息**
- **实时状态**: 查看每个插座的可用状态
- **充电详情**: 显示功率、已充时长、消费金额、开始时间
- **多代理容错**: 智能切换多个 CORS 代理，确保数据获取稳定
- **模拟数据回退**: API 失败时提供模拟数据，保证应用可用性

### 📱 **现代化体验**
- **PWA 支持**: 可安装到桌面，支持离线使用
- **夜间模式**: 深色主题，保护眼睛
- **响应式设计**: 完美适配手机、平板、桌面设备
- **Service Worker**: 智能缓存，提升加载速度

### 🛠️ **开发者功能**
- **位置覆盖系统**: 支持硬编码精确位置，覆盖 API 不准确数据
- **调试面板**: 可视化位置合并过程和 API 状态
- **环境隔离**: 开发/生产环境完全分离

## 🚀 技术栈

### 前端技术
- **React 18** + **TypeScript** - 现代化组件开发
- **Vite** - 快速构建工具和开发服务器
- **Tailwind CSS** - 原子化 CSS 框架
- **Zustand** - 轻量级状态管理
- **React-Leaflet** - React 地图组件

### PWA 技术
- **Vite PWA Plugin** - PWA 功能集成
- **Workbox** - Service Worker 和缓存策略
- **Web App Manifest** - 应用安装配置

### 部署与基础设施
- **Cloudflare Workers** - 边缘计算平台
- **自定义域名** - [endlesspower.icu](http://endlesspower.icu/)
- **多 CORS 代理** - 确保 API 访问稳定性

## 🎯 新增特性（React 版本）

### 🌙 **夜间模式**
- 支持亮色/暗色/跟随系统三种模式
- 一键切换，设置自动保存
- 所有组件完美适配暗色主题

### 🔧 **智能错误处理**
- 多重 CORS 代理备选机制
- API 失败时自动降级到模拟数据
- 详细的错误信息和状态提示

### 📲 **PWA 体验**
- 支持桌面和移动端安装
- 离线访问能力
- 自动更新提醒
- 原生应用般的体验

### 🎛️ **开发者工具**
- 位置数据可视化调试面板
- PWA 状态调试工具
- 详细的控制台日志
- 环境检测和切换

## 🌐 在线访问

**主站**: [endlesspower.icu](http://endlesspower.icu/)

### 安装为桌面应用
1. 访问 [endlesspower.icu](http://endlesspower.icu/)
2. 点击地址栏右侧的安装图标
3. 或点击页面上的"安装应用"按钮
4. 确认安装到桌面

## 🛠️ 本地开发

### 环境要求
- Node.js 18+
- npm 或 yarn

### 开发步骤
```bash
# 克隆项目
git clone https://github.com/jasonmumiao/EndlessPower.git
cd EndlessPower

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 部署到 Cloudflare Workers
```bash
# 开发环境部署（默认）
npm run deploy

# 生产环境部署
npm run deploy:prod
```

## 📊 项目架构

```
src/
├── components/          # React 组件
│   ├── Header.tsx      # 导航栏（含主题切换、PWA安装）
│   ├── MapView.tsx     # 地图视图
│   ├── SearchBar.tsx   # 搜索栏
│   └── ...
├── store/              # 状态管理
│   ├── stationStore.ts # 充电桩数据
│   ├── themeStore.ts   # 主题状态
│   └── ...
├── utils/              # 工具函数
│   ├── api.ts          # API 调用和代理
│   └── locationMerger.ts # 位置合并逻辑
├── data/               # 数据文件
│   └── stationLocations.ts # 硬编码位置数据
└── types/              # TypeScript 类型定义
```

## 🔮 路线图

### 近期计划
- [ ] 更多充电桩位置数据完善
- [ ] 充电价格预估功能
- [ ] 导航功能集成
- [ ] 充电历史记录

### 长期规划
- [ ] **社区共建系统**: 用户可提交位置修正和名称标准化
- [ ] **后端服务**: 数据库存储用户贡献的高质量数据
- [ ] **移动应用**: 原生 iOS/Android 应用

## 🤝 贡献指南

我们欢迎任何形式的贡献！

### 如何贡献
1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 贡献类型
- 🐛 Bug 修复
- ✨ 新功能开发
- 📚 文档改进
- 🎨 界面优化
- 🏗️ 架构改进
- 📊 位置数据校正

## 📞 反馈与支持

- **GitHub Issues**: [提交问题和建议](https://github.com/jasonmumiao/EndlessPower/issues)
- **在线体验**: [endlesspower.icu](http://endlesspower.icu/)

## 📄 开源协议

本项目采用 [MIT License](https://opensource.org/licenses/MIT) 开源许可证。

---

<div align="center">

**让找充电桩不再是件烦心事！** 🔋⚡

[在线体验](http://endlesspower.icu/) • [GitHub](https://github.com/jasonmumiao/EndlessPower) • [提交Issue](https://github.com/jasonmumiao/EndlessPower/issues)

</div>
