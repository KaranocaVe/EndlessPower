// 简单的访问者计数 Worker
let connectedUsers = new Set<WebSocket>();

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    
    // WebSocket 访问者计数端点
    if (url.pathname === '/ws/visitors') {
      return handleWebSocket(request);
    }
    
    // 静态文件处理
    return env.ASSETS.fetch(request);
  },
};

async function handleWebSocket(request: Request): Promise<Response> {
  // 检查是否是 WebSocket 升级请求
  const upgradeHeader = request.headers.get('Upgrade');
  if (upgradeHeader !== 'websocket') {
    return new Response('Expected websocket', { status: 400 });
  }

  // 创建 WebSocket 对
  const webSocketPair = new WebSocketPair();
  const [client, server] = Object.values(webSocketPair);

  // 接受 WebSocket 连接
  server.accept();
  
  // 添加到连接集合
  connectedUsers.add(server);
  
  // 向所有连接的客户端广播当前用户数
  broadcastUserCount();
  
  // 监听连接关闭
  server.addEventListener('close', () => {
    connectedUsers.delete(server);
    broadcastUserCount();
  });

  // 监听错误
  server.addEventListener('error', () => {
    connectedUsers.delete(server);
    broadcastUserCount();
  });

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}

function broadcastUserCount() {
  const count = connectedUsers.size;
  const message = JSON.stringify({ type: 'userCount', count });
  
  // 清理已断开的连接并广播
  const activeConnections = new Set<WebSocket>();
  
  connectedUsers.forEach(ws => {
    try {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
        activeConnections.add(ws);
      }
    } catch (error) {
      // 连接已断开，忽略错误
    }
  });
  
  // 更新活跃连接集合
  connectedUsers = activeConnections;
}