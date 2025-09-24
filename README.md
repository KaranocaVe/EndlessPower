EndlessPower - 校园充电桩实时查询地图
一个轻量、零依赖的Web应用，用于实时查询电子科技大学（清水河校区）附近的充电桩状态。通过直观的地图界面，帮助您快速找到可用的充电桩，并查看每个插座的详细信息。

 [点击此处查看在线演示]{}

✨ 主要功能
🗺️ 实时地图视图: 在高德地图上清晰地展示所有充电桩的位置。

🟢 状态颜色区分: 充电桩的可用性通过不同颜色（绿-橙-红）的标记点直观显示，一目了然。

🔍 站点搜索: 支持按名称模糊搜索充电站，快速定位。

⭐ 站点收藏: 一键收藏常用充电站，方便在“收藏”页面集中查看和管理。

🔌 插座详情: 点击地图上的充电桩，即可在弹出的侧边栏中看到所有插座的实时状态（可用/占用中）、当前功率、已充电时长、已消费金额和开始充电时间。

🔄 手动刷新: 地图和收藏页面均提供手动刷新按钮，并设有15秒的冷却时间，避免频繁请求。

📱 响应式设计: 界面在桌面和移动设备上均有良好表现。

🚀 如何使用
本项目是一个纯前端应用，但由于浏览器的**同源策略（Same-Origin Policy）**安全限制，直接用浏览器打开本地 HTML 文件无法成功请求API。因此，您必须通过以下两种方法之一来运行本项目。

方法一：使用 VS Code 和 Live Server 插件 (推荐)

这是最简单、最可靠的本地运行方式。

安装 Visual Studio Code。

在 VS Code 的扩展市场中搜索并安装 Live Server 插件。

将本项目的 index.html 文件拖入 VS Code 中打开。

点击 VS Code 右下角的 "Go Live" 按钮。

它会自动在您的默认浏览器中打开一个本地服务地址 (如 http://127.0.0.1:5500)，此时页面就可以正常访问API了。

方法二：使用浏览器跨域插件 (备选方案)

如果您不想安装代码编辑器，可以使用此方法。

下载本项目中的 index.html 文件。

为您的浏览器安装一个允许跨域请求的插件。

Chrome: Allow CORS: Access-Control-Allow-Origin

Edge: Allow CORS: Access-Control-Allow-Origin

Firefox: CORS Everywhere

启用插件: 点击浏览器工具栏中的插件图标，确保其处于开启状态。

直接用浏览器打开 index.html 文件即可。

🛠️ 技术栈
HTML5

CSS3 & Tailwind CSS: 用于快速构建现代化、响应式的界面。

JavaScript (ES6+): 核心逻辑实现。

Leaflet.js: 轻量、高效的开源地图库。

高德地图: 提供底图瓦片服务。

🌐 API 参考
本应用的数据来源于公开的API接口，无需身份验证。

获取附近充电站列表: POST https://wemp.issks.com/device/v1/near/station

获取单个充电站的插座列表: GET https://wemp.issks.com/charge/v1/outlet/station/outlets/{stationId}

获取单个插座的详细状态: GET https://wemp.issks.com/charge/v1/charging/outlet/{outletNo}

🤝 贡献
欢迎提交 Pull Requests 或 Issues 来改进这个项目！

📄 许可证
本项目采用 MIT License 开源许可证。